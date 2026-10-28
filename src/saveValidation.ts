import { normalizeDialogueLog } from './dialogueLog';
import { normalizeLearningRecords } from './learningRecords';
import { areaLabel, questions, type Area, type Point } from './content';
import { items, type Inventory, type Equipment, type ItemId } from './items';
import { migrateStoryStage } from './story';
import { normalizeReadBooks, normalizeBookmarks } from './library';
import { normalizeOpenedChests } from './chests';

type Shape={area:Area;pos:Point;inventory:Inventory;equipment:Equipment;openedChests:string[];readBooks:string[];bookmarks:Record<string,string>};
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const itemIds=new Set(Object.keys(items));
const questionIds=new Set(questions.map(q=>q.id));
const knownQuestion=(id:string)=>questionIds.has(id)||/^guardian-repair-[0-2]-(beginner|intermediate|advanced)$/.test(id);

export function validateSave<T extends Shape>(value:unknown,defaults:T):{save:T|null;notice:string} {
  if(!record(value)||!['area','pos','name'].some(key=>key in value))return {save:null,notice:'保存データの形式を読み取れませんでした。元のデータは変更していません。'};
  if(value.version!==undefined&&value.version!==1)return {save:null,notice:'この保存形式には対応していません。元のデータは変更していません。'};
  const save:Record<string,unknown>={...defaults},repairs=new Set<string>();
  const labels:Record<string,string>={gold:'所持金',level:'レベル',hp:'HP',mp:'MP',xp:'経験値',steps:'歩数',correct:'正解数',total:'回答数',wrong:'復習記録',answered:'回答記録',seen:'閲覧記録',defeated:'撃破記録',readBooks:'既読記録',openedChests:'宝箱の記録',name:'名前',story:'物語の進行',track:'学習コース',difficulty:'難易度'};
  const fix=(label:string)=>repairs.add(labels[label]??label);
  for(const [key,fallback] of Object.entries(defaults)) {
    if(key==='dialogueLog')continue;
    const candidate=value[key];if(candidate===undefined)continue;
    if(Array.isArray(fallback)) {
      if(!Array.isArray(candidate)){fix(key);continue;}
      const valid=candidate.filter((id):id is string=>typeof id==='string'&&id.length<=200).slice(-50000);
      save[key]=key==='answered'?valid:[...new Set(valid)];
      if(valid.length!==candidate.length)fix(key);
    } else if(typeof fallback==='number') {
      if(typeof candidate!=='number'||!Number.isFinite(candidate)){fix(key);continue;}
      const max=key==='level'?999:1000000000,min=key==='level'?1:0;
      const normalized=Math.min(max,Math.max(min,Math.floor(candidate)));save[key]=normalized;
      if(normalized!==candidate)fix(key);
    } else if(typeof fallback==='string'||typeof fallback==='boolean') {
      if(typeof candidate===typeof fallback)save[key]=candidate;else fix(key);
    }
  }
  save.dialogueLog=normalizeDialogueLog(value.dialogueLog);
  if(value.dialogueLog!==undefined&&JSON.stringify(value.dialogueLog)!==JSON.stringify(save.dialogueLog))fix('会話の履歴');
  save.learningRecords=normalizeLearningRecords(value.learningRecords);
  if(value.learningRecords!==undefined&&JSON.stringify(value.learningRecords)!==JSON.stringify(save.learningRecords))fix('学習記録');
  save.version=1;
  if(!['react','vue'].includes(String(save.track))){save.track='react';fix('学習コース');}
  if(!['beginner','intermediate','advanced'].includes(String(save.difficulty))){save.difficulty='beginner';fix('難易度');}
  save.story=migrateStoryStage(value.story);
  if(value.story!==undefined&&save.story!==value.story)fix('物語の進行');
  const name=typeof save.name==='string'?save.name.trim().slice(0,12):'';
  if(name!==save.name||!name)fix('名前');save.name=name||'旅人';
  if(typeof save.area!=='string'||!Object.hasOwn(areaLabel,save.area)){save.area='town';fix('現在地');}
  if(record(value.pos)&&Number.isInteger(value.pos.x)&&Number.isInteger(value.pos.y))save.pos={x:value.pos.x,y:value.pos.y};
  else if(value.pos!==undefined)fix('位置');
  const level=save.level as number;
  for(const [key,max] of [['hp',20+(level-1)*5],['mp',3+Math.floor((level-1)/2)]] as const) {
    if((save[key] as number)>max){save[key]=max;fix(key);}
  }
  if((save.correct as number)>(save.total as number)){save.total=save.correct;fix('回答数');}
  const inventory:Inventory={...defaults.inventory};
  if(record(value.inventory))for(const [id,count] of Object.entries(value.inventory)) {
    if(!itemIds.has(id)||typeof count!=='number'||!Number.isInteger(count)||count<0||count>1000000){fix('持ち物');continue;}
    inventory[id as ItemId]=items[id as ItemId].kind==='key'?Math.min(1,count):count;
  } else if(value.inventory!==undefined)fix('持ち物');
  const equipment={...defaults.equipment};
  for(const slot of ['weapon','armor'] as const) {
    const id=record(value.equipment)?value.equipment[slot]:undefined;
    if(typeof id==='string'&&itemIds.has(id)&&items[id as ItemId].kind===slot&&(inventory[id as ItemId]??0)>0)equipment[slot]=id as ItemId;
    else if(id!==undefined||value.equipment!==undefined&&!record(value.equipment))fix('装備');
    if(!(inventory[equipment[slot]]??0))inventory[equipment[slot]]=1;
  }
  save.inventory=inventory;save.equipment=equipment;
  for(const key of ['wrong','answered']) {
    const valid=(save[key] as string[]).filter(knownQuestion);
    if(valid.length!==(save[key] as string[]).length)fix('問題の記録');save[key]=valid;
  }
  save.openedChests=normalizeOpenedChests(value.openedChests).filter(id=>{const match=/^([a-zA-Z][a-zA-Z0-9]*):\d+,\d+$/.exec(id);return !!match&&Object.hasOwn(areaLabel,match[1]);});
  save.readBooks=normalizeReadBooks(value.readBooks);save.bookmarks=normalizeBookmarks(value.bookmarks);
  for(const [key,label] of [['openedChests','宝箱の記録'],['readBooks','既読記録'],['bookmarks','しおり']] as const) {
    if(value[key]!==undefined&&JSON.stringify(value[key])!==JSON.stringify(save[key]))fix(label);
  }
  if(value.lastSavedAt!==undefined) {
    if(typeof value.lastSavedAt==='number'&&Number.isFinite(value.lastSavedAt)&&value.lastSavedAt>0&&value.lastSavedAt<=8640000000000000)save.lastSavedAt=value.lastSavedAt;
    else fix('保存時刻');
  }
  const notice=[value.version===undefined?'旧形式の保存データを移行しました。':'',repairs.size?`不正な項目を補正しました：${[...repairs].join('、')}。`:''].filter(Boolean).join(' ');
  return {save:save as T,notice};
}
