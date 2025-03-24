export const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  switch (score) {
    case 0:
    case 1:
      return { label: 'Weak', color: 'text-red-500' };
    case 2:
      return { label: 'Medium', color: 'text-yellow-500' };
    case 3:
      return { label: 'Strong', color: 'text-green-500' };
    case 4:
      return { label: 'Very Strong', color: 'text-blue-500' };
    default:
      return { label: '', color: '' };
  }
};
