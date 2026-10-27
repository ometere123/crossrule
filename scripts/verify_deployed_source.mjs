import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [sourcePath = 'contracts/Crossrule.py', contractAddress, rpc = 'https://studio.genlayer.com/api'] = process.argv.slice(2);

if (!contractAddress) {
  throw new Error('usage: node scripts/verify_deployed_source.mjs <source-path> <contract-address> [rpc]');
}

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

const source = readFileSync(sourcePath);
if (source.includes(0x0d)) {
  throw new Error(`${sourcePath} contains CR bytes; canonical contract source must use LF line endings.`);
}
if (source.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
  throw new Error(`${sourcePath} contains a UTF-8 BOM; deployed bytes must match the committed source exactly.`);
}

const response = await fetch(rpc, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'gen_getContractCode',
    params: [contractAddress],
  }),
});
const payload = await response.json();
if (!response.ok || payload.error || typeof payload.result !== 'string') {
  throw new Error(`contract source retrieval failed: ${JSON.stringify(payload)}`);
}

const deployed = Buffer.from(payload.result, 'base64');
const result = {
  source: { path: sourcePath, bytes: source.length, sha256: digest(source) },
  deployed: { address: contractAddress, rpc, bytes: deployed.length, sha256: digest(deployed) },
  byteEqual: Buffer.compare(source, deployed) === 0,
};
if (!result.byteEqual) {
  throw new Error(`source parity failed: ${JSON.stringify(result)}`);
}

console.log(JSON.stringify(result, null, 2));
