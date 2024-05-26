export const NOTIFICATION_TYPE = {
    INFO: "INFO",
    WARNING: "WARNING",
    ERROR: "ERROR",
};

export const CHAT_USER_TYPE = {
    CLIENT: 1,
    AGENT: 2,
};

export const ALLOWED_MEDIA = ['audio/mp3', 'audio/wav'];
export const ALLOWED_IMAGE = ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'];
export const TIMEOUT_TYPING = 4000;
export const CHAT_BOT = 'CHATBOT';
export const TIME_OPEN_BOX_CHAT = 60;

export const ALLOWED_FILE_CHAT = ['application/x-rar-compressed',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
    'application/vnd.ms-powerpoint', // ppt
    'application/msword',
    'application/vnd.ms-excel', // xsl
    'application/pdf', // pdf
    'application/zip', // zip
    'application/x-7z-compressed',
    'image/jpeg',
    'video/3gp',
    'video/mp4',
    'audio/mpeg',
    'audio/vnd.dlna.adts'];

export const KAZOO = {
    UI_METADATA_VOIP: {
        origin: 'voip',
        ui: 'monster-ui',
        version: '4.1-63',
    }
};

export const USER = {
    PRIV_LEVEL: {
        ADMIN: 'admin',
        USER: 'user'
    },
    USER_ROLE: {
        ADMIN: 'admin',
        SUPERVISOR: 'supervisor',
        AGENT: 'agent'
    }
};

export const ObjectIDManager = {
    REQUEST_LOGIN_TRUE: 1, //  cho phep dang nhap
    AGENT_LOGIN: 2,
    LOGOUT: 3, //  dang xuat
    HAVE_MESSAGE: 4, //
    MESSAGE: 5, //  khi send message
    LEAVE_CONVERSATION: 9, //  roi khoi hoi thoai
    SEND_FILE: 20,
    RECEIVE_FILE: 21,
    USER_JOIN_CONVERSATION: 34,
    CUSTOMER_LOGIN: 37, //  tao moi visitor moi
    UPDATE_VISITOR_INFO: 41, // cap nhat visitor
    AGENT_NOT_RESPONSE_INCOMING_CHAT: 42,
    AGENT_RESPONSE_INCOMING_CHAT: 43,
    AGENT_GET_CONV_HISTORY: 44,
    AGENT_GET_MESSAGE_HISTORY: 45,
    AGENT_END_CONVERSATION: 49,
    AGENT_FRIEND_LIST: 50,
    AGENT_CREATE_CONVERSATION: 51,
    GET_LIST_AGENT: 53,
    TRANSFER_CHAT_TO_AGENT: 54,
    TRANSFER_CHAT_TO_AGENT_RESULT: 55,
    RESPONSE_TRANSFER_CHAT_TO_AGENT: 56,
    FRIEND_LIST_UPDATE: 62,
    CONVERSATION_UPDATE: 63,
    AGENT_LEFT_CONVERSATION: 64,
    AGENT_RESPONSE_INCOMING_CHAT_SUPERVISOR: 67,
    CUSTOMER_END_CONVERSATION: 69,
    AGENT_END_CONVERSATION_CUSTOMER: 71, // agent ket thuc hoi thoai
    SURVEY_SEND_DATA_TO_CUSTOMER: 139,
    SURVEY_UPDATE_RESPONSE_CUSTOMER: 138,
    AGENT_INFO_CUSTOMER: 72, // thong tin agent
    RESPONSE_AGENT_MISS_CHAT_TO_CUSTOMER: 76, //
    AGENT_HAS_CUSTOMER: 77,
    RESPONSE_CUSTOMER_GET_HISTORY_CHAT: 78, //  get history chat
    CUSTOMER_GET_HISTORY_CHAT: 79, //  get history chat
    GET_SERVICE_LIST: 80,          // web client request danh sach service
    RESPONSE_SERVICE_LIST: 81,     // tra ve danh sach service cho web client
    CHAT_SUPER_SPY: 83,
    CHAT_SUPER_SPY_END: 91,
    CUSTOMER_RESUMING_REQUEST: 86, // yeu cau resume lai session
    CUSTOMER_RESUMING_RESPONSE: 87, // response resume session
    NOTIFY_TYPING: 88,
    LIKE: 89,
    DISLIKE: 90,
    CHAT_SUPER_SUPPORT_END: 92,
    TRANSFER_CHAT_RESPONSE: 93,
    SUPPORT_CHAT_RESPONSE: 94,
    CHAT_SUPER_JOIN: 84,
    AGENT_LOGOUT: 95,
    CHAT_SUPER_JOIN_END: 97,
    COMMENT: 98,
    RESPONSE_TRANSFER_CHAT_TO_AGENT_RESULT: 99,
    OFFLINE_MESSAGE_RESPONSE: 100,
    BAN_CUSTOMER: 101,
    AGENT_RESUME_RESPONSE: 102,
    END_INTERNAL_CHAT: 103,
    GET_INTERNAL_HISTORY: 104,
    TRANSFER_CHAT_TIMEOUT: 105,
    WARNING_CUSTOMER_TIMEOUT: 107,
    CUSTOMER_TIMEOUT_CONVERSATION: 108,
    SEND_IS_CHAT_TYPING: 106,
    CUSTOMER_UPDATE_USER_INFO_ERROR : 110,
    HOLD_UNHOLD_CHAT : 111,
    NOTIFY_HOLD_CHAT : 112,
    NOTIFY_HOLD_TIMES : 113,
    NOTIFY_REPLY_FIRST_MSG : 114,
    NOTIFY_REPLY_NEXT_MSG : 115,
    MORE_CHAT_MESSAGE: 130,
    RECEIVE_MESSAGE: 136,
    LEAVE_MESSAGE : 144,
    SHOW_LEAVE_MESSAGE : 145,
    KICK_BECAUSE_SUPER_ROB: 146,
    SUPER_ROB_CHAT: 147,
    SUPER_END_CONVERSATION: 148,
    CHAT_SUPER_JOIN_ERROR_MAX: 149,
    CHAT_SUPER_ROB_ERROR_MAX: 150,
    SEND_PING: 111111,
    SUBSCRIBE_CONVERSATION: 1002,
    UNSUBSCRIBE_CONVERSATION: 1003,
    PUSH_CONVERSATION_TO_AGENT: 1005
}
export const DOMAIN_CONFIG_PREVIEW = {
    CHAT_BOX : 'CHATBOX' ,
    OFFILINE : 'OFFILINE',
    ONLINE : 'ONLINE',
    FORMCUSTOMER : 'FORMCUSTOMER',
    FORMCUSTOMER_OFF : 'FORMCUSTOMER_OFF'
};