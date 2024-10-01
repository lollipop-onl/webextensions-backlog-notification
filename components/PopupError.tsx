import { ExclamationIcon } from "@heroicons/react/outline";
import { HTTPError } from "ky";
import type React from "react";
import { useMemo } from "react";
import type { FallbackProps } from "react-error-boundary";
import { browser } from "wxt/browser";

export const PopupError: React.VFC<FallbackProps> = ({ error }) => {
	const errorMessage = useMemo(() => {
		if (!(error instanceof HTTPError)) {
			return error.message;
		}

		const { status } = error.response;

		switch (status) {
			case 401:
				return "認証情報が不正です。登録されているスペースで利用可能なAPIキーを登録してください。";
			default:
				return `不明なエラーが発生しました。 (${error.name}: ${error.message})`;
		}
	}, [error]);

	const openOptionPage = async () => {
		await browser.runtime.openOptionsPage();

		window.close();
	};

	const openGitHubIssue = async () => {
		await browser.tabs.create({
			url: "https://github.com/lollipop-onl/webextensions-backlog-notification/issues/new",
		});

		window.close();
	};

	return (
		<div className="px-4 pt-10 pb-6">
			<div className="flex flex-col justify-center">
				<div className="mb-8">
					<ExclamationIcon className="w-24 mx-auto mb-2 text-backlog" />
					<p className="px-4 leading-7 text-gray-700">{errorMessage}</p>
				</div>
				<button
					className="inline-flex items-center justify-center px-6 py-2 mb-4 text-sm text-white transition-colors rounded-md bg-backlog hover:bg-green-500"
					onClick={openOptionPage}
				>
					拡張機能の設定を開く
				</button>
				<p className="px-8 text-xs text-center text-gray-500">
					問題が解決しませんか？
					<br />
					不具合報告・質問は
					<button
						className="mx-1 underline hover:no-underline"
						onClick={openGitHubIssue}
					>
						GitHub Issue
					</button>
					へお問い合わせください
				</p>
			</div>
		</div>
	);
};
