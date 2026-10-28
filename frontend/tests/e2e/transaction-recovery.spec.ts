import {test,expect} from '@playwright/test';

const CONTRACT='0xD7510Ee01F9A922D0808f5160f83C96C491cc2Ab';
const WALLET='0x'+'2'.repeat(40);
const HASH='0x'+'c'.repeat(64);
const args: [string,string,string,string,string,number]=['Recovery Guild','A deterministic recovery test community.','A public test charter.', '0x'+'3'.repeat(40), '0x'+'4'.repeat(40), 5];

test('an unresolved write lock survives refresh and blocks only the same action',async({page})=>{
  await page.addInitScript(({contract,wallet,hash,pendingArgs})=>{
    let accounts=[wallet];
    window.ethereum={
      request:async({method})=>{
        if(method==='eth_accounts'||method==='eth_requestAccounts')return accounts;
        if(method==='eth_chainId')return '0xf22f';
        if(method==='wallet_revokePermissions'){accounts=[];return null;}
        throw new Error(`Unmocked EIP-1193 request: ${method}`);
      },
      on:()=>undefined,
      removeListener:()=>undefined
    };
    localStorage.setItem('crossrule:transactions',JSON.stringify([{
      hash,method:'create_community',wallet,chainId:61999,contract,
      fingerprint:`create_community:${JSON.stringify(pendingArgs)}`,
      submittedAt:Date.now()
    }]));
  },{contract:CONTRACT,wallet:WALLET,hash:HASH,pendingArgs:args});
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/One shared space/})).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button',{name:'Communities',exact:true}).click();
  await page.getByRole('button',{name:'Create community',exact:true}).last().click();
  await expect(page.getByRole('heading',{name:'Found a community'})).toBeVisible();
  await page.getByLabel('Community name').fill(args[0]);
  await page.getByLabel('Description').fill(args[1]);
  await page.getByLabel('Initial charter').fill(args[2]);
  await page.getByLabel('Founding wallet B').fill(args[3]);
  await page.getByLabel('Founding wallet C').fill(args[4]);
  await expect(page.getByRole('button',{name:'Register community'})).toBeDisabled();
  await page.reload();
  await expect(page.getByRole('heading',{name:/One shared space/})).toBeVisible();
  await page.waitForTimeout(1000);
  await page.getByRole('button',{name:'Communities',exact:true}).click();
  await page.getByRole('button',{name:'Create community',exact:true}).last().click();
  await expect(page.getByRole('heading',{name:'Found a community'})).toBeVisible();
  await page.getByLabel('Community name').fill(args[0]);
  await page.getByLabel('Description').fill(args[1]);
  await page.getByLabel('Initial charter').fill(args[2]);
  await page.getByLabel('Founding wallet B').fill(args[3]);
  await page.getByLabel('Founding wallet C').fill(args[4]);
  await expect(page.getByRole('button',{name:'Register community'})).toBeDisabled();
});
