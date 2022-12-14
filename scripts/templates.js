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
            <button class="btn btn-default" id="create-profile-button"
                onclick="app.handleCreateUserProfileAsync()">Créer
                profil</button>
        </div>
    </div>
</div>`;
    }

    timeline = () => {
        return ``;
    }

    leaderboard = () => {
        return ``;
    }

    chatroom = () => {
        return ``;
    }
}