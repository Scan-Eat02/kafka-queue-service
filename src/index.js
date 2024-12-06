const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 8084;

// Import the routes from the router directory
const router = require('./routes');

app.use(cors());

// Use the routes for all paths
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
