import express from 'express';

import healthRoute from './routes/health.route';
import provinceProgressRoute from './routes/provinceProgress.route';
import { updateProvinceProgressSchema } from './entities/provinceProgress.entity';
import validate from './middlewares/validate.mdw'

const app = express();

app.use(express.json());

app.use('/health', healthRoute);
app.use('/province-progress', validate(updateProvinceProgressSchema), provinceProgressRoute)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});