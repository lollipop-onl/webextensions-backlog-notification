import type { BacklogNotification } from '~/types/backlog'

export type BacklogAPIEndpoints = {
  get: {
    '/api/v2/notifications': {
      query: {
        minId?: number;
        maxId?: number;
        count?: number;
        order?: 'asc' | 'desc';
        senderId?: number;
      },
      response: BacklogNotification[],
    },
    '/api/v2/notifications/count': {
      query: {},
      response: {
        count: number;
      }
    },
  },
}
