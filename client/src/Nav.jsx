import { useState, useEffect } from 'react'
import {Xumm} from 'xumm'

const xumm = new Xumm('5cb15a71-6272-4732-a143-f3e0153c286f') // Some API Key

function App() {
  const [account, setAccount] = useState('')
  //const [connected, setConnected] = useState(false)
  const [appName, setAppName] = useState('')

  useEffect(()=>{
    async function output() {
      if (window.localStorage.getItem("xumm_address").length > 0) {
        const _account = localStorage.getItem('xumm_address');
        setAccount(_account)
        console.log("account on first render is ", account)
      }
    } output()
  },[])

  xumm.user.account.then(a => {
    setAccount(a ?? '')
    console.log("about to set account")
    localStorage.setItem('xumm_address', account);
  })
  xumm.environment.jwt?.then(j => setAppName(j?.app_name ?? ''))


  const logout = () => {
    localStorage.removeItem("xumm_address")
    xumm.logout()
    setAccount('')
    
  }

  async function get_nfts() {
    
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

  
  

  return (
    <div className="App">
      <h2>{ appName }</h2>
      <div>
        Hi <b>{ account || "" }</b>
      </div>
      {
        account === '' && !xumm.runtime.xapp
          ? <button onClick={login}>Sign in</button>
          : ''
      }
      {
        account !== ''
          ? <>
              &nbsp;- or -&nbsp;
              <button onClick={logout}>Sign Out</button>
            </>
          : ''
      }
      
    </div>
  )
}

export default App
