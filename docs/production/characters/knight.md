# 謎の騎士の固有設定

状態：ツノなしが現在の採用方針。共通の[会話画像](../uses/dialogue-portraits.md)と[マップ画像](../uses/map-sprites.md)に、この固有情報を組み合わせる。

- 確定特徴：閉じた銀/青鋼色の兜、黒いバイザーで顔を隠す、紫のマント/襟元、金の留め具、剣。顔・目・素肌を見せる設定へ勝手に変更しない。ツノは付けない。
- 物語上の事実・登場条件：[story.ts](../../../src/story.ts)と[WorldScene.tsx](../../../src/WorldScene.tsx)が正本。人物の正体など未確定の内容を外見のプロンプトへ加えない。
- 人物同定用の参照：[マップ原画](../../../public/sprites/knight-generated-original.png)、[会話肖像](../../../public/portraits/knight-v2.png)。絵柄の参考は[既存の会話肖像](../../../public/portraits/faces.png)。
- 現在の対応：マップ静止と専用会話肖像。歩行シート・連続攻撃素材は未対応。実測値と描画分岐は [MysteriousKnight.tsx](../../../src/MysteriousKnight.tsx)、呼び出しは [CharacterPortrait.tsx](../../../src/CharacterPortrait.tsx) を参照。
- 制作履歴：[マップ](../../../public/sprites/knight-art.txt)、[会話](../../art/knight-portrait-v2.md)。ツノの試案は不採用・撤回済み。形の好みと絵柄の不一致を別に記録し、不採用の特徴を全キャラの禁止事項へ一般化しない。
