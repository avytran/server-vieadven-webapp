import { Request, Response } from 'express';
import { ChatbotService } from '../services/chatbot.service';

const chatbotService = new ChatbotService();

export class ChatbotController {
    async handleChatbotRequest(req: Request, res: Response): Promise<void> {
        const { message } = req.body;

        if (!message) {
            res.status(400).json({ error: 'Message is required' });
            return;
        }

        try {
            const response = await chatbotService.getResponse(message);
            res.json({ response });
        } catch (error) {
            console.error('Error in ChatbotController:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}