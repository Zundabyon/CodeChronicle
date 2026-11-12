#!/usr/bin/env node
// Read-only by default. --write refreshes the existing architecture inventory.
import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync,existsSync,statSync,readdirSync} from 'node:fs';
import {resolve,dirname,extname,relative} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const target='docs/architecture/file-inventory.json';
const excluded=new Set([target,'docs/architecture/codechronicle-architecture.html']);
const genres={
  world:{label:'世界・場所',guide:'docs/production/world.md'},
  characters:{label:'人物・生物',guide:'docs/production/characters.md'},
  motion:{label:'動き・演出',guide:'docs/production/motion.md'},
  narrative:{label:'物語・進行',guide:'docs/production/narrative.md'},
  learning:{label:'教材・学習',guide:'docs/production/learning.md'},
  gameplay:{label:'ゲームルール',guide:'docs/production/gameplay.md'},
  presentation:{label:'画面・表現・操作',guide:'docs/production/presentation.md'},
  persistence:{label:'状態・保存',guide:'docs/production/persistence.md'},
  operations:{label:'制作・運用',guide:'docs/production/operations.md'},
};
const flat={
  world:['WorldScene','TerrainTile','TownMap','TravelMap','townMap','travelMap','worldAmbient'],
  characters:['WorldCharacter','CharacterPortrait','MysteriousKnight','EnemySprite','PixelSprite'],
  motion:['battleTiming','heroAttackArt','HeroBattleSprite','EnemyEffectSprite','enemyMovement','RecoveryCue','LevelUpCue','characterArt','heroBattleSprite','bossBreakEffect','recoveryCue','levelUpCue','chestRewardCue'],
  narrative:['story','dialogueLog','DialogueHistoryPanel','DialogueChoices','heroBanter','battleBanter'],
  learning:['questionCatalog','catalogRelease','content','questionSelection','wrongChoiceReasons','bookQuestions','library','LibraryPanel','LibrarySearch','BookPractice','LearningRecordPanel','LearningSession','LearningSetupHelp','QuestionCode','ReviewRoom','learningRecords','reviewSchedule','learningRecords','learningSession','learningSetupHelp','librarySearch','reviewRoom','questLearning'],
  gameplay:['bossBattle','heroTechniques','items','chests','ChestSprite','AdventurePanels','BattleStage','BattleEncounter','battle','chestSprite'],
  presentation:['titleMotion','QuestionBootstrap','questionBootstrap','TitleScreen','ControlsGuide','keyboardNavigation','keyboardShortcuts','audioPreferences','base','style','titleScreen','chapterStart'],
  persistence:['saveValidation','SaveTransfer','SaveStatus','ResumeSummary','saveTransfer','saveStatus','resumeSummary'],
  operations:['App','main','vite-env.d'],
};
function classify(path){
  if(path.startsWith('worker/')||['tsconfig.worker.json','worker-configuration.d.ts'].includes(path))return 'operations';
  if(['seed.lab.sql','seed.game.sql'].includes(path))return 'persistence';
  if(path.startsWith('migrations/'))return 'persistence';
  if(path.startsWith('src/motion/'))return 'motion';
  if(path.startsWith('src/dev/'))return 'operations';
  if(path.startsWith('src/world/'))return /memoryEnemy(Art|Identity)\.ts$/.test(path)?'characters':'world';
  if(path.startsWith('src/quests/'))return /\/(chapterTwoLessons|memoryBattleQuestion|QuestStudyPanel|studyTypes)\./.test(path)?'learning':/\/persistence\./.test(path)?'persistence':'narrative';
  if(path.startsWith('src/')){
    const name=path.slice(4).replace(/\.(tsx?|css)$/,'');
    if(/Questions$/.test(name))return 'learning';
    return Object.entries(flat).find(([,names])=>names.includes(name))?.[0];
  }
  if(path.startsWith('public/maps/'))return 'world';
  if(path.startsWith('public/portraits/'))return 'characters';
  if(path.startsWith('public/sprites/'))return /\/hero-(walk|attack)/.test(path)?'motion':'characters';
  if(path.startsWith('public/prologue/'))return 'narrative';
  if(/^public\/(title|fonts)\//.test(path))return 'presentation';
  if(path.startsWith('docs/production/characters/'))return 'characters';
  if(path.startsWith('docs/production/uses/'))return /\/(walking|combat-art|object-motion)\./.test(path)?'motion':/\/(dialogue-portraits|map-sprites)\./.test(path)?'characters':/\/backgrounds\./.test(path)?'presentation':'world';
  if(path.startsWith('docs/production/'))return Object.keys(genres).find(id=>path===`docs/production/${id}.md`)??'operations';
  if(/^docs\/art\/(knight|memory-enemies)/.test(path))return 'characters';
  if(/^docs\/art\/memory-props/.test(path))return 'world';
  if(path==='docs/art-direction.md'||/^docs\/art\/title/.test(path))return 'presentation';
  if(path==='docs/quests.md')return 'narrative';
  if(/^docs\/(question-authoring|chapter-two-learning)\./.test(path))return 'learning';
  if(/^(docs|tests|scripts|output|\.agents|\.codex|\.claude|\.github)\//.test(path))return 'operations';
  if(['README.md','CLAUDE.md','.gitignore','.gitattributes','package.json','package-lock.json','index.html','tsconfig.json','vite.config.ts','wrangler.staging.jsonc'].includes(path))return 'operations';
}
const args=process.argv.slice(2);
if(args.some(arg=>!['--write','--check'].includes(arg))||args.length>1){console.error('Usage: node scripts/production-inventory.mjs [--check|--write]');process.exit(2);}
const paths=[...new Set(execFileSync('git',['ls-files','--cached','--others','--exclude-standard','-z'],{cwd:root,encoding:'utf8'}).split('\0'))].filter(path=>path&&!excluded.has(path)&&existsSync(resolve(root,path))&&statSync(resolve(root,path)).isFile()).sort();
const prior=JSON.parse(readFileSync(resolve(root,target),'utf8'));
const old=new Map(prior.files.map(entry=>[entry.path,entry]));
const errors=[];
const files=paths.map(path=>{
  const genre=classify(path);
  if(!genre){errors.push(`Unclassified file: ${path}`);return null;}
  const saved=old.get(path);
  return {...saved,path,bytes:statSync(resolve(root,path)).size,suffix:extname(path),group:saved?.group??genres[genre].label,role:saved?.role??`${genres[genre].label}に関する${path.startsWith('docs/')?'制作規約・記録':path.startsWith('public/')?'素材または制作情報':path.startsWith('tests/')?'検証':path.startsWith('.agents/')||path.startsWith('.codex/')||path.startsWith('.claude/')?'作業手順・担当設定':'定義・処理・運用ファイル'}。用途と登録先はジャンル案内を参照。`,genre};
}).filter(Boolean);
function walk(path){return existsSync(path)?readdirSync(path,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(path,entry.name)):[resolve(path,entry.name)]):[];}
// Verify every local Markdown link in the new guide and project skills.
for(const file of [...walk(resolve(root,'docs/production')),...walk(resolve(root,'.agents/skills'))].filter(path=>path.endsWith('.md'))){
  for(const [,link]of readFileSync(file,'utf8').matchAll(/\]\(([^\s)]+)\)/g)){
    if(/^(https?:|mailto:|#)/.test(link))continue;
    const destination=decodeURIComponent(link.split('#')[0]);
    if(destination&&!existsSync(resolve(dirname(file),destination)))errors.push(`Missing link ${relative(root,file)} -> ${link}`);
  }
}
for(const {guide}of Object.values(genres))if(!existsSync(resolve(root,guide)))errors.push(`Missing genre guide: ${guide}`);
if(!args.includes('--write')){
  if(prior.count!==files.length)errors.push(`Inventory count ${prior.count}, actual ${files.length}; run --write`);
  for(const file of files){const previous=old.get(file.path);if(!previous||previous.genre!==file.genre||previous.bytes!==file.bytes)errors.push(`Stale inventory: ${file.path}; run --write`);}
  for(const path of old.keys())if(!paths.includes(path))errors.push(`Removed file still indexed: ${path}`);
}
if(errors.length){errors.forEach(error=>console.error(error));process.exit(1);}
const countBy=field=>Object.fromEntries([...new Set(files.map(file=>file[field]))].sort().map(value=>[value,files.filter(file=>file[field]===value).length]));
if(args.includes('--write')){
  const commit=execFileSync('git',['rev-parse','--short','HEAD'],{cwd:root,encoding:'utf8'}).trim();
  writeFileSync(resolve(root,target),JSON.stringify({snapshot:`${new Date().toISOString().slice(0,10)} / ${commit} + current working tree`,scope:'git cached and untracked non-ignored existing files; generated architecture HTML and inventory itself excluded',detailSnapshot:prior.detailSnapshot??{snapshot:prior.snapshot,fields:['lines','imports','staticReferenceHints'],status:'Historical source/reference hints retained; not recomputed by this classification tool. Verify against current source.'},count:files.length,groups:countBy('group'),genres:Object.fromEntries(Object.entries(genres).map(([id,genre])=>[id,{...genre,count:files.filter(file=>file.genre===id).length}])),files},null,2)+'\n');
}
console.log(`PASS: ${files.length} files classified into ${Object.keys(genres).length} genres; local guide/skill links valid${args.includes('--write')?'; existing inventory updated':''}`);
