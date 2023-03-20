const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;

// const db = require('./app/models/connecDB');
// db();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./app/routes/user.route')(app);
require('./app/routes/devices.route')(app);
require('./app/routes/location_devices.route')(app);
require('./app/routes/marker.router')(app);

app.listen(port, () => {
    console.log(`app run at http://localhost:${port}`);
});
