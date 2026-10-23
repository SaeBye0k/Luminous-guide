import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function fixture(initialUrl){
 let url=new URL(initialUrl),cursor=0;const states=[];
 const jsx=(type,props)=>({type,props:props||{}});
 const icon=()=>null;
 const catalog=[{id:'sword',name:'검',category:'무기',type:'장검',element:'빛',rarity:'일반',counts:[0]},{id:'job',name:'기사',category:'직업',type:'전사',element:'빛',rarity:'일반',counts:[0]},{id:'dungeon',name:'슬라임 굴',category:'던전',type:'웨이브 던전',element:'무속성',rarity:'던전',counts:[0],description:'슬라임이 등장합니다.'}];
 const community={counts:{},myVotes:{},recentEntryIds:[],loading:true,configured:true,hasSession:true,user:null,error:''};
 const context={exports:{},URLSearchParams,process:{env:{}},
  require:name=>{
   if(name==='react/jsx-runtime')return {jsx,jsxs:jsx};
   if(name==='react')return {Suspense:'suspense',useEffect(){},useRef:current=>({current}),useState:initial=>{const i=cursor++;if(!(i in states))states[i]=initial;return [states[i],value=>{states[i]=typeof value==='function'?value(states[i]):value}]}};
   if(name==='next/navigation')return {useSearchParams:()=>url.searchParams,usePathname:()=>url.pathname,useRouter:()=>({replace:next=>{url=new URL(next,url)}})};
   if(name==='@/lib/game-data')return {tierClass:t=>t.toLowerCase(),guides:[],TIERS:['S'],TIER_RANGES:{S:'4.5'},VERSIONS:['version'],GAME_VERSION:'version',emptyCounts:()=>[0],stats:()=>({total:0,average:0,tier:'S'})};
   if(name==='@/hooks/use-catalog')return {useCatalog:()=>({entries:catalog})};
   if(name==='@/hooks/use-community-votes')return {useCommunityVotes:()=>community};
   return new Proxy({},{get:()=>icon});
  },
 };
 const source=fs.readFileSync(new URL('../components/guide-app.tsx',import.meta.url),'utf8');
 vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,context);
 return {render(page){cursor=0;const wrapper=context.exports.GuideApp({page});return wrapper.props.children.type({page})},navigate(next){url=new URL(next,url)}};
}
function nodes(tree){if(!tree||typeof tree!=='object')return [];if(Array.isArray(tree))return tree.flatMap(nodes);return [tree,...nodes(tree.props?.children)]}
function text(tree){if(typeof tree==='string'||typeof tree==='number')return String(tree);if(!tree||typeof tree!=='object')return '';if(Array.isArray(tree))return tree.map(text).join('');return text(tree.props?.children)}

test('sidebar navigation renders the destination category immediately without effects',()=>{
 const f=fixture('https://guide.example/database/?category=무기&mode=PVE');f.render('database');
 f.navigate('/database/?category=직업&mode=PVP');const tree=f.render('database');
 const selected=nodes(tree).filter(n=>n.props?.role==='tab'&&n.props['aria-selected']);
 assert.equal(selected.length,1);assert.match(text(selected[0]),/직업/);
 assert.equal(tree.props['data-mode'],'PVP');
 const sidebar=nodes(tree).find(n=>n.type==='aside');assert.doesNotMatch(text(sidebar),/로그아웃/);
 for(const link of nodes(sidebar).filter(n=>n.props?.href))assert.match(link.props.href,/mode=PVP/);
 const search=nodes(tree).find(n=>n.props?.['aria-label']==='데이터 검색');search.props.onChange({target:{value:'기사'}});
 f.navigate('/database/?category=무기&mode=PVE');const next=f.render('database');
 assert.equal(nodes(next).find(n=>n.props?.['aria-label']==='데이터 검색').props.value,'');
});
test('user tiers open directly on first render and tabs update the URL',()=>{
 const f=fixture('https://guide.example/tiers/?tab=users&mode=PVE');const first=f.render('tiers');
 assert.equal(text(nodes(first).find(n=>n.props?.role==='tab'&&n.props['aria-selected'])),'유저 티어표');
 nodes(first).find(n=>n.props?.role==='tab'&&text(n)==='커뮤니티 티어').props.onClick();
 assert.equal(text(nodes(f.render('tiers')).find(n=>n.props?.role==='tab'&&n.props['aria-selected'])),'커뮤니티 티어');
});


test('dungeons offer guides and short comments without tier controls or scores',()=>{
 const f=fixture('https://guide.example/database/?category=던전&mode=PVP');
 const tree=f.render('database');
 assert.equal(nodes(tree).some(n=>n.props?.['aria-label']==='정렬'),false);
 assert.equal(nodes(tree).some(n=>n.props?.['aria-label']==='평가 구분'),false);
 const card=nodes(tree).find(n=>n.props?.entry?.id==='dungeon');
 assert.ok(card);
 const button=card.type(card.props);
 assert.equal(nodes(button).some(n=>n.props?.className==='card-meta'),false);
 assert.doesNotMatch(text(button),/5\.00|초기 결과/);
 button.props.onClick();
 const selected=f.render('database');
 assert.equal(nodes(selected).some(n=>['detail-stats','vote-panel','distribution'].includes(n.props?.className)),false);
 assert.ok(nodes(selected).some(n=>n.props?.dungeonName==='슬라임 굴'));
 assert.ok(nodes(selected).some(n=>n.props?.label==='던전 한줄평'&&n.props.targetKey==='dungeon:dungeon'));
 const weaponsFixture=fixture('https://guide.example/database/?category=무기');
 const weapons=weaponsFixture.render('database');
 const weapon=nodes(weapons).find(n=>n.props?.entry?.id==='sword');
 weapon.type(weapon.props).props.onClick();
 assert.ok(nodes(weaponsFixture.render('database')).some(n=>n.props?.className==='vote-panel'));
});
