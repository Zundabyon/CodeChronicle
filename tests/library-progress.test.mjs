import {test,after} from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});after(()=>server.close());
const {libraryShelves,normalizeReadBooks,normalizeBookmarks}=await server.ssrLoadModule('/src/library.ts');
test('all library books have unique authored IDs independent of titles and display order',()=>{
 const books=libraryShelves.flatMap(s=>s.books);assert.equal(books.length,54);assert.equal(new Set(books.map(b=>b.id)).size,54);
 for(const shelf of libraryShelves)for(const book of shelf.books)assert.ok(book.id.startsWith(shelf.id+'-'));
 const renamed={...books[0],title:'改題した本'};assert.deepEqual(normalizeReadBooks([renamed.id]),[books[0].id]);
});
test('old and invalid read-book saves are normalized without inventing progress',()=>{
 for(const value of [undefined,null,'js-variables-01',{}])assert.deepEqual(normalizeReadBooks(value),[]);
 assert.deepEqual(normalizeReadBooks(['js-variables-01',null,'unknown','js-variables-01']),['js-variables-01']);
});

test('bookmarks only retain books belonging to their shelf',()=>{
 for(const value of [undefined,null,[],42])assert.deepEqual(normalizeBookmarks(value),{});
 assert.deepEqual(normalizeBookmarks({'js-variables':'js-variables-02','js-conditions':'js-variables-01',unknown:'js-variables-01'}),{'js-variables':'js-variables-02'});
});
