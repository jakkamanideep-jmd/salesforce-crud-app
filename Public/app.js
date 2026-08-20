// Handle dropdown change → load records dynamically
document.getElementById('objectDropdown').addEventListener('change', async (e) => {
  const object = e.target.value;
  loadRecords(object);
});

// Function to load records from backend
async function loadRecords(object) {
  let url = `/${object}`;
  const res = await fetch(url);
  const data = await res.json();

  const headerRow = document.getElementById('tableHeader');
  const body = document.getElementById('tableBody');
  headerRow.innerHTML = '';
  body.innerHTML = '';

  if (data.length > 0) {
    // Build table headers dynamically
    Object.keys(data[0]).forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      headerRow.appendChild(th);
    });

    // Extra headers for actions
    const thUpdate = document.createElement('th');
    thUpdate.textContent = 'Update';
    headerRow.appendChild(thUpdate);

    const thDelete = document.createElement('th');
    thDelete.textContent = 'Delete';
    headerRow.appendChild(thDelete);

    // Build table rows dynamically
    data.forEach(record => {
      const tr = document.createElement('tr');
      Object.values(record).forEach(val => {
        const td = document.createElement('td');
        td.textContent = val;
        tr.appendChild(td);
      });

      // Update button
      const updateBtn = document.createElement('button');
      updateBtn.textContent = 'Update';
      updateBtn.onclick = () => updateRecord(object, record.Id);
      tr.appendChild(updateBtn);

      // Delete button
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.onclick = () => deleteRecord(object, record.Id);
      tr.appendChild(deleteBtn);

      body.appendChild(tr);
    });
  }
}

// Update record
async function updateRecord(object, id) {
  const newValue = prompt(`Enter new value for ${object} record ${id}`);
  if (!newValue) return;

  await fetch(`/${object}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Name: newValue }) // adjust fields per object
  });

  loadRecords(object);
}

// Delete record
async function deleteRecord(object, id) {
  if (!confirm(`Are you sure you want to delete ${object} record ${id}?`)) return;

  await fetch(`/${object}/${id}`, {
    method: 'DELETE'
  });

  loadRecords(object);
}

// Create Account form submission
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

// Create Contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const lastName = document.getElementById('lastName').value;
  const firstName = document.getElementById('firstName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  await fetch('/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      LastName: lastName,
      FirstName: firstName,
      Email: email,
      Phone: phone
    })
  });

  loadRecords('contacts');
});

// Initial load → show Accounts by default
loadRecords('accounts');
