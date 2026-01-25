/* =========================
   TIỆN ÍCH
========================= */
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* =========================
   ĐĂNG KÝ
========================= */
function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirm = document.getElementById("regConfirm").value.trim();
  const errorEl = document.getElementById("error");

  errorEl.innerText = "";

  if (!name || !email || !password || !confirm) {
    errorEl.innerText = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorEl.innerText = "Email không hợp lệ";
    return;
  }

  if (password.length < 6) {
    errorEl.innerText = "Mật khẩu phải từ 6 ký tự";
    return;
  }

  if (password !== confirm) {
    errorEl.innerText = "Mật khẩu nhập lại không khớp";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    errorEl.innerText = "Email đã được đăng ký";
    return;
  }

  users.push({
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  });

  saveUsers(users);

  alert("🎉 Đăng ký thành công!");
  window.location.href = "login.html";
}

/* =========================
   ĐĂNG NHẬP
========================= */
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Vui lòng nhập email và mật khẩu");
    return;
  }

  const users = getUsers();
  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    alert("Email hoặc mật khẩu không đúng");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  window.location.href = "index.html";
}

/* =========================
   ĐĂNG XUẤT
========================= */
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
