
"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, BRAZILIAN_STATES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store, Camera, Save, Instagram, MessageSquare, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Alert, AlertDescription } from "@/components/ui/alert";

const normalizarParaBusca = (str: string) => {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

export default function BoothSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    sellerName: "",
    description: "",
    category: "",
    city: "",
    state: "",
    whatsapp: "",
    instagram: "",
    website: "",
    logoUrl: "",
    coverImageUrl: ""
  });

  const [files, setFiles] = useState<{
    logo: File | null;
    cover: File | null;
  }>({ logo: null, cover: null });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchBoothData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchBoothData = async (uid: string) => {
    try {
      const docRef = doc(db, "booths", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          name: data.name || data.nome || "",
          sellerName: data.sellerName || auth.currentUser?.displayName || "",
          description: data.description || data.bio || "",
          category: data.category || data.categoria || "",
          city: data.city || data.localizacao || "",
          state: data.state || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          website: data.website || "",
          logoUrl: data.logoUrl || "",
          coverImageUrl: data.coverImageUrl || data.capaUrl || ""
        });
      } else {
        setFormData(prev => ({ ...prev, sellerName: auth.currentUser?.displayName || "" }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados da barraca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFiles(prev => ({ ...prev, [type]: file }));
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ 
        ...prev, 
        [type === 'logo' ? 'logoUrl' : 'coverImageUrl']: reader.result as string 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    setIsSaving(true);
    setError("");

    try {
      let finalLogoUrl = formData.logoUrl;
      let finalCoverUrl = formData.coverImageUrl;

      // Upload logo — SÓ se for um File novo
      if (files.logo instanceof File) {
        const logoRef = ref(storage, `booths/${user.uid}/logo_${Date.now()}`);
        const snap = await uploadBytes(logoRef, files.logo);
        finalLogoUrl = await getDownloadURL(snap.ref);
      }

      // Upload capa — SÓ se for um File novo
      if (files.cover instanceof File) {
        const coverRef = ref(storage, `booths/${user.uid}/cover_${Date.now()}`);
        const snap = await uploadBytes(coverRef, files.cover);
        finalCoverUrl = await getDownloadURL(snap.ref);
      }

      const boothRef = doc(db, "booths", user.uid);
      const existing = await getDoc(boothRef);

      const payload: Record<string, any> = {
        sellerId: user.uid,
        sellerEmail: user.email || "",
        name: formData.name.trim(),
        sellerName: formData.sellerName.trim(),
        description: formData.description.trim(),
        category: formData.category,
        city: formData.city.trim(),
        state: formData.state,
        whatsapp: formData.whatsapp.trim(),
        instagram: formData.instagram.trim(),
        website: formData.website.trim(),
        logoUrl: finalLogoUrl || "",
        coverImageUrl: finalCoverUrl || "",
        nameNormalizado: normalizarParaBusca(formData.name),
        categoriaNormalizada: normalizarParaBusca(formData.category),
        isActive: true,
        updatedAt: serverTimestamp(),
      };

      // Inicializa metadados apenas se for uma barraca nova
      if (!existing.exists()) {
        payload.createdAt = serverTimestamp();
        payload.views = 0;
        payload.whatsappClicks = 0;
        payload.averageRating = 0;
        payload.totalRatings = 0;
      }

      await setDoc(boothRef, payload, { merge: true });

      toast({ 
        title: "Barraca salva com sucesso!", 
        description: "As informações da sua barraca foram atualizadas." 
      });
    } catch (err: any) {
      console.error("Erro ao salvar barraca:", err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro ao salvar: ${msg}`);
      toast({ 
        variant: "destructive", 
        title: "Erro ao salvar", 
        description: "Verifique suas permissões e tente novamente." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando perfil da barraca...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Minha Barraca</h1>
          <p className="text-muted-foreground">Configure como os clientes verão sua loja virtual.</p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="space-y-4">
          <Label className="text-lg font-bold">Identidade Visual</Label>
          <div className="relative group">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              {formData.coverImageUrl ? (
                <Image src={formData.coverImageUrl} alt="Capa" fill className="object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <span className="text-xs">Foto de Capa</span>
                </div>
              )}
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => coverInputRef.current?.click()}
              >
                Alterar Capa
              </Button>
            </div>
            
            <div className="absolute -bottom-6 left-8">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-lg group/logo">
                {formData.logoUrl ? (
                  <Image src={formData.logoUrl} alt="Logo" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Store className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                )}
                <button 
                  type="button"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity text-white"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <Camera className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
          <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'cover')} />
          <div className="pt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Barraca</Label>
            <Input 
              id="name" 
              placeholder="Ex: Cerâmicas da Terra" 
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sellerName">Nome do Artesão</Label>
            <Input 
              id="sellerName" 
              placeholder="Seu nome ou marca pessoal" 
              value={formData.sellerName}
              onChange={(e) => setFormData(prev => ({ ...prev, sellerName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">História / Bio da Barraca</Label>
          <Textarea 
            id="description" 
            placeholder="Conte um pouco sobre sua arte, materiais e inspirações..." 
            className="min-h-[120px]"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Categoria Principal</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade/Localização</Label>
            <Input 
              id="city" 
              placeholder="Ex: São Paulo" 
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select 
              value={formData.state} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, state: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {BRAZILIAN_STATES.map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-lg border-b pb-2">Contatos e Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-500" /> WhatsApp (com DDD)
              </Label>
              <Input 
                id="whatsapp" 
                placeholder="Ex: 11999999999" 
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" /> Instagram (@usuario)
              </Label>
              <Input 
                id="instagram" 
                placeholder="Ex: minha_loja_artesanal" 
                value={formData.instagram}
                onChange={(e) => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button 
            type="submit" 
            size="lg" 
            className="bg-primary hover:bg-primary/90 px-8"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Perfil da Barraca
          </Button>
        </div>
      </form>
    </div>
  );
}
