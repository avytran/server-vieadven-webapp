export interface Mission {
    mission_id: string;
    title: string;
    description?: string;
    item_id: number;
    item_quantity: number;
    target: number;
    target_type: "correct_answer" | "play_landmark";
    is_active: boolean;
    created_at?: Date;
    updated_at?: Date;
}