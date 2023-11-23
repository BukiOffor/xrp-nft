import { useState } from 'react'
import {Xumm} from 'xumm'

const xumm = new Xumm('5cb15a71-6272-4732-a143-f3e0153c286f') // Some API Key

function App() {
  const [account, setAccount] = useState('')

  const [appName, setAppName] = useState('')

  xumm.user.account.then(a => setAccount(a ?? ''))
  xumm.environment.jwt?.then(j => setAppName(j?.app_name ?? ''))

  const logout = () => {
    xumm.logout()
    setAccount('')
  }

  

  return (
    <div className="App">
      <h2>{ appName }</h2>
      <div>
        Hi <b>{ account }</b>
      </div>
      {
        account === '' && !xumm.runtime.xapp
          ? <button onClick={xumm.authorize}>Sign in</button>
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
