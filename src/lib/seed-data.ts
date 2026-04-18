/**
 * @fileOverview Script de sementeira (seed) com dados reais de artesanato brasileiro.
 * Inclui 27 barracas (uma para cada estado) e produtos variados.
 */

const WIKI_POTTERY = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ceramic_pot.jpg/640px-Ceramic_pot.jpg";
const WIKI_LACE = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Lace_making.jpg/640px-Lace_making.jpg";
const WIKI_WOOD = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/African_wood_carving.jpg/640px-African_wood_carving.jpg";
const WIKI_GOLDEN_GRASS = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Artesanato_Capim_Dourado.jpg/640px-Artesanato_Capim_Dourado.jpg";
const WIKI_CHEESE = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Queijo_minas_artesanal_do_Serro.jpg/640px-Queijo_minas_artesanal_do_Serro.jpg";
const WIKI_JEWELRY = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Jewellery_beads.jpg/640px-Jewellery_beads.jpg";
const WIKI_LEATHER = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Leather_craft.jpg/640px-Leather_craft.jpg";
const WIKI_BASKET = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Traditional_basket_from_Rwanda.jpg/640px-Traditional_basket_from_Rwanda.jpg";

export const SEED_BOOTHS = [
  { id: "br_ac", nome: "Cerâmica da Floresta", sellerName: "Maria Ashaninka", bio: "Artesanato indígena do Acre, utilizando pigmentos naturais da floresta amazônica.", categoria: "Cerâmicas", localizacao: "Rio Branco", estado: "AC", whatsapp: "68999990001", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 4.8, totalRatings: 15 },
  { id: "br_al", nome: "Rendas do Pontal", sellerName: "Dona Neide", bio: "O legítimo Filé Alagoano, bordado com a alma das rendeiras de Maceió.", categoria: "Tapetes e Redes", localizacao: "Maceió", estado: "AL", whatsapp: "82999990002", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.9, totalRatings: 22 },
  { id: "br_ap", nome: "Madeiras do Equador", sellerName: "João Macapá", bio: "Esculturas em madeiras nobres caídas, transformando natureza em arte.", categoria: "Decoração", localizacao: "Macapá", estado: "AP", whatsapp: "96999990003", logoUrl: WIKI_WOOD, capaUrl: WIKI_WOOD, isActive: true, avgRating: 4.7, totalRatings: 10 },
  { id: "br_am", nome: "Cestaria Baniwa", sellerName: "Apuã Santos", bio: "Trançados em fibra de arumã com grafismos tradicionais do Alto Rio Negro.", categoria: "Cama/Mesa/Banho", localizacao: "Manaus", estado: "AM", whatsapp: "92999990004", logoUrl: WIKI_BASKET, capaUrl: WIKI_BASKET, isActive: true, avgRating: 5.0, totalRatings: 18 },
  { id: "br_ba", nome: "Barro de Maragogipinho", sellerName: "Mestre Nivaldo", bio: "Tradição secular baiana em cerâmica utilitária e decorativa.", categoria: "Cerâmicas", localizacao: "Salvador", estado: "BA", whatsapp: "71999990005", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 4.9, totalRatings: 45 },
  { id: "br_ce", nome: "Labirinto do Ceará", sellerName: "Francisca das Rendas", bio: "Rendas de labirinto feitas à beira-mar, um patrimônio cearense.", categoria: "Decoração", localizacao: "Fortaleza", estado: "CE", whatsapp: "85999990006", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.8, totalRatings: 30 },
  { id: "br_df", nome: "Design Candango", sellerName: "Bruno Modernista", bio: "Mobiliário e objetos inspirados nos traços de Oscar Niemeyer.", categoria: "Móveis e Puffs", localizacao: "Brasília", estado: "DF", whatsapp: "61999990007", logoUrl: WIKI_WOOD, capaUrl: WIKI_WOOD, isActive: true, avgRating: 4.6, totalRatings: 12 },
  { id: "br_es", nome: "Panelas de Goiabeiras", sellerName: "Sueli Capixaba", bio: "As famosas panelas de barro feitas com a técnica indígena das Paneleiras.", categoria: "Cerâmicas", localizacao: "Vitória", estado: "ES", whatsapp: "27999990008", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 4.9, totalRatings: 50 },
  { id: "br_go", nome: "Cristais de Goiás", sellerName: "Antônio Pedras", bio: "Pedras e cristais lapidados à mão, direto da Chapada dos Veadeiros.", categoria: "Bijouterias e Joias", localizacao: "Pirenópolis", estado: "GO", whatsapp: "62999990009", logoUrl: WIKI_JEWELRY, capaUrl: WIKI_JEWELRY, isActive: true, avgRating: 4.7, totalRatings: 14 },
  { id: "br_ma", nome: "Fibras de Buriti", sellerName: "Lourdes Maranhão", bio: "Acessórios e cestarias feitos da palmeira sagrada do Maranhão.", categoria: "Bolsas e Couros", localizacao: "São Luís", estado: "MA", whatsapp: "98999990010", logoUrl: WIKI_BASKET, capaUrl: WIKI_BASKET, isActive: true, avgRating: 4.8, totalRatings: 19 },
  { id: "br_mt", nome: "Redes do Pantanal", sellerName: "Zeca Pantaneiro", bio: "Redes resistentes e confortáveis tecidas artesanalmente em teares manuais.", categoria: "Tapetes e Redes", localizacao: "Cuiabá", estado: "MT", whatsapp: "65999990011", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.9, totalRatings: 25 },
  { id: "br_ms", nome: "Biojoias do Sul", sellerName: "Tainá Bonito", bio: "Joias feitas com sementes e elementos naturais da fauna sul-mato-grossense.", categoria: "Bijouterias e Joias", localizacao: "Campo Grande", estado: "MS", whatsapp: "67999990012", logoUrl: WIKI_JEWELRY, capaUrl: WIKI_JEWELRY, isActive: true, avgRating: 4.7, totalRatings: 11 },
  { id: "br_mg", nome: "Trem de Minas", sellerName: "Uai Artesanato", bio: "Móveis rústicos e queijos artesanais. O melhor do interior mineiro.", categoria: "Alimentação", localizacao: "Tiradentes", estado: "MG", whatsapp: "31999990013", logoUrl: WIKI_CHEESE, capaUrl: WIKI_CHEESE, isActive: true, avgRating: 5.0, totalRatings: 120 },
  { id: "br_pa", nome: "Arte Marajoara", sellerName: "Iara Belém", bio: "A milenar arte cerâmica da Ilha de Marajó em peças contemporâneas.", categoria: "Cerâmicas", localizacao: "Belém", estado: "PA", whatsapp: "91999990014", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 5.0, totalRatings: 60 },
  { id: "br_pb", nome: "Algodão Colorido", sellerName: "Severino Campina", bio: "Tecidos feitos com o algodão que já nasce colorido na Paraíba.", categoria: "Roupas", localizacao: "João Pessoa", estado: "PB", whatsapp: "83999990015", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.8, totalRatings: 28 },
  { id: "br_pr", nome: "Artes do Pinhão", sellerName: "Rosana Curitiba", bio: "Trabalhos manuais inspirados na gralha azul e no pinhão paranaense.", categoria: "Decoração", localizacao: "Curitiba", estado: "PR", whatsapp: "41999990016", logoUrl: WIKI_WOOD, capaUrl: WIKI_WOOD, isActive: true, avgRating: 4.5, totalRatings: 9 },
  { id: "br_pe", nome: "Mestres de Caruaru", sellerName: "Vitalino Jr.", bio: "Figuras de barro que retratam o cotidiano e a força do povo nordestino.", categoria: "Cerâmicas", localizacao: "Caruaru", estado: "PE", whatsapp: "81999990017", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 5.0, totalRatings: 85 },
  { id: "br_pi", nome: "Joias de Pedro II", sellerName: "Raimundo Opala", bio: "Exclusivas joias com a Opala do Piauí, única no mundo além da Austrália.", categoria: "Bijouterias e Joias", localizacao: "Teresina", estado: "PI", whatsapp: "86999990018", logoUrl: WIKI_JEWELRY, capaUrl: WIKI_JEWELRY, isActive: true, avgRating: 4.9, totalRatings: 32 },
  { id: "br_rj", nome: "Ateliê Búzios", sellerName: "Carla Mar", bio: "Moda praia feita à mão com materiais sustentáveis e design carioca.", categoria: "Moda Artesanal", localizacao: "Rio de Janeiro", estado: "RJ", whatsapp: "21999990019", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.6, totalRatings: 40 },
  { id: "br_rn", nome: "Renda Renascença", sellerName: "Maria Caicó", bio: "A delicadeza da renda renascença feita pelas mãos das rendeiras do Seridó.", categoria: "Decoração", localizacao: "Natal", estado: "RN", whatsapp: "84999990020", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.9, totalRatings: 18 },
  { id: "br_rs", nome: "Pampa Couros", sellerName: "Gaucho Nobre", bio: "Artigos em couro legítimo feitos com a tradição dos pampas.", categoria: "Bolsas e Couros", localizacao: "Gramado", estado: "RS", whatsapp: "51999990021", logoUrl: WIKI_LEATHER, capaUrl: WIKI_LEATHER, isActive: true, avgRating: 4.8, totalRatings: 55 },
  { id: "br_ro", nome: "Arte do Guaporé", sellerName: "Indio Velho", bio: "Artesanato tradicional das tribos de Rondônia em sementes e palha.", categoria: "Outros", localizacao: "Porto Velho", estado: "RO", whatsapp: "69999990022", logoUrl: WIKI_BASKET, capaUrl: WIKI_BASKET, isActive: true, avgRating: 4.7, totalRatings: 14 },
  { id: "br_rr", nome: "Cestaria Macuxi", sellerName: "Solange Boa Vista", bio: "Cestos e adornos feitos em fibra natural por comunidades locais.", categoria: "Tapetes e Redes", localizacao: "Boa Vista", estado: "RR", whatsapp: "95999990023", logoUrl: WIKI_BASKET, capaUrl: WIKI_BASKET, isActive: true, avgRating: 4.6, totalRatings: 8 },
  { id: "br_sc", nome: "Cristais Soprados", sellerName: "Hans Blumenau", bio: "Peças decorativas em cristal feitas com a técnica do sopro manual.", categoria: "Decoração", localizacao: "Blumenau", estado: "SC", whatsapp: "47999990024", logoUrl: WIKI_POTTERY, capaUrl: WIKI_POTTERY, isActive: true, avgRating: 4.9, totalRatings: 20 },
  { id: "br_sp", nome: "Design de Embu", sellerName: "Paulo Artes", bio: "Esculturas e utilitários modernos feitos na vila das artes de Embu.", categoria: "Quadros e Molduras", localizacao: "São Paulo", estado: "SP", whatsapp: "11999990025", logoUrl: WIKI_WOOD, capaUrl: WIKI_WOOD, isActive: true, avgRating: 4.5, totalRatings: 75 },
  { id: "br_se", nome: "Renda Irlandesa", sellerName: "Marta Divina", bio: "A tradicional renda irlandesa de Divina Pastora, patrimônio cultural do Brasil.", categoria: "Decoração", localizacao: "Aracaju", estado: "SE", whatsapp: "79999990026", logoUrl: WIKI_LACE, capaUrl: WIKI_LACE, isActive: true, avgRating: 4.8, totalRatings: 16 },
  { id: "br_to", nome: "Capim Dourado", sellerName: "Vera Jalapão", bio: "As famosas joias do Jalapão feitas com o ouro vegetal do Tocantins.", categoria: "Bijouterias e Joias", localizacao: "Palmas", estado: "TO", whatsapp: "63999990027", logoUrl: WIKI_GOLDEN_GRASS, capaUrl: WIKI_GOLDEN_GRASS, isActive: true, avgRating: 5.0, totalRatings: 42 },
];

export const SEED_PRODUCTS = SEED_BOOTHS.flatMap((booth) => [
  {
    name: `Clássico de ${booth.localizacao}`,
    price: Math.floor(Math.random() * (450 - 50 + 1) + 50),
    description: `Um item exclusivo da barraca ${booth.nome}, feito à mão utilizando técnicas de ${booth.categoria} transmitidas por gerações em ${booth.estado}.`,
    category: booth.categoria,
    imageUrl: booth.logoUrl,
    boothId: booth.id,
    sellerId: booth.id,
    isActive: true,
  },
  {
    name: `Especial ${booth.estado}`,
    price: Math.floor(Math.random() * (300 - 30 + 1) + 30),
    description: `Peça de design único que captura a essência da cultura de ${booth.localizacao}. Perfeito para decorar ou presentear.`,
    category: booth.categoria,
    imageUrl: booth.capaUrl,
    boothId: booth.id,
    sellerId: booth.id,
    isActive: true,
  }
]);
