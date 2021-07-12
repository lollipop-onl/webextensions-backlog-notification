import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { OptionsApp } from '~/components/OptionsApp';
import 'tailwindcss/tailwind.css';

const $container = document.createElement('div');

document.body.appendChild($container);

ReactDOM.render(
  <Suspense fallback={<p>Loading from storage...</p>}>
    <OptionsApp />
  </Suspense>,
  $container
);
