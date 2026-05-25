export type ScreenRegistryEntry = {
  id: string;
  kind?: string;
  code: string;
  label: string;
  kicker: string;
  headline: string;
  blurb: string;
  details: string;
  bullets: string[];
  contentTitle: string;
  contentBody: string;
  contentNotes: string[];
  markdownPath: string;
  image: string;
  backgroundImage: string;
  backgroundPosition: string;
  portraitImage?: string;
  portraitCaption?: string;
  identityDeck?: Array<{ src: string; alt: string; caption: string }>;
  profilePath?: string;
  profileLinkLabel?: string;
  agentEndpoint?: string;
  agentStrategy?: string;
  agentMode?: string;
  reportFilename?: string;
  view: {
    distance: number;
    side: number;
    height: number;
    lookHeight: number;
    lookSide: number;
    fov: number;
  };
};

const placeholder = {
  headline: "Conteudo carregado do markdown",
  blurb: "Conteudo editorial mantido em public/content/sections.",
  details: "Esta secao usa Markdown como fonte oficial.",
  bullets: ["Markdown como conteudo", "Framework como estrutura", "Runtime como comportamento"],
  contentTitle: "Fonte markdown",
  contentBody: "O conteudo desta secao e carregado de um arquivo Markdown publico.",
  contentNotes: ["Editar o arquivo .md correspondente para mudar o texto do site"]
};

function section(entry: Omit<ScreenRegistryEntry, keyof typeof placeholder | "markdownPath">): ScreenRegistryEntry {
  return {
    ...placeholder,
    ...entry,
    markdownPath: `/content/sections/${entry.id}.md`
  };
}

export const screenRegistry: ScreenRegistryEntry[] = [
  section({
    id: "overview",
    code: "01 / FUNDAMENTO",
    label: "Identidade",
    kicker: "Base profissional",
    kind: "identity",
    portraitImage: "/assets/foto-02.jpg",
    portraitCaption: "Retrato editorial / base profissional",
    identityDeck: [
      {
        src: "/identity/doce-flauta.png",
        alt: "Projeto artistico A Doce Flauta da Liberdade",
        caption: "2013 / A Doce Flauta da Liberdade"
      },
      {
        src: "/identity/caminho-parque.png",
        alt: "Banner do loteamento Caminho do Parque",
        caption: "2018 / Caminho do Parque"
      },
      {
        src: "/identity/app-caminho-parque.png",
        alt: "Screenshots do aplicativo Caminho do Parque",
        caption: "2018 / App de vendas em Android"
      }
    ],
    image: "/assets/foto-01.jpg",
    backgroundImage: "/assets/foto-06.jpg",
    backgroundPosition: "center 52%",
    view: { distance: 4.8, side: -0.45, height: 1.25, lookHeight: 1.18, lookSide: -0.12, fov: 30 }
  }),
  section({
    id: "portfolio",
    code: "02 / REQUISITOS",
    label: "Requisitos",
    kicker: "Leitura de problema",
    image: "/assets/foto-02.jpg",
    backgroundImage: "/ambient/sky-island.jpg",
    backgroundPosition: "center center",
    view: { distance: 5.15, side: 0.82, height: 1.5, lookHeight: 1.3, lookSide: 0.18, fov: 32 }
  }),
  section({
    id: "agent",
    code: "03 / CONTATO",
    label: "Contato",
    kicker: "Intake guiado",
    kind: "agent",
    profilePath: "/llm/icaro-workstyle.md",
    profileLinkLabel: "Abrir base de trabalho (.md)",
    agentEndpoint: "/api/agent-chat",
    agentStrategy: "remote-ai",
    agentMode: "contact-intake",
    reportFilename: "previa-proposta-icaro-glauco.md",
    image: "/assets/foto-07.jpg",
    backgroundImage: "/ambient/night-sentinel.jpg",
    backgroundPosition: "center center",
    view: { distance: 5.35, side: 1.36, height: 2.05, lookHeight: 1.54, lookSide: 0.28, fov: 28 }
  }),
  section({
    id: "ai-engineering",
    code: "04 / IA APLICADA",
    label: "Agentes",
    kicker: "Metodo e governanca",
    image: "/assets/foto-05.jpg",
    backgroundImage: "/ambient/dawn-boat.jpg",
    backgroundPosition: "center center",
    view: { distance: 5.1, side: -1.08, height: 1.72, lookHeight: 1.44, lookSide: -0.22, fov: 29 }
  }),
  section({
    id: "systems-explorer",
    code: "05 / LINGUAGEM",
    label: "Linguagens",
    kicker: "Pesquisa aplicada",
    image: "/assets/foto-03.jpg",
    backgroundImage: "/ambient/sky-island.jpg",
    backgroundPosition: "center center",
    view: { distance: 4.7, side: -0.62, height: 2.28, lookHeight: 1.72, lookSide: -0.04, fov: 27 }
  }),
  section({
    id: "engineering",
    code: "06 / ENGENHARIA",
    label: "Engenharia",
    kicker: "Base tecnica",
    image: "/assets/foto-04.jpg",
    backgroundImage: "/assets/foto-05.jpg",
    backgroundPosition: "center 28%",
    view: { distance: 5.5, side: 1.18, height: 1.08, lookHeight: 1.28, lookSide: 0.05, fov: 30 }
  }),
  section({
    id: "experience",
    code: "07 / EXPERIENCIAS",
    label: "Experiencias",
    kicker: "Mundo, operacao e pessoas",
    image: "/assets/foto-07.jpg",
    backgroundImage: "/ambient/dawn-boat.jpg",
    backgroundPosition: "center center",
    view: { distance: 4.95, side: -1.1, height: 1.58, lookHeight: 1.36, lookSide: -0.28, fov: 31 }
  }),
  section({
    id: "interactive",
    code: "08 / SISTEMA",
    label: "Sistema",
    kicker: "Escalabilidade editorial",
    image: "/assets/foto-06.jpg",
    backgroundImage: "/assets/foto-06.jpg",
    backgroundPosition: "center 52%",
    view: { distance: 4.6, side: 0.35, height: 2.55, lookHeight: 1.8, lookSide: 0.1, fov: 26 }
  }),
  section({
    id: "contact",
    code: "09 / FECHAMENTO",
    label: "Fechamento",
    kicker: "Assinatura profissional",
    image: "/assets/foto-04.jpg",
    backgroundImage: "/ambient/night-sentinel.jpg",
    backgroundPosition: "center center",
    view: { distance: 4.8, side: 0, height: 1.38, lookHeight: 1.18, lookSide: 0, fov: 29 }
  })
];
