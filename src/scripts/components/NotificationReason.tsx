import React from 'react';

export type Props = {
  reason: number;
}

export const NotificationReason: React.VFC<Props> = ({
  reason,
}) => {
  switch (reason) {
    // 課題の担当者に設定
    case 1:
      return (
        <span>
          が<span className="px-1 text-green-700">担当者</span>
          に設定しました。
        </span>
      );
    // 課題にコメント
    case 2:
      return (
        <span>
          が<span className="px-1 text-green-700">コメント</span>
          しました。
        </span>
      );
    // 課題の追加
    case 3:
      return (
        <span>
          が課題を
          <span className="px-1 text-green-700">追加</span>
          しました。
        </span>
      );
    // 課題の更新
    case 4:
      return (
        <span>
          が課題を
          <span className="px-1 text-green-700">更新</span>
          しました。
        </span>
      );
    // ファイルを追加
    case 5:
      return (
        <span>
          が<span className="px-1 text-red-800">ファイルを追加</span>
          しました。
        </span>
      );
    // プロジェクトユーザーの追加
    case 6:
      return (
        <span>
          がプロジェクトに
          <span className="px-1 text-red-800">追加</span>
          しました。
        </span>
      );
    // その他
    case 9:
      return <span>のその他アクション</span>;
    // プルリクエストの担当者に設定
    case 10:
      return (
        <span>
          がプルリクエストの
          <span className="px-1 text-green-700">担当者</span>
          に設定しました。
        </span>
      );
    // プルリクエストにコメント
    case 11:
      return (
        <span>
          がプルリクエストに
          <span className="px-1 text-green-700">コメント</span>
          しました。
        </span>
      );
    // プルリクエストの追加
    case 12:
      return (
        <span>
          がプルリクエストを
          <span className="px-1 text-green-700">追加</span>
          しました。
        </span>
      );
    // プルリクエストの更新
    case 13:
      return (
        <span>
          がプルリクエストを
          <span className="px-1 text-green-700">更新</span>
          しました。
        </span>
      );
    default:
      return <span>のその他アクション</span>;
  }
};
