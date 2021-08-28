import type { BacklogNotification, BacklogProject } from '~/types/backlog';

export type BacklogAPIEndpoints = {
  get: {
    '/api/v2/projects': {
      query: {
        archived?: boolean;
        all?: boolean;
      };
      response: BacklogProject[];
    };
    '/api/v2/users/myself/recentlyViewedProjects': {
      query: {
        order?: 'asc' | 'desc';
        offset?: number;
        count?: number;
      };
      response: Array<{
        project: BacklogProject;
        updated: string;
      }>;
    };
    '/api/v2/notifications': {
      query: {
        minId?: number;
        maxId?: number;
        count?: number;
        order?: 'asc' | 'desc';
        senderId?: number;
      };
      response: BacklogNotification[];
    };
    '/api/v2/notifications/count': {
      query: {
        alreadyRead?: boolean;
        resourceAlreadyRead?: boolean;
      };
      response: {
        count: number;
      };
    };
  };
};
