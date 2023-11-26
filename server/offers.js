const xrpl = require("xrpl");
const axios = require("axios")


const PUBLIC_SERVER = "wss://xrplcluster.com/";
const client = new xrpl.Client(PUBLIC_SERVER);


async function get_info(account) {
    await client.connect();

    const acc_info = await client.request({
        "id": 2,
        "command": "account_currencies",
        "account": account,
        "ledger_index": "current",
    })
    const currency = acc_info.result.receive_currencies[0]
    await client.disconnect();
    return (currency, account)
}

async function offers(account,currency ) {
    await client.connect();

    const acc_txs = await client.request({
        "id": 2,
        "command": "account_tx",
        "account": "rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg",
        "tx_type":"OfferCreate",
        "ledger_index_min": -1,
        "ledger_index_max": -1,
        "binary": false,
        "limit": 20,
        "forward": false
    })   

    const response = await client.request({
        "id": 4,
        "command": "book_offers",
        "taker": "r9cZA1mLK5R5Am25ArfXFmqgNwjZgnfk59",
        "ledger_index": "current",
        "taker_pays": {
            "currency": currency,
            "issuer": account,
        },
        "taker_gets": {
          "currency": "XRP",
        },
        "limit": 1
      });
   
    const tx = response.result.offers
    await client.disconnect()
    return tx[0].TakerGets/1000000 / tx[0].TakerPays.value

}

