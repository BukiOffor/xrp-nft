const xrpl = require("xrpl");
const axios = require("axios")


const PUBLIC_SERVER = "wss://xrplcluster.com/";
const client = new xrpl.Client(PUBLIC_SERVER);


const cold_addr = "rPbxLdojd6F9qyExWKpyQ9jPAxiiwPY5oL"
const cold_secret = "sa3mxbSsDtXLWo5vKJT7rqAXYLEvk"
const hot_secret = "sh8u3heS78Roiqh3hPB2XGgbQKir9"
const hot_addr = "rGsZ4g9GXzi2FdgJVNn4zjmTkRosnEGtfE"


function hexToASCII(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

async function get_nfts(address) {
    try {
        // Define the network client
      await client.connect();
        // Create a wallet and fund it with the Testnet faucet:
        const response = await client.request({
            command: "account_nfts",
            account: address,
            ledger_index: "validated",
        });
      const result = {"account_nfts": []}
      const data = response.result.account_nfts;
      for (i in data) {
        const uri = `${data[i].URI}`
        const url = hexToASCII(uri)
        if (url.startsWith("https://")) {
          const response = await axios.get(url)
          result.account_nfts.push(response.data)
        } else if (url.startsWith("ipfs://")) {
          const new_uri = "https://ipfs.io/ipfs/"+ url.slice(7)
          const response = await axios.get(new_uri)
          result.account_nfts.push(response.data)
        } else {
          continue
        }
      }
      console.log(result)
      await client.disconnect();      
    } catch (error) {
        console.log(error)
        await client.disconnect();

    }
}

async function getMetadata(uri) {  
  const uri = `${uri}`
  const url = hexToASCII(uri)
  if (url.startsWith("https://")) {
    const response = await axios.get(url)
    return response.data
  } else if (url.startsWith("ipfs://")) {
    const new_uri = "https://ipfs.io/ipfs/"+ url.slice(7)
    const response = await axios.get(new_uri)
    return response.data
  } else {
    return null
  }      
}

get_nfts('rnTVYExCChWe8FP3vja74HcReHNNCCaz3V');
