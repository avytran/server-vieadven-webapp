const createUserSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "maxLength": 100
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
            "maxLength": 255
        },
        "avatar_url": {
            "type": "string",
            "maxLength": 255,
            "format": "uri"
        }
    },
    "additionalProperties": false,
    "required": ["name", "email", "password"]
}

const loginSchema = {
    "type": "object",
    "properties": {
        "email": {
            "type": "string",
            "format": "email"
        },
        "password": {
            "type": "string",
        }
    },
    "additionalProperties": false,
    "required": ["email", "password"]
}

export { createUserSchema, loginSchema }