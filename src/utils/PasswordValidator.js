/**
 * Password validation utility with strength calculation and criteria checking
 */

export const PASSWORD_CRITERIA = {
  MIN_LENGTH: 8,
  MIN_UPPERCASE: 1,
  MIN_LOWERCASE: 1,
  MIN_NUMBERS: 1,
  MIN_SPECIAL_CHARS: 1,
};

export const STRENGTH_LEVELS = {
  VERY_WEAK: 0,
  WEAK: 1,
  FAIR: 2,
  GOOD: 3,
  STRONG: 4,
};

export const STRENGTH_COLORS = {
  [STRENGTH_LEVELS.VERY_WEAK]: '#ef4444', // red-500
  [STRENGTH_LEVELS.WEAK]: '#f97316', // orange-500
  [STRENGTH_LEVELS.FAIR]: '#eab308', // yellow-500
  [STRENGTH_LEVELS.GOOD]: '#22c55e', // green-500
  [STRENGTH_LEVELS.STRONG]: '#16a34a', // green-600
};

export const STRENGTH_LABELS = {
  [STRENGTH_LEVELS.VERY_WEAK]: 'Very Weak',
  [STRENGTH_LEVELS.WEAK]: 'Weak',
  [STRENGTH_LEVELS.FAIR]: 'Fair',
  [STRENGTH_LEVELS.GOOD]: 'Good',
  [STRENGTH_LEVELS.STRONG]: 'Strong',
};

/**
 * Validates individual password criteria
 * @param {string} password - The password to validate
 * @returns {Object} Validation results for each criterion
 */
export const validatePasswordCriteria = (password) => {
  const criteria = {
    minLength: {
      label: `At least ${PASSWORD_CRITERIA.MIN_LENGTH} characters`,
      met: password.length >= PASSWORD_CRITERIA.MIN_LENGTH,
      required: true,
    },
    hasUppercase: {
      label: 'Contains uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
      required: true,
    },
    hasLowercase: {
      label: 'Contains lowercase letter (a-z)',
      met: /[a-z]/.test(password),
      required: true,
    },
    hasNumbers: {
      label: 'Contains at least one number (0-9)',
      met: /\d/.test(password),
      required: true,
    },
    hasSpecialChars: {
      label: 'Contains special character (!@#$%^&*)',
      met: /[!@#$%^&*(),.?":{}|<>[\]\\/_+=~`-]/.test(password),
      required: true,
    },
    noCommonPatterns: {
      label: 'No common patterns (123, abc, qwerty)',
      met: password.length > 0 && !isCommonPattern(password),
      required: false,
    },
    noRepetitiveChars: {
      label: 'No repetitive characters (aaa, 111)',
      met: password.length > 0 && !hasRepetitiveChars(password),
      required: false,
    },
  };

  return criteria;
};

/**
 * Calculates password strength score
 * @param {string} password - The password to analyze
 * @returns {Object} Strength analysis with score, level, and details
 */
export const calculatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      level: STRENGTH_LEVELS.VERY_WEAK,
      label: STRENGTH_LABELS[STRENGTH_LEVELS.VERY_WEAK],
      color: STRENGTH_COLORS[STRENGTH_LEVELS.VERY_WEAK],
      percentage: 0,
    };
  }

  const criteria = validatePasswordCriteria(password);
  let score = 0;
  let maxScore = 0;

  // Calculate score based on criteria
  Object.values(criteria).forEach(criterion => {
    maxScore += criterion.required ? 2 : 1; // Required criteria worth more
    if (criterion.met) {
      score += criterion.required ? 2 : 1;
    }
  });

  // Additional scoring factors
  const lengthBonus = Math.min(password.length - PASSWORD_CRITERIA.MIN_LENGTH, 8) * 0.5;
  const diversityBonus = calculateCharacterDiversity(password) * 2;
  const entropyBonus = calculateEntropy(password) * 0.1;

  score += lengthBonus + diversityBonus + entropyBonus;
  maxScore += 8 + 2 + 2; // Max bonuses

  // Normalize to 0-100 scale
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  // Determine strength level
  let level;
  if (percentage < 20) level = STRENGTH_LEVELS.VERY_WEAK;
  else if (percentage < 40) level = STRENGTH_LEVELS.WEAK;
  else if (percentage < 60) level = STRENGTH_LEVELS.FAIR;
  else if (percentage < 80) level = STRENGTH_LEVELS.GOOD;
  else level = STRENGTH_LEVELS.STRONG;

  return {
    score: Math.round(score),
    level,
    label: STRENGTH_LABELS[level],
    color: STRENGTH_COLORS[level],
    percentage: Math.round(percentage),
    criteria,
  };
};

/**
 * Validates if password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {Object} Validation result with errors
 */
export const validatePassword = (password) => {
  const criteria = validatePasswordCriteria(password);
  const errors = [];

  // Check required criteria
  Object.values(criteria).forEach((criterion) => {
    if (criterion.required && !criterion.met) {
      errors.push(criterion.label);
    }
  });

  const isValid = errors.length === 0;
  const strength = calculatePasswordStrength(password);

  return {
    isValid,
    errors,
    strength,
    criteria,
  };
};

/**
 * Checks for common password patterns
 * @param {string} password - The password to check
 * @returns {boolean} True if common patterns are found
 */
function isCommonPattern(password) {
  const commonPatterns = [
    /123+/i,
    /abc+/i,
    /qwerty/i,
    /password/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
    /master/i,
  ];

  return commonPatterns.some(pattern => pattern.test(password));
}

/**
 * Checks for repetitive characters
 * @param {string} password - The password to check
 * @returns {boolean} True if repetitive characters are found
 */
function hasRepetitiveChars(password) {
  // Check for 3+ consecutive identical characters
  const repetitivePattern = /(.)\1{2,}/;
  return repetitivePattern.test(password);
}

/**
 * Calculates character diversity score
 * @param {string} password - The password to analyze
 * @returns {number} Diversity score (0-1)
 */
function calculateCharacterDiversity(password) {
  const charSets = [
    /[a-z]/,
    /[A-Z]/,
    /\d/,
    /[!@#$%^&*(),.?":{}|<>[\]\\/_+=~`-]/,
  ];

  const presentSets = charSets.filter(set => set.test(password)).length;
  return presentSets / charSets.length;
}

/**
 * Calculates password entropy (complexity measure)
 * @param {string} password - The password to analyze
 * @returns {number} Entropy score
 */
function calculateEntropy(password) {
  if (!password) return 0;

  const charFreq = {};
  for (const char of password) {
    charFreq[char] = (charFreq[char] || 0) + 1;
  }

  let entropy = 0;
  const length = password.length;

  Object.values(charFreq).forEach(freq => {
    const probability = freq / length;
    entropy -= probability * Math.log2(probability);
  });

  return entropy;
}

/**
 * Generates password suggestions based on current criteria
 * @param {Object} criteria - Current password criteria validation
 * @returns {Array} Array of suggestions
 */
export const generatePasswordSuggestions = (criteria) => {
  const suggestions = [];

  if (!criteria.minLength.met) {
    suggestions.push(`Add ${PASSWORD_CRITERIA.MIN_LENGTH - criteria.minLength.met} more characters`);
  }
  
  if (!criteria.hasUppercase.met) {
    suggestions.push('Add an uppercase letter');
  }
  
  if (!criteria.hasLowercase.met) {
    suggestions.push('Add a lowercase letter');
  }
  
  if (!criteria.hasNumbers.met) {
    suggestions.push('Add a number');
  }
  
  if (!criteria.hasSpecialChars.met) {
    suggestions.push('Add a special character (!@#$%^&*)');
  }

  return suggestions;
};

export default {
  validatePassword,
  validatePasswordCriteria,
  calculatePasswordStrength,
  generatePasswordSuggestions,
  PASSWORD_CRITERIA,
  STRENGTH_LEVELS,
  STRENGTH_COLORS,
  STRENGTH_LABELS,
};