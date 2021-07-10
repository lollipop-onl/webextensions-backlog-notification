import React from 'react';
import ReactDOM from 'react-dom';
import { PopupApp } from '~/components/PopupApp';
import 'tailwindcss/tailwind.css';

const $container = document.createElement('div');

document.body.appendChild($container);

ReactDOM.render(<PopupApp />, $container);
