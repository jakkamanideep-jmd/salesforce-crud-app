const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

let accessToken = '';
let instanceUrl = '';

// 🔑 Salesforce OAuth2 Login
app.get('/login', (req, res) => {
  const loginUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}`;
  res.redirect(loginUrl);
});

// 🔑 Salesforce OAuth2 Callback
app.get('/callback', async (req, res) => {
  try {
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI
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

// READ Accounts
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

// CREATE Account
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

// UPDATE Account
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

// DELETE Account
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




// READ Contacts
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

// CREATE Contact
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

// UPDATE Contact
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

// DELETE Contact
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
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
