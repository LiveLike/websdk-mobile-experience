class UserProfile {
    getLocalUserProfile = () => {
        S
    }

    profileIsValid = (userProfile) => {
        if (!userProfile.custom_data) {
            return false;
        }
        var customData = JSON.parse(userProfile.custom_data);
        if (!customData.email) {
            return false;
        }
        return true;
    };

    userProfileIsComplete = () => {
        return this.profileIsValid(LiveLike.userProfile);
    };
}