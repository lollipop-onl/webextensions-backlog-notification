import React from 'react';
import clsx from 'clsx';
import { browser } from 'webextension-polyfill-ts';
import { AnimateSharedLayout, motion } from 'framer-motion';
import { CogIcon } from '@heroicons/react/solid';

export const POPUP_HEADER_TABS = [
  { text: 'お知らせ' },
  { text: 'プロジェクト' },
];

export type Props = {
  tabIndex: number;
  onChange(index: number): void;
};

export const PopupHeader: React.VFC<Props> = ({ tabIndex, onChange }) => {
  const openOptionPage = async () => {
    await browser.runtime.openOptionsPage();

    window.close();
  };

  return (
    <header className="flex items-center w-full px-4 bg-backlog">
      <AnimateSharedLayout>
        <ul className="flex">
          {POPUP_HEADER_TABS.map(({ text }, index) => (
            <li key={index} className="h-full">
              <button
                className={clsx(
                  'relative h-full px-4 py-3 text-white transition-colors text-sm disabled:cursor-default',
                  {
                    'text-opacity-70 hover:text-opacity-100':
                      tabIndex !== index,
                  }
                )}
                disabled={tabIndex === index}
                onClick={() => onChange(index)}
              >
                {text}
                {tabIndex === index && (
                  <motion.span
                    layoutId="underline"
                    className="absolute bottom-0 left-0 block w-full h-1 bg-white"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </AnimateSharedLayout>
      <button
        className="ml-auto transition-opacity opacity-60 hover:opacity-100"
        onClick={openOptionPage}
      >
        <CogIcon className="h-6 text-white" />
      </button>
    </header>
  );
};
