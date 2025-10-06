import { z } from 'zod'

export interface FormData {
  nome: string
  email: string
  telefone: string
  cargo: string
  dataNascimento: string
  mensagem: string
}

export interface ValidationErrors {
  nome?: string
  email?: string
  telefone?: string
  cargo?: string
  dataNascimento?: string
  mensagem?: string
  submit?: string
}

const dddsEstados: Record<string, string> = {
  '68': 'Acre (AC)',
  '82': 'Alagoas (AL)',
  '92': 'Amazonas (AM)',
  '97': 'Amazonas (AM)',
  '71': 'Bahia (BA)',
  '73': 'Bahia (BA)',
  '74': 'Bahia (BA)',
  '75': 'Bahia (BA)',
  '77': 'Bahia (BA)',
  '85': 'Ceará (CE)',
  '88': 'Ceará (CE)',
  '61': 'Distrito Federal (DF)',
  '27': 'Espírito Santo (ES)',
  '28': 'Espírito Santo (ES)',
  '62': 'Goiás (GO)',
  '64': 'Goiás (GO)',
  '98': 'Maranhão (MA)',
  '99': 'Maranhão (MA)',
  '65': 'Mato Grosso (MT)',
  '66': 'Mato Grosso (MT)',
  '67': 'Mato Grosso do Sul (MS)',
  '31': 'Minas Gerais (MG)',
  '32': 'Minas Gerais (MG)',
  '33': 'Minas Gerais (MG)',
  '34': 'Minas Gerais (MG)',
  '35': 'Minas Gerais (MG)',
  '37': 'Minas Gerais (MG)',
  '38': 'Minas Gerais (MG)',
  '91': 'Pará (PA)',
  '93': 'Pará (PA)',
  '94': 'Pará (PA)',
  '83': 'Paraíba (PB)',
  '41': 'Paraná (PR)',
  '42': 'Paraná (PR)',
  '43': 'Paraná (PR)',
  '44': 'Paraná (PR)',
  '45': 'Paraná (PR)',
  '46': 'Paraná (PR)',
  '81': 'Pernambuco (PE)',
  '87': 'Pernambuco (PE)',
  '86': 'Piauí (PI)',
  '89': 'Piauí (PI)',
  '21': 'Rio de Janeiro (RJ)',
  '22': 'Rio de Janeiro (RJ)',
  '24': 'Rio de Janeiro (RJ)',
  '84': 'Rio Grande do Norte (RN)',
  '51': 'Rio Grande do Sul (RS)',
  '53': 'Rio Grande do Sul (RS)',
  '54': 'Rio Grande do Sul (RS)',
  '55': 'Rio Grande do Sul (RS)',
  '69': 'Rondônia (RO)',
  '95': 'Roraima (RR)',
  '47': 'Santa Catarina (SC)',
  '48': 'Santa Catarina (SC)',
  '49': 'Santa Catarina (SC)',
  '11': 'São Paulo (SP)',
  '12': 'São Paulo (SP)',
  '13': 'São Paulo (SP)',
  '14': 'São Paulo (SP)',
  '15': 'São Paulo (SP)',
  '16': 'São Paulo (SP)',
  '17': 'São Paulo (SP)',
  '18': 'São Paulo (SP)',
  '19': 'São Paulo (SP)',
  '79': 'Sergipe (SE)',
  '63': 'Tocantins (TO)'
}

export const contactFormSchema = z.object({
  nome: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços')
    .transform(val => val.trim()),

  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido. Use o formato: exemplo@dominio.com')
    .transform(val => val.trim().toLowerCase()),

  telefone: z.string()
    .min(1, 'Telefone é obrigatório')
    .transform(val => val.replace(/\D/g, ''))
    .refine(val => val.length >= 2, 'Digite pelo menos o DDD')
    .refine(val => {
      if (val.length >= 2) {
        const ddd = val.slice(0, 2)
        return dddsEstados.hasOwnProperty(ddd)
      }
      return false
    }, 'DDD inválido')
    .refine(val => val.length >= 10, 'Telefone deve ter pelo menos 10 dígitos')
    .refine(val => val.length <= 11, 'Telefone deve ter no máximo 11 dígitos')
    .refine(val => {
      if (val.length === 10) {
        return /^[1-9][1-9]\d{8}$/.test(val)
      } else if (val.length === 11) {
        return /^[1-9][1-9]9\d{8}$/.test(val)
      }
      return false
    }, 'Formato de telefone inválido'),

  cargo: z.string()
    .min(1, 'Cargo é obrigatório')
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .transform(val => val.trim()),

  dataNascimento: z.string()
    .min(1, 'Data de nascimento é obrigatória')
    .refine(val => !isNaN(new Date(val).getTime()), 'Data inválida')
    .refine(val => new Date(val) <= new Date(), 'Data não pode ser no futuro')
    .refine(val => {
      const birthDate = new Date(val)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age >= 16
    }, 'Idade mínima: 16 anos')
    .refine(val => {
      const birthDate = new Date(val)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      
      return age <= 100
    }, 'Idade máxima: 100 anos'),

  mensagem: z.string()
    .min(1, 'Mensagem é obrigatória')
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres')
    .transform(val => val.trim())
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export function validateFormWithZod(data: FormData): { 
  success: boolean
  data?: ContactFormData
  errors?: ValidationErrors 
} {
  try {
    const validatedData = contactFormSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {}
      
      error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ValidationErrors
        errors[field] = issue.message
      })
      
      return { success: false, errors }
    }
    
    return { 
      success: false, 
      errors: { submit: 'Erro na validação do formulário' } 
    }
  }
}

export function validateForm(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.nome.trim()) {
    errors.nome = 'Nome é obrigatório'
  } else if (data.nome.trim().length < 2) {
    errors.nome = 'Nome deve ter pelo menos 2 caracteres'
  } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(data.nome.trim())) {
    errors.nome = 'Nome deve conter apenas letras e espaços'
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório'
  } else if (!emailRegex.test(data.email.trim().toLowerCase())) {
    errors.email = 'E-mail inválido. Use o formato: exemplo@dominio.com'
  }

  const phoneNumbers = data.telefone.replace(/\D/g, '')
  if (!data.telefone.trim()) {
    errors.telefone = 'Telefone é obrigatório'
  } else if (phoneNumbers.length < 2) {
    errors.telefone = 'Digite pelo menos o DDD'
  } else if (phoneNumbers.length >= 2 && !isValidDDD(data.telefone)) {
    errors.telefone = 'DDD inválido'
  } else if (phoneNumbers.length < 10) {
    errors.telefone = 'Telefone deve ter pelo menos 10 dígitos'
  } else if (phoneNumbers.length === 10) {
    if (!/^[1-9][1-9]\d{8}$/.test(phoneNumbers)) {
      errors.telefone = 'Telefone fixo inválido. Use o formato: (11) 1234-5678'
    }
  } else if (phoneNumbers.length === 11) {
    if (!/^[1-9][1-9]9\d{8}$/.test(phoneNumbers)) {
      errors.telefone = 'Celular inválido. Use o formato: (11) 91234-5678'
    }
  } else {
    errors.telefone = 'Telefone deve ter 10 ou 11 dígitos'
  }

  if (!data.cargo.trim()) {
    errors.cargo = 'Cargo é obrigatório'
  } else if (data.cargo.trim().length < 2) {
    errors.cargo = 'Cargo deve ter pelo menos 2 caracteres'
  }

  if (!data.dataNascimento) {
    errors.dataNascimento = 'Data de nascimento é obrigatória'
  } else {
    const birthDate = new Date(data.dataNascimento)
    const today = new Date()
    
    if (isNaN(birthDate.getTime())) {
      errors.dataNascimento = 'Data inválida'
    } else {
      if (birthDate > today) {
        errors.dataNascimento = 'Data não pode ser no futuro'
      } else {
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--
        }
        
        if (age < 16) {
          errors.dataNascimento = 'Idade mínima: 16 anos'
        } else if (age > 100) {
          errors.dataNascimento = 'Idade máxima: 100 anos'
        }
      }
    }
  }

  if (!data.mensagem.trim()) {
    errors.mensagem = 'Mensagem é obrigatória'
  } else if (data.mensagem.trim().length < 10) {
    errors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres'
  } else if (data.mensagem.trim().length > 1000) {
    errors.mensagem = 'Mensagem deve ter no máximo 1000 caracteres'
  }

  return errors
}

export function formatPhone(phone: string): string {
  const numbers = phone.replace(/\D/g, '')
  
  const limitedNumbers = numbers.slice(0, 11)
  
  if (limitedNumbers.length === 0) return ''
  if (limitedNumbers.length <= 2) return `(${limitedNumbers}`
  if (limitedNumbers.length <= 6) return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
  if (limitedNumbers.length <= 10) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`
  }
  return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  return emailRegex.test(email.trim().toLowerCase())
}

export function isValidBrazilianPhone(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '')
  
  if (numbers.length === 10) {
    return /^[1-9][1-9]\d{8}$/.test(numbers)
  } else if (numbers.length === 11) {
    return /^[1-9][1-9]9\d{8}$/.test(numbers)
  }
  
  return false
}

export function getStateFromPhone(phone: string): string | null {
  const numbers = phone.replace(/\D/g, '')
  
  if (numbers.length >= 2) {
    const ddd = numbers.slice(0, 2)
    return dddsEstados[ddd] || null
  }
  
  return null
}

export function isValidDDD(phone: string): boolean {
  const numbers = phone.replace(/\D/g, '')
  
  if (numbers.length >= 2) {
    const ddd = numbers.slice(0, 2)
    return dddsEstados.hasOwnProperty(ddd)
  }
  
  return false
}