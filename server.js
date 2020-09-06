const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNHADLED REJECTION 🔥 SHUTTING DOWN ...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log('Database successfully connected ! ', process.env.NODE_ENV)
  );

// 1) SERVER

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App is running in port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHADLED REJECTION 🔥  SHUTTING DOWN ...');
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
