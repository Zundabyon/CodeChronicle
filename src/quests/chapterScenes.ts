import type { StoryLine } from '../story';
const narrator=(text:string):StoryLine=>({speaker:'語り手',face:'📜',text});
export const chapterTwoOpening:StoryLine[]=[narrator('石灯の村から、一通の手紙が届いた。村人の名簿から名前が消え、旅人を家族と取り違える者まで出始めたという。'),{speaker:'女将ハンナ',face:'👩',text:'今度は、あんたが覚えたことを、誰かの暮らしに返しておいで。帰りを待っているよ。'},narrator('第二章「消えた名簿」。平原の北東、石灯の村の記録係オルを訪ねよう。')];
export const chapterTwoFound:StoryLine[]=[narrator('宝箱の底板に、古い名簿の控えが挟まっていた。すでに宝を持ち出した箱でも、この薄い紙片は見落とされていた。'),narrator('名前はまだ読める。しかし住所の誤り、未登録の家族、重複した行が入り混じっている。紙片を大切に包み、石灯の村へ戻ろう。')];
export const chapterTwoEnding:StoryLine[]=[{speaker:'記録係 オル',face:'👴',text:'読む、直す、作る、不要な重複を消す。一つずつ確かめれば、名簿を元に戻せるのじゃな。'},narrator('正しい名簿を囲み、村人たちが互いの名前を呼ぶ。消えた記憶のすべては戻らなくても、また知り合うための手がかりは残せる。'),{speaker:'見習い ユナ',face:'🧒',text:'知識って、問題を解くだけじゃないんだね。誰かが困っているときに、使えるんだ。'},narrator('第二章「消えた名簿」完了。オルから70Gとエーテル1個を受け取った。両親の行方を追う旅は、まだ続いていく。')];
