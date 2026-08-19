const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const crypto = require('crypto');

dotenv.config();
const app = express();
app.use(express.json());

let accessToken = '';
let instanceUrl = '';
let codeVerifier = ''; // PKCE verifier

// 🌐 Root route
app.get("/", (req, res) => {
  res.send(`
    <h2>Salesforce CRUD App</h2>
    <p><a href="/login">Login to Salesforce</a></p>
  `);
});

// 🔑 Salesforce OAuth2 Login with PKCE
app.get('/login', (req, res) => {
  // Generate code verifier + challenge
  codeVerifier = crypto.randomBytes(32).toString('hex');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const loginUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

  res.redirect(loginUrl);
});

// 🔑 Salesforce OAuth2 Callback with PKCE
app.get('/callback', async (req, res) => {
  try {
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code_verifier: codeVerifier   // 🔑 PKCE verifier
      }
    });
    accessToken = response.data.access_token;
    instanceUrl = response.data.instance_url;
    res.send('Salesforce authentication successful!');
  } catch (error) {
    res.status(400).json({ error: 'Authentication failed', details: error.response?.data || error.message });
  }
});

// =======================
// 📡 Accounts CRUD Routes
// =======================

app.get('/accounts', async (req, res) => {
  try {
    const response = await axios.get(
      `${instanceUrl}/services/data/v57.0/query/?q=SELECT Id, Name FROM Account`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json(response.data.records);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch accounts', details: error.response?.data || error.message });
  }
});

app.post('/accounts', async (req, res) => {
  try {
    const response = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Account/`,
      { Name: req.body.Name },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Account creation failed', details: error.response?.data || error.message });
  }
});

app.put('/accounts/:id', async (req, res) => {
  try {
    await axios.patch(
      `${instanceUrl}/services/data/v57.0/sobjects/Account/${req.params.id}`,
      { Name: req.body.Name },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.send(`Account ${req.params.id} updated successfully`);
  } catch (error) {
    res.status(400).json({ error: 'Account update failed', details: error.response?.data || error.message });
  }
});

app.delete('/accounts/:id', async (req, res) => {
  try {
    await axios.delete(
      `${instanceUrl}/services/data/v57.0/sobjects/Account/${req.params.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.send(`Account ${req.params.id} deleted successfully`);
  } catch (error) {
    res.status(400).json({ error: 'Account deletion failed', details: error.response?.data || error.message });
  }
});

// =======================
// 📡 Contacts CRUD Routes
// =======================

app.get('/contacts', async (req, res) => {
  try {
    const response = await axios.get(
      `${instanceUrl}/services/data/v57.0/query/?q=SELECT Id, FirstName, LastName, Email, Phone FROM Contact`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.json(response.data.records);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch contacts', details: error.response?.data || error.message });
  }
});

app.post('/contacts', async (req, res) => {
  try {
    const response = await axios.post(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact/`,
      { LastName: req.body.LastName, FirstName: req.body.FirstName, Email: req.body.Email, Phone: req.body.Phone },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Contact creation failed', details: error.response?.data || error.message });
  }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    await axios.patch(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact/${req.params.id}`,
      { LastName: req.body.LastName, FirstName: req.body.FirstName, Email: req.body.Email, Phone: req.body.Phone },
      { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
    );
    res.send(`Contact ${req.params.id} updated successfully`);
  } catch (error) {
    res.status(400).json({ error: 'Contact update failed', details: error.response?.data || error.message });
  }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    await axios.delete(
      `${instanceUrl}/services/data/v57.0/sobjects/Contact/${req.params.id}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    res.send(`Contact ${req.params.id} deleted successfully`);
  } catch (error) {
    res.status(400).json({ error: 'Contact deletion failed', details: error.response?.data || error.message });
  }
});

// =======================
// 🚀 Start Server
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
