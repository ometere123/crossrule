import {describe,it,expect,vi,afterEach,beforeEach} from 'vitest';
import {render,screen,fireEvent,cleanup} from '@testing-library/react';

beforeEach(()=>vi.stubGlobal('scrollTo',vi.fn()));
afterEach(()=>{cleanup();vi.unstubAllGlobals();});

vi.mock('@/lib/chain',()=>({
  NETWORK_ID:61999,isConfigured:false,ADDRESS:'',
  connectWallet:vi.fn(),readJson:vi.fn(),write:vi.fn(),
  recentTransactions:()=>[],transactionUrl:(hash:string)=>`https://explorer-studio.genlayer.com/tx/${hash}`
}));
import CrossruleApp from '@/components/CrossruleApp';

describe('Crossrule complete frontend shell',()=>{
  it('is honest when contract deployment is not configured',()=>{
    render(<CrossruleApp/>);
    expect(screen.getByText(/Source build · not deployed/)).toBeTruthy();
    expect(screen.getByText(/Different communities/)).toBeTruthy();
  });
  it('opens community founding without a backend dependency',()=>{
    render(<CrossruleApp/>);
    const buttons=screen.getAllByRole('button',{name:/Create community/i});
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Found a community/)).toBeTruthy();
    expect(screen.getByLabelText('Founding wallet B')).toBeTruthy();
    expect(screen.getByLabelText('Initial charter')).toBeTruthy();
  });
  it('exposes shared discussion and governance navigation',()=>{
    render(<CrossruleApp/>);
    fireEvent.click(screen.getByRole('button',{name:'Shared rooms'}));
    expect(screen.getByText('New collaboration')).toBeTruthy();
    fireEvent.click(screen.getByRole('button',{name:/New collaboration/}));
    expect(screen.getByLabelText('Joint agreement text')).toBeTruthy();
    expect(screen.getByLabelText('Case appeal')).toBeTruthy();
  });
});
