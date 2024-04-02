// server.js
const express = require('express');
const path = require('path');
const app = express();
const ws = require('ws');

const wsServer = new ws.Server({ noServer: true });

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist/darts-scoreboard')));

// Serve the Angular app for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/darts-scoreboard', 'index.html'));
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Node Express server listening on port ${port}`);
});

const Gpio = require('onoff').Gpio;
const button = new Gpio(16, 'in', 'both'); // GPIO pin 16

button.watch((err, value) => {
    if (err) throw err;
    console.log(`Button state changed: ${value}`);
    // Handle the button press or release here
});