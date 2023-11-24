const xrpl = require("xrpl");

const PUBLIC_SERVER = "wss://xrplcluster.com/";
const client = new xrpl.Client(PUBLIC_SERVER);

async function get_nfts() {
    try {
        // Define the network client
        await client.connect();
        // Create a wallet and fund it with the Testnet faucet:
        const test_wallet = xrpl.Wallet.generate();
        const response = await client.request({
            command: "account_nfts",
            account: test_wallet.address,
            ledger_index: "validated",
        });
        console.log(response);
        await client.disconnect();
    } catch (error) {
        console.log(error)
        await client.disconnect();

    }
}

get_nfts();
