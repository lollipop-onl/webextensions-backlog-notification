import { useCallback, useMemo } from 'react';
import { useStorage } from './useStorage';

type RouteName = 'notices' | 'projects' | 'issues';

export const useStorageRouter = () => {
  const [route, setRoute] = useStorage('popup.route', 'notices');

  const currentRoute = useMemo<RouteName | null>(() => {
    switch (route) {
      case 'notices':
      case 'projects':
      case 'issues':
        return route;
      default:
        return null;
    }
  }, [route]);

  const navigateRoute = useCallback(
    async (route: RouteName) => {
      await setRoute(route);
    },
    [setRoute],
  );

  return { currentRoute, navigateRoute };
};
