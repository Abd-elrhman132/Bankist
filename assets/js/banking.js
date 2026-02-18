'use strict';

const labelWelcome = document.querySelector('#label-welcome'),
  labelDate = document.querySelector('#label-date'),
  labelBalance = document.querySelector('#label-balance'),
  labelSumIn = document.querySelector('#label-sum-in'),
  labelSumOut = document.querySelector('#label-sum-out'),
  labelSumInterest = document.querySelector('#label-sum-interest'),
  labelTimer = document.querySelector('#label-timer'),
  containerApp = document.querySelector('#container-app'),
  containerMovements = document.querySelector('#container-movements');

const accounts = loadAccounts();
let currentAccount, timer, sorted = false;

const formatCur = (val, acc) =>
  new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(val);

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const updateUI = function (acc, scrollToTop = false) {
  containerMovements.innerHTML = '';
  const allItems = acc.movements.map((m, i) => ({
    val: m,
    type: m > 0 ? 'deposit' : 'withdrawal',
    date: new Date(acc.movementsDates[i]),
    isReq: false,
  }));
  acc.pendingRequests.forEach((req, i) => {
    const isMe = req.requester === acc.username;
    allItems.push({
      val: req.amount,
      type: 'request',
      date: new Date(req.date),
      isReq: true,
      isMe,
      idx: i,
    });
  });

  if (allItems.length === 0) {
    containerMovements.innerHTML = `<div class="movements__empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg><p>No transactions found.</p></div>`;
  } else {
    if (sorted) allItems.sort((a, b) => a.val - b.val);
    allItems.forEach(item => {
      const actionHtml =
        item.isReq && !item.isMe
          ? `<div class="movements__actions"><button class="btn--action btn--accept" data-idx="${item.idx}">Accept</button><button class="btn--action btn--deny" data-idx="${item.idx}">Deny</button></div>`
          : '';
      const html = `<div class="movements__row"><div class="movements__type movements__type--${
        item.type
      }">${
        item.isReq ? (item.isMe ? 'Sent Req' : 'New Req') : item.type
      }</div><div class="movements__date">${formatMovementDate(
        item.date,
        acc.locale,
      )}</div><div class="movements__value">${
        item.isReq && item.isMe ? 'Pending' : formatCur(item.val, acc)
      }</div>${actionHtml}</div>`;
      containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }

  acc.balance = acc.movements.reduce((sum, m) => sum + m, 0);
  labelBalance.textContent = formatCur(acc.balance, acc);
  labelSumIn.textContent = formatCur(
    acc.movements.filter(m => m > 0).reduce((s, m) => s + m, 0),
    acc,
  );
  labelSumOut.textContent = formatCur(
    Math.abs(acc.movements.filter(m => m < 0).reduce((s, m) => s + m, 0)),
    acc,
  );
  labelSumInterest.textContent = formatCur(
    acc.movements
      .filter(m => m > 0)
      .map(d => (d * acc.interestRate) / 100)
      .filter(i => i >= 1)
      .reduce((s, i) => s + i, 0),
    acc,
  );
  if (scrollToTop) containerMovements.scrollTop = 0;
};

const startLogoutTimer = () => {
  let time = 300;
  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0'),
      sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      sessionStorage.removeItem('authenticatedUser');
      window.location.href = 'login.html';
    }
    time--;
  };
  tick();
  return setInterval(tick, 1000);
};

const triggerError = input => {
  input.classList.add('shake');
  setTimeout(() => input.classList.remove('shake'), 400);
  input.focus();
};

// AUTH CHECK
const userAuth = sessionStorage.getItem('authenticatedUser');
currentAccount = accounts.find(acc => acc.username === userAuth);
if (!currentAccount) window.location.href = 'login.html';
else {
  labelWelcome.textContent = `Welcome back, ${
    currentAccount.owner.split(' ')[0]
  }!`;
  labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale).format(
    new Date(),
  );
  containerApp.classList.add('active');
  updateUI(currentAccount);
  timer = startLogoutTimer();
}

// ACTIONS
document.querySelector('#form-transfer').addEventListener('submit', e => {
  e.preventDefault();
  const toIn = document.querySelector('#input-transfer-to'),
    amtIn = document.querySelector('#input-transfer-amount');
  const rec = accounts.find(a => a.username === toIn.value),
    amt = +amtIn.value;
  if (
    amt > 0 &&
    rec &&
    currentAccount.balance >= amt &&
    rec.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amt);
    currentAccount.movementsDates.push(new Date().toISOString());
    rec.movements.push(amt);
    rec.movementsDates.push(new Date().toISOString());
    saveAccounts(accounts);
    updateUI(currentAccount, true);
    showToast('Transfer Successful!');
    toIn.value = amtIn.value = '';
  } else {
    showToast('Invalid transfer', 'error');
    triggerError(!rec ? toIn : amtIn);
  }
});

document.querySelector('#form-request').addEventListener('submit', e => {
  e.preventDefault();
  const fromIn = document.querySelector('#input-request-to'),
    amtIn = document.querySelector('#input-request-amount');
  const tar = accounts.find(a => a.username === fromIn.value),
    amt = +amtIn.value;
  if (amt > 0 && tar && tar.username !== currentAccount.username) {
    const req = {
      amount: amt,
      requester: currentAccount.username,
      date: new Date().toISOString(),
    };
    tar.pendingRequests.push(req);
    currentAccount.pendingRequests.push(req);
    saveAccounts(accounts);
    updateUI(currentAccount, true);
    showToast('Request Sent!');
    fromIn.value = amtIn.value = '';
  } else {
    showToast('Invalid request', 'error');
    triggerError(!tar ? fromIn : amtIn);
  }
});

document.querySelector('#form-loan').addEventListener('submit', e => {
  e.preventDefault();
  const amtIn = document.querySelector('#input-loan-amount'),
    amt = +amtIn.value;
  if (amt > 0 && currentAccount.movements.some(m => m >= amt * 0.1)) {
    showToast('Processing...');
    setTimeout(() => {
      currentAccount.movements.push(amt);
      currentAccount.movementsDates.push(new Date().toISOString());
      saveAccounts(accounts);
      updateUI(currentAccount, true);
      showToast('Loan Approved!');
    }, 2000);
    amtIn.value = '';
  } else {
    showToast('Loan Denied', 'error');
    triggerError(amtIn);
  }
});

document.querySelector('#form-close').addEventListener('submit', e => {
  e.preventDefault();
  const uIn = document.querySelector('#input-close-user'),
    pIn = document.querySelector('#input-close-pin');
  if (uIn.value === currentAccount.username && +pIn.value === currentAccount.pin) {
    if (confirm('Permanently close account?')) {
      const idx = accounts.findIndex(
        acc => acc.username === currentAccount.username,
      );
      accounts.splice(idx, 1);
      saveAccounts(accounts);
      sessionStorage.removeItem('authenticatedUser');
      window.location.href = 'login.html';
    }
  } else {
    showToast('Error', 'error');
    triggerError(uIn.value !== currentAccount.username ? uIn : pIn);
  }
});

containerMovements.addEventListener('click', e => {
  const btn = e.target.closest('.btn--action');
  if (!btn) return;
  const idx = +btn.dataset.idx,
    req = currentAccount.pendingRequests[idx],
    reqAccount = accounts.find(a => a.username === req.requester);
  if (btn.classList.contains('btn--accept')) {
    if (currentAccount.balance >= req.amount) {
      currentAccount.movements.push(-req.amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      reqAccount.movements.push(req.amount);
      reqAccount.movementsDates.push(new Date().toISOString());
      currentAccount.pendingRequests.splice(idx, 1);
      reqAccount.pendingRequests = reqAccount.pendingRequests.filter(
        r => !(r.requester === req.requester && r.amount === req.amount),
      );
      saveAccounts(accounts);
      updateUI(currentAccount, true);
      showToast('Accepted!');
    } else showToast('Insufficient funds', 'error');
  } else {
    currentAccount.pendingRequests.splice(idx, 1);
    reqAccount.pendingRequests = reqAccount.pendingRequests.filter(
      r => !(r.requester === req.requester && r.amount === req.amount),
    );
    saveAccounts(accounts);
    updateUI(currentAccount);
    showToast('Denied');
  }
});

document
  .querySelector('#dark-mode-toggle')
  .addEventListener('click', toggleGlobalDarkMode);
document.querySelector('#btn-logout').addEventListener('click', () => {
  sessionStorage.removeItem('authenticatedUser');
  window.location.href = 'login.html';
});
document.querySelector('#btn-reset').addEventListener('click', () => {
  if (confirm('Reset all data?')) {
    localStorage.removeItem('bankistAccounts');
    window.location.reload();
  }
});
document.querySelector('#btn-sort').addEventListener('click', () => {
  sorted = !sorted;
  updateUI(currentAccount);
  document.querySelector('#btn-sort').classList.toggle('active', sorted);
});
