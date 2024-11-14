const express = require('express');
const app = express();
const port = 5001;

// Import the routes from the router directory
const router = require('./routes');

// Use the routes for all paths
app.use('/', router);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
