import { db } from "@/db";
import {
  activities,
  certifications,
  education,
  experiences,
  languages,
  peopleSuggestions,
  profiles,
  skills,
} from "@/db/schema";

const PROFILE_SLUG = "ana-beatriz-ferraz";

export const ABOUT_TEXT = `Product Designer com 8 anos de experiência transformando problemas complexos em produtos digitais simples, acessíveis e com impacto real no dia a dia das pessoas.

Hoje lidero a frente de Design Systems do Nubank, onde conecto design, engenharia e métricas de produto. Nos últimos dois anos, ajudei a reduzir em 41% o tempo de entrega de novas telas e a levar acessibilidade (WCAG 2.1 AA) para mais de 30 squads.

Acredito em design com evidências: pesquisa, prototipagem rápida e iteração constante. Também sou mentora de mulheres em transição de carreira para o design e palestrante em comunidades de produto.

Ferramentas: Figma, FigJam, Maze, Storybook, Amplitude e um bom caderno de papel.`;

async function seed() {
  const existing = await db.select({ id: profiles.id }).from(profiles).limit(1);
  if (existing.length > 0) return;

  await db.transaction(async (tx) => {
    const [profile] = await tx
      .insert(profiles)
      .values({
        slug: PROFILE_SLUG,
        name: "Ana Beatriz Ferraz",
        pronouns: "ela/dela",
        headline:
          "Product Designer Sênior na Nubank | Design Systems, UX Research e Acessibilidade",
        location: "São Paulo, Brasil",
        about: ABOUT_TEXT,
        avatarUrl: "/images/ana.png",
        coverUrl: "/images/cover.png",
        email: "ana.ferraz@email.com",
        phone: "+55 11 98765-4321",
        website: "https://anabeatriz.design",
        websiteLabel: "anabeatriz.design",
        birthday: "12 de março",
        connections: 500,
        followers: 1248,
        profileViews: 126,
        postImpressions: 3482,
        searchAppearances: 48,
        openToWork: true,
      })
      .returning();

    const profileId = profile.id;

    await tx.insert(experiences).values([
      {
        profileId,
        title: "Product Designer Sênior",
        company: "Nubank",
        companyInitials: "Nu",
        companyColor: "#7b1fa2",
        employmentType: "Tempo integral",
        location: "São Paulo, Brasil",
        workMode: "Remoto",
        startYear: 2023,
        startMonth: 1,
        isCurrent: true,
        position: 1,
        description:
          "• Lidero a evolução do design system Aurora, usado por 30+ squads e 180 designers e engenheiros.\n• Responsável pela trilha de acessibilidade do produto: auditoria WCAG 2.1 AA, tokens semânticos e documentação.\n• Parceria direta com Product e Engenharia na definição de métricas de experiência e roadmap de produto.",
        skills: ["Design Systems", "Acessibilidade", "UX Research", "Figma"],
      },
      {
        profileId,
        title: "Product Designer Pleno",
        company: "Nubank",
        companyInitials: "Nu",
        companyColor: "#7b1fa2",
        employmentType: "Tempo integral",
        location: "São Paulo, Brasil",
        workMode: "Híbrido",
        startYear: 2021,
        startMonth: 3,
        endYear: 2022,
        endMonth: 12,
        position: 2,
        description:
          "• Desenho do fluxo de onboarding do cartão de crédito, com +18% de conclusão no primeiro mês.\n• Condução de 40+ entrevistas com clientes e testes de usabilidade remotos.",
        skills: ["Product Design", "Testes de usabilidade"],
      },
      {
        profileId,
        title: "UX/UI Designer",
        company: "iFood",
        companyInitials: "iF",
        companyColor: "#ea1d2c",
        employmentType: "Tempo integral",
        location: "Osasco, São Paulo",
        workMode: "Híbrido",
        startYear: 2019,
        startMonth: 5,
        endYear: 2021,
        endMonth: 2,
        position: 3,
        description:
          "• Atuação no app do restaurante, com foco em gestão de pedidos e cardápio digital.\n• Construção do primeiro kit de componentes compartilhado entre os times de produto.",
        skills: ["UX/UI", "Prototipagem", "Design Thinking"],
      },
      {
        profileId,
        title: "Designer de Produto Júnior",
        company: "Studio Vento",
        companyInitials: "SV",
        companyColor: "#00695c",
        employmentType: "Freelance",
        location: "São Paulo, Brasil",
        workMode: "Remoto",
        startYear: 2017,
        startMonth: 8,
        endYear: 2019,
        endMonth: 4,
        position: 4,
        description:
          "• Interfaces para startups de saúde e educação, do discovery ao handoff com engenharia.",
        skills: ["Wireframes", "Identidade visual"],
      },
    ]);

    await tx.insert(education).values([
      {
        profileId,
        school: "Universidade de São Paulo",
        degree: "Bacharelado em Design",
        field: "Design Gráfico e Interfaces Digitais",
        startYear: 2015,
        endYear: 2019,
        description:
          "Intercâmbio acadêmico na Politecnico di Milano (2018) e monitoria de Tipografia por dois semestres.",
        monogram: "USP",
        color: "#123c8c",
        position: 1,
      },
      {
        profileId,
        school: "Alura",
        degree: "Formação em UX Design",
        field: "Pesquisa com usuários e Design de Produto",
        startYear: 2020,
        endYear: 2021,
        description: "Projeto final: redesenho do fluxo de doações de uma ONG parceira.",
        monogram: "A",
        color: "#0c3b6e",
        position: 2,
      },
    ]);

    await tx.insert(certifications).values([
      {
        profileId,
        name: "Certified Professional in Accessibility Core Competencies",
        issuer: "IAAP",
        issuedAt: "fev de 2023",
        credentialId: "IAAP-2023-88412",
        monogram: "IA",
        color: "#00695c",
        position: 1,
      },
      {
        profileId,
        name: "Design Systems Specialist",
        issuer: "Interaction Design Foundation",
        issuedAt: "nov de 2022",
        credentialId: "IDF-DS-55190",
        monogram: "ID",
        color: "#1b5e20",
        position: 2,
      },
      {
        profileId,
        name: "Google UX Design Professional Certificate",
        issuer: "Google",
        issuedAt: "jun de 2021",
        monogram: "G",
        color: "#c62828",
        position: 3,
      },
    ]);

    await tx.insert(skills).values([
      { profileId, name: "Design Systems", endorsements: 42, position: 1 },
      { profileId, name: "UX Research", endorsements: 38, position: 2 },
      { profileId, name: "Figma", endorsements: 51, position: 3 },
      { profileId, name: "Acessibilidade", endorsements: 27, position: 4 },
      { profileId, name: "Product Design", endorsements: 34, position: 5 },
      { profileId, name: "Prototipagem", endorsements: 23, position: 6 },
      { profileId, name: "Testes de usabilidade", endorsements: 19, position: 7 },
      { profileId, name: "Design Thinking", endorsements: 21, position: 8 },
      { profileId, name: "HTML e CSS", endorsements: 16, position: 9 },
      { profileId, name: "Métricas de produto", endorsements: 11, position: 10 },
    ]);

    await tx.insert(languages).values([
      { profileId, name: "Português", level: "Nativo ou bilíngue", position: 1 },
      { profileId, name: "Inglês", level: "Fluente", position: 2 },
      { profileId, name: "Espanhol", level: "Intermediário", position: 3 },
      { profileId, name: "Libras", level: "Básico", position: 4 },
    ]);

    await tx.insert(activities).values([
      {
        profileId,
        kind: "post",
        body: "Design system não é só uma biblioteca de componentes. É contrato, é ritual e é cultura.\n\nNesta semana fechamos o trimestre com 78% dos times de produto usando os mesmos tokens de design e acessibilidade no Nubank. O ganho não está no Figma: está na conversa que ficou mais fácil entre design e engenharia.",
        hashtags: ["#DesignSystems", "#Produto", "#Acessibilidade"],
        postedAgo: "2 sem",
        likes: 356,
        comments: 42,
        reposts: 12,
        position: 1,
      },
      {
        profileId,
        kind: "article",
        body: "Escrevi para o blog do Nubank sobre como conduzimos pesquisa com pessoas com deficiência visual e o que aprendemos sobre navegação por leitor de tela.\n\nO maior insight: acessibilidade melhorou o produto para todo mundo — inclusive para quem nunca pensou no assunto.",
        hashtags: ["#UXResearch", "#Inclusão", "#Design"],
        postedAgo: "1 mês",
        likes: 214,
        comments: 28,
        reposts: 9,
        position: 2,
      },
    ]);

    await tx.insert(peopleSuggestions).values([
      {
        name: "Rafael Monteiro",
        headline: "Engenheiro de Software Sênior na Nubank",
        avatarUrl: "/images/person-1.jpg",
        mutualConnections: 12,
        position: 1,
      },
      {
        name: "Juliana Prado",
        headline: "Head de Design na Loft | Design Ops",
        avatarUrl: "/images/person-2.jpg",
        mutualConnections: 8,
        position: 2,
      },
      {
        name: "Camila Nogueira",
        headline: "UX Writer | Conteúdo para produtos digitais",
        avatarUrl: "/images/person-3.jpg",
        mutualConnections: 5,
        position: 3,
      },
      {
        name: "Marcos Vinícius Alves",
        headline: "Tech Recruiter na Toptal",
        avatarUrl: "/images/person-5.jpg",
        mutualConnections: 3,
        position: 4,
      },
      {
        name: "Patrícia Lemos",
        headline: "Gerente de Produto na iFood | Discovery",
        avatarUrl: "/images/person-4.jpg",
        mutualConnections: 7,
        position: 5,
      },
    ]);
  });
}

let seedPromise: Promise<void> | null = null;

export function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seed().catch((error) => {
      seedPromise = null;
      const message = error instanceof Error ? error.message : String(error);
      // A concurrent request may have seeded the database first.
      if (message.includes("duplicate key value")) return;
      throw error;
    });
  }
  return seedPromise;
}

export { PROFILE_SLUG };
