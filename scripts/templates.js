class Templates {

    error = () => {
        return `
<div class="error-page-component">
    <div class="container">
        <h1 class="error-text">Error!</h1>
        <p class="error-description">Please make sure the url is correct!</p>
    </div>
</div>`;
    }

    login = () => {
        return `
<div class="login-component">
    <div class="login-component-container">
        <div class="login-static-header">&nbsp;</div>
        <div class="login-form-container">
            <form autocomplete="off">
                <label class="form-label" for="form-user-nickname">Nom<b class="red-text">*</b></label>
                <input type="text" onkeydown="app.performUserProfileValidation()"
                    onkeyup="app.performUserProfileValidation()" type="text" id="form-user-nickname"
                    class="form-control" />
                <br />
                <label class="form-label" for="form-user-email">Email<b class="red-text">*</b></label>
                <input type="text" onkeydown="app.performUserProfileValidation()"
                    onkeyup="app.performUserProfileValidation()" id="form-user-email" class="form-control" />
            </form>
            <br />
            <button class="btn btn-default" id="create-profile-button" onclick="app.handleCreateUserProfileAsync()">Créer profil</button>
        </div>
    </div>
</div>`;
    }

    timeline = (params) => {
        return `
<div class="timeline-component">
    <div class="timeline-static-header">
        <div class="small-banner"></div>
        <div class="tab-links-container tab">
            <button class="tablinks active" onclick="app.handleChangeTab(event, 'tab-widget')"><span>Quiz</span></button>
            <button class="tablinks" onclick="app.handleChangeTab(event, 'tab-leaderboard')"><span>Leaderboard</span></button>
        </div>
    </div>
    <div class="timeline-component-body">
        <div id="tab-widget" class="timeline-container-body-content">
            <livelike-widgets class="widgets-timeline" programid="${params.programId}" lang="${params.language}"
                mode="interactive-timeline"></livelike-widgets>
        </div>
        <div id="tab-leaderboard" class="timeline-container-body-content">
            <div class="leaderboard-container">
                <table class="leaderboard-table">
                    <thead>
                        <th class="thead-element text-align-left thead-rank"># &ensp;</th>
                        <th class="thead-element text-align-left">EQUIPE</th>
                        <th class="thead-element text-align-right thead-score">Score</th>
                    </thead>
                    <tbody class="leaderboard-entries-container"></tbody>
                </table>
            </div>
        </div>
    </div>
</div>`;
    }

    leaderboard = () => {
        return ``;
    }

    chatroom = () => {
        return ``;
    }
}