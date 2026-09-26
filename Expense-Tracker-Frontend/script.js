const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const logoutBtn = document.getElementById("logoutBtn");
const addTransaction = document.getElementById("add-transaction");

const username = localStorage.getItem("user");
if (!username) {
  window.location.href = "login.html";
}

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

let transactions = [];
let editingId = null; // null = adding a new transaction, otherwise = id being edited

function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts
      .filter((a) => a > 0)
      .reduce((acc, item) => acc + item, 0)
      .toFixed(2);
  const expenseTotal = (
      amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.textContent = `₹${total}`;
  income.textContent = `₹${incomeTotal}`;
  expense.textContent = `₹${expenseTotal}`;
}

function addTransactionDOM(transaction) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.text}</td>
    <td class="amount ${
      transaction.amount < 0 ? "expense" : ""
  }">₹${transaction.amount.toFixed(2)}</td>
    <td>
      <button onclick="startEdit(${transaction.id})">Edit</button>
      <button onclick="removeTransaction(${transaction.id})">X</button>
    </td>
  `;
  list.appendChild(tr);
}

function startEdit(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  editingId = id;
  text.value = transaction.text;
  amount.value = transaction.amount;
  addTransaction.textContent = "Update Transaction";
}

function cancelEdit() {
  editingId = null;
  text.value = "";
  amount.value = "";
  addTransaction.textContent = "Add Transaction";
}

function removeTransaction(id) {
  fetch(`http://localhost:8080/ExpTrack/transactions/${username}/${id}`, {
    method: "DELETE",
  })
      .then(() => {
        transactions = transactions.filter((t) => t.id !== id);
        updateUI();
        if (editingId === id) cancelEdit();
      })
      .catch((err) => alert("Delete failed: " + err.message));
}

function updateUI() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
}

addTransaction.addEventListener("click", () => {
  const textValue = text.value.trim();
  const amountValue = parseFloat(amount.value);

  if (!textValue || isNaN(amountValue)) {
    alert("Please enter valid description and amount.");
    return;
  }

  if (editingId === null) {
    // ADD mode
    const transaction = {
      text: textValue,
      amount: amountValue,
      date: new Date().toISOString().split("T")[0],
    };

    fetch(`http://localhost:8080/ExpTrack/transactions/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    })
        .then((res) => res.json())
        .then((data) => {
          transactions.push(data);
          updateUI();
          text.value = "";
          amount.value = "";
        })
        .catch((err) => alert("Add failed: " + err.message));
  } else {
    // EDIT mode
    const existing = transactions.find((t) => t.id === editingId);
    const updatedTransaction = {
      text: textValue,
      amount: amountValue,
      date: existing ? existing.date : new Date().toISOString().split("T")[0],
    };

    fetch(`http://localhost:8080/ExpTrack/transactions/${username}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTransaction),
    })
        .then((res) => res.json())
        .then((data) => {
          transactions = transactions.map((t) => (t.id === data.id ? data : t));
          updateUI();
          cancelEdit();
        })
        .catch((err) => alert("Update failed: " + err.message));
  }
});

function init() {
  fetch(`http://localhost:8080/ExpTrack/transactions/${username}`)
      .then((res) => res.json())
      .then((data) => {
        transactions = data;
        updateUI();
      })
      .catch((err) => alert("Fetch failed: " + err.message));
}

init();