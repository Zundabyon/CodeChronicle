import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {dungeonLessons,lessonReadId,isLessonRead}=await server.ssrLoadModule('/src/world/dungeonLessons.ts');
const {normalizeReadBooks}=await server.ssrLoadModule('/src/library.ts');

test('lesson read marks persist through save normalization only for registered lessons',()=>{
  dungeonLessons['test-required']={title:'テスト',lines:['一覧はindex。']};
  try{
    const saved=normalizeReadBooks([lessonReadId('test-required'),lessonReadId('unknown'),'lesson:test-required']);
    assert.deepEqual(saved,[lessonReadId('test-required')]);
    assert.equal(isLessonRead(saved,'test-required'),true);
    assert.equal(isLessonRead([],'test-required'),false);
  }finally{delete dungeonLessons['test-required'];}
});
