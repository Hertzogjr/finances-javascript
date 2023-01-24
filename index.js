const tableBody = document.querySelector("tbody");
const expensesCard = document.querySelector("#expense-card");
const incomesCard = document.querySelector("#income-card");
const saldosCard = document.querySelector("#saldo-card");


let transactions = [];
transactions = [
  {
    description: "card",
    value: 2000,
    type: "income",
  },
  {
    description: "mcdonalds",
    value: 20,
    type: "expense",
  },
  {
    description: "pao",
    value: 20,
    type: "expense",
  },
  {
    description: "açucar",
    value: 300.05,
    type: "expense",
  },
];

const setItemsDb = () =>
  localStorage.setItem("transactions", JSON.stringify(transactions));
const getItemsDb = () => JSON.parse(localStorage.getItem("transactions")) ?? [];

const getTotals = () => {

  const amountIncomes = () => getItemsDb().filter(({ type }) => type === "income")
  const totalIncomes = () => amountIncomes().reduce((acc, { value }) => acc + value ,0)
  
  const amountExpenses = () =>
    getItemsDb().filter(({ type }) => type === "expense");

  const totalExpenses = () => amountExpenses().reduce((acc, {value}) => acc + value, 0)

  console.log(typeof totalIncomes)
  const saldo = (totalIncomes() - totalExpenses())
  console.log(totalIncomes())
  console.log(totalExpenses())


  incomesCard.innerHTML = `R$ ${totalIncomes()}`
  expensesCard.innerHTML = `R$ ${totalExpenses()}`
  saldosCard.innerHTML = `R$ ${saldo}`
}

getTotals()



setItemsDb();

const renderItems = () => {
  getItemsDb().forEach(({ description, value, type }) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${description}</td>
        <td>${value}</td>
        <td>${
          type === "income"
            ? '<i class="fa-solid fa-arrow-up"></i>'
            : '<i class="fa-solid fa-arrow-down"></i>'
        }</td>
        <td><i class="fa-solid fa-trash"></i></td>       
    `;

    tableBody.appendChild(tr);
  });
};

renderItems();
