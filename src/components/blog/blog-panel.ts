type BlogPanelDependencies = {
  pageShell: HTMLElement | null;
  screens: unknown[];
  triggerPanelScroll: (targetTop: number) => void;
  escapeHtml: (value: unknown) => string;
};

function renderBlogSectionMarkup() {
  return `
    <section class="blog-stage snap-panel" id="section-blog">
      <div class="blog-shell">
        <header class="blog-hero">
          <p class="section-page-kicker">Local blog / markdown feed</p>
          <h2>Personal blog like page</h2>
          <p>
            Cada linha salva no bloco de notas local vira um post Markdown, entra no indice do site e aparece aqui como um feed pessoal.
          </p>
          <div class="blog-actions">
            <button class="blog-config-button" type="button" data-blog-config-open>Configurar estilo</button>
            <a class="blog-open-inbox" href="/blog-index.json" target="_blank" rel="noreferrer">Indice JSON</a>
          </div>
        </header>

        <section class="blog-control-panel" aria-label="Configuracao do blog">
          <div>
            <p class="blog-panel-kicker">Fonte local</p>
            <strong>data/blog-inbox.txt</strong>
            <span>Rode <code>npm run blog</code> para abrir o bloco e observar novas linhas.</span>
          </div>
          <div>
            <p class="blog-panel-kicker">Estilo ativo</p>
            <p data-blog-style-preview>Carregando estilo...</p>
          </div>
        </section>

        <section class="blog-feed" data-blog-feed aria-live="polite"></section>
      </div>

      <dialog class="blog-config-dialog" data-blog-config-dialog>
        <form class="blog-config-form" data-blog-config-form method="dialog">
          <header>
            <p class="blog-panel-kicker">Config</p>
            <h3>Estilo dos posts</h3>
          </header>
          <label>
            Autor
            <input data-blog-author name="author" type="text" autocomplete="name">
          </label>
          <label>
            Descreva o estilo desejado
            <textarea data-blog-style name="style" rows="7"></textarea>
          </label>
          <footer>
            <button class="blog-secondary-button" type="button" data-blog-config-close>Fechar</button>
            <button class="blog-config-button" type="submit">Salvar estilo</button>
          </footer>
          <p class="blog-config-status" data-blog-config-status></p>
        </form>
      </dialog>
    </section>
  `;
}

function mountBlogPanel({ pageShell, screens }: BlogPanelDependencies) {
  if (!pageShell || document.querySelector("#section-blog")) return;

  const footer = document.querySelector("#footer-stage");
  const template = document.createElement("template");
  template.innerHTML = renderBlogSectionMarkup();
  const blogSection = template.content.firstElementChild;

  if (blogSection) {
    pageShell.insertBefore(blogSection, footer || null);
  }

  const menuList = document.querySelector(".menu-list");
  if (menuList && !document.querySelector("[data-blog-jump]")) {
    const button = document.createElement("button");
    button.className = "menu-button";
    button.type = "button";
    button.dataset.blogJump = "true";
    button.innerHTML = `
      <span class="menu-index">${String(screens.length + 1).padStart(2, "0")}</span>
      <span class="menu-copy">
        <strong>Blog</strong>
        <small>notepad to markdown</small>
      </span>
      <span class="menu-arrow"></span>
    `;
    menuList.append(button);
  }
}

async function loadBlogConfig() {
  const response = await fetch("/api/blog/config").catch(() => null);
  if (!response?.ok) {
    return {
      author: "Icaro Glauco",
      style:
        "Blog pessoal, tecnico e editorial. Tom direto, introspectivo, com foco em software, IA, produto e autoria."
    };
  }

  return response.json();
}

async function loadBlogPosts() {
  const response = await fetch(`/blog-index.json?ts=${Date.now()}`);
  if (!response.ok) throw new Error("Nao foi possivel carregar o indice do blog.");
  const payload = await response.json();
  return Array.isArray(payload.posts) ? payload.posts : [];
}

function formatBlogDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function renderBlogPosts(posts, escapeHtml: BlogPanelDependencies["escapeHtml"]) {
  const blogFeedNode = document.querySelector("[data-blog-feed]");
  if (!blogFeedNode) return;

  if (!posts.length) {
    blogFeedNode.innerHTML = `
      <article class="blog-empty">
        <p class="blog-panel-kicker">Aguardando primeira linha</p>
        <h3>Nenhum post gerado ainda</h3>
        <p>Abra o watcher com <code>npm run blog</code>, escreva uma linha no bloco de notas e salve.</p>
      </article>
    `;
    return;
  }

  blogFeedNode.innerHTML = posts
    .map(
      (post) => `
        <article class="blog-post-card">
          <div class="blog-post-meta">
            <span>${escapeHtml(formatBlogDate(post.date))}</span>
            <span>${escapeHtml(post.author || "Icaro Glauco")}</span>
          </div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.excerpt || post.sourceLine || "")}</p>
          <a href="${escapeHtml(post.url)}" target="_blank" rel="noreferrer">Abrir markdown</a>
        </article>
      `
    )
    .join("");
}

async function refreshBlog(escapeHtml: BlogPanelDependencies["escapeHtml"]) {
  const [config, posts] = await Promise.all([loadBlogConfig(), loadBlogPosts().catch(() => [])]);
  const stylePreview = document.querySelector("[data-blog-style-preview]");
  const authorInput = document.querySelector<HTMLInputElement>("[data-blog-author]");
  const styleInput = document.querySelector<HTMLTextAreaElement>("[data-blog-style]");

  if (stylePreview) stylePreview.textContent = config.style;
  if (authorInput) authorInput.value = config.author || "Icaro Glauco";
  if (styleInput) styleInput.value = config.style || "";
  renderBlogPosts(posts, escapeHtml);
}

export function setupBlogPanel(dependencies: BlogPanelDependencies) {
  mountBlogPanel(dependencies);

  const { triggerPanelScroll, escapeHtml } = dependencies;
  const jumpButton = document.querySelector("[data-blog-jump]");
  const configDialog = document.querySelector("[data-blog-config-dialog]");
  const configOpen = document.querySelector("[data-blog-config-open]");
  const configClose = document.querySelector("[data-blog-config-close]");
  const configForm = document.querySelector("[data-blog-config-form]");
  const authorInput = document.querySelector<HTMLInputElement>("[data-blog-author]");
  const styleInput = document.querySelector<HTMLTextAreaElement>("[data-blog-style]");
  const status = document.querySelector("[data-blog-config-status]");

  jumpButton?.addEventListener("click", () => {
    const target = document.querySelector<HTMLElement>("#section-blog");
    if (target) triggerPanelScroll(target.offsetTop);
  });

  configOpen?.addEventListener("click", () => {
    if (configDialog instanceof HTMLDialogElement) {
      configDialog.showModal();
    }
  });

  configClose?.addEventListener("click", () => {
    if (configDialog instanceof HTMLDialogElement) {
      configDialog.close();
    }
  });

  configForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (status) status.textContent = "Salvando...";

    try {
      const response = await fetch("/api/blog/config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          author: authorInput?.value,
          style: styleInput?.value,
          language: "pt-BR"
        })
      });

      if (!response.ok) throw new Error("Nao foi possivel salvar a configuracao.");
      await refreshBlog(escapeHtml);
      if (status) status.textContent = "Estilo salvo. As proximas linhas usam esta direcao.";
    } catch (error) {
      if (status) {
        status.textContent = error instanceof Error ? error.message : "Falha ao salvar.";
      }
    }
  });

  refreshBlog(escapeHtml).catch(() => {
    renderBlogPosts([], escapeHtml);
  });
  window.setInterval(() => refreshBlog(escapeHtml), 5000);
}
