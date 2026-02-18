'use strict';

const loginForm = document.querySelector('#login-form'),
  loginUsername = document.querySelector('#login-username'),
  loginPassword = document.querySelector('#login-password'),
  passwordToggle = document.querySelector('.password-toggle');
const accounts = loadAccounts();

window.addEventListener('load', () => {
  setTimeout(
    () => document.querySelector('#loading-screen').classList.add('hidden'),
    1000,
  );
  setTimeout(() => document.querySelector('.login-section').classList.add('animate'), 100);
});

document.querySelector('#dark-mode-toggle').addEventListener('click', () => {
  const isDark = toggleGlobalDarkMode();
  showToast(`Theme: ${isDark ? 'Dark' : 'Light'}`);
});

passwordToggle.addEventListener('click', () => {
  const isHidden = loginPassword.type === 'password';
  loginPassword.type = isHidden ? 'text' : 'password';
  passwordToggle.textContent = isHidden ? 'Hide' : 'Show';
});

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const user = loginUsername.value.toLowerCase().trim(),
    pin = +loginPassword.value;
  const acc = accounts.find(a => a.username === user && a.pin === pin);
  if (acc) {
    sessionStorage.setItem('authenticatedUser', user);
    showToast('Success! Redirecting...', 'success');
    setTimeout(() => (window.location.href = 'banking.html'), 1000);
  } else showToast('Invalid credentials', 'error');
});

document.querySelector('.credentials-grid').addEventListener('click', e => {
  const card = e.target.closest('.credential-card');
  if (!card) return;
  loginUsername.value = card.dataset.user;
  loginPassword.value = card.dataset.pin;
  showToast(`Loaded ${card.dataset.user}`);
});
