import { Navbar } from 'popup/components/Navbar';
import { useStorageRouter } from 'popup/hooks/useStorageRouter';

export const PopupLayout = () => {
  const { currentRoute } = useStorageRouter();

  return (
    <div>
      <Navbar />
      {currentRoute === 'projects' ? (
        <p>Projects</p>
      ) : currentRoute === 'issues' ? (
        <p>Issues</p>
      ) : (
        <p>Notices</p>
      )}
    </div>
  );
};
