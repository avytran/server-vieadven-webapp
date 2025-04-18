import express from 'express';
import feedbackRoute from "./routes/feedback.route";
import healthRoute from './routes/health.route';


const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use("/feedback", feedbackRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});