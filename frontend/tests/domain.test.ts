import {describe,it,expect} from 'vitest';
import {threshold,policyOf,secondsLeft,sampleClauses,truncate,type Room} from '@/lib/types';

describe('Crossrule public domain models',()=>{
  it('requires two-thirds approval rounded up for each community',()=>{
    expect([3,4,5,6,7,12].map(threshold)).toEqual([2,3,4,4,5,8]);
  });
  it('never treats a non-ratified room as having an active policy',()=>{
    const room={version:0,policies:[]} as unknown as Room;
    expect(policyOf(room)).toBeNull();
  });
  it('looks up the currently ratified policy',()=>{
    const p={text:'Joint agreement',clauses:sampleClauses,vote_minutes:5,defense_minutes:5,appeal_minutes:5,suspension_minutes:5};
    const room={version:2,policies:[{version:1,policy:{...p,text:'Old'},ratified_at:1},{version:2,policy:p,ratified_at:2}]} as Room;
    expect(policyOf(room)?.text).toBe('Joint agreement');
  });
  it('clamps expired countdowns to zero and formats wallet IDs',()=>{
    expect(secondsLeft(100,101000)).toBe(0);
    expect(secondsLeft(100,98000)).toBe(2);
    expect(truncate('0x12345678901234567890')).toMatch(/…/);
  });
});
