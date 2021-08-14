const constants = {
    OLDEST_HEARTBEAT_MS_STILL_ONLINE: 600000, // 10min - If last screen heartbeat is older than this # ms, status is offline
    STATUS_REFRESHER_INTERVAL_MS: 300000, // 5 mins - Used to refresh the displayed time since last heartbeat when status is offline
    MAX_DISPLAY_WIDTH_CHARS: 40,
    MAX_DISPLAY_HEIGHT_CHARS: 10,
    CHAR_HEIGHT_WIDTH_RATIO_ANDROID: 1.956,
    FONT_SIZE_MULTIPLIER_ANDROID: 0.82,
    CHAR_HEIGHT_WIDTH_RATIO_IOS: 1.956,
    FONT_SIZE_MULTIPLIER_IOS: 0.82,
    FIREBASE_CONFIG: { //TODO: replace with your own firebase config
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    }
};

export default constants;