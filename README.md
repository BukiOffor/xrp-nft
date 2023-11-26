# xrp-nft

This program runs on the xrpl blockchain. it connects a user to the xrpl blockchain using the xumn wallet, fetches all token balance of a user(fungible and non-fungible) and the native xrpl balance. it also queries the xrpl native dex for a token price(offer).

## Usage

Clone the project and change directory to the client and server folders respectively, then install the dependencies by running 
```bash
npm i
```
Then run the following command in the client folder
```bash
npm run dev
```
Switch to the server directory and start the server by running
```bash
nodemon index
```