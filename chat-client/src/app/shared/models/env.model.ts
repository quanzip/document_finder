export interface ServiceCategory {
    CROSSBAR: ServiceAuthConfig
    ACCOUNT_API: ServiceAuthConfig
    CHAT_SERVER_API: ServiceAuthConfig
    CHAT_SERVICE_API: ServiceAuthConfig
    ACD_SERVICE_API: ServiceAuthConfig
    EMAIL_SERVICE_API: ServiceAuthConfig
    TICKET_SERVICE_API: ServiceAuthConfig
    PUBLIC_MINIO_API: ServiceAuthConfig
    PRIVATE_MINIO_API: ServiceAuthConfig
    FIREBASE_API: ServiceAuthConfig
    APP_IPCC_URL: ServiceAuthConfig
}

export interface ServiceAuthConfig {
    url: string
    authJwt: boolean
    crossbarJwt: boolean
}

export interface Properties {
    AllowTextInput: number,
    AllowImgTypesId: string,
    AllowMp3TypesId: string,
    AllowMp4TypesId: string,
    AllowOtherTypesId: string,

    AllowedAudioFileSizeId: string,
    AllowedVideoFileSizeId: string,
    AllowedImageFileSizeId: string,
    AllowedOtherFileSizeId: string,
    AllowedAlbumSize: number,

    AllowSendFileId: string;
    AllowSendEmojiId: string;
    AllowSendStickerId: string,
    AllowSendGifId: string;

    AppConfigFileDefaultSize: number

    /* thoi gian timeout khi gui tin nhan*/
    SendMessage: number,
    TypingTime: number,
    surveyBusinessId: number
}
