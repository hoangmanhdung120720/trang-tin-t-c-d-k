const user = JSON.parse(localStorage.getItem("currentUser"));
if (!user) {
  alert("Vui lòng đăng nhập để xem bài viết");
  window.location.href = "login.html";
}

const data = JSON.parse(localStorage.getItem("currentNews"));

if (!data) {
  document.body.innerHTML = "<h2>Không có dữ liệu bài viết</h2>";
} else {
  document.getElementById("title").innerText = data.title;
  document.getElementById("date").innerText = data.date;
  document.getElementById("content").innerHTML = data.content;

  // Gắn link bài gốc (nếu có)
  const sourceLink = document.getElementById("sourceLink");
  if (sourceLink && data.link) {
    sourceLink.href = data.link;
  }
}
