const createFeedbackSchema = {
    type: "object",
    "properties": {
        "content": {
            "type": "string",
            "minLength": 1,
            "maxLength": 500,
            "description": "Feedback content, must be between 1 and 500 characters",
        },
    },
    "required": ["content"],
    "additionalProperties": false,
};

const updateFeedbackSchema = {
    "type": "object",
    "properties": {
        "content": {
            "type": "string",
            "minLength": 1,
            "maxLength": 500,
            "description": "Feedback content, must be between 1 and 500 characters",
        },
    },
    "required": ["content"],
    "additionalProperties": false,
};

export { createFeedbackSchema, updateFeedbackSchema };