require('dotenv').config({ path: '../../../.env' });
const { defineChain } = require("thirdweb/chains");
const {
  prepareContractCall,
  createThirdwebClient,
  getContract,
  prepareEvent,
  readContract,
  sendAndConfirmTransaction,
} = require("thirdweb");
const { privateKeyToAccount } = require("thirdweb/wallets");
const { getTransactionStatus } = require("../utils/kalpservice.js");
// const { isValidSignature, isExpired } = require("../../utils/helper");
const Transaction = require('../model/transactionSchema');

console.log(process.env.BRIDGE_CONTRACT_ADDRESS)

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({
  clientId: "31f1dcba550cac83f6bfe001b4d2ac65",
});

// connect to your contract
const contract = getContract({
  client,
  chain: defineChain(80002),
  address: "0x9f422e66930329A4dDfD43b9c67f77cb53Ce5e88",
});

const preparedEvent = prepareEvent({
  signature: "event TokenBridged(uint256 txnID, address receiver, uint256 amount)",
});

const writeViaSDK = async (req, res) => {
  console.log("Calling Thirdweb SDK to write to evm!");
  const _receiver = "1F53959B76C4d7851078b580dC869e8712310492";
  const _amount = 1000000000000;

  const transaction = await prepareContractCall({
    contract,
    method: "function bridgeToken(string memory _receiverAddress, uint256 _amount)",
    params: [_receiver, _amount],
  });
  console.log(transaction);

  // client is important to add here.
  const account = privateKeyToAccount({
    client,
    privateKey: "4a44f6b11af1e97b513fdae8d0d2a857703379126f46914e51f693261de8fbc2",
    encryption: false, // no encryption
  });

  const { transactionHash } = await sendAndConfirmTransaction({
    transaction,
    account,
  });

  console.log(transactionHash);
  const tx = new Transaction({ txid: transactionHash });
  await tx.save();
  initiateTesting(transactionHash);

  res.send({ message: "Write send is successful!", txId: transactionHash });
};

const initiateTesting = async (txid, intervalMs = 5000, maxDurationMs = 400000) => {
  const startTime = Date.now();
  let attempts = 0;

  console.log(`Starting transaction status check for txid: ${txid}`);

  const checkStatus = async () => {
    try {
      attempts++;
      const res = await getTransactionStatus(txid);
      console.log(res);

      console.log(`Attempt ${attempts} at ${new Date().toISOString()}: Status = ${res}`);

      // Stop if txSuccess
      if (res.data.status === 'TxSuccess') {
        console.log(`Transaction ${txid} succeeded after ${attempts} attempts in ${(Date.now() - startTime) / 1000} seconds`);
        const updatedTx = await Transaction.findOneAndUpdate(
          { txid: txid }, // Query to find the transaction
          {
            $set: {
              endTimestamp: res.data.updatedAt,
            },
          },
          { new: true } // Return the updated document
        );
    
        if (!updatedTx) {
          throw new Error('Transaction not found');
        }
    
        // Calculate timeToComplete
        updatedTx.calculateTimeToComplete();
        await updatedTx.save();
        return true; // Signal to stop the loop
      }

      // Stop if max duration exceeded
      if (Date.now() - startTime >= maxDurationMs) {
        console.log(`Max duration (${maxDurationMs / 1000}s) reached after ${attempts} attempts. Last status: ${res}`);
        return true; // Signal to stop
      }

      if (res.data.status === 'TxFailed' || res.data.status == 'TxFailedWithPendingRetries') {
        console.log(`Transaction ${txid} failed after ${attempts} attempts in ${(Date.now() - startTime) / 1000} seconds`);
        return true; // Signal to stop the loop
      }

      return false; // Continue the loop
    } catch (error) {
      console.error(`Error in attempt ${attempts}: ${error.message}`);
      return false; // Continue checking despite errors
    }
  };

  // Run the loop
  const runLoop = async () => {
    while (!(await checkStatus())) {
      // Wait for the interval before the next check
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  };

  try {
    await runLoop();
  } catch (error) {
    console.error(`Unexpected error in status check loop: ${error.message}`);
  }
};

// const initiateTesting = async (txid, intervalMs = 5000, maxDurationMs = 300000) => {
//   const res = await getTransactionStatus("0x66af300d3ba8ff2081fad795c7f77ea15de24656c145d71e9b5e4eefeb9797a3")
//   console.log(res);
// };

// Getting some issue with below function, Cannot read properties of undefined (reading 'address')
const writeViaSDKForTPS = async (req, res) => {
  try {
    console.log("Calling Thirdweb SDK for TPS to write to evm!");
    console.log(req.body.bridgeContract)
    const _receiver = "1F53959B76C4d7851078b580dC869e8712310492";
    const _amount = 1000000000000;

    // connect to your contract
    const contractForTPS = getContract({
      client,
      chain: defineChain(80002),
      address: "0xA17bd954dCf3B56C47f75146D27Ff30A0afF78F2",
    });
    console.log(contractForTPS);

    const transaction = await prepareContractCall({
      contractForTPS,
      method: "function bridgeToken(string memory _receiverAddress, uint256 _amount)",
      params: [_receiver, _amount],
    });
    console.log(transaction);

    // client is important to add here.
    const account = privateKeyToAccount({
      client,
      privateKey: "4a44f6b11af1e97b513fdae8d0d2a857703379126f46914e51f693261de8fbc2",
      encryption: false, // no encryption
    });

    const { transactionHash } = await sendAndConfirmTransaction({
      transaction,
      account,
    });

    console.log(transactionHash);
    const tx = new Transaction({ txid: transactionHash });
    await tx.save();

    res.send({ message: "Write send is successful!", txId: transactionHash });
  } catch (err) {
    console.log(err);
  }
};

// const writeViaCall = async (req, res) => {
//   try {
//     console.log("Calling Thirdweb APIs to write to evm!");
//     const invokeResponse = await invokeEVMHandleBridgeToken({
//       txId: Date.now() + "123",
//       senderAddress: "tushar",
//       receiverAddress: "1F53959B76C4d7851078b580dC869e8712310492",
//       amount: "1000000000",
//       retryCount: "0",
//     });
//     retryToFetchStatus(invokeResponse.data);
//     return res.status(200).json({ message: " Successful!!", queueId: invokeResponse.data });
//   } catch (err) {
//     console.log(`Calling Thirdweb APIs failed! ${err}`);
//     return res.status(400).json({ error: err });
//   }
// };

// const retryToFetchStatus = async (queueId, attempt = 1) => {
//   const response = await fetchTxStatusByQueueId(queueId);
//   console.log(response);
//   if (response.status == "mined") {
//     console.log("Received status as mined");
//     console.log("Hash is ", response.transactionHash);
//     return;
//   }
//   if (response.status == "errored") {
//     console.log("Received status as errored");
//     return;
//   }
//   if (attempt < 13) {
//     const delay = 7000; // Every 7 seconds
//     console.log(`Desired result not found. Retrying in ${delay}ms (attempt ${attempt}/13)...`);
//     return await new Promise((resolve) => setTimeout(resolve, delay)).then(() => retryToFetchStatus(queueId, attempt + 1));
//   }
//   return;
// };

module.exports = { writeViaSDK, writeViaSDKForTPS };
