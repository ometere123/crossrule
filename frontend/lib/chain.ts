import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {ExecutionResult, TransactionHashVariant, TransactionStatus, type CalldataEncodable, type Hash} from 'genlayer-js/types';

export const NETWORK_ID=61999;
export const NETWORK_HEX='0xf22f';
export const RPC='https://studio.genlayer.com/api';
export const EXPLORER='https://explorer-studio.genlayer.com';
export const ADDRESS=process.env.NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS??'';
export const isConfigured=/^0x[a-fA-F0-9]{40}$/.test(ADDRESS);
const TX_STORE='crossrule:transactions';

export interface Provider {request(args:{method:string;params?:unknown[]}):Promise<unknown>;on?(event:string,fn:(...args:unknown[])=>void):void;removeListener?(event:string,fn:(...args:unknown[])=>void):void;}
declare global {interface Window {ethereum?:Provider}}
export type PendingTx={hash:string;method:string;wallet:string;submittedAt:number};

export function recentTransactions():PendingTx[] {
  if(typeof window==='undefined')return [];
  try{return (JSON.parse(window.localStorage.getItem(TX_STORE)??'[]') as PendingTx[]).filter(x=>/^0x[0-9a-f]{64}$/i.test(x.hash) && typeof x.method==='string');}
  catch{return [];}
}
export function rememberTransaction(tx:PendingTx) {
  if(typeof window==='undefined')return;
  const list=recentTransactions().filter(item=>item.hash!==tx.hash);
  window.localStorage.setItem(TX_STORE,JSON.stringify([tx,...list].slice(0,40)));
}
export function transactionUrl(hash:string) {return `${EXPLORER}/transactions/${hash}`;}

function readClient() {return createClient({chain:studionet});}
export async function read<T>(method:string,args:unknown[]=[]):Promise<T> {
  if(!isConfigured)throw new Error('Crossrule has not been deployed: configure NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS.');
  const raw=await readClient().readContract({address:ADDRESS as `0x${string}`,functionName:method,
    args:args as CalldataEncodable[],transactionHashVariant:TransactionHashVariant.LATEST_FINAL});
  return raw as T;
}
export async function readJson<T>(method:string,args:unknown[]=[]):Promise<T> {
  const raw=await read<string>(method,args);
  if(!raw)throw new Error(`No on-chain record returned for ${method}`);
  return JSON.parse(raw) as T;
}

export async function connectWallet():Promise<string> {
  const p=window.ethereum;
  if(!p)throw new Error('An injected EIP-1193 browser wallet is required. Install MetaMask or another compatible wallet.');
  const accounts=await p.request({method:'eth_requestAccounts'}) as string[];
  if(!accounts?.[0])throw new Error('Choose a wallet account.');
  let chain=String(await p.request({method:'eth_chainId'}));
  if(parseInt(chain,16)!==NETWORK_ID){
    try{await p.request({method:'wallet_switchEthereumChain',params:[{chainId:NETWORK_HEX}]});}
    catch(e){
      if(e && typeof e==='object' && 'code' in e && e.code===4902){
        await p.request({method:'wallet_addEthereumChain',params:[{chainId:NETWORK_HEX,chainName:'GenLayer StudioNet',rpcUrls:[RPC],nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},blockExplorerUrls:[EXPLORER]}]});
      } else throw e;
    }
  }
  chain=String(await p.request({method:'eth_chainId'}));
  if(parseInt(chain,16)!==NETWORK_ID)throw new Error('Switch your wallet to StudioNet chain 61999.');
  return accounts[0].toLowerCase();
}

export function receiptSucceeded(value:unknown):boolean {
  if(typeof value!=='object'||!value)return false;
  const r=value as Record<string,unknown>;
  const final=r.statusName==='FINALIZED'||r.status_name==='FINALIZED'||r.status===7;
  if(!final)return false;
  const execution=r.txExecutionResultName??r.tx_execution_result_name;
  if(typeof execution==='string')return execution===ExecutionResult.FINISHED_WITH_RETURN;
  const data=(r.consensusData??r.consensus_data) as Record<string,unknown>|undefined;
  const receipts=data?.leader_receipt;
  const leader=Array.isArray(receipts)?receipts[0] as Record<string,unknown>:null;
  return (r.resultName==='MAJORITY_AGREE'||r.result_name==='MAJORITY_AGREE') && leader?.execution_result==='SUCCESS';
}
export async function awaitFinalized(hash:string) {
  if(!/^0x[0-9a-f]{64}$/i.test(hash))throw new Error('Invalid transaction ID.');
  const receipt=await readClient().waitForTransactionReceipt({hash:hash as Hash,status:TransactionStatus.FINALIZED});
  if(!receiptSucceeded(receipt))throw new Error(`Transaction ${hash} finalized without successful execution. Inspect its receipt.`);
  return receipt;
}
export async function write(method:string,args:unknown[],wallet:string,onSubmit:(hash:string)=>void) {
  if(!isConfigured)throw new Error('Contract not deployed yet. Set NEXT_PUBLIC_CROSSRULE_CONTRACT_ADDRESS after final verification.');
  const active=await connectWallet();
  if(active!==wallet.toLowerCase())throw new Error('Active wallet changed. Reconnect and retry.');
  const client=createClient({chain:studionet,account:wallet as `0x${string}`,provider:window.ethereum});
  const hash=String(await client.writeContract({address:ADDRESS as `0x${string}`,functionName:method,args:args as CalldataEncodable[],value:0n}));
  rememberTransaction({hash,method,wallet,submittedAt:Date.now()});
  onSubmit(hash);
  await awaitFinalized(hash);
  return hash;
}
