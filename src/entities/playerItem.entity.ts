const updateItemOfAPlayerSchema = {
    "type": "object",
    "properties": {
        "quantity": {
            "type": "integer",
            "minimum": 1,
            "description": "The quantity to increment for the player's item. Must be a positive integer.",
        },
    },
    "required": ["quantity"],
    "additionalProperties": false,
};

export { updateItemOfAPlayerSchema };