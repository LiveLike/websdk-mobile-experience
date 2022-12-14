class App {

    constructor(baseUrl, styles) {
        this.baseUrl = baseUrl;
        this.styles = styles;
        this.core = new Core();
        this.templates = new Templates();
        this.userProfile = new UserProfile();
    }

    applyLocalization = () => {
        LiveLike.applyLocalization({
            en: {
                "widget.quiz.voteButton.label": "Valider",
                "widget.quiz.votedText": "Fait!",
                'widget.textAsk.placeholder': 'Écrivez ici...',
                'widget.textAsk.sendButton.label': 'ENVOYER',
                "widget.textPrediction.voteButton.label": "Valider",
                "widget.textPrediction.votedText": "Fait!",
                "widget.imagePrediction.voteButton.label": "Valider",
                "widget.imagePrediction.votedText": "Fait!",
                "widget.numberPrediction.voteButton.label": "Valider",
                "widget.numberPrediction.votedText": "Fait!",
            },
            fr: {
                "widget.quiz.voteButton.label": "Valider",
                "widget.quiz.votedText": "Fait!",
                'widget.textAsk.placeholder': 'Écrivez ici...',
                'widget.textAsk.sendButton.label': 'ENVOYER',
                "widget.textPrediction.voteButton.label": "Valider",
                "widget.textPrediction.votedText": "Fait!",
                "widget.imagePrediction.voteButton.label": "Valider",
                "widget.imagePrediction.votedText": "Fait!",
                "widget.numberPrediction.voteButton.label": "Valider",
                "widget.numberPrediction.votedText": "Fait!",
            }
        });
    }

    initLiveLikeSdkAsync = async () => {
        console.log("Initializing livelike sdk");
        LiveLike.init({
            clientId: this.core.program.client_id
        }).then(() => {
            this.applyLocalization();
        });

    }

    redirectToErrorPage = (error) => {
        console.debug("redirect to error page");
        console.error(error);
        document.querySelector(".app").innerHTML = this.templates.getErrorPageComponentTemplate();
    };

    redirectToLoginPage = () => {

    };

    initializeAsync = async () => {
        console.debug("initialize async");
        await this.core.loadInitialDataAsync();
        const initialDataValidationResult = this.core.validateInitialData();
        if (!initialDataValidationResult.isValid) {
            this.redirectToErrorPage(initialDataValidationResult.error);
            return;
        }
        await this.core.loadConfig(this.core.program.default_chat_room.id);
        await this.core.loadStyleAsync(this.styles);
        await this.initLiveLikeSdkAsync();
        const userProfileIsComplete = this.userProfile.userProfileIsComplete();
        if (userProfileIsComplete) {
            this.redirectToTimeline();
        } else {
            this.redirectToLoginPage();
        }
    };
}