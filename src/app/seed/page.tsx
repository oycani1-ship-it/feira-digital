
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Database, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSeed = async () => {
    if (!confirm("Isso apagará TODAS as barracas e produtos atuais. Deseja continuar?")) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Seed failed");
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err.message || "Erro desconhecido ao popular banco.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="max-w-md w-full shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Database className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-display text-2xl">Sementeira de Dados</CardTitle>
          <CardDescription>
            Popule a Feira Digital com artesãos e produtos realistas para testes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            <strong>Atenção:</strong> Esta ação é irreversível. Todas as informações de barracas, produtos e avaliações existentes no Firestore serão deletadas antes da inserção dos novos dados.
          </div>

          {status === "idle" && (
            <Button onClick={handleSeed} className="w-full h-12 font-mono-tag text-[10px] uppercase tracking-widest">
              Iniciar Limpeza e Seed
            </Button>
          )}

          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-medium animate-pulse">Trabalhando no banco de dados...</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">Banco de dados populado com sucesso!</p>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Voltar para a Home</Link>
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3 text-destructive bg-destructive/5 p-4 rounded-xl">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{errorMsg}</p>
              </div>
              <Button onClick={() => setStatus("idle")} variant="ghost" className="w-full">
                Tentar novamente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
