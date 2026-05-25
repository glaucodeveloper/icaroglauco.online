// Generated from: src/main.idsl
// Edit the .idsl source, not this file.


import { createPortfolioApplicationKit } from "./app/bootstrap.ts";

const portfolioAppKit = createPortfolioApplicationKit();
    const portfolioStructuralKit = portfolioAppKit.structuralKit;
    const frontendFrameworkKit = portfolioAppKit.frontendFramework;

    export const renderAppShell = portfolioAppKit.renderers.renderAppShell;
    export const createApplicationShellComponent = portfolioStructuralKit.structuralComponents.createApplicationShellComponent;
    export const frontendFramework = frontendFrameworkKit;
    export const portfolioApplication = () => portfolioAppKit.application;
    export const portfolioManifest = portfolioAppKit.manifest;

    globalThis.__PORTFOLIO_APPLICATION__ = portfolioAppKit.application;
    globalThis.__PORTFOLIO_APP_KIT__ = portfolioAppKit;
    globalThis.__PORTFOLIO_MANIFEST__ = portfolioAppKit.manifest;
    globalThis.__PORTFOLIO_ELEMENTS__ = portfolioStructuralKit.elements;
    globalThis.__PORTFOLIO_CONCEPTS__ = portfolioStructuralKit.concepts;
    globalThis.__PORTFOLIO_SCENE_SEMANTICS__ = portfolioStructuralKit.sceneSemantics;
    globalThis.__PORTFOLIO_STRUCTURAL_COMPONENTS__ = portfolioStructuralKit.structuralComponents;
    globalThis.__PORTFOLIO_COMPONENTS__ = portfolioAppKit.renderers;
    globalThis.__PORTFOLIO_RENDERERS__ = portfolioAppKit.renderers;
    globalThis.__PORTFOLIO_SLIDES__ = portfolioStructuralKit.slideBuilders;
    globalThis.__FRONTEND_FRAMEWORK__ = frontendFrameworkKit;
    globalThis.__FRONTEND_ARCHITECTURE_GRAPH__ = frontendFrameworkKit.graph;

    await import("/src/runtime/run-portfolio-app.ts");
