import apiClient, { API_ENDPOINTS } from './config';
import { devMockEnabled } from '../devOrders';
import type { Notification } from './types';

const SAMPLE: Notification[] = [
  {
    id: 1, recipient: 'dev', actor: { id: 'u1', username: 'Kiara Takeaway', email: '', phone: '' },
    verb: 'accepted your order', target_type: 'order', target_object_id: 101, is_read: false,
    created_at: new Date(Date.now() - 1 * 3_600_000).toISOString(),
  },
  {
    id: 2, recipient: 'dev', actor: { id: 'u2', username: 'Kiara Takeaway', email: '', phone: '' },
    verb: 'confirmed your delivery fee', target_type: 'order', target_object_id: 101, is_read: false,
    created_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
  },
  {
    id: 3, recipient: 'dev', actor: { id: 'u3', username: 'Adaeze M.', email: '', phone: '' },
    verb: 'left a review on your shop', target_type: 'review', target_object_id: 9, is_read: true,
    created_at: new Date(Date.now() - 26 * 3_600_000).toISOString(),
  },
  {
    id: 4, recipient: 'dev', actor: { id: 'u4', username: 'ShopAm', email: '', phone: '' },
    verb: 'your payout was scheduled', target_type: 'payout', target_object_id: 7, is_read: true,
    created_at: new Date(Date.now() - 2 * 86_400_000).toISOString(),
  },
];

export const notificationsService = {
  async list(): Promise<Notification[]> {
    if (devMockEnabled()) return SAMPLE;
    const response = await apiClient.get<Notification[] | { results: Notification[] }>(
      API_ENDPOINTS.NOTIFICATIONS.LIST
    );
    const data = response.data as unknown;
    return Array.isArray(data) ? (data as Notification[]) : ((data as { results?: Notification[] }).results ?? []);
  },

  async markRead(id: number): Promise<void> {
    if (devMockEnabled()) return;
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  },

  async markAllRead(): Promise<void> {
    if (devMockEnabled()) return;
    await apiClient.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  },
};
