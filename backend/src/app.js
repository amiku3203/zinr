const express= require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

 
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);


 
app.use(morgan('dev'));

 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

 
app.use('/api/v1', routes);

 
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

 
app.use(errorMiddleware);

module.exports = app;
