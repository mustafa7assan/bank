"use strict";

class Account {
  constructor(owner, transactions, interestRate, password) {
    this.owner = owner;
    this.transactions = transactions;
    this.interestRate = interestRate;
    this.password = password;
  }
  calcBalance() {
    let balance = 0;
    this.transactions.forEach((t) => {
      balance += t;
    });
    return balance;
  }

  deposit(amount) {
    this.balance += amount;
    this.transactions.push(amount);
  }

  withdraw(amount) {
    this.balance = this.balance - amount;
    this.transactions.push(-1 * amount);
  }
}

const accounts = [
  new Account(
    "mustafa",
    [10_000, 100_000, 100_000, 400_000, -20_000, -250_000, 30_000, 100_000],
    1.5,
    1111
  ),
  new Account(
    "ali",
    [30_000, -20_000, 100_000, 40_000, -20_000, 10_000, 70_000, 5_000],
    1.0,
    2222
  ),
  new Account(
    "hassan",
    [-10_000, 100_000, 60_000, 100_000, -20_000, -3_000, 100_000, -40_000],
    0.5,
    3333
  ),
  new Account(
    "osman",
    [
      100_000, -10_000, -20_000, 100_000, 70_000, 50_000, -3_000, 100_000,
      10_000,
    ],
    0.7,
    4444
  ),
  new Account(
    "adam",
    [
      50_000, 70_000, -20_000, 400_000, 100_000, -25_000, 330_000, -100_000,
      6_000,
    ],
    0.8,
    5555
  ),
];
// Application State
let currentAccount;
let timeout;
let timerID;
// Handler

const loginHandler = function (e) {
  e.preventDefault();
  const user = e.target.querySelector("#user").value.toLowerCase();
  const password = Number(
    e.target.querySelector("#password").value.toLowerCase()
  );
  const account = accounts.find(
    (account) => account.owner === user && account.password === password
  );
  if (account) {
    e.target.classList.add("hidden");
    invalidMessage.classList.add("hidden");
    currentAccount = account;
    timeout = 600;
    displayUI();
    e.target.reset();
  } else {
    invalidMessage.classList.remove("hidden");
  }
};

const displayUI = function () {
  mainContainer.classList.remove("hidden");
  welcomeLabel.textContent = `Good Morning, ${currentAccount.owner.replace(
    currentAccount.owner[0],
    currentAccount.owner[0].toUpperCase()
  )}!`;
  timerID = setInterval(() => {
    if (timeout === 0) {
      mainContainer.classList.add("hidden");
      loginForm.classList.remove("hidden");
      clearInterval(timerID);
    }
    showTime();
    timeout--;
  }, 1000);
  showDate();
  showBalance();
  displayTransactions(currentAccount.transactions);
};

const padZero = (value) => value.toString().padStart(2, "0");

const showTime = function () {
  const minutes = Math.floor(timeout / 60);
  const seconds = timeout - minutes * 60;
  logoutLabel.textContent = `${padZero(minutes)}:${padZero(seconds)}`;
};

const showDate = function () {
  const date = new Date();
  const day = padZero(date.getDate());
  const month = padZero(date.getMonth());
  const year = date.getFullYear();
  const hours = date.getHours();
  const ampm = hours > 12 ? "PM" : "AM";
  const minutes = padZero(date.getMinutes());
  dateLabel.textContent = `As of ${day}/${month}/${year}, ${padZero(
    hours % 12
  )}:${minutes} ${ampm}`;
};

const showBalance = function () {
  balanceLabel.textContent = `$${formatMoney(currentAccount.calcBalance())}`;
};

const displayTransactions = function (transactions) {
  showBalance();
  let ins = 0,
    outs = 0,
    type;
  transactionsContainer.innerHTML = "";
  transactions.forEach((t, i) => {
    if (t > 0) {
      ins += t;
      type = "deposit";
    } else {
      outs += t;
      type = "withdraw";
    }
    const html = `<div class="transaction-card">
    <div>
      <div class="transaction-type ${type}">${i + 1} ${type.toUpperCase()}</div>
      <div class="transaction-date">Today</div>
    </div>
    <div class="transaction-amount">$ ${formatMoney(Math.abs(t))}</div>
  </div>`;
    transactionsContainer.insertAdjacentHTML("afterbegin", html);
  });
  inLabel.textContent = `$${formatMoney(ins)}`;
  outLabel.textContent = `$${formatMoney(Math.abs(outs))}`;
  interestLabel.textContent = `$${formatMoney(
    (currentAccount.calcBalance() * currentAccount.interestRate) / 100
  )}`;
};

// Add comma between every 3 digits
const formatMoney = function (amount) {
  amount = amount + "";
  const length = amount.length;
  if (length <= 3) {
    return amount;
  } else {
    let formattedAmount = "";
    let counter = 0;
    // 1000
    for (let i = length - 1; i >= 0; i--) {
      formattedAmount = amount[i] + formattedAmount;
      counter++;
      if (counter === 3 && i !== 0) {
        formattedAmount = "," + formattedAmount;
        counter = 0;
      }
    }
    return formattedAmount + ".00";
  }
};

const requestLoanHandler = function (e) {
  e.preventDefault();
  const amount = Number(e.target.querySelector("#loan-amount").value);
  setTimeout(() => {
    currentAccount.deposit(amount);
    displayTransactions(currentAccount.transactions);
  }, 1000);
  e.target.reset();
};

const transferMoneyHandler = function (e) {
  e.preventDefault();
  const transferTo = e.target.querySelector("#transfer-to").value.toLowerCase();
  const amount = Number(e.target.querySelector("#transfer-amount").value);
  const targetAccount = accounts.find(
    (account) => account.owner === transferTo
  );
  if (
    targetAccount &&
    targetAccount !== currentAccount &&
    currentAccount.calcBalance() >= amount
  ) {
    setTimeout(() => {
      transferMoney(targetAccount, amount);
    }, 1000);
    e.target.reset();
  }
};

const transferMoney = function (receiver, amount) {
  currentAccount.withdraw(amount);
  receiver.deposit(amount);
  displayTransactions(currentAccount.transactions);
};

const closeAccountHandler = function (e) {
  e.preventDefault();
  const user = e.target.querySelector("#confirm-user").value.toLowerCase();
  const password = Number(e.target.querySelector("#confirm-password").value);
  const account = accounts.find(
    (account) => account.owner === user && account.password === password
  );
  if (account === currentAccount) {
    mainContainer.classList.add("hidden");
    loginForm.classList.remove("hidden");
    currentAccount = null;
    timeout = 600;
    clearInterval(timerID);
    e.target.reset();
  }
};

const showSignupForm = function () {
  loginForm.reset();
  loginForm.classList.add("hidden");
  signupForm.classList.remove("hidden");
};
const signupHandler = function (e) {
  e.preventDefault();
  const user = e.target.querySelector("#user-s").value.toLowerCase();
  const password = +e.target.querySelector("#password-s").value;
  const passwordConfirmation = +e.target.querySelector("#con-password").value;
  const account = accounts.find(
    (account) => account.owner === user && account.password === password
  );
  if (password === passwordConfirmation && !account) {
    const newAccount = new Account(user, [], 0.7, password);
    accounts.push(newAccount);
    currentAccount = newAccount;
    e.target.reset();
    e.target.classList.add("hidden");
    displayUI();
  }
};

const sortHandler = function () {
  const transactions = currentAccount.transactions.slice();
  transactions.sort((a, b) => a - b);
  displayTransactions(transactions);
};

// Elements
const loginForm = document.querySelector(".login-form");
const requestLoanForm = document.querySelector(".request-loan-form");
const transferMoneyForm = document.querySelector(".transfer-money-form");
const closeAccountForm = document.querySelector(".close-account-form");
const signupForm = document.querySelector(".signup-form");
const welcomeLabel = document.querySelector(".welcome");
const balanceLabel = document.querySelector(".balance");
const dateLabel = document.querySelector(".current-date");
const inLabel = document.querySelector(".in");
const outLabel = document.querySelector(".out");
const interestLabel = document.querySelector(".interest");
const logoutLabel = document.querySelector(".logout");
const mainContainer = document.querySelector(".container");
const transactionsContainer = document.querySelector(".transactions");
const invalidMessage = document.querySelector(".invalid-message");
const newAccountBtn = document.querySelector(".new-account");
const sortBtn = document.querySelector(".sort");

// Events
loginForm.addEventListener("submit", loginHandler);
signupForm.addEventListener("submit", signupHandler);
requestLoanForm.addEventListener("submit", requestLoanHandler);
transferMoneyForm.addEventListener("submit", transferMoneyHandler);
closeAccountForm.addEventListener("submit", closeAccountHandler);
newAccountBtn.addEventListener("click", showSignupForm);
sortBtn.addEventListener("click", sortHandler);
