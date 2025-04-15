## This is for the TPS Calculation 
- Transaction flow is "EVM to Kalp" flow
- Transaction initates with from `0x1F53959B76C4d7851078b580dC869e8712310492` to `1F53959B76C4d7851078b580dC869e8712310492` with amount `1000000000000`
- Bridge Address is `0x9f422e66930329A4dDfD43b9c67f77cb53Ce5e88` 'Mohit's server bridge contract'
- Tx goes to the devnet , Gateway URL `https://dev-kalp-gateway.p2eppl.com/transaction/v1`
- Devnet Couch db url `http://159.65.144.243:5984/_utils/#login`

### Notes 
- Replace `kalp-wallet-ts` npm manually from `backupKalpWallet` folder
- Use Curl to initiate the testing ` curl --location --request POST 'http://localhost:3001/thirdweb/writeToEVMViaSDK' --header ''`
- All the records are going to get stored in Atlas db (Mohit's cluster)
- To start the project use `node server.js`
- To start the script use `./WriteToEVM.sh` inside `script` folder.
