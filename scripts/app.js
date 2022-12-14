class App {

    constructor(baseUrl, styles) {
        this.baseUrl = baseUrl;
        this.styles = styles;
        this.core = new Core();
        this.pages = new Templates();
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

        // TODO: ...
    }

    redirect = (factory) => {
        document.querySelector(`.app`).innerHTML = factory();
    }

    redirectToTimeline = () => {
        console.log("redirecting to timeline");
        return;
        this.redirect(this.pages.timeline);
        this.core.setupLeaderboardEvents();
        const widgetsContainer = document.querySelector('livelike-widgets');
        widgetsContainer.programid = this.core.program.id;
        handleWidgetsScrolling();

        widget.addEventListener('answer', handleResultAnimation);
        widgetsContainer.addEventListener('widgetattached', e => {
            const { widget } = e.detail
            if (!(widget.kind == "image-number-prediction-follow-up"
                || widget.kind == "text-prediction-follow-up"
                || widget.kind == "image-prediction-follow-up")) {
                return;
            }

            e.detail.element.updateComplete.then(async (event) => {
                await addFooterToPredictionAsync(e.detail.widget, e.detail.element);
            });
        });
    };

    redirectToLogin = () => {
        //this.redirect(this.pages.login);
    };

    userProfileFormIsValid = () => {
        const nickname = document.querySelector("#form-user-nickname").value;
        const email = document.querySelector("#form-user-email").value;
        return email && nickname;
    }

    performUserProfileValidation = () => {
        document.querySelector("#create-profile-button").style.display = this.userProfileFormIsValid() ? "grid" : "none";
    };

    updateUserProfile = ({ nickname, custom_data }) => {
        LiveLike.updateUserProfile({
            accessToken: LiveLike.userProfile.access_token,
            options: {
                nickname: nickname,
                custom_data: JSON.stringify(custom_data),
            },
        }).then(() => {
            this.redirectToTimeline();
        }).catch((err) => {
            console.warn(err);
        });
    };

    handleCreateUserProfileAsync = () => {
        if (this.userProfileFormIsValid()) {
            this.updateUserProfile({
                nickname: document.querySelector('#form-user-nickname').value,
                custom_data: {
                    email: document.querySelector('#form-user-email').value
                }
            });
        }
    }


    initializeAsync = async () => {
        console.debug("initialize async");
        await this.core.loadInitialDataAsync();
        const initialDataValidationResult = this.core.validateInitialData();
        if (!initialDataValidationResult.isValid) {
            console.error(initialDataValidationResult.error);
            this.redirect(this.pages.error);
            return;
        }
        await this.core.loadConfig(this.core.program.default_chat_room.id);
        await this.core.loadStyleAsync(this.styles);
        await this.initLiveLikeSdkAsync();
        const userProfileIsComplete = this.userProfile.userProfileIsComplete();
        if (userProfileIsComplete) {
            this.redirectToTimeline();
        } else {
            this.redirectToLogin();
        }
    }
}