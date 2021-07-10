import React, { FormEvent, useCallback } from "react";
import clsx from 'clsx'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onInput'> & {
  onInput(value: string): void;
};

export const FormInput: React.VFC<Props> = ({ onInput, className, ...props }) => {
  const customInputHandler = useCallback<React.FormEventHandler<HTMLInputElement>>((e) => {
    if (e.target instanceof HTMLInputElement) {
      onInput(e.target.value);
    }
  }, []);
  
  return (
    <div>
      <input className={clsx('w-full border rounded-sm leading-7 py-2 px-4', className)} onInput={customInputHandler} {...props} />
    </div>
  )
}