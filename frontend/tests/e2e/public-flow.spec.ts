import {test,expect} from '@playwright/test';

test('public homepage, communities and founding form',async({page})=>{
  await page.goto('/');
  await expect(page.getByRole('heading',{name:/One shared space/})).toBeVisible();
  await page.getByRole('button',{name:'Communities',exact:true}).click();
  await expect(page.getByText('Independent governance')).toBeVisible();
  if(process.env.PLAYWRIGHT_BASE_URL){
    await expect(page.getByText(/Source build · not deployed/)).toHaveCount(0);
  }else await expect(page.getByText(/Source build · not deployed/)).toBeVisible();
  await page.getByRole('button',{name:'Create community',exact:true}).last().click();
  await expect(page.getByLabel('Initial charter')).toBeVisible();
  await page.getByLabel('Community name').fill('Builders Guild');
  await expect(page.getByLabel('Community name')).toHaveValue('Builders Guild');
});

test('shared-room policy exposes all configurable timers',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Shared rooms',exact:true}).click();
  await page.getByRole('button',{name:/New collaboration/}).click();
  await expect(page.getByLabel('Voting window')).toHaveValue('5');
  await expect(page.getByLabel('Author defense')).toHaveValue('5');
  await expect(page.getByLabel('Case appeal')).toHaveValue('5');
  await expect(page.getByLabel('Serious-breach suspension')).toHaveValue('5');
});

test('missing injected wallet reports the required signer honestly',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Connect wallet'}).click();
  await expect(page.locator('.landing-alert')).toContainText('injected EIP-1193 browser wallet is required');
  await page.getByRole('button',{name:'Create a community'}).first().click();
  await expect(page.getByRole('button',{name:'Register community'})).toBeDisabled();
});

test('responsive page never forces viewport-wide horizontal scrolling',async({page})=>{
  await page.goto('/');
  const fit=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
  expect(fit).toBe(true);
});

test('injected wallet connects and switches from the wrong network',async({page})=>{
  await page.addInitScript(()=>{
    let chain='0x1';
    window.ethereum={request:async({method,params})=>{
      if(method==='eth_requestAccounts')return ['0x'+'1'.repeat(40)];
      if(method==='eth_chainId')return chain;
      if(method==='wallet_switchEthereumChain'){
        chain=(params?.[0] as {chainId:string}).chainId;
        return null;
      }
      throw new Error(`Unmocked EIP-1193 request: ${method}`);
    }};
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Connect wallet'}).click();
  await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x1111');
  await page.getByRole('button',{name:'Create a community'}).first().click();
  await expect(page.getByRole('button',{name:'Register community'})).toBeVisible();
});

test('connected wallet rehydrates after refresh and exposes disconnect',async({page})=>{
  await page.addInitScript(()=>{
    let accounts=['0x'+'2'.repeat(40)];
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
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Connect wallet'}).click();
  await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x2222');
  await page.reload();
  await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x2222');
  await expect(page.getByRole('button',{name:'Disconnect'})).toBeVisible();
  await page.getByRole('button',{name:'Disconnect'}).click();
  await expect(page.getByRole('button',{name:'Connect wallet'})).toBeVisible();
});

test('wallet rehydrates from eth_accounts without optional event hooks',async({page})=>{
  await page.addInitScript(()=>{
    const accounts=['0x'+'3'.repeat(40)];
    window.ethereum={
      request:async({method})=>{
        if(method==='eth_accounts'||method==='eth_requestAccounts')return accounts;
        if(method==='eth_chainId')return '0xf22f';
        throw new Error('Unmocked EIP-1193 request: '+method);
      }
    };
  });
  await page.goto('/');
  await page.getByRole('button',{name:'Connect wallet'}).click();
  await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x3333');
  await page.reload();
  await expect(page.getByRole('button',{name:'Reconnect wallet'})).toContainText('0x3333');
});
