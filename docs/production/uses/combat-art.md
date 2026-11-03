# 攻撃・戦闘表現

主人公に限定せず、攻撃者・敵・武器・技を差し込める制作仕様。待機絵、連続ポーズ、被弾、魔法/効果を分け、ゲームの結果確定と絵の再生を混同しない。

入力は対象の固有設定、用途（待機/攻撃/被弾等）、向き、技、武器、ポーズ順、接地点、実表示枠、再生契約。現行戦闘の主人公は左向き、既存敵は右向き。全用途を画像反転だけで済ませず、装備や非対称な特徴を確認する。

攻撃の見本は構え→予備動作→打撃→振り抜き→戻り→構え。6コマを全攻撃者へ強制せず、動作を読めることと再生側の対応を基準にする。武器・効果・マントを含む全体がセル内へ収まるようにし、コマごとに対象が別人にならない。足元と縮尺を合わせる。背景のalphaと隣コマの混入を確認する。

現行の登録先は [HeroBattleSprite.tsx](../../../src/HeroBattleSprite.tsx)、[heroAttackArt.ts](../../../src/heroAttackArt.ts)、[EnemySprite.tsx](../../../src/EnemySprite.tsx)、[BattleEncounter.tsx](../../../src/BattleEncounter.tsx)、[BattleStage.tsx](../../../src/BattleStage.tsx)、[battleTiming.ts](../../../src/battleTiming.ts)。個別のbox/anchor/clipsは実測結果としてTSへ残す。見本から全対象の固定cropを作らない。

対応状況：3つの主人公攻撃と既存敵描画は専用実装あり。任意キャラの連続攻撃や全敵アニメーションは未対応。静止敵を全コマ対応済みとしない。

読み込み中の待機絵、向き、全コマの足元、武器先端、モーション軽減、ダメージ・勝利・報酬の一回反映を確認する。過去の[攻撃記録](../../../public/sprites/hero-attack-art.json)と[戦闘素材記録](../../../public/sprites/battle-art.json)は実例として参照し、再利用した指示と実際の差分は[新しい履歴](../templates/record.md)へ残す。
