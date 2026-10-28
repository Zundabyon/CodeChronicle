export type DialogueLogEntry={speaker:string;text:string;at:number};
export function normalizeDialogueLog(value:unknown):DialogueLogEntry[]{
  if(!Array.isArray(value))return [];
  return value.filter((entry):entry is DialogueLogEntry=>!!entry&&typeof entry==='object'&&typeof entry.speaker==='string'&&typeof entry.text==='string'&&typeof entry.at==='number'&&Number.isFinite(entry.at)&&entry.at>0&&entry.at<=8640000000000000).slice(-100).map(e=>({speaker:e.speaker.slice(0,40),text:e.text.slice(0,2000),at:e.at}));
}
export function appendDialogueLog(log:DialogueLogEntry[],speaker:string,text:string):DialogueLogEntry[]{return [...log.slice(-99),{speaker:speaker.slice(0,40),text:text.slice(0,2000),at:Date.now()}];}
