import express from 'express';
import healthRoute from './routes/health.route';
import missionRoute from "./routes/mission.route";
import cors from 'cors';

import itemRoute from './routes/item.route';
import playerDailyMissionRoute from './routes/playerDailyMission.route';
import provinceProgressRoute from './routes/provinceProgress.route';
import leaderboardRoute from './routes/leaderboard.route';
import playerItemRoute from './routes/playerItem.route';
import questionAnswerRoute from './routes/questionAnswer.route';
import landmarkRoute from './routes/landmark.route';
import provinceRoute from './routes/province.route';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/health', healthRoute);
app.use("/missions", missionRoute);
app.use("/player-item", playerItemRoute);
app.use('/items', itemRoute);
app.use('/player-dailymissions', playerDailyMissionRoute);
app.use('/province-progress', provinceProgressRoute)
app.use('/leaderboards', leaderboardRoute)
app.use('/question-answer', questionAnswerRoute)
app.use('/landmarks', landmarkRoute);
app.use('/provinces', provinceRoute)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});