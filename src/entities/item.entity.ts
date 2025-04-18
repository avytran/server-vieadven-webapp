const createItemSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100,
            "description": "The name of Item"
        },
        "description": {
            "type": "string",
            "description": "Description of Item"
        },
        "icon_url": {
            "type": "string",
            "format": "uri",
            "maxLength": 255,
            "description": "Item's icon"
        }
    },
    "additionalProperties": false,
    "required": ["name", "icon_url"]
}

const updateItemSchema = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "minLength": 1,
            "maxLength": 100,
            "description": "The name of Item"
        },
        "description": {
            "type": "string",
            "description": "Description of Item"
        },
        "icon_url": {
            "type": "string",
            "format": "uri",
            "maxLength": 255,
            "description": "Item's icon"
        }
    },
    "additionalProperties": false,
}

export { createItemSchema, updateItemSchema }