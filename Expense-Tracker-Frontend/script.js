const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("list");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const categoryFilter = document.getElementById("category-filter");
const logoutBtn = document.getElementById("logoutBtn");
const addTransaction = document.getElementById("add-transaction");
const typeIncomeBtn = document.getElementById("type-income");
const typeExpenseBtn = document.getElementById("type-expense");

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
let selectedType = "income"; // "income" or "expense" — controls the sign of the amount

// ---------- Income / Expense toggle ----------
function setType(type) {
    selectedType = type;
    typeIncomeBtn.classList.toggle("active", type === "income");
    typeExpenseBtn.classList.toggle("active", type === "expense");
}

typeIncomeBtn.addEventListener("click", () => setType("income"));
typeExpenseBtn.addEventListener("click", () => setType("expense"));

// ---------- Totals ----------
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

// ---------- Render rows ----------
function addTransactionDOM(transaction) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${transaction.date}</td>
    <td>${transaction.text}</td>
    <td>${transaction.category || "Other"}</td>
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

function updateUI() {
    list.innerHTML = "";

    if (transactions.length === 0) {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = `
      <td colspan="5" class="empty-state">No transactions yet — add your first one on the left!</td>
    `;
        list.appendChild(emptyRow);
    } else {
        transactions.forEach(addTransactionDOM);
    }

    updateValues();
}

// ---------- Edit flow ----------
function startEdit(id) {
    const transaction = transactions.find((t) => t.id === id);
    if (!transaction) return;

    editingId = id;
    text.value = transaction.text;
    amount.value = Math.abs(transaction.amount);
    category.value = transaction.category || "Other";
    setType(transaction.amount < 0 ? "expense" : "income");
    addTransaction.textContent = "Update Transaction";
}

function cancelEdit() {
    editingId = null;
    text.value = "";
    amount.value = "";
    category.value = "Other";
    setType("income");
    addTransaction.textContent = "Add Transaction";
}

// ---------- Delete (with confirmation) ----------
function removeTransaction(id) {
    const confirmed = confirm("Delete this transaction? This can't be undone.");
    if (!confirmed) return;

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

// ---------- Add / Update ----------
addTransaction.addEventListener("click", () => {
    const textValue = text.value.trim();
    const rawAmount = parseFloat(amount.value);

    if (!textValue || isNaN(rawAmount) || rawAmount <= 0) {
        alert("Please enter a valid description and a positive amount.");
        return;
    }

    // Apply the sign based on the selected toggle, so the user never types a negative number
    const signedAmount = selectedType === "expense" ? -Math.abs(rawAmount) : Math.abs(rawAmount);
    const categoryValue = category.value;

    if (editingId === null) {
        // ADD mode
        const transaction = {
            text: textValue,
            amount: signedAmount,
            date: new Date().toISOString().split("T")[0],
            category: categoryValue,
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
                category.value = "Other";
                setType("income");
            })
            .catch((err) => alert("Add failed: " + err.message));
    } else {
        // EDIT mode
        const existing = transactions.find((t) => t.id === editingId);
        const updatedTransaction = {
            text: textValue,
            amount: signedAmount,
            date: existing ? existing.date : new Date().toISOString().split("T")[0],
            category: categoryValue,
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

// ---------- Category filter (calls the backend filter endpoint) ----------
categoryFilter.addEventListener("change", () => {
    const selected = categoryFilter.value;

    const url =
        selected === "All"
            ? `http://localhost:8080/ExpTrack/transactions/${username}`
            : `http://localhost:8080/ExpTrack/transactions/${username}/category/${selected}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            transactions = data;
            updateUI();
        })
        .catch((err) => alert("Filter failed: " + err.message));
});

// ---------- Initial load ----------
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