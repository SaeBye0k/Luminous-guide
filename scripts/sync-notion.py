#!/usr/bin/env python3
"""Refresh the public catalog from the owner's Notion guide, without credentials.
Run: python scripts/sync-notion.py [--cache /tmp/luminous-source]
Only public records reachable from the configured pages are requested.
"""
import argparse, datetime, json, pathlib, re, time, urllib.request, urllib.parse, subprocess

ROOT = pathlib.Path(__file__).resolve().parents[1]
SPACE = '0bb5df0a-0ecb-4dd2-9852-b56371883e4b'
SOURCE = 'https://app.notion.com/p/luminous-rpg/RPG-04815989269e46d6b1a8ab186328ebdd'
PAGES = {'무기': '146ab655-c564-453c-8ce7-16dc37aabda6', '유물': 'a545f849-b1c2-435e-9c26-cd9018d3d185', '갑옷': '3a6f741d-045e-804b-850c-d9031561fd52', '직업': '171f741d-045e-80d0-9719-e2929a227baa'}
BLOCKED = re.compile(r'미완|추가\s*전|보류')

def unwrap(record):
    value = record.get('value', {})
    return value.get('value', value)

def text(value):
    return ''.join(part[0] for part in value or [] if isinstance(part, list) and part and isinstance(part[0], str))

def read_array(path):
    raw = path.read_text()
    try:
        return json.loads(raw[raw.index('[', raw.index('=') + 1):].rstrip().rstrip(';'))
    except json.JSONDecodeError:
        code = "const fs=require('fs'),ts=require('typescript'),vm=require('vm');const ctx={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(process.argv[1],'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,ctx);process.stdout.write(JSON.stringify(Object.values(ctx.exports)[0]));"
        return json.loads(subprocess.check_output(['node','-e',code,str(path)], cwd=ROOT))

def dump(path, prefix, data):
    path.write_text(prefix + json.dumps(data, ensure_ascii=False, indent=2) + ';\n')

class PublicNotion:
    def __init__(self, cache):
        self.cache = pathlib.Path(cache); self.cache.mkdir(parents=True, exist_ok=True)
        self.blocks = {}; self.collections = {}
    def request(self, method, body, key):
        path = self.cache / (key + '.json')
        if path.exists(): return json.loads(path.read_text())
        for attempt in range(7):
            try:
                request = urllib.request.Request('https://www.notion.so/api/v3/' + method, data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
                with urllib.request.urlopen(request, timeout=45) as response: result = json.load(response)
                if result.get('isNotionError'): raise RuntimeError(result.get('message', 'Notion error'))
                path.write_text(json.dumps(result, ensure_ascii=False)); time.sleep(.6)
                return result
            except Exception:
                if attempt == 6: raise
                time.sleep(min(30, 5 * 2 ** attempt))
    def merge(self, response):
        records = response.get('recordMap', {})
        self.blocks.update({key: unwrap(value) for key, value in records.get('block', {}).items()})
        self.collections.update({key: unwrap(value) for key, value in records.get('collection', {}).items()})
    def page(self, pid):
        cursor = {'stack': []}; chunk = 0
        while True:
            result = self.request('loadPageChunk', {'pageId': pid, 'limit': 100, 'cursor': cursor, 'chunkNumber': chunk, 'verticalColumns': False}, pid + (f'-{chunk}' if chunk else ''))
            self.merge(result); cursor = result.get('cursor', {'stack': []}); chunk += 1
            if not cursor.get('stack'): break
        if pid not in self.blocks: raise RuntimeError('Public page unavailable: ' + pid)
        return self.blocks[pid]
    def children(self, bid):
        block = self.blocks[bid]
        ids = block.get('content', [])
        missing = [value for value in ids if value not in self.blocks]
        if missing:
            result = self.request('syncRecordValues', {'requests': [{'pointer': {'id': value, 'table': 'block', 'spaceId': SPACE}, 'version': -1} for value in missing]}, 'children-' + bid)
            self.merge(result)
            if any(value not in self.blocks for value in missing): raise RuntimeError('Incomplete public child blocks: ' + bid)
        return [self.blocks[value] for value in ids if self.blocks[value].get('alive', True)]
    def walk(self, bid):
        for block in self.children(bid):
            yield block
            if block.get('content') and block.get('type') not in ('page', 'collection_view', 'collection_view_page'):
                yield from self.walk(block['id'])
    def rows(self, page_id):
        self.page(page_id)
        view = next(block for block in self.walk(page_id) if block.get('type') in ('collection_view', 'collection_view_page'))
        cid = view['collection_id']
        result = self.request('queryCollection', {'collectionId': cid, 'collectionViewId': view['view_ids'][0], 'loader': {'type': 'reducer', 'reducers': {'collection_group_results': {'type': 'results', 'limit': 1000}}, 'searchQuery': '', 'userTimeZone': 'Asia/Seoul'}}, 'collection-' + cid)
        self.merge(result)
        group = result['result']['reducerResults']['collection_group_results']
        if group.get('hasMore') or group.get('has_more') or len(group['blockIds']) >= 1000: raise RuntimeError('Collection needs pagination')
        schema = self.collections[cid]['schema']
        return [(self.blocks[bid], {prop['name']: text(self.blocks[bid].get('properties', {}).get(key)) for key, prop in schema.items()}) for bid in group['blockIds']]


def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--cache', default='/tmp/luminous-source'); args = parser.parse_args()
    api = PublicNotion(args.cache)
    trait_ids = json.loads((ROOT/'lib/notion-trait-ids.json').read_text()) if (ROOT/'lib/notion-trait-ids.json').exists() else {}
    old_items = read_array(ROOT / 'lib/notion-items.ts'); old_armor = read_array(ROOT / 'lib/notion-armor.ts')
    old_by_id = {entry['id']: entry for entry in old_items + old_armor}
    job_source = (ROOT / 'lib/notion-jobs.ts').read_text()
    # Preserve existing positional job IDs; never renumber when a job is removed.
    old_jobs = {}
    for group, names in re.findall(r'^  (\S+): \[(.*?)\]', job_source, re.M):
        for index, name in enumerate(re.findall(r"'([^']+)'", names)):
            old_jobs[name] = f'job_{group}_{index + 1}'
    if not old_jobs:
        old_jobs = {entry['name']: entry['id'] for entry in read_array(ROOT / 'lib/notion-jobs.ts')}
    entries = []; details = {}; traits = {}; excluded = []
    checked = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).date().isoformat()
    def detail(block):
        api.page(block['id']); content = list(api.walk(block['id']))
        abilities = []; transcend = []; stats = []; rows = []; current = None; section = ''; in_transcend = False
        for item in content:
            kind = item.get('type'); line = text(item.get('properties', {}).get('title')).strip()
            if kind == 'table_row':
                cells = [text(value).strip() for value in item.get('properties', {}).values()]
                cells = [cell for cell in cells if cell]
                if section == '특성':
                    for cell in cells:
                        if cell not in ('효과', '코스트', '노드'): rows.append({'id': trait_ids.get('trait_' + item['id'].replace('-', ''), 'trait_' + item['id'].replace('-', '')), 'description': cell})
                elif cells and cells != ['전수']:
                    stats.append(('전수: ' if not stats and '고유기' in '\n'.join(text(x.get('properties', {}).get('title')) for x in content) and len(cells) == 1 else '') + ' · '.join(cells))
                continue
            if kind in ('header', 'sub_header', 'sub_sub_header'):
                section = line
                if line.startswith('고유기'):
                    current = {'name': line, 'description': ''}; abilities.append(current)
                elif line == '특성': current = None
                continue
            if kind == 'toggle' and '초월' in line:
                in_transcend = True; current = None; continue
            if not line: continue
            if in_transcend:
                if kind in ('text', 'callout', 'bulleted_list', 'numbered_list'):
                    name, sep, description = line.partition(':')
                    if sep: transcend.append({'name': name.strip(), 'description': description.strip()})
                    elif transcend: transcend[-1]['description'] += '\n' + line
                continue
            if kind == 'callout' and not section.startswith('고유기'):
                name, _, description = line.partition('\n'); current = {'name': name, 'description': description}; abilities.append(current)
            elif current and kind in ('text', 'callout', 'bulleted_list', 'numbered_list'):
                current['description'] = (current['description'] + '\n' + ('- ' if kind in ('bulleted_list','numbered_list') else '') + line).strip()
        return {'sourceUrl': 'https://luminous-rpg.notion.site/' + block['id'].replace('-', ''), 'checkedOn': checked, 'stats': stats, 'abilities': abilities, **({'transcend': transcend} if transcend else {}), **({'traits': [row['description'] for row in rows]} if rows else {})}, rows
    for category in ('무기', '유물', '갑옷'):
        for block, props in api.rows(PAGES[category]):
            name = props['이름']
            if BLOCKED.search(name): excluded.append({'category': category, 'name': name, 'sourceId': block['id']}); continue
            eid = 'notion_' + block['id'].replace('-', '')
            old = old_by_id.get(eid, {})
            record, _ = detail(block)
            element = props.get('속성', props.get('더 잘나오는 속성', '무')) or '무'
            element = '무속성' if element == '무' else element
            kind = props.get('유형') or ('갑옷' if category == '갑옷' else props.get('역할') or '유물')
            description = props.get('효과') or (record['abilities'][0]['description'].split('\n')[0][:150] if record['abilities'] else f'{element} {kind}입니다.')
            entry = {**old, 'id': eid, 'name': name, 'category': category, 'type': kind, 'element': element, 'rarity': props.get('등급') or category, 'icon': old.get('icon', 'shield' if category == '갑옷' else 'gem' if category == '유물' else 'sword'), 'description': description, 'power': 0, 'team': 'D', 'counts': [0]*7}
            # Keep local assets; otherwise use Notion's stable public image endpoint.
            page_icon = block.get('format', {}).get('page_icon', '')
            if not entry.get('imageUrl') and page_icon.startswith(('attachment:', 'https://')):
                entry['imageUrl'] = 'https://www.notion.so/image/' + urllib.parse.quote(page_icon, safe='') + '?' + urllib.parse.urlencode({'table': 'block', 'id': block['id'], 'cache': 'v2', 'width': '256'})
            if category == '갑옷': record['stats'] = [f"기초 방어력: {props.get('기초 방어력','')}", f"체력 추가량: {props.get('체력 추가량','')}", props.get('효과','')] + record['stats']
            entries.append(entry); details[eid] = record
    api.page(PAGES['직업'])
    groups = [block for block in api.walk(PAGES['직업']) if block.get('type') == 'page']
    for group in groups:
        group_name = text(group.get('properties', {}).get('title'))
        if group_name not in ('전사','수호자','저격수','지원가','공통'): continue
        api.page(group['id'])
        for block in api.walk(group['id']):
            if block.get('type') != 'page': continue
            name = text(block.get('properties', {}).get('title'))
            if BLOCKED.search(name): excluded.append({'category':'직업','name':name,'sourceId':block['id']}); continue
            eid = old_jobs.get(name, 'job_' + block['id'].replace('-', ''))
            record, job_rows = detail(block)
            if not record['abilities']: raise RuntimeError('Job ability missing: ' + name)
            entries.append({'id':eid,'name':name,'category':'직업','type':group_name+' 계열','element':'물' if name == '가람' else '대지' if name in ('칼리우드','선포자') else '무속성','rarity':'직업','icon':{'전사':'sword','수호자':'shield','저격수':'bow','지원가':'heart','공통':'compass'}[group_name],'description':record['abilities'][0]['description'].split('\n')[0][:150], 'power':0,'team':'D','counts':[0]*7})
            details[eid] = record; traits[name] = {'sourceUrl':record['sourceUrl'],'traits':job_rows}
    if len({entry['id'] for entry in entries}) != len(entries): raise RuntimeError('Duplicate catalog ID')
    if any(not record['abilities'] for eid,record in details.items() if next(entry for entry in entries if entry['id']==eid)['category'] in ('직업','무기','유물')): raise RuntimeError('Missing ability')
    for filename, category, var in [('notion-items.ts',None,'notionItems'),('notion-armor.ts','갑옷','notionArmor'),('notion-jobs.ts','직업','notionJobs')]:
        data = [entry for entry in entries if entry['category'] == category] if category else [entry for entry in entries if entry['category'] in ('무기','유물')]
        dump(ROOT/'lib'/filename,"import type { Entry } from './game-data';\n\n// Generated from the public Notion guide; excludes 미완 / 추가 전.\nexport const "+var+': Entry[] = ',data)
    dump(ROOT/'lib/entry-details.ts',"export type Ability = {name:string;description:string;notes?:string[];boss?:boolean};\nexport type EntryDetail = {sourceUrl:string;checkedOn:string;stats:string[];abilities:Ability[];transcend?:Ability[];traits?:string[]};\n\nexport const entryDetails:Record<string,EntryDetail> = ",details)
    dump(ROOT/'lib/job-traits.ts',"export type JobTrait = {id:string;description:string};\nexport const jobTraits:Record<string,{sourceUrl:string;traits:JobTrait[]}> = ",traits)
    report = {'source':SOURCE,'checkedOn':checked,'counts':{category:sum(entry['category']==category for entry in entries) for category in ('무기','유물','갑옷','직업')},'excluded':excluded}
    (ROOT/'lib/notion-sync-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__ == '__main__': main()
