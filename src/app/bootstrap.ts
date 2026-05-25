// Generated from: src/app/bootstrap.idsl
// Edit the .idsl source, not this file.


import { portfolioComposition, portfolioFrontend } from "./index.ts";

import { createStructuralRendererAdapter } from "./adapters/structural-renderer-adapter.ts";
    import { createPortfolioApplication, portfolioManifest } from "./config/portfolio-manifest.ts";
    import { createPortfolioRenderers } from "./rendering/portfolio-renderers.ts";

    export function createPortfolioApplicationKit() {
          const structuralKit = createStructuralRendererAdapter();
          const application = createPortfolioApplication(portfolioManifest)();
          const declaredComposition = portfolioComposition;
          const eventPhases = ["construct", "mount", "bind", "render", "transition", "settle", "dispose"];
          const orderedKinds = ["component", "module", "section", "landing", "chatbox", "application"];

          function eventKeys(events = {}) {
            return Object.keys(events || {});
          }

          function stateKeys(state = {}) {
            return Object.keys(state || {});
          }

          function defineEventCycle(name, triggers = [], phases = eventPhases, description = "") {
            return { name, phases, triggers, description };
          }

          function inferNodeKind(component = {}) {
            if (component.kind) return component.kind;
            const name = String(component.name || component.type || "");
            if (name.includes("application") || name.includes("shell")) return "application";
            if (name.includes("landing")) return "landing";
            if (name.includes("companion") || name.includes("chat")) return "chatbox";
            if (name.includes("section") || name.includes("stage") || name.includes("blog")) return "section";
            if (name.includes("module")) return "module";
            return "component";
          }

          function defineComponent(spec) {
            return {
              props: {},
              state: {},
              events: {},
              cycles: [],
              children: [],
              concepts: [],
              source: "macro-frontend",
              ...spec,
              kind: spec.kind || inferNodeKind(spec)
            };
          }

          function specializeComponent(base, next) {
            const component = defineComponent({
              ...base,
              ...next,
              props: { ...(base.props || {}), ...(next.props || {}) },
              state: { ...(base.state || {}), ...(next.state || {}) },
              events: { ...(base.events || {}), ...(next.events || {}) },
              cycles: [...(base.cycles || []), ...(next.cycles || [])],
              children: next.children || base.children || [],
              concepts: [...(base.concepts || []), ...(next.concepts || [])],
              source: next.source || base.source || "macro-specialization"
            });

            return {
              component,
              specialization: {
                from: base.name,
                to: component.name,
                reason: next.reason || "macro structural specialization",
                addedEvents: eventKeys(next.events),
                addedState: stateKeys(next.state)
              }
            };
          }

          function fromStructuralComponent(component) {
            const children = Array.isArray(component.children)
              ? component.children.map(fromStructuralComponent)
              : [];

            return defineComponent({
              name: component.name || component.type || "structural-component",
              kind: inferNodeKind(component),
              props: component.props || {},
              state: component.state || {},
              events: component.events || {},
              cycles: component.cycles || [],
              children,
              concepts: component.concepts || [],
              source: component.type || "structural-renderer"
            });
          }

          function inferCrossLayerInterplays(nodes) {
            const byKind = new Map();
            for (const node of nodes) {
              const nodesByKind = byKind.get(node.kind) || [];
              nodesByKind.push(node);
              byKind.set(node.kind, nodesByKind);
            }

            const first = (kind) => (byKind.get(kind) || [])[0];
            const application = first("application");
            const landing = first("landing");
            const chatbox = first("chatbox");
            const sections = byKind.get("section") || [];
            const blog = sections.find((section) => section.name === "blog-section");
            const interplays = [];

            if (landing && sections.length) {
              interplays.push({
                name: "landing-to-section-flow",
                level: "cross-layer",
                from: landing.name,
                to: sections[0].name,
                via: ["menu-preview", "menu-navigate", "section-snap"],
                abstraction: "landing -> section"
              });
            }

            if (chatbox && application) {
              interplays.push({
                name: "chatbox-application-dialogue",
                level: "application-runtime",
                from: chatbox.name,
                to: application.name,
                via: ["message-submit", "message-stream", "message-close"],
                abstraction: "chatbox -> application"
              });
            }

            if (blog && application) {
              interplays.push({
                name: "notepad-blog-ingestion",
                level: "application-runtime",
                from: blog.name,
                to: application.name,
                via: ["blog-config-submit", "notepad-line-commit", "blog-index-refresh"],
                abstraction: "local node watcher -> markdown post -> page section"
              });
            }

            return interplays;
          }

          function buildArchitectureGraph(root) {
            const nodes = [];
            const specializations = [];
            const eventSurface = {};

            function visit(node, parent = null) {
              nodes.push(node);
              for (const eventName of eventKeys(node.events)) {
                if (!eventSurface[eventName]) eventSurface[eventName] = [];
                eventSurface[eventName].push(node.name);
              }

              if (parent) {
                specializations.push({
                  from: parent.name,
                  to: node.name,
                  reason: node.source || "macro structural nesting",
                  addedEvents: eventKeys(node.events),
                  addedState: stateKeys(node.state)
                });
              }

              for (const child of node.children || []) {
                visit(child, node);
              }
            }

            visit(root);

            const layers = orderedKinds.reduce((acc, kind) => {
              acc[kind] = nodes.filter((node) => node.kind === kind);
              return acc;
            }, {});

            return {
              root,
              nodes,
              layers,
              specializations,
              interplays: inferCrossLayerInterplays(nodes),
              eventSurface
            };
          }

          function buildArchitecture(input) {
            const { screens, siteAvatar, assistant, currentYear, layouts } = input;
            const componentProps = {
              screens,
              siteAvatar,
              assistant,
              currentYear,
              layouts,
              structuralKit
            };
            const components = structuralKit.structuralComponents;
            const landing = fromStructuralComponent(components.createLandingScreenComponent(siteAvatar, screens));
            const contentSections = screens.map((screen, index) =>
              fromStructuralComponent(components.createContentStageComponent(screen, index, siteAvatar, layouts))
            );
            const companion = fromStructuralComponent(
              components.createCompanionPanelComponent(assistant.name, assistant.kicker, assistant.tooltip)
            );
            const blog = defineComponent({
              name: "blog-section",
              kind: "section",
              props: { source: "data/blog-inbox.txt", output: "public/posts" },
              state: { hydrated: false, posts: [] },
              events: {
                configure: "blog-config-submit",
                ingest: "notepad-line-commit",
                refresh: "blog-index-refresh"
              },
              cycles: [
                defineEventCycle(
                  "blog-ingest-cycle",
                  ["configure", "ingest", "refresh"],
                  eventPhases,
                  "Interplay entre Node watcher, configuracao local e feed publico renderizado."
                )
              ],
              children: [],
              concepts: [{ kind: "concept", type: "content-ingestion", source: "notepad", format: "markdown" }],
              source: "portfolio-blog-runtime"
            });
            const shell = fromStructuralComponent(
              components.createApplicationShellComponent(screens, siteAvatar, assistant, currentYear, layouts)
            );
            const root = specializeComponent(shell, {
              name: shell.name,
              kind: "application",
              reason: "Macro de aplicacao fecha landing, secoes, chatbox e blog em uma arquitetura unica.",
              state: {
                contentSource: "markdown-files",
                runtime: "macro-frontend-plus-local-node"
              },
              events: { boot: "runtime-boot", render: "app-render", navigate: "hash-link" },
              children: [landing, ...contentSections, companion, blog],
              concepts: [
                ...(shell.concepts || []),
                {
                  kind: "macro-component-tree",
                  components: declaredComposition.components.map((component) => component.definition?.name || component.name),
                  layers: Object.keys(declaredComposition.layers)
                }
              ],
              source: "macro-application-bootstrap"
            }).component;
            const graph = buildArchitectureGraph(root);
            const frontendNode = declaredComposition.render(componentProps);

            frontendFramework.graph = graph;
            frontendFramework.node = frontendNode;

            return {
              root,
              graph,
              frontendNode,
              layers: graph.layers,
              specializations: graph.specializations,
              interplays: graph.interplays,
              components: {
                landing,
                contentSections,
                companion,
                blog,
                shell: root
              }
            };
          }

          const frontendFramework = {
            name: "portfolio-frontend",
            mode: "macro-component-framework",
            base: $kit,
            source: "createPortfolioApplicationKit",
            composition: declaredComposition,
            graph: null,
            node: null,
            eventPhases,
            orderedKinds
          };
          const renderers = createPortfolioRenderers(structuralKit, buildArchitecture);

          return {
            manifest: portfolioManifest,
            application,
            structuralKit,
            frontendFramework,
            composition: declaredComposition,
            buildArchitecture,
            renderers
          };
        }


    export const icaroglaucoOnline = {
      name: "icaroglaucoOnline",
      framework: portfolioFrontend,
      composition: portfolioComposition,
      factory: createPortfolioApplicationKit
    };
