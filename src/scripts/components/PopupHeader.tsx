import React, { useState } from 'react';
import clsx from 'clsx';
import { AnimateSharedLayout, motion } from 'framer-motion';
import backlogLogo from '~~/images/backlog.png';

const HEADER_TABS = [{ text: 'お知らせ' }, /* { text: 'プロジェクト' } */];

export const PopupHeader: React.VFC = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <header className="flex items-center w-full px-2 bg-backlog">
      <img className="flex-shrink-0 h-10 mr-2" src={backlogLogo} alt="Backlog" />
      <AnimateSharedLayout>
        <ul className="flex">
          {HEADER_TABS.map(({ text }, index) => (
            <li key={index} className="h-full">
              <button
                className={clsx(
                  'relative h-full px-4 py-3 text-white transition-colors disabled:cursor-default',
                  {
                    'text-opacity-70 hover:text-opacity-100':
                      tabIndex !== index,
                  }
                )}
                disabled={tabIndex === index}
                onClick={() => setTabIndex(index)}
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
    </header>
  );
};
