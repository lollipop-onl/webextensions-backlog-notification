import { Navbar } from "components/Navbar";

type Props = {
  children: React.ReactNode;
};

export const PopupLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};
