const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const logRoutes = require('./routes/log');

dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(cors());
app.use(bodyParser.json());

app.use('/log', logRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
