import express from 'express';
import chatbotRoute from './routes/chatbot.route';
import healthRoute from './routes/health.route';
import dotenv from 'dotenv';

dotenv.config();


const app = express();

app.use(express.json());
app.use('/', chatbotRoute);

app.use('/health', healthRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});