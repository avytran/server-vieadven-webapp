const updateProgressSchema = {
    "type": "object",
    "properties": {
        "progress": {
            "type": "number"
        },
        "is_completed": {
            "type": "boolean"
        },
        "claimed": {
            "type": "boolean"
        }
    },
    "additionalProperties": false,
}

export { updateProgressSchema };