export type ResourceAction = 'index'|'show'|'create'|'store'|'edit'|'update'|'destroy';
export type TableSnapshot = {columns:string[];rows:string[][]};
export type QuestStudy = {
  objective:string;
  request?:string;
  action?:ResourceAction;
  before?:TableSnapshot;
  after?:TableSnapshot;
  result:string;
  mode?:'practice'|'checkpoint';
};
