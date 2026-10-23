import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('OAuth failure survives the signed-out refresh and is removed from the URL',async()=>{
  const states=[],effects=[],timers=[];let replaced='';
  const react={useState:initial=>{const index=states.length;states.push(initial);return [initial,value=>{states[index]=value}]},useRef:current=>({current}),useCallback:fn=>fn,useEffect:fn=>effects.push(fn)};
  const supabase={rpc:async()=>({data:[],error:null}),auth:{getSession:async()=>({data:{session:null},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}})}};
  const context={exports:{},URL,URLSearchParams,
    window:{location:{href:'https://guide.example/#error=server_error&error_description=issuer%20mismatch',search:'',hash:'#error=server_error&error_description=issuer%20mismatch'},history:{replaceState:(_state,_title,url)=>{replaced=url}}},
    setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout(){},
    require:name=>name==='react'?react:name==='@/lib/supabase'?{supabase,supabaseConfigured:true}:{TIERS:['S'],emptyCounts:()=>[0]},
  };
  const source=fs.readFileSync(new URL('../hooks/use-community-votes.ts',import.meta.url),'utf8');
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
  context.exports.useCommunityVotes([],'version');effects[0]();await Promise.resolve();
  for(const timer of timers)await timer();
  assert.match(states[6],/인증 설정이 일치하지 않아/);
  assert.equal(replaced,'https://guide.example/');
});
