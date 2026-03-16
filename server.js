const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3000;
let xmrigProcess = null;
let miningOutput = '';

// Middleware to parse JSON requests
app.use(express.json());

// Start mining
app.post('/start', (req, res) => {
    if (xmrigProcess) {
        return res.status(400).send('Mining already in progress.');
    }
    xmrigProcess = spawn('xmrig', ['--config', 'config.json']);

    xmrigProcess.stdout.on('data', (data) => {
        miningOutput += data.toString();
    });

    xmrigProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    xmrigProcess.on('close', (code) => {
        console.log(`XMRig process exited with code ${code}`);
        xmrigProcess = null;
    });
    res.send('Mining started.');
});

// Stop mining
app.post('/stop', (req, res) => {
    if (!xmrigProcess) {
        return res.status(400).send('No mining process running.');
    }
    xmrigProcess.kill();
    xmrigProcess = null;
    res.send('Mining stopped.');
});

// Get real-time statistics
app.get('/stats', (req, res) => {
    if (!miningOutput) {
        return res.status(204).send('No data available.');
    }
    res.send(miningOutput);
    miningOutput = ''; // Reset after sending
});

// Monitor CPU usage
setInterval(() => {
    const cpuUsage = process.cpuUsage();
    console.log(`CPU Usage: User ${cpuUsage.user}, System ${cpuUsage.system}`);
}, 5000);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});