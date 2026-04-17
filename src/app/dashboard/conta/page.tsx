"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { updateProfile, updatePassword, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User as UserIcon, Lock, Mail, ShieldCheck } from "lucide-react";
import { useTranslation } from "@/context/language-context";

export default function AccountSettingsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.displayName || "");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdatingProfile(true);
    try {
      await updateProfile(user, { displayName: name });
      toast({ title: "Perfil atualizado!", description: "Seu nome de usuário foi alterado com sucesso." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao atualizar", description: error.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      return toast({ variant: "destructive", title: "Erro", description: "As senhas não coincidem." });
    }
    if (newPassword.length < 6) {
      return toast({ variant: "destructive", title: "Senha curta", description: "A senha deve ter pelo menos 6 caracteres." });
    }

    setIsUpdatingPassword(true);
    try {
      await updatePassword(user, newPassword);
      toast({ title: "Senha alterada!", description: "Sua senha foi redefinida com sucesso." });
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro de segurança", description: "Para trocar a senha, você precisa ter feito login recentemente. Tente sair e entrar de novo." });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Carregando dados da conta...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">{t('dashboard.account.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.account.subtitle')}</p>
      </div>

      <div className="grid gap-8">
        {/* Profile Card */}
        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <UserIcon className="h-5 w-5 text-primary" /> {t('dashboard.account.personalInfo')}
            </CardTitle>
            <CardDescription>{t('dashboard.account.personalDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="acc-email">{t('dashboard.account.emailLabel')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="acc-email" 
                    value={user?.email || ""} 
                    disabled 
                    className="pl-10 bg-muted/50"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">{t('dashboard.account.emailDesc')}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="acc-name">{t('dashboard.account.nameLabel')}</Label>
                <Input 
                  id="acc-name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : t('dashboard.account.saveBtn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="border-none shadow-sm bg-muted/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lock className="h-5 w-5 text-primary" /> {t('dashboard.account.security')}
            </CardTitle>
            <CardDescription>{t('dashboard.account.securityDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-pass">{t('dashboard.account.newPassLabel')}</Label>
                <Input 
                  id="new-pass" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="conf-pass">{t('dashboard.account.confPassLabel')}</Label>
                <Input 
                  id="conf-pass" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite novamente"
                />
              </div>
              <Button variant="outline" type="submit" className="w-full sm:w-auto" disabled={isUpdatingPassword}>
                {isUpdatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : t('dashboard.account.resetBtn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            {t('dashboard.account.shieldText')}
          </p>
        </div>
      </div>
    </div>
  );
}
