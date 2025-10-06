
export function pushDataLayer(data: Record<string, any>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
export function normalizePhoneBR(phone: string) {
  const digits = phone.replace(/\D+/g, '');
  if (digits.startsWith('55')) return Number(digits);
  return Number(`55${digits}`);
}

export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}