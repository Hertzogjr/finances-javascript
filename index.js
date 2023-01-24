const tableBody = document.querySelector("tbody");
const descriptionInput = document.querySelector("#descriptionInput");
const valueInput = document.querySelector("#valueInput");
const typeInput = document.querySelector("#typeInput");
const include = document.querySelector("#include");

const expensesCard = document.querySelector("#expense-card");
const incomesCard = document.querySelector("#income-card");
const balanceCard = document.querySelector("#balance-card");
const body = document.querySelector("body");

addEventListener("load", () => descriptionInput.focus());
include.addEventListener("click", () => addTransaction());

let transactions = [];

function addTransaction() {
  if (
    descriptionInput.value.trim() === "" ||
    valueInput.value === "" ||
    typeInput.value === ""
  )
    return alert("Fill all inputs");

  const descriptionOutSpaces = descriptionInput.value.trim();
  const descriptionFormatted =
    descriptionOutSpaces.split("")[0].toUpperCase() +
    descriptionOutSpaces.substring(1);

  const pureValue = valueInput.value
    .replace("R$", "")
    .replace(".", "")
    .replace(",", ".");

  const id = transactions[transactions.length - 1]?.id + 1 || 1;
  const description = descriptionFormatted;
  const value = pureValue;
  const type = typeInput.value;

  const newTransactions = {
    id,
    description,
    value,
    type,
  };

  transactions.push(newTransactions);

  setItemsDb();
  loadItems();

  descriptionInput.value = "";
  valueInput.value = "";
}

const getTotals = () => {
  const amountIncomes = () =>
    getItemsDb().filter(({ type }) => type === "income");
  const totalIncomes = () =>
    amountIncomes().reduce((acc, { value }) => acc + Number(value), 0);

  const amountExpenses = () =>
    getItemsDb().filter(({ type }) => type === "expense");
  const totalExpenses = () =>
    amountExpenses().reduce((acc, { value }) => acc + Number(value), 0);

  const balance = totalIncomes() - totalExpenses();

  incomesCard.innerHTML = `${formatBrazilianCurrency(totalIncomes())}`;
  expensesCard.innerHTML = `${formatBrazilianCurrency(totalExpenses())}`;
  balanceCard.innerHTML = `${formatBrazilianCurrency(balance)}`;
};

const deleItemsDb = (index) => {
  transactions.splice(index, 1);
  setItemsDb();
  getItemsDb();
  loadItems();
};

const renderItems = ({ description, value, type }, index) => {
  const tr = document.createElement("tr");
  tr.innerHTML = `  
      <td>${description}</td>
      <td>${formatBrazilianCurrency(Number(value))}</td>
      <td>${
        type === "income"
          ? '<i class="fa-solid fa-arrow-up"></i>'
          : '<i class="fa-solid fa-arrow-down"></i>'
      }</td>
      <td><i class="fa-solid fa-trash" id="${index}" onClick=deleItemsDb(id)></i></td>       
  `;
  tableBody.appendChild(tr);
};

const formatBrazilianCurrency = (string) => {
  return string.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });
};

function inputCurrencyMask(event) {
  const onlyDigits = event.target.value
    .split("")
    .filter((s) => /\d/.test(s))
    .join("")
    .padStart(3, "0");
  const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
  event.target.value = maskCurrency(digitsFloat);
}

function maskCurrency(valor, locale = "pt-BR", currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(valor);
}

const loadItems = () => {
  transactions = getItemsDb();
  tableBody.innerHTML = "";
  transactions.forEach((transaction, index) => {
    renderItems(transaction, index);
  });
  getTotals();
};

function setItemsDb() {
  return localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getItemsDb() {
  return JSON.parse(localStorage.getItem("transactions")) ?? [];
}

loadItems();
