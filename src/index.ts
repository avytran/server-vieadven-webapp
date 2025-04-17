import express from 'express';

import healthRoute from './routes/health.route';
import leaderboardRoute from './routes/leaderboard.route'

const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use('/leaderboards', leaderboardRoute)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});