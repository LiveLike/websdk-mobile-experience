class Core {

    constructor() {
        this.config = null;
        this.program = null;
    }

    getQueryParameterValue = (parameterName) => {
        if (!(window && window.location && window.location.search)) {
            return null;
        }
        const urlSerachParams = new URLSearchParams(window.location.search);
        return urlSerachParams.get(parameterName);
    };

    getCurrentProgramId = () => {
        var programId = this.getQueryParameterValue("program_id");
        return programId;
    };

    getProgramAsync = async (programId) => {
        const response = await fetch(`${baseUrl}/programs/${programId}/`);
        if (response.ok) {
            const program = await response.json();
            return program;
        }
        return null;
    };

    getCurrentProgramAsync = async () => {
        const currentProgramId = this.getCurrentProgramId();
        const program = await this.getProgramAsync(currentProgramId);
        return program;
    };

    loadInitialDataAsync = async () => {
        this.program = await this.getCurrentProgramAsync();
    };

    validateInitialData = () => {
        
        if (!this.program) {
            return {
                isValid: false,
                error: "Invalid program id!"
            };
        }

        if (!(this.program && this.program.leaderboards && this.program.leaderboards.length)) {
            return {
                isValid: false,
                error: "The program has no linked leaderboards!"
            };
        }

        if (!(this.program && this.program.default_chat_room)) {
            return {
                isValid: false,
                error: "The program has no default chatroom!"
            };
        }

        return { isValid: true };
    }

    getChatroomAsync = async (chatroomId) => {
        const response = await fetch(`${baseUrl}/chat-rooms/${chatroomId}/`);
        if (response.ok) {
            const chatRoom = await response.json();
            return chatRoom;
        }
        console.error("Invalid chat room id!");
        return null;
    }

    getConfig = async (chatroomId) => {
        const chatRoom = await this.getChatroomAsync(chatroomId);
        if (!(chatRoom && chatRoom.custom_data)) {
            console.error("chatroom is not configured or missing custom_data");
        }
        return JSON.parse(chatRoom.custom_data);
    };

    loadConfig = async () => {
        const config = await this.getConfig(this.program.default_chat_room.id);
        this.config = config;
    }

    getRawFileContentAsync = async (path) => {
        const response = await fetch(path, {
            headers: {
                "Content-Type": "text/plain"
            }
        });
        if (response.ok) {
            const content = await response.text();
            return content;
        }
        console.error(`Invalid file path!, cannot fetch ${path}`);
    }

    appendCss = (cssContent) => {
        document.head.appendChild(document.createElement("style")).innerHTML = cssContent;
    }

    loadStyleAsync = async (styles) => {
        for (const stylePath of styles) {
            {
                this.getRawFileContentAsync(stylePath).then(cssContent => {
                    // replace font
                    cssContent = cssContent.replaceAll(`__Font__`, this.config.style.font);
                    cssContent = cssContent.replaceAll(`__LoginHeader__`, this.config.style.loginHeader);
                    cssContent = cssContent.replaceAll(`__SmallHeader__`, this.config.style.smallHeader);

                    // replace colors
                    for (const key in this.config.style.colors) {
                        cssContent = cssContent.replaceAll(`"__${key}__"`, this.config.style.colors[key]);
                    }

                    this.appendCss(cssContent);
                });
            }
        }
    }

    loadLeaderboardAsync = async () => {
        const lbContainer = document.querySelector(
            '.leaderboard-entries-container'
        );

        if (!lbContainer) {
            return;
        }

        lbContainer.innerHTML = "";
        const leaderboard = await LiveLike.getLeaderboardEntries({ leaderboardId: this.program.leaderboards[0].id });
        leaderboard.entries.forEach((entry) => {

            const entryRow = document.createElement('tr');
            entryRow.setAttribute('class', 'list-item');

            if (entry.profile_id === LiveLike.userProfile.id) {
                entry.profile_nickname = entry.profile_nickname + '(moi)';
                entryRow.setAttribute('class', 'list-item current-profile-list-item');
            }

            if (entry.rank <= 3) {
                entryRow.innerHTML = `<td class="score-label ${entry.profile_id === LiveLike.userProfile.id ? "current-score-label " : ""}rank text-align-left active-bage">${entry.rank}</td>`;

            } else {
                entryRow.innerHTML = `<td class="score-label ${entry.profile_id === LiveLike.userProfile.id ? "current-score-label " : ""}rank">${entry.rank}</td>`
            }

            entryRow.innerHTML += `<td class="score-label ${entry.profile_id === LiveLike.userProfile.id ? "current-score-label " : ""}text-align-left name">${entry.profile_nickname}</td>
<td class="score-label ${entry.profile_id === LiveLike.userProfile.id ? "current-score-label " : ""}text-align-right pts">${entry.score}</td>`;

            lbContainer.appendChild(entryRow);
        });
    }

    setupLeaderboardEvents = () => {
        const leaderboardEvents = ['vote', 'answer', 'prediction', 'cheer', 'slider', 'beforewidgetdetached', 'rankchange'];
        leaderboardEvents.forEach(event => document.addEventListener(event, this.loadLeaderboardAsync));
    }
}

