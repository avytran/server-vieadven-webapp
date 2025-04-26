const updateProvinceProgressSchema = {
    "type": "object",
    "properties": {
        "stars": {
            "type": "number"
        },
        "last_played": {
            "type": "string",
            "format": "date-time"
        }
    },
    "additionalProperties": false
}

const createProvinceProgressSchema = {
    "type": "object",
    "properties": {
        "player_id": {
            "type": "string",
            "maxLength": 5,
            "pattern": "^US\\d{3}$"
        },
        "province_id": {
            "type": "string",
            "maxLength": 5,
            "pattern": "^vn-\\d{2}$"
        },
        "stars": {
            "type": "number"
        },
        "last_played": {
            "type": "string",
            "format": "date-time"
        }
    },
    "additionalProperties": false,
    "required": ["player_id", "province_id", "stars"]
}

export { updateProvinceProgressSchema, createProvinceProgressSchema }