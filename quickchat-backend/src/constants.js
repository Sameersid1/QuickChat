export const DB_NAME="quickchat"

export const USER_ROLES = {
    USER: "user",
    ADMIN: "admin"
};

export const AVAILABLE_USER_ROLES = Object.values(USER_ROLES);

export const MESSAGE_TYPES = {
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    FILE: "file"
};

export const AVAILABLE_MESSAGE_TYPES = Object.values(MESSAGE_TYPES);

export const CHAT_TYPES = {
    PRIVATE: "private",
    GROUP: "group"
};