export function redirectIfLoggedOut() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "popup.html";
    }
}

export function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "game.html";
    }
}
