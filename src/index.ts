import express from 'express';
import healthRoute from './routes/health.route';
import missionRoute from "./routes/mission.route";

const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use("/missions", missionRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});