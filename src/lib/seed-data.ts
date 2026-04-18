/**
 * @fileOverview Script de sementeira (seed) com dados reais de artesanato brasileiro.
 * Inclui 27 barracas (uma para cada estado) e produtos variados com preços e descrições fixas.
 */

const WIKI_POTTERY = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pottery_-_Memorial_dos_Povos_Ind%C3%ADgenas_-_Brasilia_-_DSC00478.JPG/800px-Pottery_-_Memorial_dos_Povos_Ind%C3%ADgenas_-_Brasilia_-_DSC00478.JPG";
const WIKI_LACE = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Renda_de_bilro.jpg/800px-Renda_de_bilro.jpg";
const WIKI_WOOD = "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Escultura_em_madeira._%286479004455%29.jpg/800px-Escultura_em_madeira._%286479004455%29.jpg";
const WIKI_GOLDEN_GRASS = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Artesanato_capim_dourado.jpg/800px-Artesanato_capim_dourado.jpg";
const WIKI_CHEESE = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Queijo_Minas_Frescal.JPG/800px-Queijo_Minas_Frescal.JPG";
const WIKI_JEWELRY = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Artez%C3%A3o_na_feira_-_panoramio.jpg/800px-Artez%C3%A3o_na_feira_-_panoramio.jpg";
const WIKI_LEATHER = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Artesanato_em_couro.jpg/800px-Artesanato_em_couro.jpg";
const WIKI_BASKET = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Cestaria_ind%C3%ADgena_MN_01.jpg/800px-Cestaria_ind%C3%ADgena_MN_01.jpg";

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

export const SEED_PRODUCTS = [
  // AC
  { id: "prod_ac_1", name: "Vaso Kene Tradicional", price: 120.00, description: "Vaso de cerâmica modelado à mão com grafismos Kene da etnia Ashaninka.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_ac", sellerId: "br_ac", isActive: true },
  { id: "prod_ac_2", name: "Cesto de Arumã", price: 85.00, description: "Cesto trançado com fibra de arumã e pigmentos naturais da floresta.", category: "Decoração", imageUrl: WIKI_BASKET, boothId: "br_ac", sellerId: "br_ac", isActive: true },
  // AL
  { id: "prod_al_1", name: "Jogo Americano Filé", price: 250.00, description: "Conjunto completo em renda Filé bordado com cores vibrantes típicas de Alagoas.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_al", sellerId: "br_al", isActive: true },
  { id: "prod_al_2", name: "Caminho de Mesa Renda", price: 145.00, description: "Peça delicada em renda Filé para mesas de jantar.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_al", sellerId: "br_al", isActive: true },
  // AP
  { id: "prod_ap_1", name: "Escultura Onça de Madeira", price: 180.00, description: "Escultura entalhada à mão em madeira de reaproveitamento.", category: "Decoração", imageUrl: WIKI_WOOD, boothId: "br_ap", sellerId: "br_ap", isActive: true },
  // AM
  { id: "prod_am_1", name: "Tipiti Baniwa", price: 95.00, description: "Espremedor de mandioca artesanal feito por comunidades do Alto Rio Negro.", category: "Cama/Mesa/Banho", imageUrl: WIKI_BASKET, boothId: "br_am", sellerId: "br_am", isActive: true },
  { id: "prod_am_2", name: "Máscara Cerimonial", price: 220.00, description: "Máscara tradicional utilizada em ritos amazônicos.", category: "Decoração", imageUrl: WIKI_WOOD, boothId: "br_am", sellerId: "br_am", isActive: true },
  // BA
  { id: "prod_ba_1", name: "Moringa Barro Marrom", price: 90.00, description: "Moringa clássica de Maragogipinho para água fresca.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_ba", sellerId: "br_ba", isActive: true },
  { id: "prod_ba_2", name: "Prato Decorativo Bahia", price: 110.00, description: "Prato em cerâmica pintado com temas do cotidiano baiano.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_ba", sellerId: "br_ba", isActive: true },
  // CE
  { id: "prod_ce_1", name: "Almofada Renda Labirinto", price: 85.00, description: "Capa de almofada com detalhes em renda Labirinto autêntica.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_ce", sellerId: "br_ce", isActive: true },
  { id: "prod_ce_2", name: "Caminho de Mesa Labirinto", price: 320.00, description: "Peça de luxo artesanal feita em Fortaleza.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_ce", sellerId: "br_ce", isActive: true },
  // DF
  { id: "prod_df_1", name: "Luminária Capital", price: 190.00, description: "Luminária de mesa inspirada nos vitrais da Catedral de Brasília.", category: "Decoração", imageUrl: WIKI_WOOD, boothId: "br_df", sellerId: "br_df", isActive: true },
  // ES
  { id: "prod_es_1", name: "Panela de Barro Oficial", price: 130.00, description: "Panela de barro original para moqueca capixaba.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_es", sellerId: "br_es", isActive: true },
  // GO
  { id: "prod_go_1", name: "Drusa de Cristal Puro", price: 150.00, description: "Formação natural de cristal de rocha da região de Cristalina.", category: "Decoração", imageUrl: WIKI_JEWELRY, boothId: "br_go", sellerId: "br_go", isActive: true },
  { id: "prod_go_2", name: "Pulseira Capim Dourado", price: 45.00, description: "Pulseira elegante feita com o capim dourado da região.", category: "Bijouterias e Joias", imageUrl: WIKI_GOLDEN_GRASS, boothId: "br_go", sellerId: "br_go", isActive: true },
  // MA
  { id: "prod_ma_1", name: "Bolsa Buriti Chic", price: 140.00, description: "Bolsa feminina tecida à mão com fibra de palmeira Buriti.", category: "Bolsas e Couros", imageUrl: WIKI_BASKET, boothId: "br_ma", sellerId: "br_ma", isActive: true },
  // MT
  { id: "prod_mt_1", name: "Rede de Tear Manual", price: 280.00, description: "Rede de algodão tecida em tear tradicional do Pantanal.", category: "Tapetes e Redes", imageUrl: WIKI_LACE, boothId: "br_mt", sellerId: "br_mt", isActive: true },
  // MS
  { id: "prod_ms_1", name: "Colar Jarina Real", price: 85.00, description: "Colar feito com o marfim vegetal da Amazônia (Semente de Jarina).", category: "Bijouterias e Joias", imageUrl: WIKI_JEWELRY, boothId: "br_ms", sellerId: "br_ms", isActive: true },
  // MG
  { id: "prod_mg_1", name: "Queijo Canastra Meia Cura", price: 110.00, description: "Queijo artesanal premiado da região da Serra da Canastra.", category: "Alimentação", imageUrl: WIKI_CHEESE, boothId: "br_mg", sellerId: "br_mg", isActive: true },
  { id: "prod_mg_2", name: "Doce de Leite na Palha", price: 35.00, description: "Doce de leite tradicional cozido lentamente no fogão a lenha.", category: "Alimentação", imageUrl: WIKI_CHEESE, boothId: "br_mg", sellerId: "br_mg", isActive: true },
  // PA
  { id: "prod_pa_1", name: "Vaso Marajoara Clássico", price: 380.00, description: "Réplica autorizada de cerâmica arqueológica da Ilha de Marajó.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_pa", sellerId: "br_pa", isActive: true },
  { id: "prod_pa_2", name: "Prato Tapajônico", price: 150.00, description: "Peça cerâmica com os cariátides e relevos típicos da região do Tapajós.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_pa", sellerId: "br_pa", isActive: true },
  // PB
  { id: "prod_pb_1", name: "Camisa de Algodão Colorido", price: 165.00, description: "Vestuário feito com algodão sustentável que já nasce com cor.", category: "Roupas", imageUrl: WIKI_LACE, boothId: "br_pb", sellerId: "br_pb", isActive: true },
  // PR
  { id: "prod_pr_1", name: "Petisqueira Pinhão", price: 120.00, description: "Utilitário em madeira esculpida no formato de pinhão.", category: "Decoração", imageUrl: WIKI_WOOD, boothId: "br_pr", sellerId: "br_pr", isActive: true },
  // PE
  { id: "prod_pe_1", name: "O Retirante de Barro", price: 180.00, description: "Escultura inspirada no legado de Mestre Vitalino de Caruaru.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_pe", sellerId: "br_pe", isActive: true },
  { id: "prod_pe_2", name: "Banda de Pífano", price: 120.00, description: "Conjunto de figuras de barro representando músicos nordestinos.", category: "Cerâmicas", imageUrl: WIKI_POTTERY, boothId: "br_pe", sellerId: "br_pe", isActive: true },
  // PI
  { id: "prod_pi_1", name: "Anel Opala Nobre", price: 450.00, description: "Anel em prata com a única opala preciosa do Brasil.", category: "Bijouterias e Joias", imageUrl: WIKI_JEWELRY, boothId: "br_pi", sellerId: "br_pi", isActive: true },
  // RJ
  { id: "prod_rj_1", name: "Biquíni Crochê Rio", price: 160.00, description: "Moda praia feita artesanalmente com design exclusivo do Rio.", category: "Moda Artesanal", imageUrl: WIKI_LACE, boothId: "br_rj", sellerId: "br_rj", isActive: true },
  // RN
  { id: "prod_rn_1", name: "Toalha Renascença Luxo", price: 480.00, description: "Toalha de mesa inteiramente feita em renda Renascença.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_rn", sellerId: "br_rn", isActive: true },
  // RS
  { id: "prod_rs_1", name: "Mateira Couro Cru", price: 220.00, description: "Kit completo em couro para carregar chimarrão com estilo gaúcho.", category: "Bolsas e Couros", imageUrl: WIKI_LEATHER, boothId: "br_rs", sellerId: "br_rs", isActive: true },
  { id: "prod_rs_2", name: "Faca Artesanal Pampa", price: 350.00, description: "Faca forjada com cabo em osso e bainha de couro.", category: "Bolsas e Couros", imageUrl: WIKI_LEATHER, boothId: "br_rs", sellerId: "br_rs", isActive: true },
  // RO
  { id: "prod_ro_1", name: "Colar Etnia Karitiana", price: 55.00, description: "Colar de miçangas e sementes feito por mulheres indígenas.", category: "Bijouterias e Joias", imageUrl: WIKI_JEWELRY, boothId: "br_ro", sellerId: "br_ro", isActive: true },
  // RR
  { id: "prod_rr_1", name: "Cesto Macuxi", price: 95.00, description: "Cesto trançado com grafismos de terra da etnia Macuxi.", category: "Tapetes e Redes", imageUrl: WIKI_BASKET, boothId: "br_rr", sellerId: "br_rr", isActive: true },
  // SC
  { id: "prod_sc_1", name: "Vaso de Cristal Soprado", price: 380.00, description: "Vaso artesanal feito com técnica alemã de sopro de vidro.", category: "Decoração", imageUrl: WIKI_POTTERY, boothId: "br_sc", sellerId: "br_sc", isActive: true },
  // SP
  { id: "prod_sp_1", name: "Abstrato em Madeira", price: 420.00, description: "Escultura decorativa inspirada no movimento de arte de Embu.", category: "Quadros e Molduras", imageUrl: WIKI_WOOD, boothId: "br_sp", sellerId: "br_sp", isActive: true },
  // SE
  { id: "prod_se_1", name: "Toalha Irlanda Brasil", price: 450.00, description: "Toalha em Renda Irlandesa, patrimônio imaterial de Sergipe.", category: "Decoração", imageUrl: WIKI_LACE, boothId: "br_se", sellerId: "br_se", isActive: true },
  // TO
  { id: "prod_to_1", name: "Mandala Capim Dourado", price: 240.00, description: "Grande mandala decorativa feita com o ouro vegetal do Jalapão.", category: "Bijouterias e Joias", imageUrl: WIKI_GOLDEN_GRASS, boothId: "br_to", sellerId: "br_to", isActive: true },
  { id: "prod_to_2", name: "Colar Jalapão", price: 110.00, description: "Colar em capim dourado e pedras naturais.", category: "Bijouterias e Joias", imageUrl: WIKI_GOLDEN_GRASS, boothId: "br_to", sellerId: "br_to", isActive: true }
];
