import React, { useCallback, useMemo, useState } from 'react';
import { ExclamationIcon, RefreshIcon } from '@heroicons/react/outline/esm';
import useSWR from 'swr';
import dayjs from 'dayjs';
import clsx from 'clsx';
import http, { HTTPError } from 'ky';
import { FormField } from '~/components/FormField';
import { FormInput } from '~/components/FormInput';
import { SpaceOptions } from '~/types/app';
import {
  getSpacesFromStorage,
  saveSpacesToStorage,
} from '~/utils/webextension';
import backlogImage from '~/images/backlog.png';
import { requestBacklogAPI } from '~/api';

export const OptionsApp: React.VFC = () => {
  const { data: savedSpaces = [] } = useSWR(
    'storage.local.spaces',
    getSpacesFromStorage,
    { suspense: true }
  );
  const [readAllState, setReadAllState] = useState<{
    errorMessage: string | null;
    isLoading: boolean;
  }>({ errorMessage: null, isLoading: false });
  const [spaces, setSpaces] = useState<SpaceOptions[]>(
    savedSpaces.length > 0 ? savedSpaces : [{ domain: '', apiKey: '' }]
  );
  const [isSaving, setSavingStatus] = useState(false);

  const validationErrorMessages = useMemo((): string[] => {
    return spaces.flatMap(({ domain, apiKey }) => {
      const errorMessages: string[] = [];

      if (!domain) {
        errorMessages.push('スペースドメインを入力してください');
      } else if (!/^[^/:]+\.backlog\.(?:jp|com)$/.test(domain)) {
        errorMessages.push(
          'スペースドメインは example.backlog.com もしくは example.backlog.jp の形で入力してください'
        );
      }

      if (!apiKey) {
        errorMessages.push('APIキーを入力してください');
      }

      return errorMessages;
    });
  }, [spaces]);

  const setSpaceValue = (
    value: string,
    key: keyof SpaceOptions,
    index: number
  ) => {
    setSpaces((spaces) =>
      spaces.map((space, i) => ({
        ...space,
        [key]: i === index ? value : space.domain,
      }))
    );
  };

  const savePreference = useCallback(async () => {
    try {
      setSavingStatus(true);

      await saveSpacesToStorage(spaces);
    } finally {
      setSavingStatus(false);
    }
  }, [spaces]);

  const readAll = async () => {
    try {
      setReadAllState({ errorMessage: null, isLoading: true });

      const [space] = spaces;

      if (!space) {
        return;
      }

      const { domain, apiKey } = space;
      const { count } = await requestBacklogAPI(
        'get',
        '/api/v2/notifications/count',
        { resourceAlreadyRead: false }
      );

      let maxId: number | undefined;

      for (let i = count; i > 0; ) {
        const notifications = await requestBacklogAPI(
          'get',
          '/api/v2/notifications',
          { count: 100, maxId }
        );
        const unreadNotificationIdList = notifications
          .filter(({ resourceAlreadyRead }) => !resourceAlreadyRead)
          .map(({ id }) => id);

        await Promise.all(
          unreadNotificationIdList.map(async (id) => {
            const searchParams = new URLSearchParams();

            searchParams.append('apiKey', apiKey);

            await http(
              `https://${domain}/api/v2/notifications/${id}/markAsRead`,
              {
                method: 'post',
                searchParams,
              }
            );
          })
        );

        i -= unreadNotificationIdList.length;

        maxId = notifications.slice().pop()?.id;

        if (maxId == null) {
          throw new Error('お知らせ一覧が取得できませんでした。');
        }
      }
    } catch (err) {
      if (err instanceof HTTPError) {
        const { status } = err.response;

        switch (status) {
          case 401: {
            setReadAllState(({ isLoading }) => ({
              errorMessage:
                '認証情報が不正です。登録されているスペースで利用可能なAPIキーを登録してください。',
              isLoading,
            }));

            return;
          }
          case 429: {
            const { 'X-RateLimit-Reset': rateLimitReset } = err.response
              .headers as any;

            setReadAllState(({ isLoading }) => ({
              errorMessage: `レート制限に達しました。制限は${dayjs(
                rateLimitReset
              ).format('YYYY/MM/DD HH:mm:ss')}に解除されます。`,
              isLoading,
            }));

            return;
          }
        }
      }

      if (err instanceof Error) {
        const errorMessage = err.message;

        setReadAllState(({ isLoading }) => ({ errorMessage, isLoading }));

        return;
      }

      setReadAllState(({ isLoading }) => ({
        errorMessage: '不明なエラーが発生しました。',
        isLoading,
      }));
    } finally {
      setReadAllState(({ errorMessage }) => ({
        errorMessage,
        isLoading: false,
      }));
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-2">
        <img className="h-10 mr-3" src={backlogImage} alt="Backlog" />
        <h1 className="text-2xl leading-7">Notification Extension</h1>
        <button
          type="button"
          className="flex items-center justify-center w-32 py-2 ml-auto text-sm text-white transition-colors rounded-md bg-backlog hover:bg-green-500"
          disabled={isSaving}
          onClick={savePreference}
        >
          {isSaving ? (
            <RefreshIcon className="h-5 animate-spin" />
          ) : (
            '設定を保存'
          )}
        </button>
      </div>
      <p className="mb-3 text-xs leading-7 text-gray-400">
        「設定を保存」ボタンを押すまで、拡張機能の設定は更新されません。
      </p>
      <hr className="mb-8 border-b" />
      <div className="px-8">
        {spaces.map(({ domain, apiKey }, index) => (
          <div key={index}>
            <div className="mb-5">
              <FormField label="スペースドメイン">
                <FormInput
                  defaultValue={domain}
                  placeholder="example.backlog.com"
                  onInput={(value) => setSpaceValue(value, 'domain', index)}
                />
              </FormField>
            </div>
            <FormField label="APIキー">
              <FormInput
                defaultValue={apiKey}
                placeholder="xxxxxxxxxxxxxxxxxxxxx"
                onInput={(value) => setSpaceValue(value, 'apiKey', index)}
              />
            </FormField>
            <p className="mt-2 pl-[120px] text-sm text-gray-400">
              そのスペースで使用できるAPIキーを指定します。
              <a
                className="underline hover:no-underline"
                href="https://backlog.com/ja/blog/backlog-api-rate-limit-announcement/"
                target="_blank"
                rel="noreferrer"
              >
                レート制限
              </a>
              による影響を減らすため、この拡張機能専用のAPIキーを発行することをおすすめします。
              <a
                className="ml-1 underline hover:no-underline"
                href="https://support-ja.backlog.com/hc/ja/articles/360035641754-API%E3%81%AE%E8%A8%AD%E5%AE%9A"
                target="_blank"
                rel="noreferrer"
              >
                新しいAPIキーを発行する
              </a>
            </p>
          </div>
        ))}
        {validationErrorMessages.length > 0 && (
          <div className="mt-8 pl-[120px]">
            {validationErrorMessages.map((message) => (
              <div key={message} className="flex mb-2 text-red-800 last:mb-0">
                <ExclamationIcon className="h-6" />
                <p className="ml-2 leading-6">{message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <hr className="my-8 border-b" />
      <div className="px-8">
        <FormField label="すべて既読">
          <button
            className={clsx(
              'flex w-72 justify-center items-center h-8 text-white transition-colors bg-red-500 rounded-md',
              {
                'disabled:bg-gray-400': validationErrorMessages.length > 0,
                'hover:bg-red-600':
                  validationErrorMessages.length === 0 &&
                  !readAllState.isLoading,
              }
            )}
            disabled={
              validationErrorMessages.length > 0 || readAllState.isLoading
            }
            onClick={readAll}
          >
            {readAllState.isLoading ? (
              <RefreshIcon className="h-5 mr-2 animate-spin" />
            ) : (
              '未読のお知らせをすべて既読にする'
            )}
          </button>
        </FormField>
        <div className="mt-2 pl-[120px]">
          <p className="text-sm text-gray-400">
            未読のお知らせをすべて既読にします。レート制限によって、一度ではすべてのお知らせを既読にできない可能性があります。
          </p>
          {readAllState.errorMessage && (
            <div className="flex mt-8 text-red-800">
              <ExclamationIcon className="h-6" />
              <p className="ml-2 leading-6">{readAllState.errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
