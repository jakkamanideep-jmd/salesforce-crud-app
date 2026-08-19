// Create Account
document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('accountName').value;
  await fetch('/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name })
  });
  loadAccounts();
});

// Create Contact
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const lastName = document.getElementById('lastName').value;
  const firstName = document.getElementById('firstName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  await fetch('/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ LastName: lastName, FirstName: firstName, Email: email, Phone: phone })
  });
  loadContacts();
});

// Load Accounts
async function loadAccounts() {
  const res = await fetch('/accounts');
  const accounts = await res.json();
  const list = document.getElementById('accountsList');
  list.innerHTML = accounts.map(acc => `<li>${acc.Name} (ID: ${acc.Id})</li>`).join('');
}

// Load Contacts
async function loadContacts() {
  const res = await fetch('/contacts');
  const contacts = await res.json();
  const list = document.getElementById('contactsList');
  list.innerHTML = contacts.map(c => `<li>${c.LastName}, ${c.FirstName} - ${c.Email}</li>`).join('');
}

// Initial load
loadAccounts();
loadContacts();
