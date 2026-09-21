// Strip country code so the backend can concatenate phone_country_code + phone correctly.
export function normalizeNigerianPhone(raw: string): string {
  let phone = raw.trim().replace(/\s+/g, '');
  if (phone.startsWith('+234')) phone = phone.slice(4);
  else if (phone.startsWith('234')) phone = phone.slice(3);
  else if (phone.startsWith('0')) phone = phone.slice(1);
  return phone;
}
