const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('Public'));

// In-memory data
let accounts = [
  { Id: '0011', Name: 'Test Account 1' },
  { Id: '0012', Name: 'Test Account 2' }
];

let contacts = [
  { Id: '0031', LastName: 'Doe', FirstName: 'John', Email: 'john@example.com', Phone: '1234567890' },
  { Id: '0032', LastName: 'Smith', FirstName: 'Jane', Email: 'jane@example.com', Phone: '9876543210' }
];

// ---------------- Accounts CRUD ----------------
app.get('/accounts', (req, res) => res.json(accounts));

app.post('/accounts', (req, res) => {
  const newAcc = { Id: Date.now().toString(), Name: req.body.Name };
  accounts.push(newAcc);
  res.json(newAcc);
});

app.put('/accounts/:id', (req, res) => {
  const { id } = req.params;
  const acc = accounts.find(a => a.Id === id);
  if (acc) {
    acc.Name = req.body.Name;
    res.json(acc);
  } else {
    res.status(404).json({ error: 'Account not found' });
  }
});

app.delete('/accounts/:id', (req, res) => {
  const { id } = req.params;
  accounts = accounts.filter(a => a.Id !== id);
  res.json({ success: true });
});

// ---------------- Contacts CRUD ----------------
app.get('/contacts', (req, res) => res.json(contacts));

app.post('/contacts', (req, res) => {
  const newCon = { Id: Date.now().toString(), ...req.body };
  contacts.push(newCon);
  res.json(newCon);
});

app.put('/contacts/:id', (req, res) => {
  const { id } = req.params;
  const con = contacts.find(c => c.Id === id);
  if (con) {
    Object.assign(con, req.body);
    res.json(con);
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
});

app.delete('/contacts/:id', (req, res) => {
  const { id } = req.params;
  contacts = contacts.filter(c => c.Id !== id);
  res.json({ success: true });
});

// ---------------- Default route ----------------
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

// ---------------- Start server ----------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
