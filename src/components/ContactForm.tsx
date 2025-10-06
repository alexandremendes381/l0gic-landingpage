'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  FormData,
  ValidationErrors,
  validateForm,
  validateFormWithZod,
  formatPhone,
  getStateFromPhone
} from '@/lib/validation';

import { createUser } from '@/services/userService';
import { mapFormDataToApiRequest } from '@/types/api';

import { UseTracking } from '@/hooks/useTracking';
import { useUrlTracking } from '@/hooks/useUrlTracking';
import { generateUUID, normalizeEmail, normalizePhoneBR, pushDataLayer } from '@/lib/gtmConfig';


export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    dataNascimento: '',
    mensagem: ''
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const { attribution } = UseTracking();
  const urlTrackingData = useUrlTracking();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      const firstName = formData.nome.trim().split(/\s+/)[0] || '';

      pushDataLayer({
        event: 'generate_lead',
        event_id: generateUUID(),

        lead_email: normalizeEmail(formData.email),
        lead_phone: normalizePhoneBR(formData.telefone),
        lead_full_name: formData.nome.trim(),
        lead_first_name: firstName,
        lead_position: formData.cargo.trim(),
        lead_message_length: formData.mensagem.length,

        lead_value: 0,
        lead_currency: 'BRL',

        lead_source: 'form_home',
        lead_form_name: 'contact_home_main',

        page_path: typeof window !== 'undefined' ? window.location.pathname : '',

        utm_source: attribution.utmSource,
        utm_medium: attribution.utmMedium,
        utm_campaign: attribution.utmCampaign,
        utm_term: attribution.utmTerm,
        utm_content: attribution.utmContent,
        gclid: attribution.gclid,
        fbclid: attribution.fbclid
      });

      setSubmitted(true);
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        dataNascimento: '',
        mensagem: ''
      });
      setErrors({});
    },
    onError: (error: any) => {
      setErrors({ submit: error?.message || 'Erro ao enviar' });
    }
  });

  function handleInputChange(field: keyof FormData, value: string) {
    if (field === 'telefone') {
      value = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(
    e?: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) {
    if (e && 'preventDefault' in e) e.preventDefault();

    const validation = validateFormWithZod(formData);
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }

    const apiPayload = mapFormDataToApiRequest(formData, { attribution, isReady: true });
    
    const payloadWithTracking = {
      ...apiPayload,
      ...(urlTrackingData.utm_source && { utm_source: urlTrackingData.utm_source }),
      ...(urlTrackingData.utm_medium && { utm_medium: urlTrackingData.utm_medium }),
      ...(urlTrackingData.utm_campaign && { utm_campaign: urlTrackingData.utm_campaign }),
      ...(urlTrackingData.utm_term && { utm_term: urlTrackingData.utm_term }),
      ...(urlTrackingData.utm_content && { utm_content: urlTrackingData.utm_content }),
      ...(urlTrackingData.gclid && { gclid: urlTrackingData.gclid }),
      ...(urlTrackingData.fbclid && { fbclid: urlTrackingData.fbclid }),
    };
    
    console.log('📊 Attribution data:', attribution);
    console.log('📊 URL tracking data:', urlTrackingData);
    console.log('📊 Dados completos sendo enviados:', payloadWithTracking);
    
    setErrors({});
    createUserMutation.mutate(payloadWithTracking);
  }

  const phoneState = formData.telefone ? getStateFromPhone(formData.telefone) : null;

  if (submitted) {
    return (
      <div className="text-center">
        <div className="w-12 h-12 bg-logic-green rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Mensagem Enviada!</h3>
        <p className="text-gray-600 mb-4">
          Obrigado pelo seu contato. Nossa equipe entrará em contato em breve.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="outline"
          className="border-logic-green text-logic-green hover:bg-logic-green hover:text-black"
        >
          Enviar Nova Mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <div>
          <Label htmlFor="nome" className="text-xs font-semibold text-gray-200 mb-1 block">
            Nome Completo *
          </Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={e => handleInputChange('nome', e.target.value)}
              className={`bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-logic-green focus:ring-logic-green/20 h-9 text-sm ${
                errors.nome ? 'border-red-500' : ''
              }`}
              placeholder="Digite seu nome completo"
            />
          {errors.nome && <p className="text-red-400 text-xs mt-1">{errors.nome}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="text-xs font-semibold text-gray-200 mb-1 block">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => handleInputChange('email', e.target.value)}
            className={`bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-logic-green focus:ring-logic-green/20 h-9 text-sm ${
              errors.email ? 'border-red-500' : ''
            }`}
            placeholder="seu@email.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="telefone" className="text-xs font-semibold text-gray-200 mb-1 block">
            Telefone *
          </Label>
          <Input
            id="telefone"
            type="tel"
            value={formData.telefone}
            onChange={e => handleInputChange('telefone', e.target.value)}
            className={`bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-logic-green focus:ring-logic-green/20 h-9 text-sm ${
              errors.telefone ? 'border-red-500' : ''
            }`}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          {phoneState && (
            <p className="text-logic-green text-xs mt-1">📍 {phoneState}</p>
          )}
          {errors.telefone && <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>}
        </div>

        <div>
          <Label htmlFor="cargo" className="text-xs font-semibold text-gray-200 mb-1 block">
            Cargo/Posição *
          </Label>
          <Input
            id="cargo"
            type="text"
            value={formData.cargo}
            onChange={e => handleInputChange('cargo', e.target.value)}
            className={`bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-logic-green focus:ring-logic-green/20 h-9 text-sm ${
              errors.cargo ? 'border-red-500' : ''
            }`}
            placeholder="Digite seu cargo ou posição"
          />
          {errors.cargo && <p className="text-red-400 text-xs mt-1">{errors.cargo}</p>}
        </div>

        <div>
          <Label htmlFor="dataNascimento" className="text-xs font-semibold text-gray-200 mb-1 block">
            Data de Nascimento *
          </Label>
          <Input
            id="dataNascimento"
            type="date"
            value={formData.dataNascimento}
            onChange={e => handleInputChange('dataNascimento', e.target.value)}
            min="1900-01-01"
            max={new Date().toISOString().split('T')[0]}
            className={`bg-white/10 border-white/20 text-white focus:border-logic-green focus:ring-logic-green/20 h-9 text-sm ${
              errors.dataNascimento ? 'border-red-500' : ''
            }`}
          />
          {errors.dataNascimento && (
            <p className="text-red-400 text-xs mt-1">{errors.dataNascimento}</p>
          )}
        </div>

        <div>
          <Label htmlFor="mensagem" className="text-xs font-semibold text-gray-200 mb-1 block">
            Mensagem *
          </Label>
          <Textarea
            id="mensagem"
            value={formData.mensagem}
            onChange={e => handleInputChange('mensagem', e.target.value)}
            className={`bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:border-logic-green focus:ring-logic-green/20 min-h-[80px] resize-none text-sm ${
              errors.mensagem ? 'border-red-500' : ''
            }`}
            placeholder="Conte-nos sobre seu projeto ou como podemos ajudar..."
          />
          {errors.mensagem && <p className="text-red-400 text-xs mt-1">{errors.mensagem}</p>}
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="text-red-400 text-sm">{errors.submit}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={createUserMutation.isPending}
        className="w-full bg-logic-green hover:bg-logic-green/90 text-black font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm h-9"
      >
        {createUserMutation.isPending ? 'Enviando...' : 'Enviar Mensagem'}
      </Button>
    </form>
  );
}