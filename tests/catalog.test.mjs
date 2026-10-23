import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const root=new URL('../',import.meta.url);
function load(path,name){const ctx={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(new URL(path,root),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,ctx);return JSON.parse(JSON.stringify(ctx.exports[name]))}
const jobs=load('lib/notion-jobs.ts','notionJobs'),items=load('lib/notion-items.ts','notionItems'),armor=load('lib/notion-armor.ts','notionArmor');
const details=load('lib/entry-details.ts','entryDetails'),traits=load('lib/job-traits.ts','jobTraits');
const entries=[...jobs,...items,...armor];
const report=JSON.parse(fs.readFileSync(new URL('lib/notion-sync-report.json',root)));
test('public catalog contains only released entries with complete details and zero initial votes',()=>{
 assert.equal(new Set(entries.map(e=>e.id)).size,entries.length);
 for(const e of entries){assert.doesNotMatch(e.name,/미완|추가\s*전/);assert.ok(details[e.id],e.name);assert.equal(e.counts.reduce((a,b)=>a+b,0),0);assert.equal(e.counts.length,7);if(e.category!=='갑옷')assert.ok(details[e.id].abilities.some(a=>a.description.trim()),e.name)}
 for(const e of report.excluded)assert.ok(!entries.some(current=>current.name===e.name));
 for(const [category,count] of Object.entries(report.counts))assert.equal(entries.filter(e=>e.category===category).length,count);
});
test('updated source damage values are reflected without renumbering existing entries',()=>{
 const hunter=jobs.find(e=>e.name==='사냥꾼');assert.equal(hunter.id,'job_전사_1');assert.match(details[hunter.id].abilities[0].description,/250%/);
 const sword=items.find(e=>e.name==='묵직한 검');assert.equal(sword.id,'notion_c38343c5f5d54bd988b251f45e5d7812');assert.match(details[sword.id].abilities[0].description,/201%/);
});
test('trait selections have unique references and preserve unchanged legacy traits',()=>{
 for(const job of jobs){const jobTraits=traits[job.name]?.traits;assert.ok(jobTraits?.length,job.name);assert.equal(new Set(jobTraits.map(t=>t.id)).size,jobTraits.length,job.name)}
 assert.equal(traits['사냥꾼'].traits[0].id,'trait_3e6f741d045e8109947ec8b98f1a443e');
});


test('dungeon entries retain their wave details and each provided drop table exactly once',()=>{
 const dungeons=load('lib/dungeons.ts','dungeonEntries');
 const dungeonDetails=load('lib/dungeons.ts','dungeonDetails');
 const supplements=load('lib/catalog-supplements.ts','catalogSupplements');
 const all=[...entries,...dungeons,...supplements];
 assert.equal(new Set(all.map(entry=>entry.id)).size,all.length);
 assert.equal(dungeons.length,5);
 assert.deepEqual(dungeons.map(d=>d.id),['dungeon_gloomy_cave','dungeon_slime_cave','dungeon_russell_battle','dungeon_suspicious_church','dungeon_chicken_farm']);
 assert.equal(dungeonDetails.dungeon_slime_cave.abilities[2].boss,true);
 for(const dungeon of dungeons){
  const isRussell=dungeon.id==='dungeon_russell_battle';
  assert.equal(dungeon.dropTable.draws,isRussell?1:2);
  assert.equal(dungeon.dropTable.items.length,isRussell?3:7);
  assert.equal(dungeonDetails[dungeon.id].abilities.length,isRussell?1:dungeon.id==='dungeon_suspicious_church'?4:3);
  assert.deepEqual(dungeonDetails[dungeon.id].stats.map(stat=>stat.split(':')[0]),['권장 명성','평균 레벨','추천 속성','최대 입장 가능 인원']);
 }
 assert.equal(dungeons.find(d=>d.id==='dungeon_slime_cave').dropTable.items.find(i=>i.name==='탐색의 흔적').probability,'확정');
});
