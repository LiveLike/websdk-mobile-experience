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
        return LiveLike.init({
            clientId: this.core.program.client_id
        }).then(() => {
            this.applyLocalization();
        });
    }

    redirect = (factory, params) => {
        document.querySelector(`.app`).innerHTML = factory(params);
    }

    handleWidgetsScrolling = () => {
        const widgetsContainer = document.querySelector('livelike-widgets');
        const widgetsTabPane = document.querySelector('#tab-widget')
        const handleClickLoadMoreButton = () => {
            const loadMoreButton = document.querySelector(".livelike-load-more-button");
            if (loadMoreButton) {
                loadMoreButton.click();
            }
        };
        const scrollUp = () => {
            widgetsTabPane.scrollTop = 0;
            handleClickLoadMoreButton();
        }

        widgetsContainer.addEventListener('widgetattached', scrollUp);
    }

    handleResultAnimation = e => {
        const { result, element, widget, answer } = e.detail;
        let rewardText = "";
        if (answer.is_correct) {
            rewardText = `${answer.rewards[0].reward_item_amount} ${answer.rewards[0].reward_item_name}!`
        }
        const rewardElement = `<span class="confirmation-message quiz-confirmation-message"> ${rewardText}</span>`;

        e.target.lastChild.lastChild.children[1].insertAdjacentHTML('beforeend', rewardElement);

        const animationEl = element.querySelector('.animation-container');
        if (result !== 'unattempted' && !animationEl) {
            let imgUrl = answer.is_correct ? './assets/images/correct.gif' : './assets/images/incorrect.gif';

            const elStr =
                `<div class="animation-container" style="position: absolute; z-index: 10; left: 50%; width: 100%; top: 50%; transform: translate(-50%,-50%); z-index: 1000; width: 100%;">
              <img class="animation-image" style="height: 100%; width: 100%;" src="${imgUrl}" alt="Result animation">
      </div>`;

            const widgetEl = element.querySelector('livelike-widget-root');
            widgetEl && widgetEl.insertAdjacentHTML(
                'beforeend',
                elStr
            );
            widgetEl && setTimeout(() => {
                const animation = element.querySelector('.animation-image');
                const gif = element.querySelector('.animation-container');
                if (gif && animation) {
                    animation.src = "";
                    gif.removeChild(animation);
                }
            }, 2250);
        }

    };

    getScoreAsync = async (widgetId) => {
        const response = await LiveLike.getRewardTransactions({ widgetIds: [widgetId] });
        return {
            rewardItemAmount: response.results.map(x => x.reward_item_amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0),
            rewardItemName: response.results.length ? response.results[0].reward_item_name : null
        };
    };

    addFooterToPredictionAsync = async (widget, element) => {
        const body = element.querySelector('livelike-widget-body');
        if (body) {
            let widgetId = ""
            if (widget.kind == "text-prediction-follow-up") {
                widgetId = widget.text_prediction_id;
            } else if (widget.kind == "image-number-prediction-follow-up") {
                widgetId = widget.image_number_prediction_id;
            } else if (widget.kind == "image-prediction-follow-up") {
                widgetId = widget.image_prediction_id;
            }

            const score = await this.getScoreAsync(widgetId);
            body.insertAdjacentHTML('afterend', `<livelike-footer class="prediction-follow-up-footer-message">${score.rewardItemAmount} ${score.rewardItemAmount ? score.rewardItemName : ""}</livelike-footer>`);
        }
    };

    redirectToTimelineAsync = async () => {
        this.redirect(this.pages.timeline, { programId: this.core.program.id });
        this.core.setupLeaderboardEvents();
        await this.core.loadLeaderboardAsync();
        this.handleWidgetsScrolling();
        const widgetsContainer = document.querySelector('livelike-widgets');

        widgetsContainer.addEventListener('answer', this.handleResultAnimation);
        widgetsContainer.addEventListener('widgetattached', e => {
            const { widget } = e.detail;
            if (widget.kind === "cheer-meter") {
                e.detail.element.updateComplete.then(async (event) => {
                    var sheet = new CSSStyleSheet

                    sheet.replaceSync(`
                        .bar0 {
                            background: ${this.core.config.style.colors.Successful}; 
                            border-radius: 4px 0px 0px 4px;
                        }
                        .bar1{
                            background: ${this.core.config.style.colors.Unsuccessful};
                            border-radius: 0px 4px 4px 0px;
                        }
                    `)
                    const host = e.detail.element.querySelector('livelike-dueling-progress');
                    host.shadowRoot.adoptedStyleSheets = [sheet]
                });

            }
            if (!(widget.kind == "image-number-prediction-follow-up"
                || widget.kind == "text-prediction-follow-up"
                || widget.kind == "image-prediction-follow-up")) {
                return;
            }
            e.detail.element.updateComplete.then(async (event) => {
                await this.addFooterToPredictionAsync(e.detail.widget, e.detail.element);
            });
        });
    };

    redirectToLogin = () => {
        this.redirect(this.pages.login);
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
            this.redirectToTimelineAsync();
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
        await this.core.loadInitialDataAsync();
        const initialDataValidationResult = this.core.validateInitialData();
        if (!initialDataValidationResult.isValid) {
            console.error(initialDataValidationResult.error);
            this.redirect(this.pages.error);
            return;
        }
        await this.core.loadConfig(this.core.program.default_chat_room.id);
        await this.core.loadStyleAsync(this.styles);
        this.initLiveLikeSdkAsync().then(() => {
            const userProfileIsComplete = this.userProfile.userProfileIsComplete();
            if (userProfileIsComplete) {
                this.redirectToTimelineAsync();
            } else {
                this.redirectToLogin();
            }
        });
    }

    handleChangeTab = (event, tabId) => {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("timeline-container-body-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabId).style.display = "block";
        event.currentTarget.className += " active";
    }
}