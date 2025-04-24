export interface dailyMission{
    user_id: string,
    mission_id: string,
    progress: number,
    is_completed: boolean,
    last_update: string,
    claimed: boolean
}