import {describe,it,expect} from 'vitest';
import {actionFingerprint,receiptSucceeded,rememberObservation,rememberTransaction,NETWORK_HEX,NETWORK_ID,transactionUrl,unresolvedTransactions} from '@/lib/chain';

describe('GenLayer signing and receipt safety gates',()=>{
  it('pins the injected wallet to StudioNet chain 61999',()=>{
    expect(NETWORK_ID).toBe(61999);
    expect(Number.parseInt(NETWORK_HEX,16)).toBe(NETWORK_ID);
  });
  it('accepts an actually finalized successful execution',()=>{
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_AGREE',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(true);
    expect(receiptSucceeded({status:7,resultName:'MAJORITY_AGREE',consensusData:{leader_receipt:[{execution_result:'SUCCESS'}]}})).toBe(true);
    expect(receiptSucceeded({status_name:'FINALIZED',result_name:'MAJORITY_AGREE',consensus_data:{leader_receipt:[{mode:'leader',execution_result:'FINISHED_WITH_RETURN'}]}})).toBe(true);
  });
  it('does not claim success on unfinalized or failed receipts',()=>{
    expect(receiptSucceeded({statusName:'PENDING',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',txExecutionResultName:'FAILED'})).toBe(false);
    expect(receiptSucceeded({status:7,resultName:'MAJORITY_AGREE',consensusData:{leader_receipt:[{execution_result:'ERROR'}]}})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_DISAGREE',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_DISAGREE',txExecutionResultName:'FINISHED_WITH_ERROR'})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_AGREE'})).toBe(false);
    expect(receiptSucceeded(null)).toBe(false);
  });
  it('uses the explorer transaction detail route and numeric execution fields safely',()=>{
    const hash='0x'+'a'.repeat(64);
    expect(transactionUrl(hash)).toBe(`https://explorer-studio.genlayer.com/tx/${hash}`);
    expect(receiptSucceeded({status:7,result:6,txExecutionResult:1})).toBe(true);
    expect(receiptSucceeded({status:7,result:6,txExecutionResult:2})).toBe(false);
  });
  it('fails safely on contradictory, malformed, or incomplete evidence',()=>{
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_DISAGREE',txExecutionResultName:'FINISHED_WITH_RETURN'})).toBe(false);
    expect(receiptSucceeded({statusName:'FINALIZED',resultName:'MAJORITY_AGREE',txExecutionResultName:'FINISHED_WITH_RETURN',tx_execution_result_name:'FINISHED_WITH_ERROR'})).toBe(false);
    expect(receiptSucceeded({status:7,result:99,txExecutionResult:1})).toBe(false);
    expect(receiptSucceeded({status:'FINALIZED',result:'MAJORITY_AGREE',txExecutionResult:'FINISHED_WITH_RETURN'})).toBe(true);
  });
  it('rehydrates unresolved action protection from browser storage',()=>{
    localStorage.clear();
    const hash='0x'+'b'.repeat(64);
    const fingerprint=actionFingerprint('publish_post',[4,0,'durable write']);
    expect(rememberTransaction({hash,method:'publish_post',wallet:'0x'+'1'.repeat(40),chainId:NETWORK_ID,contract:'',fingerprint,submittedAt:Date.now()})).toBe(true);
    expect(unresolvedTransactions('0x'+'1'.repeat(40)).map(item=>item.fingerprint)).toEqual([fingerprint]);
    expect(actionFingerprint('publish_post',[4,0,'durable write'])).toBe(fingerprint);
    rememberObservation(hash,{hash,statusName:'PENDING',executionResultName:'UNKNOWN',resultName:'MAJORITY_AGREE',finalized:false,successful:false,outcome:'UNKNOWN',consensusKnown:true,consensusSuccessful:true,executionKnown:false,executionSuccessful:false,authoritative:false});
    expect(unresolvedTransactions('0x'+'1'.repeat(40))).toHaveLength(1);
    rememberObservation(hash,{hash,statusName:'FINALIZED',executionResultName:'FINISHED_WITH_RETURN',resultName:'MAJORITY_AGREE',finalized:true,successful:true,outcome:'SUCCESS',consensusKnown:true,consensusSuccessful:true,executionKnown:true,executionSuccessful:true,authoritative:true});
    expect(unresolvedTransactions('0x'+'1'.repeat(40))).toHaveLength(0);
  });
  it('fails closed when stored transaction JSON is malformed',()=>{
    localStorage.setItem('crossrule:transactions','{not-json');
    expect(()=>unresolvedTransactions('0x'+'1'.repeat(40))).not.toThrow();
    expect(unresolvedTransactions('0x'+'1'.repeat(40))).toEqual([]);
  });
});
