// Handle dropdown change → load records dynamically
document.getElementById('objectDropdown').addEventListener('change', async (e) => {
  const object = e.target.value;
  loadRecords(object);
});

// Function to load records from backend
async function loadRecords(object) {
  try {
    let url = `/${object}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load ${object}`);
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
        updateBtn.className = 'btn btn-success btn-sm';
        updateBtn.onclick = () => updateRecord(object, record.Id, record);
        tr.appendChild(updateBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-danger btn-sm ms-2';
        deleteBtn.onclick = () => deleteRecord(object, record.Id);
        tr.appendChild(deleteBtn);

        body.appendChild(tr);
      });
    }
  } catch (err) {
    alert(err.message);
  }
}

// Update record (multiple fields for contacts)
async function updateRecord(object, id, record) {
  try {
    if (object === "contacts") {
      const newFirstName = prompt("Enter new First Name", record.FirstName);
      const newLastName = prompt("Enter new Last Name", record.LastName);
      const newEmail = prompt("Enter new Email", record.Email);
      const newPhone = prompt("Enter new Phone", record.Phone);

      if (!newFirstName || !newLastName || !newEmail || !newPhone) {
        alert("All fields are required");
        return;
      }
      if (!newEmail.includes("@")) {
        alert("Invalid email format");
        return;
      }
      if (isNaN(newPhone)) {
        alert("Phone must be numeric");
        return;
      }

      const res = await fetch(`/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FirstName: newFirstName,
          LastName: newLastName,
          Email: newEmail,
          Phone: newPhone
        })
      });
      if (!res.ok) throw new Error("Failed to update contact");
    } else if (object === "accounts") {
      const newName = prompt("Enter new Account Name", record.Name);
      if (!newName || !newName.trim()) {
        alert("Account Name is required");
        return;
      }
      const res = await fetch(`/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Name: newName })
      });
      if (!res.ok) throw new Error("Failed to update account");
    }
    loadRecords(object);
  } catch (err) {
    alert(err.message);
  }
}

// Delete record
async function deleteRecord(object, id) {
  if (!confirm(`Are you sure you want to delete ${object} record ${id}?`)) return;

  try {
    const res = await fetch(`/${object}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error("Failed to delete record");
    loadRecords(object);
  } catch (err) {
    alert(err.message);
  }
}

// Create Account form submission
document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('accountName').value;

  if (!name.trim()) {
    alert("Account Name is required");
    return;
  }

  try {
    const res = await fetch('/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Name: name })
    });
    if (!res.ok) throw new Error("Failed to create account");
    loadRecords('accounts');
  } catch (err) {
    alert(err.message);
  }
});

// Create Contact form submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const lastName = document.getElementById('lastName').value;
  const firstName = document.getElementById('firstName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;

  if (!lastName.trim() || !firstName.trim()) {
    alert("First and Last Name are required");
    return;
  }
  if (!email.includes("@")) {
    alert("Invalid email format");
    return;
  }
  if (isNaN(phone)) {
    alert("Phone must be numeric");
    return;
  }

  try {
    const res = await fetch('/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        LastName: lastName,
        FirstName: firstName,
        Email: email,
        Phone: phone
      })
    });
    if (!res.ok) throw new Error("Failed to create contact");
    loadRecords('contacts');
  } catch (err) {
    alert(err.message);
  }
});

// Initial load → show Accounts by default
loadRecords('accounts');
