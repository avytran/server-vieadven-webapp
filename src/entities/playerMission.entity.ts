const updateProgressSchema = {
    "type": "object",
    "properties": {
        "progress": {
            "type": "number"
        }
    },
    "additionalProperties": false,
    "required": ["progress"]
}

export { updateProgressSchema };