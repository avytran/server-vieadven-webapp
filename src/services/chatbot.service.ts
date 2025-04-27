import { getChatbotResponse } from '../chatbot/main';

export class ChatbotService {
    async getResponse(message: string): Promise<string> {
        try {
            return await getChatbotResponse(message);
        } catch (error) {
            console.error('Error in ChatbotService:', error);
            throw new Error('Failed to get chatbot response');
        }
    }
}