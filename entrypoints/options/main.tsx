import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { OptionsApp } from '~/components/OptionsApp';
import 'tailwindcss/tailwind.css';

dayjs.extend(relativeTime);
dayjs.locale('ja', {
  relativeTime: {
    M: '1ヶ月',
    MM: '%dヶ月',
    d: '1日',
    dd: '%d日',
    future: '%s後',
    h: '1時間',
    hh: '%d時間',
    m: '数分',
    mm: '%d分',
    past: '%s前',
    s: '数秒',
    y: '1年',
    yy: '%d年',
  },
});

const $container = document.getElementById('app');

ReactDOM.render(
  <Suspense fallback={null}>
    <OptionsApp />
  </Suspense>
, $container);