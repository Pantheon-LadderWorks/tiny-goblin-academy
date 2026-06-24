export type Action = 'attack'|'heal'|'block'; export type Phase='roll'|'action'|'won'|'lost';
export interface Duel { playerHp:number; enemyHp:number; phase:Phase; roll:number|null; log:string[]; dieIndex:number; }
const dice=[4,3,6,2,5]; const max=10;
export const createDuel=():Duel=>({playerHp:max,enemyHp:max,phase:'roll',roll:null,log:['Your turn. Roll the d6.'],dieIndex:0});
export const roll=(s:Duel):Duel=>{if(s.phase!=='roll')return s;const r=dice[s.dieIndex%dice.length];return {...s,roll:r,phase:'action',dieIndex:s.dieIndex+1,log:[...s.log,`You rolled ${r}.`]};};
const enemy=(s:Duel,block=0):Duel=>{const dealt=Math.max(0,3-block),hp=s.playerHp-dealt,entry=block?`Goblin Brawler attacks for 3. Block reduced it to ${dealt}.`:'Goblin Brawler attacks for 3.';return {...s,playerHp:Math.max(0,hp),phase:hp<=0?'lost':'roll',roll:null,log:[...s.log,entry]};};
export const act=(s:Duel,a:Action):Duel=>{if(s.phase!=='action'||s.roll===null)return s;const r=s.roll;if(a==='attack'){const e=Math.max(0,s.enemyHp-r),next={...s,enemyHp:e,log:[...s.log,`You chose Attack for ${r} damage.`]};return e===0?{...next,phase:'won',roll:null,log:[...next.log,'Goblin Brawler is defeated! Victory!']}:enemy(next);}if(a==='heal')return enemy({...s,playerHp:Math.min(max,s.playerHp+r),log:[...s.log,`You chose Heal for ${r}.`]});return enemy({...s,log:[...s.log,`You chose Block for ${r}.`]},r);};
