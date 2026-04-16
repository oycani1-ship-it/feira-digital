
"use client";

import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, BRAZILIAN_STATES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Store, Camera, Save, Globe, Instagram, MessageSquare } from "lucide-react";
import Image from "next/image";

export default function BoothSettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
          name: data.name || "",
          sellerName: data.sellerName || auth.currentUser?.displayName || "",
          description: data.description || "",
          category: data.category || "",
          city: data.city || "",
          state: data.state || "",
          whatsapp: data.whatsapp || "",
          instagram: data.instagram || "",
          website: data.website || "",
          logoUrl: data.logoUrl || "",
          coverImageUrl: data.coverImageUrl || ""
        });
      } else {
        // Inicializar com nome do usuário se não houver barraca
        setFormData(prev => ({ ...prev, sellerName: auth.currentUser?.displayName || "" }));
      }
    } catch (error) {
      console.error("Erro ao carregar dados da barraca:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'coverImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, [field]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    try {
      await setDoc(doc(db, "booths", userId), {
        ...formData,
        updatedAt: serverTimestamp(),
        ownerId: userId
      }, { merge: true });

      toast({ title: "Perfil atualizado!", description: "As informações da sua barraca foram salvas." });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar", description: "Tente novamente mais tarde." });
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Banner and Logo Section */}
        <div className="space-y-4">
          <Label className="text-lg font-bold">Identidade Visual</Label>
          <div className="relative group">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              {formData.coverImageUrl ? (
                <Image src={formData.coverImageUrl} alt="Capa" fill className="object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <span className="text-xs">Foto de Capa (Recomendado 1200x400)</span>
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
          <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logoUrl')} />
          <input type="file" ref={coverInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'coverImageUrl')} />
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
            <Label htmlFor="city">Cidade</Label>
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" /> Website ou Portfólio
              </Label>
              <Input 
                id="website" 
                placeholder="https://meusite.com.br" 
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
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
