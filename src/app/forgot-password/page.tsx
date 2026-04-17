"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/context/language-context";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.code === "auth/user-not-found" ? "Email nao encontrado" : "Erro ao enviar email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">{t('auth.emailSentTitle')}</h1>
          <p className="text-gray-600 mb-6">{t('auth.emailSentDesc')}</p>
          <Link href="/login"><Button className="w-full">{t('auth.backButton')}</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-primary mb-6">{t('auth.forgotPasswordTitle')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('auth.emailLabel')}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" 
              placeholder={t('auth.emailPlaceholder')} 
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? "..." : t('auth.forgotPasswordButton')}</Button>
          <Link href="/login" className="block text-center text-sm text-primary hover:underline">{t('auth.backToLogin')}</Link>
        </form>
      </div>
    </div>
  );
}
