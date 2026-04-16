"use client";

import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Eye, Package, Star, MessageCircle, ArrowUpRight, Plus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardHome() {
  const user = auth.currentUser;
  const [stats, setStats] = useState({
    views: 1240,
    products: 12,
    rating: 4.8,
    clicks: 45
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="font-headline text-3xl font-bold mb-2">Olá, {user?.displayName?.split(' ')[0] || "Artesão"}!</h1>
        <p className="text-muted-foreground">Aqui está o desempenho da sua barraca nos últimos 30 dias.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">Visitas</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-green-500 font-bold">+12%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Ativos na plataforma</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rating}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Baseado em 24 avaliações</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary/70">Cliques WhatsApp</CardTitle>
            <MessageCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.clicks}</div>
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-green-500 font-bold">+5%</span> leads convertidos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-bold text-xl">Ações Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href="/dashboard/produtos/novo">
                <span className="flex items-center gap-3 font-bold"><Plus className="h-5 w-5 text-primary" /> Novo Produto</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href="/dashboard/barraca">
                <span className="flex items-center gap-3 font-bold"><Store className="h-5 w-5 text-primary" /> Editar Barraca</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
            <Button asChild className="h-16 justify-between px-6" variant="outline">
              <Link href={`/barraca/public-profile`}>
                <span className="flex items-center gap-3 font-bold"><ExternalLink className="h-5 w-5 text-primary" /> Ver Perfil Público</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-xl">Dicas para seu Negócio</h2>
          <Card className="border-none bg-muted/30">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 bg-primary text-white rounded-lg flex items-center justify-center font-bold">!</div>
                <div>
                  <h4 className="font-bold mb-1">Destaque seus produtos</h4>
                  <p className="text-sm text-muted-foreground">Barracas com mais de 5 produtos e fotos de alta qualidade recebem 3x mais contatos no WhatsApp.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}