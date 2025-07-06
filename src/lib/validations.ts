import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH, MAX_USERNAME_LENGTH, USERNAME_REGEX } from '@/lib/constants'

// Validation result type
export interface ValidationResult {
  success: boolean
  error?: string
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { success: false, error: 'Email is required' }
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return { success: false, error: 'Please enter a valid email address' }
  }
  
  return { success: true }
}

// Password validation
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { success: false, error: 'Password is required' }
  }
  
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { success: false, error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` }
  }
  
  return { success: true }
}

// Username validation
export function validateUsername(username: string): ValidationResult {
  if (!username) {
    return { success: false, error: 'Username is required' }
  }
  
  if (username.length < MIN_USERNAME_LENGTH) {
    return { success: false, error: `Username must be at least ${MIN_USERNAME_LENGTH} characters long` }
  }
  
  if (username.length > MAX_USERNAME_LENGTH) {
    return { success: false, error: `Username must be no more than ${MAX_USERNAME_LENGTH} characters long` }
  }
  
  if (!USERNAME_REGEX.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, and underscores' }
  }
  
  return { success: true }
}

// Amount validation
export function validateAmount(amount: string | number): ValidationResult {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return { success: false, error: 'Amount must be a positive number' }
  }
  
  return { success: true }
}

// Price validation
export function validatePrice(price: string | number): ValidationResult {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  
  if (isNaN(numPrice) || numPrice <= 0) {
    return { success: false, error: 'Price must be a positive number' }
  }
  
  return { success: true }
}

// Trade limits validation
export function validateTradeLimits(min: number, max: number): ValidationResult {
  if (min <= 0 || max <= 0) {
    return { success: false, error: 'Trade limits must be positive numbers' }
  }
  
  if (min >= max) {
    return { success: false, error: 'Minimum trade limit must be less than maximum' }
  }
  
  return { success: true }
} 