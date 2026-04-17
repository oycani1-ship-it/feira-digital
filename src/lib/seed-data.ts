
import { db } from "./firebase";
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc, 
  serverTimestamp 
} from "firebase/firestore";

const BOOTHS_COLLECTION = "booths";
const PRODUCTS_COLLECTION = "products";
const RATINGS_COLLECTION = "ratings";

export const SEED_BOOTHS = [
  {
    id: "artesao_ceramica_01",
    nome: "Ateliê Barro Vivo",
    sellerName: "Mestre Januário",
    bio: "Herdeiro das tradições do Vale do Jequitinhonha, transformo o barro em poesia. Minhas peças carregam o silêncio e a força do sertão mineiro, utilizando pigmentos naturais e queima primitiva.",
    categoria: "Cerâmicas",
    localizacao: "Turmalina",
    estado: "MG",
    whatsapp: "31999999999",
    instagram: "barrovivo_oficial",
    logoUrl: "https://images.unsplash.com/photo-1595039838779-f3130553de5c?auto=format&fit=crop&q=80&w=200",
    capaUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1200",
    isActive: true,
    avgRating: 4.9,
    totalRatings: 12,
    views: 145,
    whatsappClicks: 28
  },
  {
    id: "artesao_tecelagem_02",
    nome: "Tecelagem Solar",
    sellerName: "Dona Flor",
    bio: "Fios tingidos com cascas de árvores e frutos. Criamos redes e mantas que guardam o calor do sol do Nordeste. Cada trama é um desenho da nossa história, feito no tear manual de madeira.",
    categoria: "Tapetes e Redes",
    localizacao: "Resende",
    estado: "RJ",
    whatsapp: "24988888888",
    instagram: "tecelagem_solar",
    logoUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=200",
    capaUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=1200",
    isActive: true,
    avgRating: 4.8,
    totalRatings: 8,
    views: 89,
    whatsappClicks: 15
  },
  {
    id: "artesao_joias_03",
    nome: "Joias do Sertão",
    sellerName: "Ricardo Prata",
    bio: "Ourivesaria contemporânea inspirada no cangaço e na fauna da caatinga. Trabalhamos com prata 950 e pedras brasileiras brutas, criando adornos que são verdadeiros amuletos de força.",
    categoria: "Bijouterias e Joias",
    localizacao: "Caicó",
    estado: "RN",
    whatsapp: "84977777777",
    instagram: "joiasdosertao_arte",
    logoUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200",
    capaUrl: "https://images.unsplash.com/photo-1515562141207-7a18b5ce73f3?auto=format&fit=crop&q=80&w=1200",
    isActive: true,
    avgRating: 5.0,
    totalRatings: 20,
    views: 312,
    whatsappClicks: 54
  },
  {
    id: "artesao_doces_04",
    nome: "Sabor da Roça",
    sellerName: "Tia Cotinha",
    bio: "O segredo do tacho de cobre e o tempo da lenha. Produzimos doces de corte e geleias com frutas do nosso pomar, sem conservantes, seguindo as receitas da minha bisavó desde 1940.",
    categoria: "Doces e Salgados",
    localizacao: "Pirenópolis",
    estado: "GO",
    whatsapp: "62966666666",
    instagram: "sabordaroca_pira",
    logoUrl: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=200",
    capaUrl: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&q=80&w=1200",
    isActive: true,
    avgRating: 4.7,
    totalRatings: 35,
    views: 520,
    whatsappClicks: 112
  }
];

export const SEED_PRODUCTS = [
  // Produtos Ateliê Barro Vivo
  {
    nome: "Vaso Noiva do Jequitinhonha",
    price: 380.00,
    categoria: "Cerâmicas",
    shortDescription: "Vaso icônico moldado à mão com pintura de pigmentos minerais.",
    description: "Inspirado nas tradicionais bonecas noivas da região. Esta peça é decorativa e utilitária, suportando água. A pintura é feita com o próprio barro em tons de ocre e terracota.",
    boothId: "artesao_ceramica_01",
    sellerId: "artesao_ceramica_01",
    boothNome: "Ateliê Barro Vivo",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  {
    nome: "Cumbuca Ancestral",
    price: 85.00,
    categoria: "Cerâmicas",
    shortDescription: "Tigela rústica para caldos, feita em torno manual.",
    description: "Peça resistente ao calor, ideal para servir sopas e caldos. O acabamento é feito com brunidura de pedra, conferindo um brilho acetinado natural.",
    boothId: "artesao_ceramica_01",
    sellerId: "artesao_ceramica_01",
    boothNome: "Ateliê Barro Vivo",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  // Produtos Tecelagem Solar
  {
    nome: "Manta Horizonte Ocre",
    price: 245.00,
    categoria: "Tapetes e Redes",
    shortDescription: "Manta 100% algodão para sofá ou cama.",
    description: "Tecida em tear manual com fios tingidos com casca de cebola e urucum. Toque macio e trama fechada, garantindo durabilidade e conforto térmico.",
    boothId: "artesao_tecelagem_02",
    sellerId: "artesao_tecelagem_02",
    boothNome: "Tecelagem Solar",
    imageUrl: "https://images.unsplash.com/photo-1606567170104-e53b66412e47?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  {
    nome: "Rede Descanso do Mar",
    price: 420.00,
    categoria: "Tapetes e Redes",
    shortDescription: "Rede de casal reforçada com acabamento em franjas.",
    description: "Rede de grandes dimensões, ideal para varandas. O punho é feito com corda náutica revestida em algodão para maior segurança. Estampa listrada clássica.",
    boothId: "artesao_tecelagem_02",
    sellerId: "artesao_tecelagem_02",
    boothNome: "Tecelagem Solar",
    imageUrl: "https://images.unsplash.com/photo-1544273677-277914c9ad44?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  // Produtos Joias do Sertão
  {
    nome: "Colar Mandacaru Prata",
    price: 290.00,
    categoria: "Bijouterias e Joias",
    shortDescription: "Pingente em prata 950 esculpido com forma de cacto.",
    description: "Uma joia que celebra a resiliência da caatinga. Corrente veneziana de 45cm inclusa. Acabamento oxidado para destacar os detalhes da textura.",
    boothId: "artesao_joias_03",
    sellerId: "artesao_joias_03",
    boothNome: "Joias do Sertão",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a18b5ce73f3?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  {
    nome: "Anel Pedra da Lua Bruta",
    price: 180.00,
    categoria: "Bijouterias e Joias",
    shortDescription: "Anel ajustável com pedra natural não lapidada.",
    description: "Peça única. A pedra mantém sua forma original como foi encontrada na natureza, encastrada em uma moldura de prata orgânica.",
    boothId: "artesao_joias_03",
    sellerId: "artesao_joias_03",
    boothNome: "Joias do Sertão",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  // Produtos Sabor da Roça
  {
    nome: "Geleia de Jabuticaba do Pé",
    price: 32.00,
    categoria: "Doces e Salgados",
    shortDescription: "Geleia artesanal com pedaços da fruta, 250g.",
    description: "Frutas colhidas no auge da maturação. Cozimento lento que preserva a cor e o sabor intenso da jabuticaba. Sem adição de pectina comercial.",
    boothId: "artesao_doces_04",
    sellerId: "artesao_doces_04",
    boothNome: "Sabor da Roça",
    imageUrl: "https://images.unsplash.com/photo-1534063462998-fdf05417677d?auto=format&fit=crop&q=80&w=600",
    isActive: true
  },
  {
    nome: "Queijo Minas Curado no Café",
    price: 65.00,
    categoria: "Doces e Salgados",
    shortDescription: "Queijo artesanal de leite cru com casca de café.",
    description: "Maturado por 30 dias em ambiente controlado. A crosta de café confere notas amadeiradas e um aroma irresistível. Aproximadamente 500g.",
    boothId: "artesao_doces_04",
    sellerId: "artesao_doces_04",
    boothNome: "Sabor da Roça",
    imageUrl: "https://images.unsplash.com/photo-1485962391905-2d793ad41e32?auto=format&fit=crop&q=80&w=600",
    isActive: true
  }
];

export async function clearDatabase() {
  const collections = [BOOTHS_COLLECTION, PRODUCTS_COLLECTION, RATINGS_COLLECTION];
  
  for (const collectionName of collections) {
    const snap = await getDocs(collection(db, collectionName));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
    console.log(`Coleção ${collectionName} limpa.`);
  }
}

export async function runSeed() {
  try {
    console.log("Iniciando limpeza...");
    await clearDatabase();
    
    const batch = writeBatch(db);
    
    console.log("Inserindo Barracas...");
    SEED_BOOTHS.forEach((booth) => {
      const ref = doc(db, BOOTHS_COLLECTION, booth.id);
      batch.set(ref, {
        ...booth,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });
    
    console.log("Inserindo Produtos...");
    SEED_PRODUCTS.forEach((product) => {
      const ref = doc(collection(db, PRODUCTS_COLLECTION));
      batch.set(ref, {
        ...product,
        createdAt: serverTimestamp()
      });
    });
    
    await batch.commit();
    console.log("Seed finalizado com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("Erro no Seed:", error);
    throw error;
  }
}
