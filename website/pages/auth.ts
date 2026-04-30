export function requireLogin() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "index.html";
  }
}

export function redirectIfLoggedIn() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "game.html"; // or wherever your main page is
  }
}
