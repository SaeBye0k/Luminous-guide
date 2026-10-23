import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const tags=['렙업용','무기파밍','유물파밍','봉우리 파밍'];
const jsx=(type,props)=>({type,props:props||{}});
function nodes(tree){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)]}
function text(tree){if(typeof tree==='string'||typeof tree==='number')return String(tree);if(!tree||typeof tree!=='object')return '';if(Array.isArray(tree))return tree.map(text).join('');return text(tree.props?.children)}
function fixture(){
 let cursor=0;const states=[],effects=[],queries=[],inserts=[];
 const rows=[
  {id:1,title:'[슬라임 굴] 빠른 레벨업',content:'슬라임 공략',dungeon_id:'dungeon_slime_cave',tags:['렙업용'],user_id:'author',profiles:{nickname:'작성자'}},
  {id:2,title:'[슬라임 굴] 이전 공략',content:'기존 글',dungeon_id:null,tags:[],user_id:'other',profiles:{nickname:'모험가'}},
  {id:3,title:'[음침한 동굴] 다른 던전',content:'다른 글',dungeon_id:'dungeon_gloomy_cave',tags:['렙업용'],user_id:'other',profiles:{nickname:'모험가'}},
 ];
 const db={from(){const filters={};const query={select(){return this},order(){return this},limit(){return this},or(value){filters.or=value;return this},contains(column,value){filters.tags=value;return this},then(resolve){queries.push(filters);const data=rows.filter(row=>(row.dungeon_id==='dungeon_slime_cave'||row.dungeon_id===null&&row.title.startsWith('[슬라임 굴] '))&&(!filters.tags||filters.tags.every(tag=>row.tags.includes(tag))));return Promise.resolve({data,error:null}).then(resolve)},insert:async payload=>{inserts.push(payload);return {error:null}}};return query}};
 const context={exports:{},require(name){
  if(name==='react/jsx-runtime')return {jsx,jsxs:jsx};
  if(name==='react')return {useCallback:f=>f,useEffect:f=>effects.push(f),useRef:initial=>{const index=cursor++;return states[index]??(states[index]={current:initial})},useState:initial=>{const index=cursor++;if(!(index in states))states[index]=initial;return [states[index],value=>states[index]=typeof value==='function'?value(states[index]):value]}};
  if(name==='@/lib/supabase')return {supabase:db};
  if(name==='@/lib/dungeon-guides')return {DUNGEON_GUIDE_TAGS:tags};
  return new Proxy({},{get:()=>()=>null});
 }};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../components/guide-board.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);
 const props={dungeonId:'dungeon_slime_cave',dungeonName:'슬라임 굴',userId:'author',nickname:'작성자',onLogin(){},onNickname(){}};
 return {queries,inserts,render(){cursor=0;effects.length=0;return context.exports.GuideBoard(props)},async load(){effects[0]();await new Promise(resolve=>setImmediate(resolve))}};
}

test('dungeon guides retain legacy posts, filter tags, and save multiple purpose tags',async()=>{
 const f=fixture();f.render();await f.load();let tree=f.render();
 assert.match(text(tree),/빠른 레벨업/);assert.match(text(tree),/이전 공략/);assert.doesNotMatch(text(tree),/다른 던전/);
 assert.match(f.queries[0].or,/dungeon_id.eq.dungeon_slime_cave/);
 let filters=nodes(tree).find(n=>n.props?.['aria-label']==='공략 태그 필터');
 nodes(filters).find(n=>n.type==='button'&&text(n)==='#렙업용').props.onClick();
 f.render();await f.load();tree=f.render();assert.match(text(tree),/빠른 레벨업/);assert.doesNotMatch(text(tree),/이전 공략/);
 nodes(tree).find(n=>n.type==='button'&&text(n).includes('공략 작성')).props.onClick();
 tree=f.render();let editor=nodes(tree).find(n=>n.type==='form');
 nodes(editor).find(n=>n.type==='input').props.onChange({target:{value:'봉우리도 챙기는 레벨업'}});
 nodes(editor).find(n=>n.type==='textarea').props.onChange({target:{value:'웨이브를 빠르게 정리하세요.'}});
 nodes(editor).find(n=>n.type==='button'&&text(n)==='#렙업용').props.onClick();
 nodes(editor).find(n=>n.type==='button'&&text(n)==='#봉우리 파밍').props.onClick();
 tree=f.render();editor=nodes(tree).find(n=>n.type==='form');
 await editor.props.onSubmit({preventDefault(){}});
 assert.equal(f.inserts.length,1);assert.equal(f.inserts[0].dungeon_id,'dungeon_slime_cave');
 assert.deepEqual(Array.from(f.inserts[0].tags),['렙업용','봉우리 파밍']);
 assert.equal(f.inserts[0].title,'[슬라임 굴] 봉우리도 챙기는 레벨업');
 assert.equal(nodes(f.render()).some(n=>n.type==='form'),false);
});

test('dungeon hub supports direct dungeon links, selection, and shared short reviews',()=>{
 let tab='guides';const selections=[];
 const context={exports:{},URLSearchParams,require(name){
  if(name==='react/jsx-runtime')return {jsx,jsxs:jsx};
  if(name==='react')return {useState:()=>[tab,value=>tab=value]};
  if(name==='@/lib/dungeons')return {dungeonDetails:{}};
  return new Proxy({},{get:()=>()=>null});
 }};
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL('../components/dungeon-guide-hub.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);
 const dungeons=[{id:'gloomy',name:'음침한 동굴'},{id:'slime',name:'슬라임 굴'},{id:'farm',name:'닭농장'}];
 const render=id=>context.exports.DungeonGuideHub({dungeons,dungeonId:id,onSelect:id=>selections.push(id),nickname:'모험가',onLogin(){},onNickname(){}});
 let tree=render('slime');
 assert.ok(nodes(tree).some(n=>n.props?.dungeonId==='slime'&&n.props.dungeonName==='슬라임 굴'));
 nodes(tree).find(n=>n.type==='button'&&text(n).includes('음침한 동굴')).props.onClick();assert.deepEqual(selections,['gloomy']);
 nodes(tree).find(n=>n.type==='button'&&text(n)==='한줄평').props.onClick();
 tree=render('farm');assert.ok(nodes(tree).some(n=>n.props?.targetKey==='dungeon:farm'));
 tree=render('unknown');assert.ok(nodes(tree).some(n=>n.props?.targetKey==='dungeon:gloomy'));
});
