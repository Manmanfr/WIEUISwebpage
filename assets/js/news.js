async function loadNews() {
    const response = await fetch('news.json');
    const articles = await response.json();
    return articles;
}

// Builds the featured post (most recent)
function buildFeaturedPost(article) {
    return `
        <article class="box post">
            <header>
                <h3><a href="news.html?id=${article.id}">${article.title}</a></h3>
                <p>${article.subtitle}</p>
                <ul class="meta">
                    <li class="icon fa-clock">${article.date}</li>
                </ul>
            </header>
            <a href="news.html?id=${article.id}" class="image featured">
                <img src="${article.image}" alt="${article.title}" />
            </a>
            <p>${article.preview}</p>
            <a href="news.html?id=${article.id}" class="button">Continue Reading</a>
        </article>
    `;
}

// Builds the sidebar summaries (remaining articles)
function buildSidebarPost(article) {
    return `
        <li>
            <article class="box post-summary">
                <h3><a href="news.html?id=${article.id}">${article.title}</a></h3>
                <ul class="meta">
                    <li class="icon fa-clock">${article.date}</li>
                </ul>
            </article>
        </li>
    `;
}

function buildNewsCard(article) {
    return `
        <div class="col-4 col-6-medium col-12-small">
            <a href="news.html?id=${article.id}" class="news-card">
                <div class="news-card-inner">
                    <img src="${article.image}" alt="${article.title}" />
                    <div class="news-card-title">
                        <span class="icon fa-clock"> ${article.date}</span>
                        <h3>${article.title}</h3>
                    </div>
                </div>
            </a>
        </div>
    `;
}

async function initNewsGrid() {
    const articles = await loadNews();
    const grid = document.getElementById('news-grid');
    if (grid) {
        grid.innerHTML = articles.map(buildNewsCard).join('');
    }
}

// For main.html — populates the blog section
async function initMainBlog() {
    const articles = await loadNews();
    const featured = document.querySelector('.box.blog .content');
    const sidebar = document.querySelector('.box.blog .sidebar ul.divided');

    if (featured && articles[0]) {
        featured.innerHTML = buildFeaturedPost(articles[0]);
    }

    if (sidebar && articles.length > 1) {
        sidebar.innerHTML = articles.slice(1).map(buildSidebarPost).join('');
    }
}

// For find_out.html — shows the full article
async function initArticlePage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const articles = await loadNews();
    const article = articles.find(a => a.id === id);

    if (!article) return;

    document.title = article.title + ' | WIE UIS';

    const articleBox = document.querySelector('article.box.page-content');
    if (articleBox) {
        articleBox.innerHTML = `
            <header>
                <h2>${article.title}</h2>
                <p>${article.subtitle}</p>
                <ul class="meta">
                    <li class="icon fa-clock">${article.date}</li>
                </ul>
            </header>
            <section>
                <span class="image featured"><img src="${article.image}" alt="${article.title}" /></span>
                ${article.content}
            </section>
            <a href="find_out.html" class="button">← Back to News</a>
        `;
    }
}