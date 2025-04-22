import express from 'express';

import healthRoute from './routes/health.route';
import itemRoute from './routes/item.route';
import playerDailyMissionRoute from './routes/playerDailyMission.route';

const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use('/items', itemRoute);
app.use('/player-missions', playerDailyMissionRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});