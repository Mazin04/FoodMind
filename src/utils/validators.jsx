// Validators for name
export const isNameEmpty = (name) => name.trim() === '';

// Validators for emails
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
export const isEmailValid = (email) => emailRegex.test(email);

export const isEmailEmpty = (email) => isEmailEmpty(email);

// Validators for passwords
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // At least 8 characters, at least one letter and one number
export const isPasswordValid = (password) => passwordRegex.test(password);

export const isPasswordEmpty = (password) => password.trim() === '';