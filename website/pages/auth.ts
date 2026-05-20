export function redirectIfLoggedOut() {
    const token = localStorage.getItem("token");
    if (!token) {
        // allow game.ts to load BEFORE redirect
        setTimeout(() => {
            window.location.href = "popup.html";
        }, 50);
    }
}

export function redirectIfLoggedIn() {
    const token = localStorage.getItem("token");
    if (token) {
        window.location.href = "game.html";
    }
}
