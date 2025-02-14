const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 3000;

app.use(express.json());

// Generate mines using server seed, client seed, and nonce
function generateMines(serverSeed, clientSeed, nonce, minesCount) {
  const hash = crypto
    .createHash('sha256')
    .update(serverSeed + clientSeed + nonce)
    .digest('hex');

  const mines = new Set();
  while (mines.size < minesCount) {
    const index = parseInt(hash.slice(mines.size * 2, mines.size * 2 + 2), 16) % 25;
    mines.add(index);
  }
  return Array.from(mines);
}

// Endpoint to generate mines
app.post('/generate-mines', (req, res) => {
  const { clientSeed, minesCount } = req.body;
  const serverSeed = 'your-server-secret'; // Replace with a secure server seed
  const nonce = 0; // Increment this for each game

  const mines = generateMines(serverSeed, clientSeed, nonce, minesCount);
  res.json({ mines });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
