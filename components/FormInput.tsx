import clsx from "clsx";
import type React from "react";
import { useCallback } from "react";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onInput"> & {
	onInput(value: string): void;
};

export const FormInput: React.FC<Props> = ({
	onInput,
	className,
	...props
}) => {
	const customInputHandler = useCallback<
		React.FormEventHandler<HTMLInputElement>
	>(
		(e) => {
			if (e.target instanceof HTMLInputElement) {
				onInput(e.target.value);
			}
		},
		[onInput],
	);

	return (
		<div>
			<input
				className={clsx(
					"w-full border rounded-sm leading-7 py-2 px-4",
					className,
				)}
				onInput={customInputHandler}
				{...props}
			/>
		</div>
	);
};
