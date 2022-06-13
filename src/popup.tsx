import { createRoot } from 'react-dom/client';
import '~/style.css';

const rootEl = document.createElement('div');

document.body.appendChild(rootEl);

createRoot(rootEl).render(<div>hello you.</div>)