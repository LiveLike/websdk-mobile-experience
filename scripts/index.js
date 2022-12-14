const baseUrl = "https://cf-blast.livelikecdn.com/api/v1";
const styles = ["./styles/style.css"];

; (() => {
    window.addEventListener('DOMContentLoaded', async () => {
        var app = new App(baseUrl, styles);
        window.app = app;
        await app.initializeAsync();
    });
})();