const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
export const isEmailValid = (email) => emailRegex.test(email);

const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // At least 8 characters, at least one letter and one number
export const isPasswordValid = (password) => passwordRegex.test(password);