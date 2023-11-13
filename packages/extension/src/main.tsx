import "tailwindcss/tailwind.css";
import { createRoot } from "react-dom/client";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import { PopupLayout } from "layouts/Popup";

const router = createMemoryRouter([
  {
    path: "/",
    element: (
      <PopupLayout>
        <Outlet />
      </PopupLayout>
    ),
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(<RouterProvider router={router} />);
