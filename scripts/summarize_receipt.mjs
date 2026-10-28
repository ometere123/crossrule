import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionStatus} from 'genlayer-js/types';

const hash=process.argv[2];
if(!/^0x[0-9a-f]{64}$/i.test(hash??''))throw new Error('usage: node scripts/summarize_receipt.mjs 0x<transaction-hash>');
const receipt=await createClient({chain:studionet}).waitForTransactionReceipt({hash,status:TransactionStatus.FINALIZED});
const leaders=Array.isArray(receipt.consensus_data?.leader_receipt)?receipt.consensus_data.leader_receipt:[];
const leader=leaders.find(item=>item?.mode==='leader')??leaders[0]??null;
console.log(JSON.stringify({
  hash:receipt.hash,
  from:receipt.from_address,
  to:receipt.to_address,
  status:receipt.status,
  status_name:receipt.status_name,
  result:receipt.result,
  result_name:receipt.result_name,
  leader_execution_result:leader?.execution_result??null,
  validator_votes:receipt.last_round?.validator_votes_name??[],
  validator_count:receipt.last_round?.round_validators?.length??0,
  current_status_changes:receipt.consensus_data?.current_status_changes??[],
  result_payload:leader?.result?.payload?.readable??null,
  created_timestamp:receipt.created_timestamp??null,
  finalized_timestamp:receipt.consensus_data?.current_monitoring?.FINALIZED??null
},null,2));
