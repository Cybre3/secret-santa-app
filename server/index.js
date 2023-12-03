require('dotenv').config();
const Winston = require('winston');

const app = require('express')();

require('./startup/logging')(app);
require('./startup/cors')(app);
require('./startup/apiValidation')();
require('./startup/routes-middlesware')(app);
require('./startup/config')();
require('./startup/db')(app);
require('./startup/prod')(app);

const port = process.env.PORT || 5000;
app.listen(port, () => Winston.info(`Listening on port ${port}...`))