import { clsx } from 'clsx';
import { useStorageRouter } from 'popup/hooks/useStorageRouter';

const NAV_ITEMS = [
  { route: 'notices', text: 'お知らせ' },
  { route: 'projects', text: 'プロジェクト' },
  { route: 'issues', text: '課題' },
] as const;

export const Navbar: React.FC = () => {
  const { currentRoute, navigateRoute } = useStorageRouter();

  return (
    <header className="h-11 bg-backlog px-3">
      <nav className="flex h-full items-stretch">
        {NAV_ITEMS.map(({ route, text }) => (
          <button
            key={route}
            className={clsx('grid place-items-center px-3 text-sm text-white', {
              'border-b-4 border-white pt-1 font-bold': currentRoute === route,
              'text-opacity-75 hover:text-opacity-100': currentRoute !== route,
            })}
            onClick={() => navigateRoute(route)}
          >
            {text}
          </button>
        ))}
      </nav>
    </header>
  );
};
