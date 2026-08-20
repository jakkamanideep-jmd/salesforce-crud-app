const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from Public folder
app.use(express.static('Public'));

// Accounts
app.get('/accounts', async (req, res) => {
  res.json([
    { Id: '0011', Name: 'Test Account 1' },
    { Id: '0012', Name: 'Test Account 2' }
  ]);
});

app.post('/accounts', async (req, res) => {
  const { Name } = req.body;
  res.json({ success: true, Name });
});

app.put('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  const { Name } = req.body;
  res.json({ success: true, id, updatedName: Name });
});

app.delete('/accounts/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ success: true, id });
});

// Contacts
app.get('/contacts', async (req, res) => {
  res.json([
    { Id: '0031', LastName: 'Doe', FirstName: 'John', Email: 'john@example.com' },
    { Id: '0032', LastName: 'Smith', FirstName: 'Jane', Email: 'jane@example.com' }
  ]);
});

app.post('/contacts', async (req, res) => {
  const { LastName, FirstName, Email, Phone } = req.body;
  res.json({ success: true, LastName, FirstName, Email, Phone });
});

app.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { LastName, FirstName, Email, Phone } = req.body;
  res.json({ success: true, id, LastName, FirstName, Email, Phone });
});

app.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ success: true, id });
});

// Default route → serve index.html automatically
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
