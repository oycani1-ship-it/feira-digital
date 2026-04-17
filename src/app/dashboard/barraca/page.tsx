"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
import { Loader2, Camera, ImagePlus } from "lucide-react";
import { CATEGORIAS_PLATAFORMA, ESTADOS_BR } from "@/lib/constants";

export default function MinhaBarracaPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user,       setUser]       = useState<User | null>(null);
  const [authReady,  setAuthReady]  = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState("");

  // Campos do formulário
  const [nome,       setNome]       = useState("");
  const [bio,        setBio]        = useState("");
  const [categoria,  setCategoria]  = useState("");
  const [localizacao,setLocalizacao]= useState("");
  const [estado,     setEstado]     = useState("");
  const [whatsapp,   setWhatsapp]   = useState("");
  const [instagram,  setInstagram]  = useState("");

  // URLs já salvas no banco
  const [logoUrl,    setLogoUrl]    = useState("");
  const [capaUrl,    setCapaUrl]    = useState("");

  // Arquivos novos selecionados pelo usuário
  const [logoFile,   setLogoFile]   = useState<File | null>(null);
  const [capaFile,   setCapaFile]   = useState<File | null>(null);

  // Previews locais (objectURL ou URL do banco)
  const [logoPreview, setLogoPreview] = useState("");
  const [capaPreview, setCapaPreview] = useState("");

  // ── Auth ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, [router]);

  // ── Carrega dados existentes ────────────────────────────────────
  useEffect(() => {
    if (!authReady || !user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "booths", user.uid));
        if (snap.exists()) {
          const d = snap.data();
          setNome(d.nome ?? "");
          setBio(d.bio ?? "");
          setCategoria(d.categoria ?? "");
          setLocalizacao(d.localizacao ?? "");
          setEstado(d.estado ?? "");
          setWhatsapp(d.whatsapp ?? "");
          setInstagram(d.instagram ?? "");
          setLogoUrl(d.logoUrl ?? "");
          setCapaUrl(d.capaUrl ?? "");
          setLogoPreview(d.logoUrl ?? "");
          setCapaPreview(d.capaUrl ?? "");
        }
      } catch (e) {
        console.error("Erro ao carregar barraca:", e);
      } finally {
        setIsFetching(false);
      }
    })();
  }, [authReady, user]);

  // ── Seleção de imagens ─────────────────────────────────────────
  function onLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  }

  function onCapaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setCapaFile(f);
    setCapaPreview(URL.createObjectURL(f));
  }

  // ── Submit ─────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      // Upload logo (só se novo arquivo)
      let finalLogoUrl = logoUrl;
      if (logoFile instanceof File) {
        const r    = ref(storage, `booths/${user.uid}/logo_${Date.now()}`);
        const snap = await uploadBytes(r, logoFile);
        finalLogoUrl   = await getDownloadURL(snap.ref);
        setLogoUrl(finalLogoUrl);
        setLogoFile(null);
      }

      // Upload capa (só se novo arquivo)
      let finalCapaUrl = capaUrl;
      if (capaFile instanceof File) {
        const r    = ref(storage, `booths/${user.uid}/capa_${Date.now()}`);
        const snap = await uploadBytes(r, capaFile);
        finalCapaUrl   = await getDownloadURL(snap.ref);
        setCapaUrl(finalCapaUrl);
        setCapaFile(null);
      }

      const boothRef = doc(db, "booths", user.uid);
      const existing = await getDoc(boothRef);

      const payload: Record<string, unknown> = {
        sellerId:    user.uid,
        sellerEmail: user.email ?? "",
        nome:        nome.trim(),
        bio:         bio.trim(),
        categoria,
        localizacao: localizacao.trim(),
        estado,
        whatsapp:    whatsapp.trim(),
        instagram:   instagram.trim(),
        logoUrl:     finalLogoUrl,
        capaUrl:     finalCapaUrl,
        isActive:    true,
        updatedAt:   serverTimestamp(),
        nomeNormalizado: nome.trim().toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
        categoriaNormalizada: categoria.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      };

      // Campos apenas na criação
      if (!existing.exists()) {
        payload.createdAt      = serverTimestamp();
        payload.views          = 0;
        payload.whatsappClicks = 0;
        payload.avgRating      = 0;
        payload.totalRatings   = 0;
      }

      await setDoc(boothRef, payload, { merge: true });

      toast({
        title: "Barraca salva! 🎉",
        description: "Seu perfil público foi atualizado.",
      });

    } catch (err: unknown) {
      console.error("Erro ao salvar:", err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro: ${msg}`);
      toast({ title: "Erro ao salvar", description: msg, variant: "destructive" });

    } finally {
      // ✅ SEMPRE libera o botão — com sucesso OU com erro
      setIsLoading(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────────
  if (!authReady || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold">Minha Barraca</h1>

      {/* Capa */}
      <div>
        <Label>Foto de Capa</Label>
        <div
          onClick={() => document.getElementById("input-capa")?.click()}
          className="mt-2 relative h-40 rounded-xl border-2 border-dashed border-border bg-muted hover:bg-muted/70 cursor-pointer overflow-hidden flex items-center justify-center transition-colors"
        >
          {capaPreview
            ? <img src={capaPreview} alt="Capa" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">Clique para enviar foto de capa</span>
              </div>
          }
          {capaPreview && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Alterar Capa</span>
            </div>
          )}
        </div>
        <input id="input-capa" type="file" accept="image/*" className="hidden" onChange={onCapaChange} />
      </div>

      {/* Logo */}
      <div>
        <Label>Logo da Barraca</Label>
        <div
          onClick={() => document.getElementById("input-logo")?.click()}
          className="mt-2 w-24 h-24 rounded-full border-2 border-dashed border-border bg-muted hover:bg-muted/70 cursor-pointer overflow-hidden flex items-center justify-center transition-colors"
        >
          {logoPreview
            ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
            : <Camera className="h-6 w-6 text-muted-foreground" />
          }
        </div>
        <input id="input-logo" type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
      </div>

      {/* Nome */}
      <div className="space-y-1">
        <Label htmlFor="nome">Nome da Barraca *</Label>
        <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Artesanato da Maria" />
      </div>

      {/* Categoria */}
      <div className="space-y-1">
        <Label>Categoria Principal</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {CATEGORIAS_PLATAFORMA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <Label htmlFor="bio">História / Bio da Barraca</Label>
        <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Conte a história da sua barraca..." />
      </div>

      {/* Localização */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="localizacao">Cidade/Localização</Label>
          <Input id="localizacao" value={localizacao} onChange={e => setLocalizacao(e.target.value)} placeholder="Ex: São Paulo" />
        </div>
        <div className="space-y-1">
          <Label>Estado</Label>
          <Select value={estado} onValueChange={setEstado}>
            <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
            <SelectContent>
              {ESTADOS_BR.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contatos */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
          <Input id="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="11999999999" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="instagram">Instagram</Label>
          <Input id="instagram" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="minha_loja" />
        </div>
      </div>

      {/* Erro */}
      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Botão */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</>
          : "Salvar Perfil da Barraca"
        }
      </Button>
    </form>
  );
}
