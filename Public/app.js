// Load records dynamically
document.getElementById('objectDropdown').addEventListener('change', async (e) => {
  const object = e.target.value;
  loadRecords(object);
});

async function loadRecords(object) {
  let url = `/${object}`;
  const res = await fetch(url);
  const data = await res.json();

  const headerRow = document.getElementById('tableHeader');
  const body = document.getElementById('tableBody');
  headerRow.innerHTML = '';
  body.innerHTML = '';

  if (data.length > 0) {
    // Build headers dynamically
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });

    // Build rows
    data.forEach(record => {
      const tr = document.createElement('tr');
      Object.values(record).forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  }
}

// Create Account
document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('accountName').value;
  await fetch('/accounts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: name })
  });
  loadRecords('accounts');
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
  loadRecords('contacts');
});

// Initial load
loadRecords('accounts');
