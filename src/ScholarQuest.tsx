export function ScholarQuest({accepted,ready,completed}:{accepted:boolean;ready:boolean;completed:boolean}){
  return <details className="learning-records"><summary>住民の依頼：図書館の案内板</summary>{completed?<p>完了：司書見習いの案内板が直りました。お礼は受け取り済みです。</p>:!accepted?<p>未受注：図書館 西棟1階の司書見習いが、案内板の修理を手伝ってくれる人を探しています。任意の依頼です。</p>:<><p>{ready?'報告待ち：西棟1階の司書見習いに成果を報告しましょう。':'受注中：URLと処理の行き先をつなぐしくみを学ぼう。'}</p><ol><li>東棟2階「ルート」の「01 URLに応答する」を読んで既読にする。</li><li>その本の確認問題に正解する。</li><li>西棟1階の司書見習いへ報告する。</li></ol><p>お礼：40G・やくそう1個。主な物語とは別に進められます。</p></>}</details>;
}
