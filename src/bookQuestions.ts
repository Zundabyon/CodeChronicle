import { questions } from './content';
import { libraryShelves } from './library';
// Curated matches: each book directly explains the linked question's concept.
export const questionBookLinks:Record<string,string>={
  'r-b-1':'react-components-01','r-b-2':'react-props-01','r-b-3':'react-state-01',
  'v-b-3':'vue-template-02','v-b-4':'vue-events-01',
  'l-b-1':'laravel-routes-01','l-b-2':'laravel-controllers-02','l-b-3':'laravel-validation-02',
};
export function relatedBook(questionId:string) {
  const bookId=questionBookLinks[questionId];
  const shelf=libraryShelves.find(s=>s.books.some(b=>b.id===bookId));
  const book=shelf?.books.find(b=>b.id===bookId);
  return shelf&&book?{shelf,book}:null;
}
export function practiceQuestion(bookId:string){return questions.find(q=>questionBookLinks[q.id]===bookId)??null;}
