// index.js
const express = require('express');
const fs = require('fs');
const { Worker } = require('worker_threads');

const app = express();
const PORT = 3000;

// 🔹 Blocking example
app.get('/blocking', (req, res) => {
  // Simulate blocking with a large file read
  try {
    const data = fs.readFileSync(__filename, 'utf-8'); // Blocking
    res.send("Blocking task finished. File size: " + data.length + " chars");
  } catch (err) {
    res.status(500).send("Error in blocking operation");
  }
});

// 🔹 Non-blocking example
app.get('/non-blocking', (req, res) => {
  // Simulate async task (file read)
  fs.readFile(__filename, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).send("Error in non-blocking operation");
    } else {
      res.send("Non-blocking task finished. File size: " + data.length + " chars");
    }
  });
});

// 🔹 Parallelism with Worker Thread
app.get('/worker', (req, res) => {
  const worker = new Worker(`
    const { parentPort } = require('worker_threads');
    // Simulate heavy computation
    let sum = 0;
    for (let i = 0; i < 1e8; i++) sum += i;
    parentPort.postMessage(sum);
  `, { eval: true });

  worker.on('message', (sum) => {
    res.send("Worker thread finished. Sum: " + sum);
  });

  worker.on('error', (err) => {
    res.status(500).send("Worker error: " + err);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
