'use strict';

/**
 * ==========================================================================
 * SHARED BANKIST DATA & STORAGE
 * ==========================================================================
 */

const defaultAccounts = [
  {
    username: 'jonas',
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2,
    pin: 1111,
    movementsDates: [
      '2024-08-18T21:31:17.178Z', '2025-06-23T07:42:02.383Z', '2025-01-28T09:15:04.904Z',
      '2025-04-01T10:17:24.185Z', '2025-05-08T14:11:59.604Z', '2025-05-27T17:01:17.194Z',
      '2025-07-11T23:36:17.929Z', '2025-08-30T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT',
    pendingRequests: [],
  },
  {
    username: 'jessica',
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200, 100, 400],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
      '2025-08-01T13:15:33.035Z', '2025-05-30T09:48:16.867Z', '2025-06-25T06:04:23.907Z',
      '2025-01-25T14:18:46.235Z', '2025-02-05T16:33:06.386Z', '2025-04-10T14:43:26.374Z',
      '2025-06-25T18:49:59.371Z', '2025-07-24T12:01:20.894Z', '2025-07-20T12:01:20.894Z',
      '2025-07-21T12:01:20.894Z', '2025-07-25T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
    pendingRequests: [],
  },
  {
    username: 'abdelrahman',
    owner: 'Abdelrahman Ahmed',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 3333,
    movementsDates: [
      '2025-01-01T13:15:33.035Z', '2025-03-30T09:48:16.867Z', '2025-04-25T06:04:23.907Z',
      '2025-01-25T14:18:46.235Z', '2025-02-05T16:33:06.386Z', '2025-04-10T14:43:26.374Z',
      '2025-06-25T18:49:59.371Z', '2025-07-26T12:01:20.894Z',
    ],
    currency: 'EGP',
    locale: 'en-US',
    pendingRequests: [],
  },
  {
    username: 'ahmed',
    owner: 'Ahmed Ezzat',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 1000, -500],
    interestRate: 1.5,
    pin: 4444,
    movementsDates: [
      '2025-07-01T13:15:33.035Z', '2025-03-30T09:48:16.867Z', '2025-04-25T06:04:23.907Z',
      '2025-01-25T14:18:46.235Z', '2025-02-05T16:33:06.386Z', '2025-04-10T14:43:26.374Z',
      '2025-06-25T18:49:59.371Z', '2025-07-26T12:01:20.894Z', '2025-08-01T10:00:00Z',
      '2025-08-31T10:00:00Z',
    ],
    currency: 'EGP',
    locale: 'en-US',
    pendingRequests: [],
  }
];

const loadAccounts = () => {
  const data = localStorage.getItem('bankistAccounts');
  return data ? JSON.parse(data) : defaultAccounts;
};

const saveAccounts = accs => localStorage.setItem('bankistAccounts', JSON.stringify(accs));

const showToast = (message, type = 'success') => {
  const toast = document.querySelector('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  setTimeout(() => toast.className = 'toast', 3000);
};

/**
 * DARK MODE LOGIC
 */
const initDarkMode = () => {
  const isDark = localStorage.getItem('darkMode') === 'true';
  if (isDark) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
};

const toggleGlobalDarkMode = () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  return isDark;
};

// Auto-init on script load
initDarkMode();

// Sync across tabs
window.addEventListener('storage', (e) => {
  if (e.key === 'darkMode') {
    initDarkMode();
  }
});
