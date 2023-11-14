import { Link } from "react-router-dom";

const NAV_ITEMS = [
  { text: "お知らせ", path: "/notices" },
  { text: "プロジェクト", path: "projects" },
  { text: "課題", path: "issues" },
];

export const PopupNavbar: React.FC = () => {
  return (
    <header className="bg-brand px-4 h-8">
      <nav className="h-full flex items-stretch">
        {NAV_ITEMS.map(({ text, path }) => (
          <Link
            className="grid place-items-center text-white text-opacity-70 px-3"
            to={path}
          >
            {text}
          </Link>
        ))}
      </nav>
    </header>
  );
};
