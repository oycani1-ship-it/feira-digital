"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  doc, getDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import {
  ref, uploadBytes, getDownloadURL,
} from "firebase/storage";
import { auth, db, storage } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Camera, Store } from "lucide-react";
import { CATEGORIES, BRAZILIAN_STATES } from "@/lib/constants";

export default function MinhaBarracaPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser]           = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError]         = useState("");

  // Campos do formulário
  const [nome, setNome]           = useState("");
  const [bio, setBio]             = useState("");
  const [categoria, setCategoria] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [estado, setEstado]       = useState("");
  const [whatsapp, setWhatsapp]   = useState("");
  const [instagram, setInstagram] = useState("");

  // Imagens — URL já salva
  const [logoUrl, setLogoUrl]     = useState("");
  const [capaUrl, setCapaUrl]     = useState("");

  // Imagens — arquivo novo selecionado pelo usuário
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [capaFile, setCapaFile]   = useState<File | null>(null);

  // Preview local
  const [logoPreview, setLogoPreview] = useState("");
  const [capaPreview, setCapaPreview] = useState("");

  // ── Auth listener ──────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }
      setUser(firebaseUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, [router]);

  // ── Carregar dados existentes da barraca ────────────────────────
  useEffect(() => {
    if (!authReady || !user) return;

    async function loadBooth() {
      setIsFetching(true);
      try {
        const snap = await getDoc(doc(db, "booths", user!.uid));
        if (snap.exists()) {
          const d = snap.data();
          setNome(d.nome || d.name || "");
          setBio(d.bio || d.description || "");
          setCategoria(d.categoria || d.category || "");
          setLocalizacao(d.localizacao || d.city || "");
          setEstado(d.estado || d.state || "");
          setWhatsapp(d.whatsapp || "");
          setInstagram(d.instagram || "");
          setLogoUrl(d.logoUrl || "");
          setCapaUrl(d.capaUrl || d.coverImageUrl || "");
          setLogoPreview(d.logoUrl || "");
          setCapaPreview(d.capaUrl || d.coverImageUrl || "");
        }
      } catch (err) {
        console.error("Erro ao carregar barraca:", err);
      } finally {
        setIsFetching(false);
      }
    }

    loadBooth();
  }, [authReady, user]);

  // ── Seleção de imagens ─────────────────────────────────────────
  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function handleCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapaFile(file);
    setCapaPreview(URL.createObjectURL(file));
  }

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      // Upload de logo (só se novo arquivo selecionado)
      let finalLogoUrl = logoUrl;
      if (logoFile instanceof File) {
        const r = ref(storage, `booths/${user.uid}/logo_${Date.now()}`);
        const snap = await uploadBytes(r, logoFile);
        finalLogoUrl = await getDownloadURL(snap.ref);
      }

      // Upload de capa (só se novo arquivo selecionado)
      let finalCapaUrl = capaUrl;
      if (capaFile instanceof File) {
        const r = ref(storage, `booths/${user.uid}/capa_${Date.now()}`);
        const snap = await uploadBytes(r, capaFile);
        finalCapaUrl = await getDownloadURL(snap.ref);
      }

      const boothRef  = doc(db, "booths", user.uid);
      const existing  = await getDoc(boothRef);

      const normalizar = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Campos que sempre atualizamos
      const payload: Record<string, any> = {
        sellerId:     user.uid,
        sellerEmail:  user.email || "",
        nome:         nome.trim(),
        name:         nome.trim(), // Compatibilidade com versões que usam 'name'
        bio:          bio.trim(),
        description:  bio.trim(), // Compatibilidade com versões que usam 'description'
        categoria:    categoria,
        category:     categoria,    // Compatibilidade
        localizacao:  localizacao.trim(),
        city:         localizacao.trim(), // Compatibilidade
        estado:       estado,
        state:        estado,      // Compatibilidade
        whatsapp:     whatsapp.trim(),
        instagram:    instagram.trim(),
        logoUrl:      finalLogoUrl,
        capaUrl:      finalCapaUrl,
        coverImageUrl: finalCapaUrl, // Compatibilidade
        isActive:     true,
        updatedAt:    serverTimestamp(),
        nomeNormalizado: normalizar(nome.trim()),
        categoriaNormalizada: normalizar(categoria),
      };

      // Campos inicializados APENAS na criação
      if (!existing.exists()) {
        payload.createdAt      = serverTimestamp();
        payload.views          = 0;
        payload.whatsappClicks = 0;
        payload.avgRating      = 0;
        payload.averageRating  = 0; // Compatibilidade
        payload.totalRatings   = 0;
      }

      await setDoc(boothRef, payload, { merge: true });

      toast({
        title: "Barraca salva com sucesso! 🎉",
        description: "Seu perfil público foi atualizado.",
      });

      // Limpa arquivos temporários após salvar
      setLogoFile(null);
      setCapaFile(null);

    } catch (err: any) {
      console.error("Erro ao salvar barraca:", err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro ao salvar: ${msg}`);
      toast({ title: "Erro ao salvar", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  if (!authReady || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Carregando configurações da barraca...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-headline text-3xl font-bold">Minha Barraca</h1>
        <p className="text-muted-foreground">Personalize como sua marca será vista pelos clientes.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 pb-12">
        {/* Identidade Visual */}
        <div className="space-y-4">
          <Label className="text-lg font-bold">Identidade Visual</Label>
          
          {/* Capa */}
          <div className="relative group">
            <div 
              className="relative h-48 w-full rounded-2xl overflow-hidden bg-muted border-2 border-dashed border-muted-foreground/20 flex items-center justify-center cursor-pointer transition-colors hover:bg-muted/50"
              onClick={() => document.getElementById("capa-input")?.click()}
            >
              {capaPreview ? (
                <img src={capaPreview} alt="Capa" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Camera className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <span className="text-xs font-medium">Clique para enviar foto de capa</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button type="button" variant="secondary" size="sm">Alterar Capa</Button>
              </div>
            </div>
            <input id="capa-input" type="file" accept="image/*" className="hidden" onChange={handleCapaChange} />

            {/* Logo */}
            <div className="absolute -bottom-6 left-8">
              <div 
                className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white bg-white shadow-lg cursor-pointer group/logo"
                onClick={() => document.getElementById("logo-input")?.click()}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Store className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity text-white">
                  <Camera className="h-6 w-6" />
                </div>
              </div>
              <input id="logo-input" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>
          <div className="h-8" />
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Barraca *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Ex: Cerâmicas da Terra"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Categoria Principal</Label>
            <Select value={categoria} onValueChange={setCategoria}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">História / Bio da Barraca</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="Conte um pouco sobre sua arte, materiais e inspirações..."
            className="min-h-[120px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="localizacao">Cidade/Localização</Label>
            <Input
              id="localizacao"
              value={localizacao}
              onChange={e => setLocalizacao(e.target.value)}
              placeholder="Ex: São Paulo"
            />
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {BRAZILIAN_STATES.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contatos */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="font-bold text-lg">Contatos e Redes Sociais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="Ex: 11999999999"
              />
              <p className="text-[10px] text-muted-foreground">Usado para os clientes iniciarem conversas sobre produtos.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram (@usuario)</Label>
              <Input
                id="instagram"
                value={instagram}
                onChange={e => setInstagram(e.target.value)}
                placeholder="Ex: minha_loja_artesanal"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-6 border-t">
          <Button type="submit" size="lg" className="px-8 font-bold" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
            ) : (
              "Salvar Perfil da Barraca"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
