(function (window) {
    window.env = window.env || {};

    const PROFILE = "IPCC4";
    const WEB_URL = 'https://cc.vietteltelecom.vn/chat-client';

    /*================================================================================================================*/
    const SERVICES = {
        CHAT_SERVER_API: {url: 'http://localhost:8080', authJwt: true, crossbarJwt: false},
        CHAT_SERVICE_API: {url: 'https://cc.vietteltelecom.vn/chat-service', authJwt: true, crossbarJwt: false},
        TICKET_SERVICE_API: {url: 'https://cc.vietteltelecom.vn/ticket-service', authJwt: true, crossbarJwt: false},
        APP_IPCC_URL: {url: `${WEB_URL}`, authJwt: false, crossbarJwt: false},
    }


    const PROPERTIES = {
        /*--------------------------------------------------------------APPLICATION PARAM-----------------------------------------------*/
        AllowTextInput: 22,
        AppConfigFileDefaultSize: 22,
        AllowImgTypesId: 'KPI_IN_UPLOAD_FILE_IMAGE_FORMAT',
        AllowMp4TypesId: 'KPI_IN_UPLOAD_FILE_VIDEO_FORMAT',
        AllowMp3TypesId: 'KPI_IN_UPLOAD_FILE_AUDIO_FORMAT',
        AllowOtherTypesId: 'KPI_IN_UPLOAD_FILE_OTHER_FORMAT',

        AllowedImageFileSizeId: 'KPI_IN_MAX_IMAGE_UPLOAD_SIZE',
        AllowedVideoFileSizeId: 'KPI_IN_MAX_VIDEO_UPLOAD_SIZE',
        AllowedAudioFileSizeId: 'KPI_IN_MAX_AUDIO_UPLOAD_SIZE',
        AllowedOtherFileSizeId: 'KPI_IN_MAX_OTHER_UPLOAD_SIZE',

        AllowSendFileId: 'KPI_IN_ENABLE_SEND_FILE',
        AllowSendEmojiId: 'KPI_IN_ENABLE_SEND_EMOJI',
        AllowSendStickerId: 'KPI_IN_ENABLE_SEND_STICKER',
        AllowSendGifId: 'KPI_IN_ENABLE_SEND_GIF',

        /* thoi gian timeout khi gui tin nhan*/
        SendMessage: 10,
        TypingTime: 5,
        surveyBusinessId: 8567
    }

    /*================================================================================================================*/
    const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

    window.env.production = true;
    window.env.SERVICES = SERVICES;
    window.env.DEFAULT_TIMEZONE = DEFAULT_TIMEZONE;
    window.env.PROPERTIES = PROPERTIES;

    console.log("===========================WEB_CHAT_CLIENT_ENV===========================");
    console.log("PROFILE " + PROFILE + ", ENV: ", window.env);
    console.log("=========================================================================");
}(this));
