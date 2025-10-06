import { TrackingInfo } from '@/hooks/useTracking'
import { FormData } from '@/lib/validation'
import { CreateUserRequest } from '@/services/userService'

export function mapFormDataToApiRequest(
  formData: FormData, 
  trackingData?: TrackingInfo
): CreateUserRequest {
  const baseData = {
    name: formData.nome,
    email: formData.email,
    phone: formData.telefone,
    position: formData.cargo,
    birthDate: formData.dataNascimento,
    message: formData.mensagem,
  };

  if (trackingData?.attribution) {
    return {
      ...baseData,
      utm_source: trackingData.attribution.utmSource,
      utm_medium: trackingData.attribution.utmMedium,
      utm_campaign: trackingData.attribution.utmCampaign,
      utm_term: trackingData.attribution.utmTerm,
      utm_content: trackingData.attribution.utmContent,
      gclid: trackingData.attribution.gclid,
      fbclid: trackingData.attribution.fbclid,
    };
  }

  return baseData;
}

export interface FormSubmissionState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  error: string | null
}