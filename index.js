const express = require('express');
const app = express();
const port = 3000;
const jwt = require('jsonwebtoken');
const pool = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const morganConfig = require('./config/morganconfig');



app.set('trust proxy', true)
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morganConfig);
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static('uploads'));
//import routes
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const craftsmanRoutes = require('./routes/craftsmanroutes');
const servicesRoutes = require('./routes/servicesRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

//use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/craftsmen', craftsmanRoutes);
app.use('/api/', servicesRoutes);
app.use('/api/', reservationRoutes);

//use the upload file as static

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});