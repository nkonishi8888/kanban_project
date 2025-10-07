const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save', (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'data', 'board.json'), JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.get('/load', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'board.json');
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    res.json(JSON.parse(data));
  } else {
    res.json({ todo: [], 'in-progress': [], done: [] });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
