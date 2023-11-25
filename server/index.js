const xrpl = require("xrpl");
const express = require('express');
const cors =  require('cors'); 
const bodyParser = require('body-parser');
require('dotenv').config()



const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PUBLIC_SERVER = "wss://xrplcluster.com/";
const client = new xrpl.Client(PUBLIC_SERVER);



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
        const nfts = response.result;
        await client.disconnect();
        return(nfts)
    } catch (error) {
        console.log(error)
        await client.disconnect();

    }
}

async function get_balance(address) {
    try {
        // Define the network client
        await client.connect();
        // Create a wallet and fund it with the Testnet faucet:
        const response = await client.request({
            command: "account_info",
            account: address,
            ledger_index: "validated",
        });
        const balance = response.result.account_data.Balance;
        await client.disconnect();
        return(balance)
    } catch (error) {
        console.log(error)
        await client.disconnect();

    }
}

async function get_tokens(address) {
    try {
        // Define the network client
        await client.connect();
        // Create a wallet and fund it with the Testnet faucet:
        const response = await client.request({
            command: "account_lines",
            account: address,
        });
        const trustlines = response.result;
        await client.disconnect();
        return(trustlines)
    } catch (error) {
        console.log(error)
        await client.disconnect();

    }
}

app.get('/nfts/:account', (req,res)=>{
    async function getMyNfts(){
        const { account } = req.params;
        const data = await get_nfts("rnTVYExCChWe8FP3vja74HcReHNNCCaz3V");
        res.send({data:data})
    }getMyNfts()
})

app.get('/balance/:account', (req,res)=>{
    async function getMyXrpBal(){
        const { account } = req.params;
        const balance = await get_balance("rnTVYExCChWe8FP3vja74HcReHNNCCaz3V");
        res.send({data:balance})
    }getMyXrpBal()
})


app.get('/tokens/:account', (req,res)=>{
    async function getMyTkns(){
        const { account } = req.params;
        const tokens = await get_tokens("rnTVYExCChWe8FP3vja74HcReHNNCCaz3V");
        res.send({ data: tokens })
    }getMyTkns()
})

const port = 8000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}!.`)
})
