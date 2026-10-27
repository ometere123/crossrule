import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const [sourcePath = 'contracts/Crossrule.py', deployedPath] = process.argv.slice(2);

function digest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function describe(path, bytes) {
  return { path, bytes: bytes.length, sha256: digest(bytes) };
}

const source = readFileSync(sourcePath);
if (source.includes(0x0d)) {
  throw new Error(`${sourcePath} contains CR bytes; canonical contract source must use LF line endings.`);
}
if (source.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) {
  throw new Error(`${sourcePath} contains a UTF-8 BOM; deployed bytes must match the committed source exactly.`);
}

const result = { source: describe(sourcePath, source) };
if (deployedPath) {
  const deployed = readFileSync(deployedPath);
  result.deployed = describe(deployedPath, deployed);
  result.byteEqual = Buffer.compare(source, deployed) === 0;
  if (!result.byteEqual) {
    throw new Error(`source parity failed: ${JSON.stringify(result)}`);
  }
}

console.log(JSON.stringify(result, null, 2));
