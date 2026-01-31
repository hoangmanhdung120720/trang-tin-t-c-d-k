/* ================= DOM ================= */
const container = document.getElementById("articles");
const loading = document.getElementById("loading");
const menuButtons = document.querySelectorAll(".menu button");

/* ================= STATE ================= */
let articles = [];
let page = 0;
const limit = 6;
let currentRSS = "giai-tri"; // 👈 Giải trí
let isLoading = false;
let isEnd = false;

/* ================= RSS ================= */
function getRSSUrl(type) {
  return `https://vnexpress.net/rss/${type}.rss`;
}

async function fetchRSS(type) {
  // reset state
  container.innerHTML = "";
  loading.style.display = "block";
  loading.innerText = "Đang tải...";
  page = 0;
  isEnd = false;
  isLoading = false;

  try {
    const rssURL = encodeURIComponent(getRSSUrl(type));
    const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${rssURL}`;
    const res = await fetch(apiURL);
    const data = await res.json();

    articles = data.items || [];

    if (articles.length === 0) {
      loading.innerText = "Không có tin";
      return;
    }

    loadMore(); // load lần đầu
  } catch (err) {
    loading.innerText = "Lỗi tải dữ liệu";
    console.error(err);
  }
}

/* ================= LOAD MORE ================= */
function loadMore() {
  if (isLoading || isEnd) return;
  isLoading = true;

  const start = page * limit;
  const end = start + limit;
  const items = articles.slice(start, end);

  if (items.length === 0) {
    isEnd = true;
    loading.style.display = "none"; // 👈 cho footer hiện
    isLoading = false;
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "article";

    div.innerHTML = `
      ${getImage(item)}
      <div class="article-content">
        <h3>
          <a href="detail.html" class="article-link">${item.title}</a>
        </h3>
        <p>${stripHTML(item.description).slice(0, 140)}...</p>
        <span>${item.pubDate}</span>
      </div>
    `;

    div.querySelector(".article-link").addEventListener("click", () => {
      saveNews(item);
    });

    container.appendChild(div);
  });

  page++;
  isLoading = false;
}

/* ================= SCROLL ================= */
window.addEventListener("scroll", () => {
  if (
    !isEnd &&
    window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 150
  ) {
    loadMore();
  }
});

/* ================= MENU ================= */
menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentRSS = btn.dataset.rss;
    fetchRSS(currentRSS);
  });
});

/* ================= UTIL ================= */
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html || "";
  return div.textContent || "";
}

function getImage(item) {
  if (item.thumbnail) {
    return `<img src="${item.thumbnail}" loading="lazy">`;
  }

  const match = item.description?.match(/<img[^>]+src="([^">]+)"/);
  if (match) {
    return `<img src="${match[1]}" loading="lazy">`;
  }

  return "";
}

function saveNews(item) {
  localStorage.setItem(
    "currentNews",
    JSON.stringify({
      title: item.title,
      content: item.description,
      date: item.pubDate,
      link: item.link
    })
  );
}

/* ================= INIT ================= */
fetchRSS(currentRSS);

/* ================= USER ================= */
const userArea = document.getElementById("userArea");
const user = JSON.parse(localStorage.getItem("currentUser"));

if (userArea) {
  if (user) {
    userArea.innerHTML = `
      👤 ${user.name}
      <button onclick="logout()">Đăng xuất</button>
    `;
  } else {
    userArea.innerHTML = `
      <a href="login.html">Đăng nhập</a> |
      <a href="register.html">Đăng ký</a>
    `;
  }
}
