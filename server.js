const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app');

// SET CONFIG ENV PATH
dotenv.config({ path: './config.env' });

// CONNECT MONGODB
(async () => {
    const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
    const con = await mongoose.connect(db);

    console.log(`MongoDB connected on: ${con.connection.host}`);
})();

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on: http://localhost:${port}`));

/*
TEST ACCOUNT FOR LOGIN
username: ramdanaguss16
password: 1111
*/
