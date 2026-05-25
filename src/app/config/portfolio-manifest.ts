export const portfolioManifest = {
  name: "Icaro Glauco Portfolio",
  version: "0.8.0",
  mode: "macro-frontend-framework",
  contentSource: "markdown-files",
  contentPath: "/content/sections",
  entry: "main.ts",
  structureModel: "macro-frontend-specialization-graph",
  layouts: {
    overview: "identity-editorial",
    portfolio: "technical-pager",
    agent: "contact-intake",
    "ai-engineering": "technical-pager",
    "systems-explorer": "technical-pager",
    engineering: "technical-pager",
    experience: "technical-pager",
    interactive: "technical-pager",
    contact: "technical-pager"
  },
  assistant: {
    name: "icaroIA",
    kicker: "agente de orientacao comercial",
    tooltip:
      "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor para orientar conversas, esclarecer contexto e preparar relatorios ou pre-propostas iniciais."
  }
};

export function createPortfolioApplication(manifest = portfolioManifest) {
  return function portfolioApplication() {
    return {
      name: () => manifest.name,
      layouts: () => manifest.layouts,
      assistant: () => manifest.assistant,
      version: manifest.version,
      mode: manifest.mode,
      contentSource: manifest.contentSource,
      contentPath: manifest.contentPath,
      entry: manifest.entry,
      structureModel: manifest.structureModel
    };
  };
}
