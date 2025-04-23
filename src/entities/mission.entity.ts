const createMissionSchema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "maxLength": 100,
            "description": "The title of the mission, maximum 100 characters.",
        },
        "description": {
            "type": "string",
            "description": "A detailed description of the mission.",
        },
        "item_id": {
            "type": "integer",
            "description": "The ID of the item rewarded for completing the mission.",
        },
        "item_quantity": {
            "type": "integer",
            "minimum": 1,
            "description": "The quantity of the item rewarded for completing the mission.",
        },
        "target": {
            "type": "integer",
            "minimum": 1,
            "description": "The target value required to complete the mission.",
        },
        "target_type": {
            "type": "string",
            "enum": ["correct_answer", "play_landmark"],
            "description": "The type of target for the mission.",
        },
        "is_active": {
            "type": "boolean",
            "default": true,
            "description": "Indicates whether the mission is active.",
        },
    },
    "required": ["title", "item_id", "item_quantity", "target", "target_type", "is_active"],
    "additionalProperties": false,
};
const updateMissionSchema = {
    "type": "object",
    "properties": {
        "title": {
            "type": "string",
            "maxLength": 100,
            "description": "The title of the mission, maximum 100 characters.",
        },
        "description": {
            "type": "string",
            "description": "A detailed description of the mission.",
        },
        "item_id": {
            "type": "integer",
            "description": "The ID of the item rewarded for completing the mission.",
        },
        "item_quantity": {
            "type": "integer",
            "minimum": 1,
            "description": "The quantity of the item rewarded for completing the mission.",
        },
        "target": {
            "type": "integer",
            "minimum": 1,
            "description": "The target value required to complete the mission.",
        },
        "target_type": {
            "type": "string",
            "enum": ["correct_answer", "play_landmark"],
            "description": "The type of target for the mission.",
        },
        "is_active": {
            "type": "boolean",
            "default": true,
            "description": "Indicates whether the mission is active.",
        },
    },
    "additionalProperties": false,
};



export { createMissionSchema, updateMissionSchema };