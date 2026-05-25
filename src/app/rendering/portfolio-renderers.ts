export function createPortfolioRenderers(structuralKit, architectureFactory) {
  const baseRenderers = structuralKit.renderers;

  return {
    ...baseRenderers,
    renderAppShell(input) {
      const architecture = architectureFactory(input);
      globalThis.__PORTFOLIO_APP_ARCHITECTURE__ = architecture;
      globalThis.__FRONTEND_ARCHITECTURE_GRAPH__ = architecture.graph;
      return architecture.frontendNode || baseRenderers.renderAppShell(input);
    }
  };
}
