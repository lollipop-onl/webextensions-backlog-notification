import React, { useCallback, useMemo, useState } from "react";
import { ExclamationIcon, RefreshIcon } from '@heroicons/react/outline'
import useSWR from 'swr'
import { FormField } from "~/components/FormField";
import { FormInput } from "~/components/FormInput";
import { SpaceOptions } from "~/types/app";
import { getSpacesFromStorage, saveSpacesToStorage } from "~/utils/webextension";
import backlogImage from '~~/images/backlog.png'

export const OptionsApp: React.VFC = () => {
  const { data: savedSpaces } = useSWR('storage.local.spaces', getSpacesFromStorage, { suspense: true });
  const [spaces, setSpaces] = useState<SpaceOptions[]>(savedSpaces || [{ domain: '', apiKey: '' }]);
  const [isSaving, setSavingStatus] = useState(false)

  const validationErrorMessages = useMemo((): string[] => {
    return spaces.flatMap(({ domain, apiKey }) => {
      const errorMessages: string[] = []

      if (!domain) {
        errorMessages.push('スペースドメインを入力してください');
      } else if (!/^[^/:]+\.backlog\.(?:jp|com)$/.test(domain)) {
        errorMessages.push('スペースドメインは example.backlog.com もしくは example.backlog.jp の形で入力してください')
      }

      if (!apiKey) {
        errorMessages.push('APIキーを入力してください')
      }

      return errorMessages;
    })
  }, [spaces])
  
  const setSpaceValue = (value: string, key: keyof SpaceOptions, index: number) => {
    setSpaces((spaces) => spaces.map((space, i) => ({ ...space, [key]: i === index ? value : space.domain })));
  }

  const savePreference = useCallback(async () => {
    try {
      setSavingStatus(true);

      await saveSpacesToStorage(spaces)
    } finally {
      setSavingStatus(false);
    }
  }, [spaces])
  
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
          {isSaving ? <RefreshIcon className="h-5" /> : '設定を保存'}
        </button>
      </div>
      <p className="mb-3 text-xs leading-7 text-gray-400">「設定を保存」ボタンを押すまで、拡張機能の設定は更新されません。</p>
      <hr className="mb-8 border-b" />
      <div className="px-8">
        {spaces.map(({ domain, apiKey }, index) => (
          <div key={index}>
            <div className="mb-5">
              <FormField label="スペースドメイン">
                <FormInput defaultValue={domain} placeholder="example.backlog.com" onInput={(value) => setSpaceValue(value, 'domain', index)} />
              </FormField>
            </div>
            <FormField label="APIキー">
              <FormInput defaultValue={apiKey} placeholder="xxxxxxxxxxxxxxxxxxxxx" onInput={(value) => setSpaceValue(value, 'apiKey', index)} />
            </FormField>
            <p className="mt-2 pl-[120px] text-sm text-gray-400">
              そのスペースで使用できるAPIキーを指定します。
              <a
                className="ml-1 underline hover:no-underline"
                href="https://support-ja.backlog.com/hc/ja/articles/360035641754-API%E3%81%AE%E8%A8%AD%E5%AE%9A"
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
    </div>
  )
}
