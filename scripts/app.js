class App {

    constructor(baseUrl, styles) {
        this.baseUrl = baseUrl;
        this.styles = styles;
        this.core = new Core();
        this.templates = new Templates();
    }

    initLiveLikeSdkAsync = async () => {
        console.log("Initializing livelike sdk");
    }

    redirectToErrorPage = (error) => {
        console.debug("redirect to error page");
        console.error(error);
        document.querySelector(".app").innerHTML = this.templates.getErrorPageComponentTemplate();
    };

    initializeAsync = async () => {
        console.debug("initialize async");
        await this.core.loadInitialDataAsync();
        const validationResult = this.core.validateInitialData();
        if (!validationResult.isValid) {
            this.redirectToErrorPage(validationResult.error);
            return;
        }
        await this.core.loadConfig(this.core.program.default_chat_room.id);
        await this.core.loadStyleAsync(this.styles);
        await this.initLiveLikeSdkAsync()
    };
}