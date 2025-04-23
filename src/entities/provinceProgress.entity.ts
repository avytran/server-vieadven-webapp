const updateProvinceProgressSchema = {
    "type": "object",
    "properties": {
        "stars": {
            "type": "number"
        },
        "last_played": {
            "type": "string",
            "format": "timestamp"
        }
    },
    "additionalProperties": false
}

export { updateProvinceProgressSchema }