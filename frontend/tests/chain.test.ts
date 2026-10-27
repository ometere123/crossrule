import {describe,it,expect} from 'vitest';
import {receiptSucceeded,NETWORK_HEX,NETWORK_ID,transactionUrl} from '@/lib/chain';

describe('GenLayer signing and receipt safety gates',()=>{
  it('pins the injected wallet to StudioNet chain 61999',()=>{
    expect(NETWORK_ID).toBe(61999);
    expect(Number.parseInt(NETWORK_HEX,16)).toBe(NETWORK_ID);
  });
  it('accepts an actually finalized successful execution',()=>{
    expect(receiptSucceeded({statusName:'FINALIZED',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(true);
    expect(receiptSucceeded({status:7,resultName:'MAJORITY_AGREE',consensusData:{leader_receipt:[{execution_result:'SUCCESS'}]}})).toBe(true);
  });
  it('does not claim success on unfinalized or failed receipts',()=>{
    expect(receiptSucceeded({statusName:'PENDING',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',txExecutionResultName:'FAILED'})).toBe(false);
    expect(receiptSucceeded({status:7,resultName:'MAJORITY_AGREE',consensusData:{leader_receipt:[{execution_result:'ERROR'}]}})).toBe(false);
    expect(receiptSucceeded(null)).toBe(false);
  });
  it('uses the explorer transaction detail route and numeric execution fields safely',()=>{
    const hash='0x'+'a'.repeat(64);
    expect(transactionUrl(hash)).toBe(`https://explorer-studio.genlayer.com/tx/${hash}`);
    expect(receiptSucceeded({status:7,txExecutionResult:1})).toBe(true);
    expect(receiptSucceeded({status:7,txExecutionResult:2})).toBe(false);
  });
});
