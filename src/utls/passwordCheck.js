const checkPasswordStrength = (password) => {
  const checks = {
    minLength: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    noCommonPattern: !isCommonWeakPattern(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  let score;
  if (!checks.minLength || passedCount <= 2) score = 0;
  else if (passedCount === 3) score = 1;
  else if (passedCount === 4) score = 2;
  else if (passedCount === 5) score = 3;
  else score = 4;

  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];

  return {
    score,
    label: labels[score],
    isAcceptable: score == 4,
    suggestions: buildSuggestions(checks),
  };
};

const isCommonWeakPattern = (password) => {
  const commonPasswords = [
    "password",
    "12345678",
    "qwerty",
    "letmein",
    "admin",
    "welcome",
    "123456789",
    "password1",
  ];
  const lower = password.toLowerCase();

  if (commonPasswords.includes(lower)) return true;
  if (/^(.)\1+$/.test(password)) return true; // e.g. "aaaaaaaa"
  if (/^(0123456789|abcdefgh)/i.test(password)) return true; // sequential

  return false;
};

const buildSuggestions = (checks) => {
  const suggestions = [];
  if (!checks.minLength) suggestions.push("Use at least 8 characters");
  if (!checks.hasLower) suggestions.push("Add a lowercase letter");
  if (!checks.hasUpper) suggestions.push("Add an uppercase letter");
  if (!checks.hasNumber) suggestions.push("Add a number");
  if (!checks.hasSymbol) suggestions.push("Add a symbol (e.g. !@#$%)");
  if (!checks.noCommonPattern)
    suggestions.push("Avoid common or predictable passwords");
  return suggestions;
};

export { checkPasswordStrength };
