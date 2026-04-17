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
import { useTranslation } from "@/context/language-context";

export default function MinhaBarracaPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [user,       setUser]       = useState<User | null>(null);
  const [authReady,  setAuthReady]  = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading,  setIsLoading]  = useState(false);
  const [error,      setError]      = useState("");

  const [nome,       setNome]       = useState("");
  const [bio,        setBio]        = useState("");
  const [categoria,  setCategoria]  = useState("");
  const [localizacao,setLocalizacao]= useState("");
  const [estado,     setEstado]     = useState("");
  const [whatsapp,   setWhatsapp]   = useState("");
  const [instagram,  setInstagram]  = useState("");

  const [logoUrl,    setLogoUrl]    = useState("");
  const [capaUrl,    setCapaUrl]    = useState("");

  const [logoFile,   setLogoFile]   = useState<File | null>(null);
  const [capaFile,   setCapaFile]   = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [capaPreview, setCapaPreview] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      setAuthReady(true);
    });
    return () => unsub();
  }, [router]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");

    try {
      let finalLogoUrl = logoUrl;
      if (logoFile instanceof File) {
        const r    = ref(storage, `booths/${user.uid}/logo_${Date.now()}`);
        const snap = await uploadBytes(r, logoFile);
        finalLogoUrl   = await getDownloadURL(snap.ref);
        setLogoUrl(finalLogoUrl);
        setLogoFile(null);
      }

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

      if (!existing.exists()) {
        payload.createdAt      = serverTimestamp();
        payload.views          = 0;
        payload.whatsappClicks = 0;
        payload.avgRating      = 0;
        payload.totalRatings   = 0;
      }

      await setDoc(boothRef, payload, { merge: true });

      toast({
        title: t('dashboard.boothSettings.title') + " 🎉",
        description: t('dashboard.boothSettings.saveBtn'),
      });

    } catch (err: unknown) {
      console.error("Erro ao salvar:", err);
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setError(`Erro: ${msg}`);
      toast({ title: "Erro ao salvar", description: msg, variant: "destructive" });

    } finally {
      setIsLoading(false);
    }
  }

  if (!authReady || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold">{t('dashboard.boothSettings.title')}</h1>

      {/* Capa */}
      <div>
        <Label>{t('dashboard.boothSettings.coverLabel')}</Label>
        <div
          onClick={() => document.getElementById("input-capa")?.click()}
          className="mt-2 relative h-40 rounded-xl border-2 border-dashed border-border bg-muted hover:bg-muted/70 cursor-pointer overflow-hidden flex items-center justify-center transition-colors"
        >
          {capaPreview
            ? <img src={capaPreview} alt="Capa" className="w-full h-full object-cover" />
            : <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">{t('dashboard.boothSettings.coverDesc')}</span>
              </div>
          }
          {capaPreview && (
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">{t('dashboard.products.editModal.changePhoto')}</span>
            </div>
          )}
        </div>
        <input id="input-capa" type="file" accept="image/*" className="hidden" onChange={onCapaChange} />
      </div>

      {/* Logo */}
      <div>
        <Label>{t('dashboard.boothSettings.logoLabel')}</Label>
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
        <Label htmlFor="nome">{t('dashboard.boothSettings.nameLabel')}</Label>
        <Input id="nome" value={nome} onChange={e => setNome(e.target.value)} required placeholder="Ex: Artesanato da Maria" />
      </div>

      {/* Categoria */}
      <div className="space-y-1">
        <Label>{t('dashboard.boothSettings.categoryLabel')}</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {CATEGORIAS_PLATAFORMA.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <Label htmlFor="bio">{t('dashboard.boothSettings.bioLabel')}</Label>
        <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)} rows={4} placeholder="Conte a história da sua barraca..." />
      </div>

      {/* Localização */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="localizacao">{t('dashboard.boothSettings.cityLabel')}</Label>
          <Input id="localizacao" value={localizacao} onChange={e => setLocalizacao(e.target.value)} placeholder="Ex: São Paulo" />
        </div>
        <div className="space-y-1">
          <Label>{t('dashboard.boothSettings.stateLabel')}</Label>
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
          <Label htmlFor="whatsapp">{t('dashboard.boothSettings.whatsappLabel')}</Label>
          <Input id="whatsapp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="11999999999" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="instagram">{t('dashboard.boothSettings.instagramLabel')}</Label>
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
          ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('dashboard.boothSettings.saving')}</>
          : t('dashboard.boothSettings.saveBtn')
        }
      </Button>
    </form>
  );
}
