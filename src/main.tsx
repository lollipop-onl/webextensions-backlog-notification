import 'tailwindcss/tailwind.css';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root')!);

root.render(<div className="text-red-500">Hello World</div>);
