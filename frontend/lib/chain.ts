import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {TransactionStatus, TransactionHashVariant, type CalldataEncodable, type Hash} from 'genlayer-js/types';

export const NETWORK_ID=61999;
export const NETWORK_HEX='0xf22f';
export const RPC='https://studio.genlayer.com/api';
export const EXPLORER='https://explorer-studio.genlayer.com';
export const ADDRESS=process.env.NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS??'';
export const isConfigured=/^0x[a-fA-F0-9]{40}$/.test(ADDRESS);
const TX_STORE='crossrule:transactions';
const ACTION_LOCK_STORE='crossrule:action-locks';
const TX_EVENT='crossrule:transaction-event';

export interface Provider {request(args:{method:string;params?:unknown[]}):Promise<unknown>;on?(event:string,fn:(...args:unknown[])=>void):void;removeListener?(event:string,fn:(...args:unknown[])=>void):void;}
declare global {interface Window {ethereum?:Provider}}

export type TransactionOutcome='PENDING'|'SUCCESS'|'FAILED'|'UNKNOWN';
export type PendingTx={hash:string;method:string;wallet:string;chainId:number;contract:string;fingerprint:string;submittedAt:number;lastObservation?:TransactionObservation};
export type TransactionObservation={hash:string;statusName:string;executionResultName:string;resultName:string;finalized:boolean;successful:boolean;outcome:TransactionOutcome;consensusKnown:boolean;consensusSuccessful:boolean;executionKnown:boolean;executionSuccessful:boolean;authoritative:boolean};

// genlayer-js@1.1.8 decodes StudioNet's transaction enums with these maps.
// Keep this namespace separate from newer raw node examples: in those
// examples result 1/2 mean MajorityAgree/MajorityDisagree, while the pinned
// SDK's result 1/2 mean Agree/Disagree.  Numeric receipts without enough
// provenance are therefore rejected instead of guessed.
const SDK_STATUS_BY_NUMBER:Record<string,string>={'0':'UNINITIALIZED','1':'PENDING','2':'PROPOSING','3':'COMMITTING','4':'REVEALING','5':'ACCEPTED','6':'UNDETERMINED','7':'FINALIZED','8':'CANCELED','9':'APPEAL_REVEALING','10':'APPEAL_COMMITTING','11':'READY_TO_FINALIZE','12':'VALIDATORS_TIMEOUT','13':'LEADER_TIMEOUT'};
const SDK_RESULT_BY_NUMBER:Record<string,string>={'0':'IDLE','1':'AGREE','2':'DISAGREE','3':'TIMEOUT','4':'DETERMINISTIC_VIOLATION','5':'NO_MAJORITY','6':'MAJORITY_AGREE','7':'MAJORITY_DISAGREE'};
const RAW_NODE_RESULT_BY_NUMBER:Record<string,string>={'1':'MAJORITY_AGREE','2':'MAJORITY_DISAGREE'};
const RAW_NODE_STATUS_BY_NUMBER:Record<string,string>={'11':'VALIDATORS_TIMEOUT','12':'LEADER_TIMEOUT','13':'LEADER_REVEALING'};
const EXECUTION_BY_NUMBER:Record<string,string>={'0':'NOT_VOTED','1':'FINISHED_WITH_RETURN','2':'FINISHED_WITH_ERROR'};
const STATUS_NAMES=new Set([...Object.values(SDK_STATUS_BY_NUMBER), 'LEADER_REVEALING']);
const RESULT_NAMES=new Set(Object.values(SDK_RESULT_BY_NUMBER));
const EXECUTION_NAMES=new Set(Object.values(EXECUTION_BY_NUMBER));

function asRecord(value:unknown):Record<string,unknown>|null {return typeof value==='object'&&value!==null&&!Array.isArray(value)?value as Record<string,unknown>:null;}
function has(value:Record<string,unknown>,key:string) {return Object.prototype.hasOwnProperty.call(value,key);}
function enumKey(value:string) {return value.replace(/[^a-z0-9]/gi,'').toUpperCase();}
function normalizeEnum(value:unknown,numbers:Record<string,string>,names:Set<string>,aliases:Record<string,string>={},allowNumeric=true):string|undefined {
  if(allowNumeric&&typeof value==='number'&&Number.isInteger(value))return numbers[String(value)];
  if(allowNumeric&&typeof value==='string'&&/^\d+$/.test(value))return numbers[value];
  if(typeof value==='string'){
    const upper=value.toUpperCase();
    if(names.has(upper))return upper;
    const compact=enumKey(value);
    for(const name of names)if(enumKey(name)===compact)return name;
    if(aliases[upper])return aliases[upper];
    if(aliases[compact])return aliases[compact];
  }
  return undefined;
}
function numericCandidates(value:unknown,maps:Record<string,string>[]):string[] {
  const key=typeof value==='number'&&Number.isInteger(value)?String(value):
    typeof value==='string'&&/^\d+$/.test(value)?value:'';
  if(!key)return [];
  return [...new Set(maps.map(map=>map[key]).filter(Boolean))];
}
function resolvePairedEnum(record:Record<string,unknown>,nameKeys:string[],numericKeys:string[],maps:Record<string,string>[],names:Set<string>,aliases:Record<string,string>={}):{value?:string;present:boolean;invalid:boolean} {
  const namedValues:string[]=[];let namedPresent=false;let invalid=false;
  for(const key of nameKeys){
    if(!has(record,key))continue;
    const raw=record[key];
    if(typeof raw==='number'||(typeof raw==='string'&&/^\d+$/.test(raw)))continue;
    namedPresent=true;
    const normalized=normalizeEnum(raw,{},names,aliases,false);
    if(!normalized)invalid=true;else if(!namedValues.includes(normalized))namedValues.push(normalized);
  }
  const candidateLists:string[][]=[];let numericPresent=false;
  for(const key of numericKeys){
    if(!has(record,key))continue;
    const raw=record[key];
    if(typeof raw!=='number'&&!(typeof raw==='string'&&/^\d+$/.test(raw)))continue;
    numericPresent=true;
    const candidates=numericCandidates(raw,maps);
    if(!candidates.length)invalid=true;else candidateLists.push(candidates);
  }
  if(namedValues.length>1)invalid=true;
  const namedValue=namedValues.length===1?namedValues[0]:undefined;
  if(namedValue&&candidateLists.some(candidates=>!candidates.includes(namedValue)))invalid=true;
  if(invalid)return {present:namedPresent||numericPresent,invalid:true};
  if(namedValue)return {value:namedValue,present:true,invalid:false};
  if(numericPresent){
    const candidates=[...new Set(candidateLists.flat())];
    // Ambiguous numeric-only values, such as result=1 (SDK AGREE versus
    // raw-node MAJORITY_AGREE), must remain UNKNOWN rather than guessed.
    return candidates.length===1?{value:candidates[0],present:true,invalid:false}:{present:true,invalid:true};
  }
  return {present:namedPresent,invalid:false};
}
function nestedConsensus(record:Record<string,unknown>):Record<string,unknown>|null {return asRecord(record.consensus_data)??asRecord(record.consensusData);}
function leaderExecution(record:Record<string,unknown>):{value?:string;present:boolean;invalid:boolean} {
  const consensus=nestedConsensus(record);if(!consensus)return {present:false,invalid:false};
  const raw=consensus.leader_receipt??consensus.leaderReceipt;const receipts=Array.isArray(raw)?raw:raw?[raw]:[];
  if(!receipts.length)return {present:false,invalid:false};
  const leader=receipts.find(item=>asRecord(item)?.mode==='leader')??receipts[0];const value=asRecord(leader);
  if(!value)return {present:true,invalid:true};
  return resolvePairedEnum(value,['execution_result','executionResult','execution_result_name','executionResultName'],['execution_result','executionResult'],[EXECUTION_BY_NUMBER],EXECUTION_NAMES,{SUCCESS:'FINISHED_WITH_RETURN',ERROR:'FINISHED_WITH_ERROR',FAILED:'FINISHED_WITH_ERROR',FAILURE:'FINISHED_WITH_ERROR'});
}

/** Normalize full and simplified genlayer-js 1.1.8 StudioNet receipts. */
export function classifyReceipt(value:unknown):TransactionObservation {
  const record=asRecord(value);const hash=typeof record?.hash==='string'?record.hash:'';
  const unknown={hash,statusName:'UNKNOWN',executionResultName:'UNKNOWN',resultName:'UNKNOWN',finalized:false,successful:false,outcome:'UNKNOWN' as TransactionOutcome,consensusKnown:false,consensusSuccessful:false,executionKnown:false,executionSuccessful:false,authoritative:false};
  if(!record)return unknown;
  const status=resolvePairedEnum(record,['statusName','status_name','status'],['status'],[SDK_STATUS_BY_NUMBER,RAW_NODE_STATUS_BY_NUMBER],STATUS_NAMES);
  const result=resolvePairedEnum(record,['resultName','result_name','result'],['result'],[SDK_RESULT_BY_NUMBER,RAW_NODE_RESULT_BY_NUMBER],RESULT_NAMES);
  const lastRound=asRecord(record.last_round)??asRecord(record.lastRound);
  const roundResult=lastRound?resolvePairedEnum(lastRound,['resultName','result_name','result'],['result'],[SDK_RESULT_BY_NUMBER,RAW_NODE_RESULT_BY_NUMBER],RESULT_NAMES):{present:false,invalid:false} as {value?:string;present:boolean;invalid:boolean};
  const consensusCandidates=[result.value,roundResult.value].filter(Boolean) as string[];
  const consensusKnown=(result.present||roundResult.present)&&!result.invalid&&!roundResult.invalid&&consensusCandidates.length>0;
  const consensusName=consensusCandidates.length&&new Set(consensusCandidates).size===1?consensusCandidates[0]:undefined;
  const consensusInvalid=result.invalid||roundResult.invalid||new Set(consensusCandidates).size>1;
  const explicitExecution=resolvePairedEnum(record,['txExecutionResultName','tx_execution_result_name','txExecutionResult','tx_execution_result'],['txExecutionResult','tx_execution_result'],[EXECUTION_BY_NUMBER],EXECUTION_NAMES,{SUCCESS:'FINISHED_WITH_RETURN',ERROR:'FINISHED_WITH_ERROR',FAILED:'FINISHED_WITH_ERROR',FAILURE:'FINISHED_WITH_ERROR'});
  const derivedExecution=leaderExecution(record);const executionValues=[explicitExecution.value,derivedExecution.value].filter(Boolean) as string[];
  const executionKnown=(explicitExecution.present||derivedExecution.present)&&!explicitExecution.invalid&&!derivedExecution.invalid&&executionValues.length>0;
  const executionName=executionValues.length&&new Set(executionValues).size===1?executionValues[0]:undefined;
  const executionInvalid=explicitExecution.invalid||derivedExecution.invalid||new Set(executionValues).size>1;
  const invalid=status.invalid||consensusInvalid||executionInvalid;
  const finalized=!invalid&&status.value==='FINALIZED';
  const consensusSuccessful=consensusKnown&&!invalid&&consensusName==='MAJORITY_AGREE';
  const executionSuccessful=executionKnown&&!invalid&&executionName==='FINISHED_WITH_RETURN';
  const authoritative=finalized&&consensusKnown&&executionKnown&&!invalid;
  const successful=authoritative&&consensusSuccessful&&executionSuccessful;
  let outcome:TransactionOutcome='UNKNOWN';
  // A known non-final protocol state is pending.  A finalized receipt with
  // missing/unknown execution or consensus evidence is not a confirmed
  // failure: it is UNKNOWN and must retain the unresolved-write safeguard.
  if(!invalid&&!finalized&&status.value)outcome='PENDING';
  else if(successful)outcome='SUCCESS';
  else if(authoritative)outcome='FAILED';
  return {hash,statusName:status.value??'UNKNOWN',executionResultName:executionName??'UNKNOWN',resultName:consensusName??'UNKNOWN',finalized,successful,outcome,consensusKnown,consensusSuccessful,executionKnown,executionSuccessful,authoritative};
}

let storageUnsafe=false;
function browserStorage():Storage|null {if(typeof window==='undefined')return null;try{return window.localStorage;}catch{storageUnsafe=true;return null;}}
function emitTransactionEvent(type:string,hash='') {
  if(typeof window==='undefined')return;
  try{window.dispatchEvent(new CustomEvent(TX_EVENT,{detail:{type,hash}}));}catch{/* best effort */}
  try{if('BroadcastChannel' in window){const channel=new BroadcastChannel(TX_EVENT);channel.postMessage({type,hash});channel.close();}}catch{/* unsupported or blocked */}
}
function normalizedTransaction(value:unknown):PendingTx|null {
  const item=asRecord(value);if(!item||typeof item.hash!=='string'||!/^0x[0-9a-f]{64}$/i.test(item.hash)||typeof item.method!=='string')return null;
  if(item.lastObservation!==undefined&&!asRecord(item.lastObservation))return null;
  return {hash:item.hash,method:item.method,wallet:typeof item.wallet==='string'?item.wallet.toLowerCase():'',chainId:typeof item.chainId==='number'?item.chainId:Number(item.chainId??0),contract:typeof item.contract==='string'?item.contract.toLowerCase():'',fingerprint:typeof item.fingerprint==='string'?item.fingerprint:'',submittedAt:typeof item.submittedAt==='number'?item.submittedAt:Date.now(),lastObservation:asRecord(item.lastObservation)?item.lastObservation as TransactionObservation:undefined};
}
function readStoredTransactions():PendingTx[] {
  const store=browserStorage();if(!store){storageUnsafe=true;return [];}
  try{
    const raw=store.getItem(TX_STORE);if(raw===null){storageUnsafe=false;return [];}
    const parsed=JSON.parse(raw) as unknown;
    if(!Array.isArray(parsed))throw new Error('transaction store is not an array');
    const normalized=parsed.map(normalizedTransaction);
    if(normalized.some(item=>item===null))throw new Error('transaction store contains malformed records');
    storageUnsafe=false;
    return normalized as PendingTx[];
  }catch{storageUnsafe=true;return []}
}
function writeStoredTransactions(list:PendingTx[]):boolean {
  const store=browserStorage();if(!store||storageUnsafe)return false;
  try{
    // Never truncate an unresolved transaction.  Only settled history is
    // bounded for UI/storage hygiene.
    const unresolved=list.filter(isUnresolved);
    const settled=list.filter(item=>!isUnresolved(item)).slice(0,80);
    store.setItem(TX_STORE,JSON.stringify([...unresolved,...settled]));
    storageUnsafe=false;
    return true;
  }catch{storageUnsafe=true;return false;}
}
function currentScope(item:PendingTx,wallet?:string) {return item.chainId===NETWORK_ID&&item.contract===ADDRESS.toLowerCase()&&(!wallet||item.wallet===wallet.toLowerCase());}
function isUnresolved(item:PendingTx) {return !item.lastObservation||item.lastObservation.outcome==='PENDING'||item.lastObservation.outcome==='UNKNOWN';}
export function canonicalize(value:unknown):unknown {
  if(Array.isArray(value))return value.map(canonicalize);
  if(value&&typeof value==='object')return Object.keys(value as Record<string,unknown>).sort().reduce<Record<string,unknown>>((result,key)=>{result[key]=canonicalize((value as Record<string,unknown>)[key]);return result;},{});
  return value;
}
export function actionFingerprint(method:string,args:unknown[]) {return `${method}:${JSON.stringify(canonicalize(args))}`;}
export function recentTransactions():PendingTx[] {return readStoredTransactions();}
export function unresolvedTransactions(wallet?:string):PendingTx[] {return readStoredTransactions().filter(item=>currentScope(item,wallet)&&isUnresolved(item));}
export function transactionStorageReady():boolean {readStoredTransactions();return !storageUnsafe;}
export function rememberTransaction(tx:PendingTx):boolean {
  const current=readStoredTransactions();
  if(storageUnsafe)return false;
  const stored=writeStoredTransactions([tx,...current.filter(item=>item.hash!==tx.hash)]);
  if(stored)emitTransactionEvent('submitted',tx.hash);return stored;
}
export function rememberObservation(hash:string,observation:TransactionObservation):boolean {
  const list=readStoredTransactions();if(storageUnsafe)return false;const index=list.findIndex(item=>item.hash===hash);if(index<0)return false;
  list[index]={...list[index],lastObservation:observation};const stored=writeStoredTransactions(list);if(stored)emitTransactionEvent('observed',hash);return stored;
}
export async function reconcileTransactions(wallet?:string):Promise<PendingTx[]> {
  const pending=unresolvedTransactions(wallet);
  await Promise.all(pending.map(async item=>{try{rememberObservation(item.hash,await inspectTransaction(item.hash));}catch{/* retain lock on RPC failure */}}));
  return unresolvedTransactions(wallet);
}
export function transactionUrl(hash:string) {return `${EXPLORER}/tx/${hash}`;}

type ActionLock={scope:string;owner:string;createdAt:number};
function lockScope(method:string,args:unknown[],wallet:string) {return `${NETWORK_ID}:${ADDRESS.toLowerCase()}:${wallet.toLowerCase()}:${actionFingerprint(method,args)}`;}
function readLocks():ActionLock[] {
  const store=browserStorage();if(!store){storageUnsafe=true;return []}
  try{
    const raw=store.getItem(ACTION_LOCK_STORE);if(raw===null)return [];
    const parsed=JSON.parse(raw) as unknown;
    if(!Array.isArray(parsed)||parsed.some(item=>!item||typeof item!=='object'||typeof (item as ActionLock).scope!=='string'||typeof (item as ActionLock).owner!=='string'||typeof (item as ActionLock).createdAt!=='number'))throw new Error('action lock store is malformed');
    return parsed as ActionLock[];
  }catch{storageUnsafe=true;return []}
}
function writeStoredValue(key:string,value:unknown):boolean {const store=browserStorage();if(!store||storageUnsafe)return false;try{store.setItem(key,JSON.stringify(value));return true;}catch{storageUnsafe=true;return false;}}
function writeLocks(list:ActionLock[]) {return writeStoredValue(ACTION_LOCK_STORE,list);}
function storageWritable() {
  const store=browserStorage();if(!store)return false;
  const key='crossrule:storage-probe';
  try{
    const previous=store.getItem(key);const marker=`${Date.now()}-${Math.random()}`;
    store.setItem(key,marker);const readable=store.getItem(key)===marker;
    if(previous===null)store.removeItem(key);else store.setItem(key,previous);
    return readable;
  }catch{return false;}
}
function ownerId() {
  if(typeof window==='undefined')return 'server';const key='crossrule:tab-id';
  try{const existing=window.sessionStorage.getItem(key);if(existing)return existing;const next=`${Date.now()}-${Math.random().toString(36).slice(2)}`;window.sessionStorage.setItem(key,next);return next;}catch{return `${Date.now()}-${Math.random()}`;}
}
function claimAction(method:string,args:unknown[],wallet:string) {
  if(!storageWritable()||!transactionStorageReady())throw new Error('Browser storage is unavailable or corrupted; CROSSRULE is blocking this write until its transaction history can be recovered.');
  const fingerprint=actionFingerprint(method,args);const scope=lockScope(method,args,wallet);
  if(unresolvedTransactions(wallet).some(item=>item.fingerprint===fingerprint))throw new Error('An earlier transaction for this action is unresolved. Inspect its status before submitting another.');
  const owner=ownerId();const locks=readLocks();
  // localStorage read/modify/write is not an atomic lock.  navigator.locks is
  // checked by withBrowserWriteLock below; this persistent record is still
  // useful for recovery and for a second tab after the broadcast.
  if(locks.some(item=>item.scope===scope))throw new Error('Another CROSSRULE tab is already submitting this action, or a prior signing attempt is unresolved. Inspect its transaction status before retrying.');
  if(!writeLocks([...locks.filter(item=>item.scope!==scope),{scope,owner,createdAt:Date.now()}]))throw new Error('Browser storage is unavailable; CROSSRULE cannot safely guard duplicate transactions.');
  return {scope,owner};
}
function releaseAction(lock:{scope:string;owner:string}|null) {if(!lock)return;writeLocks(readLocks().filter(item=>item.scope!==lock.scope||item.owner!==lock.owner));}
async function withBrowserWriteLock<T>(scope:string,action:()=>Promise<T>):Promise<T> {
  if(typeof navigator==='undefined'||!navigator.locks)throw new Error('This browser cannot provide an atomic cross-tab transaction lock. CROSSRULE is blocking the write for safety.');
  return navigator.locks.request(`crossrule:${scope}`,{mode:'exclusive'},action);
}

function readClient() {return createClient({chain:studionet});}
export async function read<T>(method:string,args:unknown[]=[]):Promise<T> {
  if(!isConfigured)throw new Error('Crossrule has not been deployed: configure NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS.');
  const raw=await readClient().readContract({address:ADDRESS as `0x${string}`,functionName:method,args:args as CalldataEncodable[],transactionHashVariant:TransactionHashVariant.LATEST_FINAL});return raw as T;
}
export async function readJson<T>(method:string,args:unknown[]=[]):Promise<T> {const raw=await read<string>(method,args);if(!raw)throw new Error(`No on-chain record returned for ${method}`);return JSON.parse(raw) as T;}

export async function connectWallet():Promise<string> {
  const p=window.ethereum;if(!p)throw new Error('An injected EIP-1193 browser wallet is required. Install MetaMask or another compatible wallet.');
  const accounts=await p.request({method:'eth_requestAccounts'}) as string[];if(!accounts?.[0])throw new Error('Choose a wallet account.');
  let chain=String(await p.request({method:'eth_chainId'}));
  if(parseInt(chain,16)!==NETWORK_ID){
    try{await p.request({method:'wallet_switchEthereumChain',params:[{chainId:NETWORK_HEX}]});}
    catch(e){if(e&&typeof e==='object'&&'code' in e&&e.code===4902)await p.request({method:'wallet_addEthereumChain',params:[{chainId:NETWORK_HEX,chainName:'GenLayer StudioNet',rpcUrls:[RPC],nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},blockExplorerUrls:[EXPLORER]}]});else throw e;}
  }
  chain=String(await p.request({method:'eth_chainId'}));if(parseInt(chain,16)!==NETWORK_ID)throw new Error('Switch your wallet to StudioNet chain 61999.');
  const current=await p.request({method:'eth_accounts'}) as string[];if(!current?.[0])throw new Error('Choose a wallet account.');return current[0].toLowerCase();
}
export async function connectedWallet():Promise<string> {const p=window.ethereum;if(!p)return '';const accounts=await p.request({method:'eth_accounts'}) as string[];return accounts?.[0]?.toLowerCase()??'';}
export async function disconnectWallet():Promise<boolean> {const p=window.ethereum;if(!p)return false;try{await p.request({method:'wallet_revokePermissions',params:[{eth_accounts:{}}]});return true;}catch{return false;}}

export function receiptSucceeded(value:unknown):boolean {return classifyReceipt(value).successful;}
export async function inspectTransaction(hash:string):Promise<TransactionObservation> {if(!/^0x[0-9a-f]{64}$/i.test(hash))throw new Error('Invalid transaction ID.');return classifyReceipt(await readClient().getTransaction({hash:hash as Hash}));}
export async function awaitFinalized(hash:string) {
  if(!/^0x[0-9a-f]{64}$/i.test(hash))throw new Error('Invalid transaction ID.');
  const receipt=await readClient().waitForTransactionReceipt({hash:hash as Hash,status:TransactionStatus.FINALIZED});
  const observation=classifyReceipt(receipt);
  if(observation.outcome==='FAILED')throw new Error(`Transaction ${hash} finalized with failed contract execution. Inspect its receipt.`);
  if(observation.outcome!=='SUCCESS')throw new Error(`Transaction ${hash} reached finality without a complete execution outcome. Inspect its receipt; do not resubmit.`);
  return receipt;
}
export async function write(method:string,args:unknown[],wallet:string,onSubmit:(hash:string)=>void) {
  if(!isConfigured)throw new Error('Contract not deployed yet. Set NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS after final verification.');
  const active=await connectWallet();if(active!==wallet.toLowerCase())throw new Error('Active wallet changed. Reconnect and retry.');
  const scope=lockScope(method,args,wallet);
  return withBrowserWriteLock(scope,async()=>{
    const lock=claimAction(method,args,wallet);let hash='';
    try{
      const client=createClient({chain:studionet,account:wallet as `0x${string}`,provider:window.ethereum});
      hash=String(await client.writeContract({address:ADDRESS as `0x${string}`,functionName:method,args:args as CalldataEncodable[],value:0n}));
      if(!/^0x[0-9a-f]{64}$/i.test(hash))throw new Error('Wallet returned an invalid transaction identifier.');
      const pending:PendingTx={hash,method,wallet:wallet.toLowerCase(),chainId:NETWORK_ID,contract:ADDRESS.toLowerCase(),fingerprint:actionFingerprint(method,args),submittedAt:Date.now()};
      if(!rememberTransaction(pending))throw new Error(`Transaction ${hash} was submitted, but this browser could not persist its recovery record. Do not resubmit.`);
      onSubmit(hash);
      // The durable post-broadcast record now protects this action across
      // reloads/tabs.  Release only the temporary pre-broadcast lock.
      releaseAction(lock);
      const receipt=await awaitFinalized(hash);const observation=classifyReceipt(receipt);rememberObservation(hash,observation);releaseAction(lock);return hash;
    }catch(error){
      if(hash){try{const observation=await inspectTransaction(hash);rememberObservation(hash,observation);if(observation.outcome==='SUCCESS'||observation.outcome==='FAILED')releaseAction(lock);}catch{/* retain transaction and lock on unknown/RPC failure */}}
      else releaseAction(lock);
      throw error;
    }
  });
}
