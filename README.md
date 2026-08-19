# Salesforce CRUD App

A simple Node.js + Express application that connects to Salesforce using **jsforce** and demonstrates basic **CRUD operations** (Create, Read, Update, Delete) for Accounts and Contacts.

---

## 🚀 Features
- Create new Accounts
- List Accounts
- Create new Contacts linked to Accounts
- Simple front‑end forms (`index.html` in Public folder)
- REST API endpoints for Accounts and Contacts

---

## 📂 Project Structure
salesforce-crud-app/
│
├── public/
│   ├── index.html
│   └── app.js
├── server.js
├── package.json
├── .env.example
└── README.md

---

## ⚙️ Setup Instructions
1. Clone the repo:
   ```bash
   git clone https://github.com/jakkamanideep-jmd/salesforce-crud-app-.git
   cd salesforce-crud-app-
2. Install dependencies
npm install
3. Create a .env file with your Salesforce credentials:
SF_USERNAME=your_salesforce_username
SF_PASSWORD=your_salesforce_password
SF_TOKEN=your_salesforce_security_token
4. Run the app locally:
node server.js
5. Open http://localhost:3000 in your browser.