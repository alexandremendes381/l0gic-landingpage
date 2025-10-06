import { prepareUserDataForAPI, createSafeJSON } from '@/lib/dataValidation'
import API from '@/lib/api'

export interface CreateUserRequest {
  name: string
  email: string
  phone: string
  position: string
  birthDate: string
  message: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
}

export interface CreateUserResponse {
  id: string
  name: string
  email: string
  phone: string
  position: string
  birthDate: string
  message: string
  createdAt: string
}

export async function createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
  try {
    const validatedData = prepareUserDataForAPI(userData)
    
    console.log('📤 Enviando dados do usuário:', validatedData);
    
    const response = await API.post('/api/leads', validatedData);
    
    console.log('✅ Resposta da API:', response.data);
    
    return response.data;
    
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.error || error.response.data?.message || `Erro HTTP ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error('Erro de conexão com o servidor');
    } else {
      throw new Error(error.message || 'Erro desconhecido');
    }
  }
}


export const createUserMutationOptions = {
  mutationFn: createUser,
}