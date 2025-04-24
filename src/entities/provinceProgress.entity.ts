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

export { updateProvinceProgressSchema }