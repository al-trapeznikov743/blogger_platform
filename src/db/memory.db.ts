export const db = {
  blogs: [
    {
      id: '1',
      name: 'Techdirt',
      description: 'Вопросы технологий и связанные с ними бизнес и экономические политики в контексте цифровой революции.',
      websiteUrl: 'https://techdirt.com/'
    },
    {
      id: '2',
      name: 'The Verge',
      description: 'Материалы о технологиях, науке, развлечениях и многом другом.',
      websiteUrl: 'https://www.theverge.com/'
    },
    {
      id: '3',
      name: 'MacRumors',
      description: 'Новости и слухах, связанных с продукцией и программным обеспечением Apple.',
      websiteUrl: 'https://www.macrumors.com/'
    },
    {
      id: '4',
      name: 'Techmeme',
      description: 'Агрегатор новостей. Технологическая индустрия. Актуальные новости и обсуждения.',
      websiteUrl: 'http://www.techmeme.com/'
    }
  ],
  posts: [
    {
      id: '1',
      title: 'The Rise of AI in Web Development',
      shortDescription: 'Как искусственный интеллект меняет фронтенд и бэкенд разработку.',
      content: 'Искусственный интеллект постепенно становится неотъемлемой частью веб-разработки. В этом посте мы рассмотрим, как AI помогает в написании кода, автоматизации тестирования и улучшении пользовательского опыта...',
      blogId: '1',
      blogName: 'Techdirt'
    },
    {
      id: '2',
      title: 'The Future of JavaScript: ESNext Features',
      shortDescription: 'Какие новые фичи ожидают нас в ближайших релизах JavaScript?',
      content: 'JavaScript продолжает эволюционировать, и с каждым новым стандартом появляются полезные возможности. Давайте разберёмся, какие фичи ожидаются в ESNext и как они упростят жизнь разработчикам...',
      blogId: '2',
      blogName: 'The Verge'
    },
    {
      id: '3',
      title: 'Why Apple Silicon is a Game Changer',
      shortDescription: 'Разбираем, как переход Apple на ARM повлиял на разработчиков и пользователей.',
      content: 'Apple Silicon кардинально изменил рынок ноутбуков и десктопов. Производительность, энергоэффективность и оптимизация приложений для M-чипов — вот лишь малая часть изменений, о которых стоит поговорить...',
      blogId: '3',
      blogName: 'MacRumors'
    },
    {
      id: '4',
      title: 'The Evolution of Web Design Trends in 2025',
      shortDescription: 'Что будет популярно в веб-дизайне в ближайшем будущем?',
      content: 'Веб-дизайн развивается невероятными темпами. В этом году тренды смещаются в сторону минимализма, нейросетей в UX, адаптивных анимаций и новых цветовых решений...',
      blogId: '4',
      blogName: 'Techmeme'
    }
  ]
};