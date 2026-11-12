// Dungeon explanations placed along the route. Bodies are authored with /question-author;
// placements come from the dungeon layouts (docs/production/chapter-two-act1-dungeon-request.md).
export type DungeonLesson={title:string;lines:string[]};
export const dungeonLessons:Record<string,DungeonLesson>={};

// Read state lives in save.readBooks under a prefix, so no new save field is needed.
export const lessonReadId=(id:string)=>'lesson:'+id;
export const isLessonRead=(readBooks:string[],id:string)=>readBooks.includes(lessonReadId(id));
export const lessonReadIds=()=>Object.keys(dungeonLessons).map(lessonReadId);
