import express from 'express';
import { ChatbotController } from '../controller/chatbot.controller';

const router = express.Router();
const chatbotController = new ChatbotController();

router.post('/chatbot', (req, res) => chatbotController.handleChatbotRequest(req, res));

export default router;