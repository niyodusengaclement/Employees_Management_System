import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import fileupload from 'express-fileupload';
import env from 'dotenv';
import compression from 'compression';
import routes from './routes/index';

env.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(fileupload({
  createParentPath: true,
  useTempFiles: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port} `);
});

export default app;
