import { PopupNavbar } from "ui";

type Props = {
  children: React.ReactNode;
};

export const PopupLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <PopupNavbar />
      {children}
    </div>
  );
};
