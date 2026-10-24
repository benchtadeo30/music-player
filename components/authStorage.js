import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = 'holiday_music_accounts_v1';
const SESSION_KEY = 'holiday_music_session_v1';

async function readAccounts() {
  const savedAccounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
  return savedAccounts ? JSON.parse(savedAccounts) : [];
}

export async function registerAccount({ name, email, password }) {
  const cleanName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!cleanName) throw new Error('Enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Enter a valid email address.');
  if (password.length < 6) throw new Error('Use a password with at least 6 characters.');

  const accounts = await readAccounts();
  if (accounts.some((account) => account.email === normalizedEmail)) {
    throw new Error('An account with this email already exists.');
  }

  accounts.push({ name: cleanName, email: normalizedEmail, password });
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function loginAccount({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) throw new Error('Enter your email and password.');

  const accounts = await readAccounts();
  const account = accounts.find((savedAccount) => savedAccount.email === normalizedEmail);
  if (!account) throw new Error('No account was found with that email.');
  if (account.password !== password) throw new Error('That password does not match this email.');

  await AsyncStorage.setItem(SESSION_KEY, account.email);
  return { name: account.name, email: account.email };
}

export async function getCurrentAccount() {
  const currentEmail = await AsyncStorage.getItem(SESSION_KEY);
  if (!currentEmail) return null;
  const accounts = await readAccounts();
  const account = accounts.find((savedAccount) => savedAccount.email === currentEmail);
  return account ? { name: account.name, email: account.email } : null;
}

export async function updateCurrentAccount({ name, email }) {
  const currentEmail = await AsyncStorage.getItem(SESSION_KEY);
  if (!currentEmail) throw new Error('Log in to update your profile.');

  const cleanName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();
  if (!cleanName) throw new Error('Enter your name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) throw new Error('Enter a valid email address.');

  const accounts = await readAccounts();
  const accountIndex = accounts.findIndex((account) => account.email === currentEmail);
  if (accountIndex < 0) throw new Error('Your saved account could not be found.');
  if (accounts.some((account) => account.email === normalizedEmail && account.email !== currentEmail)) {
    throw new Error('Another account already uses this email.');
  }

  accounts[accountIndex] = { ...accounts[accountIndex], name: cleanName, email: normalizedEmail };
  await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  await AsyncStorage.setItem(SESSION_KEY, normalizedEmail);
  return { name: cleanName, email: normalizedEmail };
}

export async function logoutAccount() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function deleteCurrentAccount() {
  const currentEmail = await AsyncStorage.getItem(SESSION_KEY);
  if (currentEmail) {
    const accounts = await readAccounts();
    await AsyncStorage.setItem(
      ACCOUNTS_KEY,
      JSON.stringify(accounts.filter((account) => account.email !== currentEmail)),
    );
  }
  await AsyncStorage.removeItem(SESSION_KEY);
}
