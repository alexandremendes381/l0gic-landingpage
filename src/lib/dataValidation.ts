import { CreateUserRequest } from '@/services/userService'

function sanitizeString(value: any): string {
  if (value === null || value === undefined) return ''
  
  const str = String(value).trim()
  return str.replace(/[\x00-\x1F\x7F-\x9F]/g, '')
}

export function sanitizeUserData(userData: any): CreateUserRequest {
  const sanitized: CreateUserRequest = {
    name: sanitizeString(userData.name),
    email: sanitizeString(userData.email),
    phone: sanitizeString(userData.phone),
    position: sanitizeString(userData.position),
    birthDate: sanitizeString(userData.birthDate),
    message: sanitizeString(userData.message),
    ...(userData.utm_source && { utm_source: sanitizeString(userData.utm_source) }),
    ...(userData.utm_medium && { utm_medium: sanitizeString(userData.utm_medium) }),
    ...(userData.utm_campaign && { utm_campaign: sanitizeString(userData.utm_campaign) }),
    ...(userData.utm_term && { utm_term: sanitizeString(userData.utm_term) }),
    ...(userData.utm_content && { utm_content: sanitizeString(userData.utm_content) }),
    ...(userData.gclid && { gclid: sanitizeString(userData.gclid) }),
    ...(userData.fbclid && { fbclid: sanitizeString(userData.fbclid) }),
  }
  
  return sanitized
}

export function validateAndCleanData(userData: CreateUserRequest): CreateUserRequest {
  const cleaned: any = {}
  
  Object.entries(userData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = typeof value === 'string' ? value.trim() : String(value).trim()
    }
  })
  
  return cleaned as CreateUserRequest
}

export function validateUserData(userData: CreateUserRequest): void {
  const required = ['name', 'email', 'phone', 'position', 'birthDate', 'message']
  const missing = required.filter(field => !userData[field as keyof CreateUserRequest])
  
  if (missing.length > 0) {
    throw new Error(`Campos obrigatórios: ${missing.join(', ')}`)
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userData.email)) {
    throw new Error('Email inválido')
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(userData.birthDate)) {
    throw new Error('Data deve estar no formato YYYY-MM-DD')
  }

  const maxLengths = {
    name: 100,
    email: 100,
    phone: 20,
    position: 100,
    birthDate: 10,
    message: 2000,
    utm_source: 200,
    utm_medium: 200,
    utm_campaign: 200,
    utm_term: 200,
    utm_content: 200,
    gclid: 200,
    fbclid: 200
  }
  
  Object.entries(maxLengths).forEach(([field, maxLength]) => {
    const fieldValue = userData[field as keyof CreateUserRequest]
    if (fieldValue && fieldValue.length > maxLength) {
      throw new Error(`Campo ${field} muito longo (máximo ${maxLength} caracteres)`)
    }
  })
}

export function createSafeJSON(data: any): string {
  try {
    const jsonString = JSON.stringify(data)
    JSON.parse(jsonString)
    return jsonString
  } catch (jsonError) {
    throw new Error('Dados inválidos para JSON')
  }
}

export function prepareUserDataForAPI(userData: any): CreateUserRequest {
  const sanitized = sanitizeUserData(userData)
  const cleaned = validateAndCleanData(sanitized)
  validateUserData(cleaned)
  createSafeJSON(cleaned)
  
  return cleaned
}