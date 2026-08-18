document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const ARTICLES = [
    {
      id: "rubi",
      name: "Ing. Rubí Hernández Luis",
      page: 10,
      image: "./assets/articles/rubi.png"
    },
    {
      id: "denisse",
      name: "Dra. Mirna Denisse Barreiro Argüelles",
      page: 11,
      image: "./assets/articles/denisse.png"
    },
    {
      id: "esther",
      name: "Dra. Esther Lugo González",
      page: 12,
      image: "./assets/articles/esther.png"
    },
    {
      id: "maria",
      name: "Dra. María de Jesús Martínez López",
      page: 13,
      image: "./assets/articles/maria.png"
    },
    {
      id: "patricia",
      name: "Dra. Patricia Magaly Gallegos",
      page: 14,
      image: "./assets/articles/patricia.png"
    },
    {
      id: "monica",
      name: "M.C. Mónica Edith García García",
      page: 15,
      image: "./assets/articles/monica.png"
    }
  ];

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get("id") || "denisse";
  const requestedIndex = ARTICLES.findIndex((article) => article.id === requestedId);
  const currentIndex = requestedIndex >= 0 ? requestedIndex : 0;

  const readerTitle = document.querySelector("#reader-title");
  const articleImage = document.querySelector("#article-image");
  const articleCaption = document.querySelector("#article-caption");
  const imageViewport = document.querySelector("#image-viewport");
  const paperFrame = document.querySelector("#paper-frame");
  const articleStatus = document.querySelector("#article-status");
  const previousButton = document.querySelector("#previous-story");
  const nextButton = document.querySelector("#next-story");
  const zoomButton = document.querySelector("#zoom-article");
  const zoomLabel = zoomButton.querySelector("span:last-child");

  function goToArticle(index) {
    const normalizedIndex = (index + ARTICLES.length) % ARTICLES.length;
    const article = ARTICLES[normalizedIndex];
    window.location.assign(`./historia.html?id=${encodeURIComponent(article.id)}`);
  }

  function renderArticle(article) {
    const description = `Página ${article.page} del fanzine dedicada a ${article.name}`;

    document.title = `${article.name} · Fanzine Historias que inspiran`;
    readerTitle.textContent = description;
    articleCaption.textContent = description;
    articleStatus.textContent = `${article.name} · pág. ${article.page}`;
    articleImage.alt = description;
    articleImage.src = article.image;

    if (requestedIndex < 0) {
      window.history.replaceState({}, "", `./historia.html?id=${article.id}`);
    }
  }

  function setZoom(isZoomed) {
    imageViewport.classList.toggle("is-zoomed", isZoomed);
    zoomButton.setAttribute("aria-pressed", String(isZoomed));
    zoomLabel.textContent = isZoomed ? "Ajustar" : "Ampliar";

    if (isZoomed) {
      imageViewport.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }

  articleImage.addEventListener("load", () => {
    paperFrame.classList.remove("is-loading", "has-error");
  });

  articleImage.addEventListener("error", () => {
    paperFrame.classList.remove("is-loading");
    paperFrame.classList.add("has-error");
    articleStatus.textContent = "No se pudo cargar esta página";
    articleImage.alt = "No se pudo cargar la página del fanzine.";
  });

  previousButton.addEventListener("click", () => goToArticle(currentIndex - 1));
  nextButton.addEventListener("click", () => goToArticle(currentIndex + 1));
  zoomButton.addEventListener("click", () => {
    setZoom(!imageViewport.classList.contains("is-zoomed"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") goToArticle(currentIndex - 1);
    if (event.key === "ArrowRight") goToArticle(currentIndex + 1);
    if (event.key === "Escape") setZoom(false);
  });

  renderArticle(ARTICLES[currentIndex]);
});
