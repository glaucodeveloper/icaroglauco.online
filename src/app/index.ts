// Generated from: src/app/index.idsl
// Edit the .idsl source, not this file.


const portfolioFrontend = (() => {
      function toFragment(output) {
        const fragment = document.createDocumentFragment();

        if (output instanceof DocumentFragment) {
          fragment.append(output);
          return fragment;
        }

        if (output instanceof Node) {
          fragment.append(output);
          return fragment;
        }

        const template = document.createElement("template");
        template.innerHTML = String(output ?? "").trim();
        fragment.append(template.content);
        return fragment;
      }

      function resolveChild(child, props) {
        if (!child) return null;
        if (child instanceof Node) return child;
        if (typeof child === "function") return child(props);
        return toFragment(child);
      }

      function emitLifecycleEvent(node, eventName, detail) {
        if (!node || !eventName) return;
        node.dispatchEvent(
          new CustomEvent(eventName, {
            detail,
            bubbles: true,
            composed: true
          })
        );
      }

      function runLifecycle(lifecycle, phase, context) {
        const step = lifecycle?.[phase];
        const detail = {
          phase,
          step,
          definition: context.definition,
          props: context.props,
          children: context.children
        };

        if (typeof step === "function") step(context);
        if (typeof step === "string") emitLifecycleEvent(context.node, step, detail);
        emitLifecycleEvent(context.node, `macro-frontend:${phase}`, detail);
      }

      function defineElement(definition) {
        const elementName = definition.element;

        if (!customElements.get(elementName)) {
          customElements.define(
            elementName,
            class MacroFrontendElement extends HTMLElement {
              connectedCallback() {
                this.__macroConnected = true;
                runLifecycle(this.__macroFrontend?.definition?.lifecycle, "mount", {
                  node: this,
                  definition: this.__macroFrontend?.definition,
                  props: this.__macroFrontend?.props,
                  children: this.__macroFrontend?.children
                });
              }

              disconnectedCallback() {
                this.__macroConnected = false;
                runLifecycle(this.__macroFrontend?.definition?.lifecycle, "dispose", {
                  node: this,
                  definition: this.__macroFrontend?.definition,
                  props: this.__macroFrontend?.props,
                  children: this.__macroFrontend?.children
                });
              }
            }
          );
        }

        return elementName;
      }

      function createComponent(definition, props = {}, children = []) {
        const elementName = defineElement(definition);
        const node = document.createElement(elementName);
        node.__macroFrontend = {
          definition,
          props,
          children
        };

        runLifecycle(definition.lifecycle, "construct", { definition, props, children, node });

        node.dataset.frontendComponent = definition.name;
        node.dataset.frontendNamespace = definition.namespace || "portfolio-frontend";
        node.dataset.frontendKind = definition.kind;
        node.dataset.frontendLifecycle = definition.lifecycle?.phases?.join(",") || "";

        if (definition.className) {
          node.classList.add(...String(definition.className).split(/\s+/u).filter(Boolean));
        }

        if (definition.display) {
          node.style.display = definition.display;
        }

        if (definition.attributes) {
          for (const [key, value] of Object.entries(definition.attributes)) {
            if (value === false || value === null || value === undefined) continue;
            if (value === true) node.setAttribute(key, "");
            else node.setAttribute(key, String(value));
          }
        }

        const output =
          typeof definition.render === "function"
            ? definition.render(props, children)
            : "";
        node.append(toFragment(output));

        for (const child of children) {
          const childNode = resolveChild(child, props);
          if (childNode) node.append(childNode);
        }

        runLifecycle(definition.lifecycle, "bind", { definition, props, children, node });
        runLifecycle(definition.lifecycle, "render", { definition, props, children, node });
        runLifecycle(definition.lifecycle, "settle", { definition, props, children, node });

        return node;
      }

      function mount(target, component, props = {}, children = []) {
        const host = typeof target === "string" ? document.querySelector(target) : target;
        const node = typeof component === "function" ? component(props, children) : resolveChild(component, props);
        if (host && node) host.replaceChildren(node);
        return node;
      }

      return {
        name: "portfolio-frontend",
        createComponent,
        mount
      };
    })();


    export { portfolioFrontend };


const landingEvents = {
      primary: "menu-preview",
      secondary: "menu-navigate",
      tertiary: "section-snap",
      all: ["menu-preview", "menu-navigate", "section-snap"]
    };



const sectionEvents = {
      primary: "hash-navigation",
      secondary: "section-snap",
      tertiary: "horizontal-pager",
      all: ["hash-navigation", "section-snap", "horizontal-pager"]
    };



const chatboxEvents = {
      primary: "message-submit",
      secondary: "message-stream",
      tertiary: "message-close",
      all: ["message-submit", "message-stream", "message-close"]
    };



const blogEvents = {
      primary: "notepad-line-commit",
      secondary: "blog-config-submit",
      tertiary: "blog-index-refresh",
      all: ["notepad-line-commit", "blog-config-submit", "blog-index-refresh"]
    };



const shellEvents = {
      primary: "runtime-boot",
      secondary: "app-render",
      tertiary: "hash-link",
      all: ["runtime-boot", "app-render", "hash-link"]
    };



const landingLifecycle = {
      construct: "read-menu-content",
      mount: "mount-landing-surface",
      bind: "bind-menu-events",
      render: "render-preview-state",
      settle: "sync-section-target",
      phases: ["read-menu-content", "mount-landing-surface", "bind-menu-events", "render-preview-state", "sync-section-target"]
    };



const sectionLifecycle = {
      construct: "load-markdown-files",
      mount: "mount-section-rail",
      bind: "bind-scroll-and-hash",
      render: "render-content-panels",
      settle: "snap-current-section",
      phases: ["load-markdown-files", "mount-section-rail", "bind-scroll-and-hash", "render-content-panels", "snap-current-section"]
    };



const chatboxLifecycle = {
      construct: "hydrate-dialogue-state",
      mount: "mount-companion-panel",
      bind: "bind-message-events",
      render: "render-conversation",
      settle: "dock-or-float-chatbox",
      phases: ["hydrate-dialogue-state", "mount-companion-panel", "bind-message-events", "render-conversation", "dock-or-float-chatbox"]
    };



const blogLifecycle = {
      construct: "watch-notepad-lines",
      mount: "mount-blog-panel",
      bind: "bind-config-and-refresh",
      render: "render-markdown-posts",
      settle: "refresh-blog-index",
      phases: ["watch-notepad-lines", "mount-blog-panel", "bind-config-and-refresh", "render-markdown-posts", "refresh-blog-index"]
    };



const shellLifecycle = {
      construct: "create-application-kit",
      mount: "mount-page-shell",
      bind: "bind-runtime-events",
      render: "render-application-shell",
      settle: "publish-architecture-graph",
      phases: ["create-application-kit", "mount-page-shell", "bind-runtime-events", "render-application-shell", "publish-architecture-graph"]
    };



const landingSurface = (props = {}, children = []) =>
      portfolioFrontend.createComponent(
        {
          name: "landing-surface",
          namespace: "Portfolio",
          kind: "landing",
          element: "portfolio-landing",
          display: "contents",
          className: "portfolio-component",
          source: "Portfolio",
          props: {},
          state: {},
          events: landingEvents,
          lifecycle: landingLifecycle,
          abstraction: "entry surface -> section navigation",
          attributes: landingSurface.attributes,
          render: landingSurface.render,
          componentModel: "macro-frontend.web-component"
        },
        props,
        children
      );

    landingSurface.definition = {
      name: "landing-surface",
      namespace: "Portfolio",
      kind: "landing",
      element: "portfolio-landing",
      events: landingEvents,
      lifecycle: landingLifecycle,
      abstraction: "entry surface -> section navigation",
      componentModel: "macro-frontend.web-component"
    };
    landingSurface.attributes = {};
    landingSurface.render = () => "";


    landingSurface.source = "portfolio-landing";
    landingSurface.output = "";
    landingSurface.render = (props) => {
      if ("landing" === "landing") {
        return props.structuralKit.structuralComponents
          .createLandingScreenComponent(props.siteAvatar, props.screens)
          .render();
      }

      if ("landing" === "sections") {
        return `<div data-portfolio-sections style="display: contents">${props.screens
          .map((screen, index) =>
            props.structuralKit.structuralComponents
              .createContentStageComponent(screen, index, props.siteAvatar, props.layouts)
              .render()
          )
          .join("")}</div>`;
      }

      if ("landing" === "chatbox") {
        return props.structuralKit.structuralComponents
          .createCompanionPanelComponent(
            props.assistant.name || "icaroIA",
            props.assistant.kicker || "agente de orientacao comercial",
            props.assistant.tooltip || "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor."
          )
          .render();
      }

      if ("landing" === "blog") {
        return `<section data-portfolio-blog-node hidden data-source="${"portfolio-landing"}" data-output="${""}"></section>`;
      }

      return "";
    };


const markdownSections = (props = {}, children = []) =>
      portfolioFrontend.createComponent(
        {
          name: "markdown-sections",
          namespace: "Portfolio",
          kind: "sections",
          element: "portfolio-sections",
          display: "contents",
          className: "portfolio-component",
          source: "Portfolio",
          props: {},
          state: {},
          events: sectionEvents,
          lifecycle: sectionLifecycle,
          abstraction: "markdown content -> section modules",
          attributes: markdownSections.attributes,
          render: markdownSections.render,
          componentModel: "macro-frontend.web-component"
        },
        props,
        children
      );

    markdownSections.definition = {
      name: "markdown-sections",
      namespace: "Portfolio",
      kind: "sections",
      element: "portfolio-sections",
      events: sectionEvents,
      lifecycle: sectionLifecycle,
      abstraction: "markdown content -> section modules",
      componentModel: "macro-frontend.web-component"
    };
    markdownSections.attributes = {};
    markdownSections.render = () => "";


    markdownSections.source = "content/sections/*.md";
    markdownSections.output = "";
    markdownSections.render = (props) => {
      if ("sections" === "landing") {
        return props.structuralKit.structuralComponents
          .createLandingScreenComponent(props.siteAvatar, props.screens)
          .render();
      }

      if ("sections" === "sections") {
        return `<div data-portfolio-sections style="display: contents">${props.screens
          .map((screen, index) =>
            props.structuralKit.structuralComponents
              .createContentStageComponent(screen, index, props.siteAvatar, props.layouts)
              .render()
          )
          .join("")}</div>`;
      }

      if ("sections" === "chatbox") {
        return props.structuralKit.structuralComponents
          .createCompanionPanelComponent(
            props.assistant.name || "icaroIA",
            props.assistant.kicker || "agente de orientacao comercial",
            props.assistant.tooltip || "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor."
          )
          .render();
      }

      if ("sections" === "blog") {
        return `<section data-portfolio-blog-node hidden data-source="${"content/sections/*.md"}" data-output="${""}"></section>`;
      }

      return "";
    };


const companionChatbox = (props = {}, children = []) =>
      portfolioFrontend.createComponent(
        {
          name: "companion-chatbox",
          namespace: "Portfolio",
          kind: "chatbox",
          element: "portfolio-chatbox",
          display: "contents",
          className: "portfolio-component",
          source: "Portfolio",
          props: {},
          state: {},
          events: chatboxEvents,
          lifecycle: chatboxLifecycle,
          abstraction: "conversation state -> application guidance",
          attributes: companionChatbox.attributes,
          render: companionChatbox.render,
          componentModel: "macro-frontend.web-component"
        },
        props,
        children
      );

    companionChatbox.definition = {
      name: "companion-chatbox",
      namespace: "Portfolio",
      kind: "chatbox",
      element: "portfolio-chatbox",
      events: chatboxEvents,
      lifecycle: chatboxLifecycle,
      abstraction: "conversation state -> application guidance",
      componentModel: "macro-frontend.web-component"
    };
    companionChatbox.attributes = {};
    companionChatbox.render = () => "";


    companionChatbox.source = "portfolio-companion";
    companionChatbox.output = "";
    companionChatbox.render = (props) => {
      if ("chatbox" === "landing") {
        return props.structuralKit.structuralComponents
          .createLandingScreenComponent(props.siteAvatar, props.screens)
          .render();
      }

      if ("chatbox" === "sections") {
        return `<div data-portfolio-sections style="display: contents">${props.screens
          .map((screen, index) =>
            props.structuralKit.structuralComponents
              .createContentStageComponent(screen, index, props.siteAvatar, props.layouts)
              .render()
          )
          .join("")}</div>`;
      }

      if ("chatbox" === "chatbox") {
        return props.structuralKit.structuralComponents
          .createCompanionPanelComponent(
            props.assistant.name || "icaroIA",
            props.assistant.kicker || "agente de orientacao comercial",
            props.assistant.tooltip || "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor."
          )
          .render();
      }

      if ("chatbox" === "blog") {
        return `<section data-portfolio-blog-node hidden data-source="${"portfolio-companion"}" data-output="${""}"></section>`;
      }

      return "";
    };


const notepadBlog = (props = {}, children = []) =>
      portfolioFrontend.createComponent(
        {
          name: "notepad-blog",
          namespace: "Portfolio",
          kind: "blog",
          element: "portfolio-blog",
          display: "contents",
          className: "portfolio-component",
          source: "Portfolio",
          props: {},
          state: {},
          events: blogEvents,
          lifecycle: blogLifecycle,
          abstraction: "notepad line -> markdown post -> page section",
          attributes: notepadBlog.attributes,
          render: notepadBlog.render,
          componentModel: "macro-frontend.web-component"
        },
        props,
        children
      );

    notepadBlog.definition = {
      name: "notepad-blog",
      namespace: "Portfolio",
      kind: "blog",
      element: "portfolio-blog",
      events: blogEvents,
      lifecycle: blogLifecycle,
      abstraction: "notepad line -> markdown post -> page section",
      componentModel: "macro-frontend.web-component"
    };
    notepadBlog.attributes = {};
    notepadBlog.render = () => "";


    notepadBlog.source = "data/blog-inbox.txt";
    notepadBlog.output = "public/posts";
    notepadBlog.render = (props) => {
      if ("blog" === "landing") {
        return props.structuralKit.structuralComponents
          .createLandingScreenComponent(props.siteAvatar, props.screens)
          .render();
      }

      if ("blog" === "sections") {
        return `<div data-portfolio-sections style="display: contents">${props.screens
          .map((screen, index) =>
            props.structuralKit.structuralComponents
              .createContentStageComponent(screen, index, props.siteAvatar, props.layouts)
              .render()
          )
          .join("")}</div>`;
      }

      if ("blog" === "chatbox") {
        return props.structuralKit.structuralComponents
          .createCompanionPanelComponent(
            props.assistant.name || "icaroIA",
            props.assistant.kicker || "agente de orientacao comercial",
            props.assistant.tooltip || "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor."
          )
          .render();
      }

      if ("blog" === "blog") {
        return `<section data-portfolio-blog-node hidden data-source="${"data/blog-inbox.txt"}" data-output="${"public/posts"}"></section>`;
      }

      return "";
    };


const portfolioShell = (props = {}, children = []) =>
      portfolioFrontend.createComponent(
        {
          name: "portfolio-shell",
          namespace: "Portfolio",
          kind: "application",
          element: "portfolio-shell",
          display: "contents",
          className: "portfolio-component",
          source: "Portfolio",
          props: {},
          state: {},
          events: shellEvents,
          lifecycle: shellLifecycle,
          abstraction: "application shell -> runtime mount",
          attributes: portfolioShell.attributes,
          render: portfolioShell.render,
          componentModel: "macro-frontend.web-component"
        },
        props,
        children
      );

    portfolioShell.definition = {
      name: "portfolio-shell",
      namespace: "Portfolio",
      kind: "application",
      element: "portfolio-shell",
      events: shellEvents,
      lifecycle: shellLifecycle,
      abstraction: "application shell -> runtime mount",
      componentModel: "macro-frontend.web-component"
    };
    portfolioShell.attributes = {};
    portfolioShell.render = () => "";


    portfolioShell.source = "portfolio-shell";
    portfolioShell.output = "";
    portfolioShell.render = (props) => {
      if ("application" === "landing") {
        return props.structuralKit.structuralComponents
          .createLandingScreenComponent(props.siteAvatar, props.screens)
          .render();
      }

      if ("application" === "sections") {
        return `<div data-portfolio-sections style="display: contents">${props.screens
          .map((screen, index) =>
            props.structuralKit.structuralComponents
              .createContentStageComponent(screen, index, props.siteAvatar, props.layouts)
              .render()
          )
          .join("")}</div>`;
      }

      if ("application" === "chatbox") {
        return props.structuralKit.structuralComponents
          .createCompanionPanelComponent(
            props.assistant.name || "icaroIA",
            props.assistant.kicker || "agente de orientacao comercial",
            props.assistant.tooltip || "Carrego a intencao profissional, a leitura estrutural e o repertorio comercial do meu autor."
          )
          .render();
      }

      if ("application" === "blog") {
        return `<section data-portfolio-blog-node hidden data-source="${"portfolio-shell"}" data-output="${""}"></section>`;
      }

      return "";
    };


portfolioShell.attributes = { "data-shell": true };
portfolioShell.render = () => "";

const portfolioComponentChildren = [landingSurface, markdownSections, companionChatbox, notepadBlog];
    const portfolioComponentLayers = {
      landing: landingSurface,
      sections: markdownSections,
      chatbox: companionChatbox,
      blog: notepadBlog,
      application: portfolioShell
    };

    const portfolioComposition = {
          root: portfolioShell,
          children: portfolioComponentChildren,
          components: [portfolioShell, ...portfolioComponentChildren],
          layers: portfolioComponentLayers,
          compositionModel: "macro-frontend.web-component-composition",
          render(props = {}) {
            return portfolioShell(
              props,
              portfolioComponentChildren.map((child) => (typeof child === "function" ? child(props) : child))
            );
          }
        };


    portfolioComposition.kit = portfolioFrontend;
    portfolioComposition.landing = landingSurface;
    portfolioComposition.sections = markdownSections;
    portfolioComposition.chatbox = companionChatbox;
    portfolioComposition.blog = notepadBlog;
    portfolioComposition.shell = portfolioShell;
    portfolioComposition.mount = (target, props) => portfolioFrontend.mount(target, portfolioComposition.render(props));
    export { portfolioComposition };
