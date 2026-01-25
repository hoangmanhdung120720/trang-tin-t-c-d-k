const container = document.getElementById("articles");
const loading = document.getElementById("loading");
const menuButtons = document.querySelectorAll(".menu button");

let articles = [];
let page = 0;
const limit = 6;
let currentRSS = "tin-moi-nhat";

/* ================= RSS ================= */

// Lấy RSS theo chuyên mục
function getRSSUrl(type) {
  return `https://vnexpress.net/rss/${type}.rss`;
}

async function fetchRSS(type) {
  loading.innerText = "Đang tải...";
  container.innerHTML = "";
  page = 0;

  const rssURL = encodeURIComponent(getRSSUrl(type));
  const apiURL = `https://api.rss2json.com/v1/api.json?rss_url=${rssURL}`;

  try {
    const res = await fetch(apiURL);
    const data = await res.json();
    articles = data.items;
    loadMore();
  } catch (err) {
    loading.innerText = "Lỗi tải dữ liệu";
    console.error(err);
  }
}

/* ================= LOAD MORE ================= */

function loadMore() {
  const start = page * limit;
  const end = start + limit;
  const items = articles.slice(start, end);

  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "article";

    div.innerHTML = `
      ${getImage(item)}
      <div class="article-content">
        <h3>
          <a href="detail.html" class="article-link">
            ${item.title}
          </a>
        </h3>
        <p>${stripHTML(item.description).slice(0, 140)}...</p>
        <span>${item.pubDate}</span>
      </div>
    `;

    // Click → lưu tin → sang detail.html
    div.querySelector(".article-link").addEventListener("click", () => {
      saveNews(item);
    });

    container.appendChild(div);
  });

  page++;
  if (page * limit >= articles.length) {
    loading.innerText = "Hết tin";
  }
}

/* ================= INFINITE SCROLL ================= */

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
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

// Xóa HTML tag
function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

// Lấy ảnh (chuẩn RSS VnExpress)
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

// Lưu tin sang localStorage
function saveNews(item) {
  localStorage.setItem(
    "currentNews",
    JSON.stringify({
      title: item.title,
      content: item.description, // giữ HTML
      date: item.pubDate,
      link: item.link            // 👈 THÊM DÒNG NÀY
    })
  );
}



/* ================= INIT ================= */

fetchRSS(currentRSS);
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
