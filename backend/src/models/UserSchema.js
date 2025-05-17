// User validation schema
const userSchema = {
  fullName: {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 255,
    pattern: /^[a-zA-Z\s]+$/
  },
  mobileNumber: {
    type: 'string',
    required: true,
    pattern: /^[0-9]{10}$/,
    unique: true
  },
  password: {
    type: 'string',
    required: true,
    minLength: 8,
    maxLength: 255,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  }
};

// Validation function for new user registration
const validateUser = (userData) => {
  const errors = {};

  // Validate full name
  if (!userData.fullName) {
    errors.fullName = 'Full name is required';
  } else if (userData.fullName.length < 2 || userData.fullName.length > 255) {
    errors.fullName = 'Full name must be between 2 and 255 characters';
  } else if (!userSchema.fullName.pattern.test(userData.fullName)) {
    errors.fullName = 'Full name can only contain letters and spaces';
  }

  // Validate mobile number
  if (!userData.mobileNumber) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!userSchema.mobileNumber.pattern.test(userData.mobileNumber)) {
    errors.mobileNumber = 'Mobile number must be 10 digits';
  }

  // Validate password
  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (userData.password.length < 8 || userData.password.length > 255) {
    errors.password = 'Password must be between 8 and 255 characters';
  } else if (!userSchema.password.pattern.test(userData.password)) {
    errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation function for profile updates
const validateProfileUpdate = (userData) => {
  const errors = {};

  // Validate full name if provided
  if (userData.fullName) {
    if (userData.fullName.length < 2 || userData.fullName.length > 255) {
      errors.fullName = 'Full name must be between 2 and 255 characters';
    } else if (!userSchema.fullName.pattern.test(userData.fullName)) {
      errors.fullName = 'Full name can only contain letters and spaces';
    }
  }

  // Validate mobile number if provided
  if (userData.mobileNumber) {
    if (!userSchema.mobileNumber.pattern.test(userData.mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be 10 digits';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validation function for password updates
const validatePasswordUpdate = (userData) => {
  const errors = {};

  // Validate new password
  if (!userData.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (userData.newPassword.length < 8 || userData.newPassword.length > 255) {
    errors.newPassword = 'Password must be between 8 and 255 characters';
  } else if (!userSchema.password.pattern.test(userData.newPassword)) {
    errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export { userSchema, validateUser, validateProfileUpdate, validatePasswordUpdate }; 