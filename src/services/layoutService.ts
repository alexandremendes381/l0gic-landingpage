import API from '@/lib/api';

export interface LayoutConfigResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    value: number;
    createdAt: string;
    updatedAt: string;
  };
}

export const layoutService = {
  getLayoutConfig: async (): Promise<LayoutConfigResponse> => {
    try {
      const response = await API.get('/api/layout-config');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar configuração do layout:', error);
      throw error;
    }
  },

  updateLayoutConfig: async (value: number): Promise<LayoutConfigResponse> => {
    try {
      const response = await API.patch('/api/layout-config', { value });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configuração do layout:', error);
      throw error;
    }
  },
};

export default layoutService;