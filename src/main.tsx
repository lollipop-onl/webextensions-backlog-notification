import 'tailwindcss/tailwind.css';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import { PopupLayout } from 'popup/Layout';

const router = createHashRouter([
  {
    path: 'popup',
    element: <PopupLayout />,
  },
]);

const root = createRoot(document.getElementById('root')!);
root.render(<RouterProvider router={router} />);
