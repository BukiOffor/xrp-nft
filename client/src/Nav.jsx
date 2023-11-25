import { useState, useEffect } from 'react'
import { Xumm } from 'xumm'
import server from './server';



const xumm = new Xumm('5cb15a71-6272-4732-a143-f3e0153c286f') // Some API Key

function App() {
  const [account, setAccount] = useState('')
  const [nfts, setNfts] = useState([]);
  //const [appName, setAppName] = useState('')
  const [balance, setBalance] = useState('')
  const [tokenData, setTokenData] = useState([])



  useEffect(()=>{
    async function output() {
      if (window.localStorage.getItem("xumm_address") !== null) {
        const _account = localStorage.getItem('xumm_address');
        setAccount(_account)
        console.log("account on first render is ", account)
      }
    } output()
  }, [])
  
  useEffect(()=>{
    async function output() {
      const { data: { data } } = await server.get(`nfts/${account}`);
      setNfts(data.account_nfts)
      const { data:balance } = await server.get(`balance/${account}`);
      setBalance(balance.data)
      const { data:tokens } = await server.get(`tokens/${account}`);
      setTokenData(tokens.data.lines)
      console.log(tokens.data.lines)


    } output()
  }, [account])

  xumm.user.account.then(a => {
    setAccount(a ?? '')
    console.log("about to set account")
    localStorage.setItem('xumm_address', account);
  })
  //xumm.environment.jwt?.then(j => setAppName(j?.app_name ?? ''))


  const logout = () => {
    //localStorage.removeItem("xumm_address")
    xumm.logout()
    setAccount('')
    
  }



  const login = async () => {
    if (window.localStorage.getItem("xumm_address") !== null) {
      const _account = localStorage.getItem('xumm_address');
      console.log(_account)
      if (_account.length == 0) {
        xumm.authorize()
      }
      setAccount(_account)
      //console.log("clicked")
    } else {
      await xumm.authorize()
    }
  }
  function hexToASCII(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  }

  //https://ipfs.io/ipfs/bafyreihcxsrh2nqzdrqzy66smi7u2upjy3ya6ib73nr4gs7xf3v2eipbbq/metadata.json
  const elements = nfts.map((item, index) => {
    const uri = `${item.URI}`
    const url = hexToASCII(uri)
    return (
      <ul key={index} className="mb-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-red-900 dark:border-black dark:text-white">
        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">TokenId: { item.NFTokenID}</li>
        <li className="w-full px-4 py-2 border-b border-black rounded-t-lg dark:border-black">Transfer Fee : {item.TransferFee}</li>
        <li className="w-full px-4 py-2  border-b border-black">Issuer: { item.Issuer}</li>
        <li className="w-full px-4 py-2 rounded-b-lg border-gray-200 dark:border-gray-600">URI: {url}</li>
    </ul>
    )
  });
  
  const token_elements = tokenData.map((item, index) => {
    return (
      <ul key={index} className="mb-4 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-yellow-900 dark:border-black dark:text-white">
        <li className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-600">account: { item.account}</li>
        <li className="w-full px-4 py-2 border-b border-black rounded-t-lg dark:border-black">Balance : {item.balance}</li>
        <li className="w-full px-4 py-2 rounded-b-lg border-gray-200 dark:border-gray-600">Currency: {item.currency}</li>
    </ul>
)});
    

  return (
    <div className="App">
      <div className='flex space-between '>
        {
          account === '' && !xumm.runtime.xapp
            ? <>Please sign in to enjoy the app</>
            :
          <div className='text-lg'>
            Welcome <b>{account}</b><br/>
            <>balance: {balance} xrp</>
          </div>
        }
        {
        account === '' && !xumm.runtime.xapp
          ? <button onClick={login} className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Sign in</button>
          : ''
      }
      {
        account !== ''
          ? <>
              <button onClick={logout} className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>Sign Out</button>
            </>
          : ''
        }
      </div>
      <>Tokens</>
      <div>
        {token_elements}
      </div>
        <>NFTS</>
      <div>
        {elements}
      </div>
    </div>
  )
}

export default App
