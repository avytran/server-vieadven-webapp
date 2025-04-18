import express from 'express';
import playerItemRoute from './routes/playerItem.route';
import healthRoute from './routes/health.route';


const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use("/player-item", playerItemRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});