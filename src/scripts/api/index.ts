import http from 'ky-universal';
import { BacklogAPIEndpoints } from './types';

type RequestBacklogAPI = {
  [Method in keyof BacklogAPIEndpoints]: {
    [Endpoint in keyof BacklogAPIEndpoints[Method]]: (method: Method, endpoint: Endpoint) => any;
  }[keyof BacklogAPIEndpoints[Method]];
}[keyof BacklogAPIEndpoints];

export const requestBacklogAPI = async <Method extends keyof BacklogAPIEndpoints, Endpoint extends keyof BacklogAPIEndpoints[Method]>(method: Method, endpoint: Endpoint, query: BacklogAPIEndpoints[Method][Endpoint] extends { query: any } ? BacklogAPIEndpoints[Method][Endpoint]['query'] : {}): Promise<BacklogAPIEndpoints[Method][Endpoint] extends { response: any } ? BacklogAPIEndpoints[Method][Endpoint]['response'] : never> => {
  const searchParams = new URLSearchParams();

  if (process.env.BACKLOG_API_KEY) {
    searchParams.append('apiKey', process.env.BACKLOG_API_KEY);
  }

  Object.entries(query).forEach(([key, value]) => {
    switch (typeof value) {
      case 'string':
      case 'number':
      case 'bigint':
      case 'boolean':
        searchParams.append(key, value.toString());
    }
  })
  
  return await http(
    `https://${process.env.BACKLOG_SPACE_ID}.backlog.com${endpoint}`,
    {
      method,
      searchParams,
    }
  ).json();
}
