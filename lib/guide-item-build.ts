export const GUIDE_FOOD_SLOT = 'slot_food';
export type GuideItemBuild = {
  job_id: string;
  armor_id: string;
  inventory_ids: string[];
  transcend_levels: number[];
  trait_ids: string[];
  version: string;
};

export function emptyGuideBuild(version:string):GuideItemBuild {
  return {job_id:'',armor_id:'',inventory_ids:Array(6).fill(''),transcend_levels:Array(6).fill(0),trait_ids:[],version};
}

export function parseGuideBuild(value:unknown):GuideItemBuild|null {
  if(!value||typeof value!=='object')return null;
  const b=value as Record<string,unknown>;
  if(typeof b.job_id!=='string'||!b.job_id||typeof b.armor_id!=='string'||typeof b.version!=='string')return null;
  if(!Array.isArray(b.inventory_ids)||b.inventory_ids.length!==6||!b.inventory_ids.every(id=>typeof id==='string')||!b.inventory_ids.some(Boolean))return null;
  if(!Array.isArray(b.transcend_levels)||b.transcend_levels.length!==6||!b.transcend_levels.every((n,i)=>Number.isInteger(n)&&n>=0&&n<=3&&((b.inventory_ids as string[])[i]!==''&&(b.inventory_ids as string[])[i]!==GUIDE_FOOD_SLOT||n===0)))return null;
  if(!Array.isArray(b.trait_ids)||b.trait_ids.length>3||!b.trait_ids.every(id=>typeof id==='string')||new Set(b.trait_ids).size!==b.trait_ids.length)return null;
  return {job_id:b.job_id,armor_id:b.armor_id,version:b.version,inventory_ids:[...b.inventory_ids],transcend_levels:[...b.transcend_levels],trait_ids:[...b.trait_ids]};
}
