const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('Public'));

// ---------------- In-memory data ----------------
let accounts = [
  { Id: '0011', Name: 'Test Account 1' },
  { Id: '0012', Name: 'Test Account 2' }
];

let contacts = [
  { Id: '0031', LastName: 'Doe', FirstName: 'John', Email: 'john@example.com', Phone: '1234567890' },
  { Id: '0032', LastName: 'Smith', FirstName: 'Jane', Email: 'jane@example.com', Phone: '9876543210' }
];

let opportunities = [
  { Id: '0041', Name: 'Opportunity A', Stage: 'Prospecting', Amount: 5000 },
  { Id: '0042', Name: 'Opportunity B', Stage: 'Closed Won', Amount: 12000 }
];

let leads = [
  { Id: '0051', LastName: 'Brown', FirstName: 'Charlie', Company: 'Acme Corp', Status: 'Open' },
  { Id: '0052', LastName: 'Taylor', FirstName: 'Anna', Company: 'Globex', Status: 'Working' }
];

let cases = [
  { Id: '0061', Subject: 'Login Issue', Status: 'New', Priority: 'High' },
  { Id: '0062', Subject: 'Payment Error', Status: 'Closed', Priority: 'Medium' }
];

// ---------------- Accounts CRUD ----------------
app.get('/accounts', (req, res) => res.json(accounts));
app.post('/accounts', (req, res) => {
  const newAcc = { Id: Date.now().toString(), Name: req.body.Name };
  accounts.push(newAcc);
  res.json(newAcc);
});
app.put('/accounts/:id', (req, res) => {
  const acc = accounts.find(a => a.Id === req.params.id);
  if (acc) { acc.Name = req.body.Name; res.json(acc); }
  else res.status(404).json({ error: 'Account not found' });
});
app.delete('/accounts/:id', (req, res) => {
  accounts = accounts.filter(a => a.Id !== req.params.id);
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
  const con = contacts.find(c => c.Id === req.params.id);
  if (con) { Object.assign(con, req.body); res.json(con); }
  else res.status(404).json({ error: 'Contact not found' });
});
app.delete('/contacts/:id', (req, res) => {
  contacts = contacts.filter(c => c.Id !== req.params.id);
  res.json({ success: true });
});

// ---------------- Opportunities CRUD ----------------
app.get('/opportunities', (req, res) => res.json(opportunities));
app.post('/opportunities', (req, res) => {
  const newOpp = { Id: Date.now().toString(), ...req.body };
  opportunities.push(newOpp);
  res.json(newOpp);
});
app.put('/opportunities/:id', (req, res) => {
  const opp = opportunities.find(o => o.Id === req.params.id);
  if (opp) { Object.assign(opp, req.body); res.json(opp); }
  else res.status(404).json({ error: 'Opportunity not found' });
});
app.delete('/opportunities/:id', (req, res) => {
  opportunities = opportunities.filter(o => o.Id !== req.params.id);
  res.json({ success: true });
});

// ---------------- Leads CRUD ----------------
app.get('/leads', (req, res) => res.json(leads));
app.post('/leads', (req, res) => {
  const newLead = { Id: Date.now().toString(), ...req.body };
  leads.push(newLead);
  res.json(newLead);
});
app.put('/leads/:id', (req, res) => {
  const lead = leads.find(l => l.Id === req.params.id);
  if (lead) { Object.assign(lead, req.body); res.json(lead); }
  else res.status(404).json({ error: 'Lead not found' });
});
app.delete('/leads/:id', (req, res) => {
  leads = leads.filter(l => l.Id !== req.params.id);
  res.json({ success: true });
});

// ---------------- Cases CRUD ----------------
app.get('/cases', (req, res) => res.json(cases));
app.post('/cases', (req, res) => {
  const newCase = { Id: Date.now().toString(), ...req.body };
  cases.push(newCase);
  res.json(newCase);
});
app.put('/cases/:id', (req, res) => {
  const cs = cases.find(c => c.Id === req.params.id);
  if (cs) { Object.assign(cs, req.body); res.json(cs); }
  else res.status(404).json({ error: 'Case not found' });
});
app.delete('/cases/:id', (req, res) => {
  cases = cases.filter(c => c.Id !== req.params.id);
  res.json({ success: true });
});

// ---------------- Default route ----------------
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

// ---------------- Start server ----------------
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
