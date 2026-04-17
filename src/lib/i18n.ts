export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export const translations = {
  'pt-BR': {
    nav: {
      explore: 'Explorar',
      howItWorks: 'Como Funciona',
      login: 'Entrar',
      createBooth: 'Criar Barraca',
      dashboard: 'Painel do Vendedor',
      logout: 'Sair',
      searchPlaceholder: 'Buscar barracas, produtos...'
    },
    hero: {
      editorial: 'A ressonância singular do artesanato puro.',
      description: 'Um palco digital curado para a excelência artesanal. Onde cada ponto narra uma linhagem de maestria.',
      cta: 'Iniciar Descoberta'
    },
    sections: {
      legacy: 'Legado e Forma',
      legacyTitle: 'Coleções curadas que transcendem o efêmero.',
      legacyDesc: 'Unimos técnicas ancestrais a sensibilidades contemporâneas. Sem produção em massa. Sem concessões. Apenas pura intenção humana.',
      legacyLink: 'Explorar Coleções',
      authenticity: 'Autenticidade é o luxo supremo.',
      path: 'O Caminho do Artesão',
      pathTitle: 'Diálogo direto com mestres criadores.',
      pathDesc: 'Conecte-se diretamente via WhatsApp. Negocie a alma da sua aquisição sem intermediários. Um mercado construído sobre confiança e transparência.',
      pathCta: 'Juntar-se como Artesão'
    },
    explore: {
      title: 'Explorar Feira',
      subtitle: 'Artesanato autêntico direto de quem faz.',
      searchPlaceholder: 'Nome ou categoria...',
      clearFilters: 'Limpar filtros',
      state: 'ESTADO',
      category: 'CATEGORIA',
      allStates: 'Brasil inteiro',
      allCategories: 'Todas as categorias',
      noResults: 'Nenhuma barraca encontrada',
      noResultsDesc: 'Tente ajustar seus filtros ou termos de busca para encontrar artesãos.',
      viewBooth: 'Ver Barraca',
      evaluations: 'avaliações'
    },
    boothDetail: {
      backToExplore: 'Voltar para Explorar',
      contactWhatsapp: 'Contato WhatsApp',
      share: 'Compartilhar',
      averageRating: 'Média de Avaliações',
      evaluations: 'avaliações',
      rateThisBooth: 'Avalie esta barraca',
      ratingSuccess: 'Sua avaliação foi registrada com sucesso.',
      ratingError: 'Não foi possível registrar sua avaliação.',
      catalogue: 'Catálogo de Produtos',
      viewDetails: 'Ver Detalhes',
      interestBtn: 'Tenho Interesse',
      directNegociation: 'Negociação direta com o artesão via WhatsApp.',
      emptyCatalogue: 'Sem produtos no momento. O artesão está preparando novidades.'
    },
    dashboard: {
      sidebar: {
        general: 'Geral',
        myBooth: 'Minha Barraca',
        products: 'Produtos',
        account: 'Minha Conta'
      },
      home: {
        welcome: 'Olá',
        subtitle: 'Aqui está o desempenho real da sua barraca na Feira Digital.',
        stats: {
          views: 'Visitas',
          viewsDesc: 'Total de visualizações do perfil',
          products: 'Produtos',
          productsDesc: 'Cadastrados no catálogo',
          rating: 'Avaliação Média',
          ratingDesc: 'Baseado em {count} avaliações',
          clicks: 'Cliques WhatsApp',
          clicksDesc: 'Interessados que abriram conversa'
        },
        quickActions: {
          title: 'Ações Rápidas',
          newProduct: 'Novo Produto',
          editBooth: 'Editar Barraca',
          viewPublic: 'Ver Perfil Público'
        },
        tips: {
          title: 'Dicas para seu Negócio',
          tip1Title: 'Destaque seus produtos',
          tip1Desc: 'Barracas com mais de 5 produtos e fotos de alta qualidade recebem 3x mais contatos no WhatsApp.'
        }
      },
      products: {
        title: 'Produtos',
        subtitle: 'Gerencie o catálogo da sua barraca.',
        addBtn: 'Adicionar Produto',
        searchPlaceholder: 'Buscar produtos...',
        table: {
          photo: 'Foto',
          name: 'Nome',
          category: 'Categoria',
          price: 'Preço',
          status: 'Status',
          actions: 'Ações',
          active: 'Ativo',
          inactive: 'Inativo'
        },
        empty: 'Nenhum produto encontrado.',
        editModal: {
          title: 'Editar Produto',
          changePhoto: 'Alterar Foto',
          saveBtn: 'Salvar Alterações',
          cancelBtn: 'Cancelar'
        }
      },
      newProduct: {
        title: 'Novo Produto',
        backLink: 'Voltar',
        photosLabel: 'Fotos do Produto (Máx 4)',
        addPhoto: 'Adicionar Foto',
        nameLabel: 'Nome do Produto',
        categoryLabel: 'Categoria',
        priceLabel: 'Preço (R$)',
        summaryLabel: 'Resumo para Listagem (Máx 160 chars)',
        suggestAiBtn: 'Sugerir Tags & Categoria',
        tagsLabel: 'Tags Sugeridas',
        descriptionLabel: 'Descrição Detalhada',
        aiBtn: 'Escrever com IA',
        aiGenerating: 'Gerando...',
        activeLabel: 'Produto Ativo',
        activeDesc: 'Visível para os clientes na sua barraca.',
        saveBtn: 'Salvar Produto',
        cancelBtn: 'Cancelar'
      },
      boothSettings: {
        title: 'Minha Barraca',
        coverLabel: 'Foto de Capa',
        coverDesc: 'Clique para enviar foto de capa',
        logoLabel: 'Logo da Barraca',
        nameLabel: 'Nome da Barraca *',
        bioLabel: 'História / Bio da Barraca',
        categoryLabel: 'Categoria Principal',
        cityLabel: 'Cidade/Localização',
        stateLabel: 'Estado',
        whatsappLabel: 'WhatsApp (com DDD)',
        instagramLabel: 'Instagram',
        saveBtn: 'Salvar Perfil da Barraca',
        saving: 'Salvando...'
      },
      account: {
        title: 'Minha Conta',
        subtitle: 'Gerencie suas informações de acesso e segurança.',
        personalInfo: 'Informações Pessoais',
        personalDesc: 'Atualize seu nome que aparece nas avaliações e perfil.',
        emailLabel: 'E-mail',
        emailDesc: 'O e-mail não pode ser alterado por aqui.',
        nameLabel: 'Nome Completo',
        saveBtn: 'Salvar Alterações',
        security: 'Segurança',
        securityDesc: 'Mantenha sua conta protegida alterando sua senha periodicamente.',
        newPassLabel: 'Nova Senha',
        confPassLabel: 'Confirmar Nova Senha',
        resetBtn: 'Redefinir Senha',
        shieldText: 'Sua conta está protegida pelo sistema de autenticação seguro da Feira Digital.'
      }
    },
    footer: {
      desc: 'Conectando o talento artesanal brasileiro ao mundo digital. Valorize o feito à mão, fortaleça a economia local.',
      platform: 'Plataforma',
      news: 'Novidades',
      faq: 'Perguntas Frequentes',
      forSellers: 'Para Vendedores',
      rights: 'Todos os direitos reservados.',
      privacy: 'Privacidade',
      terms: 'Termos de Uso'
    },
    auth: {
      registerTitle: 'Criar sua Conta',
      registerSubtitle: 'Comece a mostrar sua arte para o mundo hoje mesmo.',
      loginTitle: 'Entrar',
      loginSubtitle: 'Entre para gerenciar sua barraca ou avaliar artesãos.',
      forgotPasswordTitle: 'Recuperar Senha',
      emailLabel: 'E-mail',
      passwordLabel: 'Senha',
      confirmPasswordLabel: 'Confirmar Senha',
      nameLabel: 'Nome Completo',
      termsLabel: 'Aceito os termos e condições',
      registerButton: 'Criar Minha Barraca',
      loginButton: 'Entrar',
      forgotPasswordButton: 'Enviar Link',
      noAccount: 'Ainda não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      createBoothLink: 'Crie sua barraca',
      loginLink: 'Entre aqui',
      backToLogin: 'Voltar para login',
      emailSentTitle: 'Email Enviado!',
      emailSentDesc: 'Verifique sua caixa de entrada.',
      backButton: 'Voltar',
      forgotPasswordLink: 'Esqueceu a senha?',
      orContinueWith: 'Ou continue com',
      namePlaceholder: 'Seu nome completo',
      emailPlaceholder: 'nome@exemplo.com'
    }
  },
  'en-US': {
    nav: {
      explore: 'Explore',
      howItWorks: 'How it Works',
      login: 'Login',
      createBooth: 'Create Booth',
      dashboard: 'Seller Dashboard',
      logout: 'Logout',
      searchPlaceholder: 'Search booths, products...'
    },
    hero: {
      editorial: 'The singular resonance of raw craftsmanship.',
      description: 'A curated digital stage for artisanal excellence. Where every stitch narrates a lineage of mastery.',
      cta: 'Begin Discovery'
    },
    sections: {
      legacy: 'Legacy & Form',
      legacyTitle: 'Curated collections that transcend the ephemeral.',
      legacyDesc: 'We bridge the gap between ancient techniques and contemporary sensibilities. No mass production. No compromises. Just pure human intention.',
      legacyLink: 'Explore Collections',
      authenticity: 'Authenticity is the ultimate luxury.',
      path: 'The Artisan Path',
      pathTitle: 'Direct dialogue with master makers.',
      pathDesc: 'Connect directly via WhatsApp. Negotiate the soul of your acquisition without middlemen. A marketplace built on trust and transparency.',
      pathCta: 'Join as an Artisan'
    },
    explore: {
      title: 'Explore Fair',
      subtitle: 'Authentic craftsmanship straight from those who make it.',
      searchPlaceholder: 'Name or category...',
      clearFilters: 'Clear filters',
      state: 'STATE',
      category: 'CATEGORY',
      allStates: 'Whole Brazil',
      allCategories: 'All categories',
      noResults: 'No booths found',
      noResultsDesc: 'Try adjusting your filters or search terms to find artisans.',
      viewBooth: 'View Booth',
      evaluations: 'reviews'
    },
    boothDetail: {
      backToExplore: 'Back to Explore',
      contactWhatsapp: 'WhatsApp Contact',
      share: 'Share',
      averageRating: 'Average Rating',
      evaluations: 'reviews',
      rateThisBooth: 'Rate this booth',
      ratingSuccess: 'Your rating was registered successfully.',
      ratingError: 'Could not register your rating.',
      catalogue: 'Product Catalogue',
      viewDetails: 'View Details',
      interestBtn: 'I am Interested',
      directNegociation: 'Direct negotiation with the artisan via WhatsApp.',
      emptyCatalogue: 'No products at the moment. The artisan is preparing novelties.'
    },
    dashboard: {
      sidebar: {
        general: 'General',
        myBooth: 'My Booth',
        products: 'Products',
        account: 'My Account'
      },
      home: {
        welcome: 'Hello',
        subtitle: 'Here is the real performance of your booth on the Digital Fair.',
        stats: {
          views: 'Visits',
          viewsDesc: 'Total profile views',
          products: 'Products',
          productsDesc: 'Registered in the catalogue',
          rating: 'Average Rating',
          ratingDesc: 'Based on {count} reviews',
          clicks: 'WhatsApp Clicks',
          clicksDesc: 'Interested people who started a chat'
        },
        quickActions: {
          title: 'Quick Actions',
          newProduct: 'New Product',
          editBooth: 'Edit Booth',
          viewPublic: 'View Public Profile'
        },
        tips: {
          title: 'Tips for your Business',
          tip1Title: 'Highlight your products',
          tip1Desc: 'Booths with more than 5 products and high-quality photos receive 3x more WhatsApp contacts.'
        }
      },
      products: {
        title: 'Products',
        subtitle: 'Manage your booth catalogue.',
        addBtn: 'Add Product',
        searchPlaceholder: 'Search products...',
        table: {
          photo: 'Photo',
          name: 'Name',
          category: 'Category',
          price: 'Price',
          status: 'Status',
          actions: 'Actions',
          active: 'Active',
          inactive: 'Inactive'
        },
        empty: 'No products found.',
        editModal: {
          title: 'Edit Product',
          changePhoto: 'Change Photo',
          saveBtn: 'Save Changes',
          cancelBtn: 'Cancel'
        }
      },
      newProduct: {
        title: 'New Product',
        backLink: 'Back',
        photosLabel: 'Product Photos (Max 4)',
        addPhoto: 'Add Photo',
        nameLabel: 'Product Name',
        categoryLabel: 'Category',
        priceLabel: 'Price (USD)',
        summaryLabel: 'Listing Summary (Max 160 chars)',
        suggestAiBtn: 'Suggest Tags & Category',
        tagsLabel: 'Suggested Tags',
        descriptionLabel: 'Detailed Description',
        aiBtn: 'Write with AI',
        aiGenerating: 'Generating...',
        activeLabel: 'Active Product',
        activeDesc: 'Visible to customers in your booth.',
        saveBtn: 'Save Product',
        cancelBtn: 'Cancel'
      },
      boothSettings: {
        title: 'My Booth',
        coverLabel: 'Cover Photo',
        coverDesc: 'Click to upload cover photo',
        logoLabel: 'Booth Logo',
        nameLabel: 'Booth Name *',
        bioLabel: 'Story / Booth Bio',
        categoryLabel: 'Main Category',
        cityLabel: 'City/Location',
        stateLabel: 'State',
        whatsappLabel: 'WhatsApp (with Country Code)',
        instagramLabel: 'Instagram',
        saveBtn: 'Save Booth Profile',
        saving: 'Saving...'
      },
      account: {
        title: 'My Account',
        subtitle: 'Manage your access and security information.',
        personalInfo: 'Personal Information',
        personalDesc: 'Update your name that appears on reviews and profile.',
        emailLabel: 'Email',
        emailDesc: 'Email cannot be changed here.',
        nameLabel: 'Full Name',
        saveBtn: 'Save Changes',
        security: 'Security',
        securityDesc: 'Keep your account protected by changing your password periodically.',
        newPassLabel: 'New Password',
        confPassLabel: 'Confirm New Password',
        resetBtn: 'Reset Password',
        shieldText: 'Your account is protected by Digital Fair safe authentication system.'
      }
    },
    footer: {
      desc: 'Connecting Brazilian artisanal talent to the digital world. Value the handmade, strengthen the local economy.',
      platform: 'Platform',
      news: 'News',
      faq: 'FAQ',
      forSellers: 'For Sellers',
      rights: 'All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms of Use'
    },
    auth: {
      registerTitle: 'Create your Account',
      registerSubtitle: 'Start showing your art to the world today.',
      loginTitle: 'Login',
      loginSubtitle: 'Log in to manage your booth or rate artisans.',
      forgotPasswordTitle: 'Recover Password',
      emailLabel: 'E-mail',
      passwordLabel: 'Password',
      confirmPasswordLabel: 'Confirm Password',
      nameLabel: 'Full Name',
      termsLabel: 'I accept the terms and conditions',
      registerButton: 'Create My Booth',
      loginButton: 'Login',
      forgotPasswordButton: 'Send Link',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      createBoothLink: 'Create your booth',
      loginLink: 'Log in here',
      backToLogin: 'Back to login',
      emailSentTitle: 'Email Sent!',
      emailSentDesc: 'Check your inbox.',
      backButton: 'Back',
      forgotPasswordLink: 'Forgot password?',
      orContinueWith: 'Or continue with',
      namePlaceholder: 'Your full name',
      emailPlaceholder: 'name@example.com'
    }
  },
  'es-ES': {
    nav: {
      explore: 'Explorar',
      howItWorks: 'Cómo Funciona',
      login: 'Entrar',
      createBooth: 'Crear Puesto',
      dashboard: 'Panel del Vendedor',
      logout: 'Salir',
      searchPlaceholder: 'Buscar puestos, productos...'
    },
    hero: {
      editorial: 'La resonancia singular de la artesanía pura.',
      description: 'Un escenario digital curado para la excelencia artesanal. Donde cada puntada narra un linaje de maestría.',
      cta: 'Iniciar Descubrimiento'
    },
    sections: {
      legacy: 'Legado y Forma',
      legacyTitle: 'Colecciones curadas que trascienden lo efímero.',
      legacyDesc: 'Unimos técnicas ancestrales con sensibilidades contemporáneas. Sin producción en masa. Sin concesiones. Solo pura intención humana.',
      legacyLink: 'Explorar Colecciones',
      authenticity: 'La autenticidad es el lujo supremo.',
      path: 'El Camino del Artesano',
      pathTitle: 'Diálogo directo con maestros creadores.',
      pathDesc: 'Conéctese directamente vía WhatsApp. Negocie el alma de su adquisición sin intermediarios. Un mercado construido sobre la confianza y la transparencia.',
      pathCta: 'Unirse como Artesano'
    },
    explore: {
      title: 'Explorar Feria',
      subtitle: 'Artesanía auténtica directamente de quien la hace.',
      searchPlaceholder: 'Nombre o categoría...',
      clearFilters: 'Limpar filtros',
      state: 'ESTADO',
      category: 'CATEGORÍA',
      allStates: 'Brasil entero',
      allCategories: 'Todas las categorías',
      noResults: 'No se encontraron puestos',
      noResultsDesc: 'Prueba a ajustar tus filtros ou términos de búsqueda para encontrar artesanos.',
      viewBooth: 'Ver Puesto',
      evaluations: 'evaluaciones'
    },
    boothDetail: {
      backToExplore: 'Volver a Explorar',
      contactWhatsapp: 'Contacto WhatsApp',
      share: 'Compartir',
      averageRating: 'Promedio de Calificaciones',
      evaluations: 'evaluaciones',
      rateThisBooth: 'Califica este puesto',
      ratingSuccess: 'Su calificación fue registrada con éxito.',
      ratingError: 'No se pudo registrar su calificación.',
      catalogue: 'Catálogo de Productos',
      viewDetails: 'Ver Detalles',
      interestBtn: 'Tengo Interés',
      directNegociation: 'Negociación directa con el artesano vía WhatsApp.',
      emptyCatalogue: 'Sin productos por ahora. El artesano está preparando novedades.'
    },
    dashboard: {
      sidebar: {
        general: 'General',
        myBooth: 'Mi Puesto',
        products: 'Productos',
        account: 'Mi Cuenta'
      },
      home: {
        welcome: 'Hola',
        subtitle: 'Aquí está el rendimiento real de su puesto en la Feria Digital.',
        stats: {
          views: 'Visitas',
          viewsDesc: 'Total de vistas del perfil',
          products: 'Productos',
          productsDesc: 'Registrados en el catálogo',
          rating: 'Calificación Promedio',
          ratingDesc: 'Basado en {count} evaluaciones',
          clicks: 'Clics WhatsApp',
          clicksDesc: 'Interesados que iniciaron chat'
        },
        quickActions: {
          title: 'Acciones Rápidas',
          newProduct: 'Nuevo Producto',
          editBooth: 'Editar Puesto',
          viewPublic: 'Ver Perfil Público'
        },
        tips: {
          title: 'Consejos para su Negocio',
          tip1Title: 'Destaque sus productos',
          tip1Desc: 'Los puestos con más de 5 productos y fotos de alta calidad reciben 3x más contactos de WhatsApp.'
        }
      },
      products: {
        title: 'Productos',
        subtitle: 'Gestione el catálogo de su puesto.',
        addBtn: 'Añadir Producto',
        searchPlaceholder: 'Buscar productos...',
        table: {
          photo: 'Foto',
          name: 'Nombre',
          category: 'Categoría',
          price: 'Precio',
          status: 'Estado',
          actions: 'Acciones',
          active: 'Activo',
          inactive: 'Inactivo'
        },
        empty: 'No se encontraron productos.',
        editModal: {
          title: 'Editar Producto',
          changePhoto: 'Cambiar Foto',
          saveBtn: 'Guardar Cambios',
          cancelBtn: 'Cancelar'
        }
      },
      newProduct: {
        title: 'Nuevo Producto',
        backLink: 'Volver',
        photosLabel: 'Fotos del Producto (Máx 4)',
        addPhoto: 'Añadir Foto',
        nameLabel: 'Nombre del Producto',
        categoryLabel: 'Categoría',
        priceLabel: 'Precio (EUR)',
        summaryLabel: 'Resumen para Listado (Máx 160 chars)',
        suggestAiBtn: 'Sugerir Tags y Categoría',
        tagsLabel: 'Tags Sugeridas',
        descriptionLabel: 'Descripción Detallada',
        aiBtn: 'Escribir con IA',
        aiGenerating: 'Generando...',
        activeLabel: 'Producto Ativo',
        activeDesc: 'Visible para los clientes en su puesto.',
        saveBtn: 'Guardar Producto',
        cancelBtn: 'Cancelar'
      },
      boothSettings: {
        title: 'Mi Puesto',
        coverLabel: 'Foto de Portada',
        coverDesc: 'Haga clic para subir foto de portada',
        logoLabel: 'Logo del Puesto',
        nameLabel: 'Nombre del Puesto *',
        bioLabel: 'Historia / Bio del Puesto',
        categoryLabel: 'Categoría Principal',
        cityLabel: 'Ciudad/Ubicación',
        stateLabel: 'Estado',
        whatsappLabel: 'WhatsApp (con código de país)',
        instagramLabel: 'Instagram',
        saveBtn: 'Guardar Perfil del Puesto',
        saving: 'Guardando...'
      },
      account: {
        title: 'Mi Cuenta',
        subtitle: 'Gestione su información de acceso y seguridad.',
        personalInfo: 'Información Personal',
        personalDesc: 'Actualice su nombre que aparece en las evaluaciones y perfil.',
        emailLabel: 'Correo electrónico',
        emailDesc: 'El correo no se pode cambiar aquí.',
        nameLabel: 'Nombre Completo',
        saveBtn: 'Guardar Cambios',
        security: 'Seguridad',
        securityDesc: 'Mantenga su cuenta protegida cambiando su contraseña periódicamente.',
        newPassLabel: 'Nueva Contraseña',
        confPassLabel: 'Confirmar Nueva Contraseña',
        resetBtn: 'Restablecer Contraseña',
        shieldText: 'Su cuenta está protegida por el sistema de autenticación seguro de la Feria Digital.'
      }
    },
    footer: {
      desc: 'Conectando el talento artesanal brasileño al mundo digital. Valora lo hecho a mano, fortalece la economía local.',
      platform: 'Plataforma',
      news: 'Novedades',
      faq: 'Preguntas Frequentes',
      forSellers: 'Para Vendedores',
      rights: 'Todos los derechos reservados.',
      privacy: 'Privacidad',
      terms: 'Términos de Uso'
    },
    auth: {
      registerTitle: 'Crear su Cuenta',
      registerSubtitle: 'Comience a mostrar su arte al mundo hoy mismo.',
      loginTitle: 'Entrar',
      loginSubtitle: 'Entre para gestionar su puesto o evaluar artesanos.',
      forgotPasswordTitle: 'Recuperar Contraseña',
      emailLabel: 'Correo electrónico',
      passwordLabel: 'Contraseña',
      confirmPasswordLabel: 'Confirmar Contraseña',
      nameLabel: 'Nombre Completo',
      termsLabel: 'Acepto los términos y condiciones',
      registerButton: 'Crear Mi Puesto',
      loginButton: 'Entrar',
      forgotPasswordButton: 'Enviar Enlace',
      noAccount: '¿Aún no tienes una cuenta?',
      hasAccount: '¿Ya tienes una cuenta?',
      createBoothLink: 'Crea tu puesto',
      loginLink: 'Entra aquí',
      backToLogin: 'Volver al login',
      emailSentTitle: '¡Correo Enviado!',
      emailSentDesc: 'Revise su bandeja de entrada.',
      backButton: 'Volver',
      forgotPasswordLink: '¿Olvidaste la contraseña?',
      orContinueWith: 'O continuar con',
      namePlaceholder: 'Su nombre completo',
      emailPlaceholder: 'nombre@ejemplo.com'
    }
  }
};
