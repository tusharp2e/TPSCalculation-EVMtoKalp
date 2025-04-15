const { Network, submitTransaction, evaluateTransaction } = require("kalp-wallet-ts");

const networkName = "Devnet"
const networkURL = 'https://dev-kalp-gateway.p2eppl.com/transaction/v1';
const kalpChannelName = "kalp-devnet";
const kalpGiniChainCodeName = "klp-f02611a93e-cc";
const kalpBridgeChainCodeName = "klp-519fe60d6e-cc";
const kalpStoreChainCodeName = "klp-e7e044e8c0-cc";
const privateKeyString = "-----BEGIN PRIVATE KEY-----\r\nMEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBU2rwHsIv7+FljOGki\r\nh7zgoSxXdXmgA7CxAXIc7PH7/w==\r\n-----END PRIVATE KEY-----\r\n"
const publicKeyString = "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE2ObZofneSwgMEol5sptJvN5sDMGKKnf3FEDSv3d+22Vzz1ulzcZMKdJmVdmDFuhpzxtIFKIgppI2rJpeTz3Idg==\n-----END PUBLIC KEY-----\n";
const cert = "-----BEGIN CERTIFICATE-----\nMIIDYjCCAwigAwIBAgIUXghuHl1Nr7VzVcu5D1ZmjcnG0q8wCgYIKoZIzj0EAwIw\ngbIxCzAJBgNVBAYTAlVTMREwDwYDVQQIEwhEZWxhd2FyZTFQME4GA1UEBxNHUDJF\nIExBQlMgTExDICAxMDA3IE4gT3JhbmdlIFN0LiA0dGggRmxvb3IgU3RlIDEzODIg\nV2lsbWluZ3RvbiBVLlMgMTk4MDExETAPBgNVBAoTCE1BSSBMYWJzMQ8wDQYDVQQL\nEwZjbGllbnQxGjAYBgNVBAMTEWV4YW1wbGUtaW50LWFkbWluMB4XDTI1MDMyNDEx\nMTUwMFoXDTI2MDQwMzA5MjUwMFowgb0xCzAJBgNVBAYTAklOMRYwFAYDVQQIEw1Z\nb3VyIFByb3ZpbmNlMRYwFAYDVQQHEw1Zb3VyIExvY2FsaXR5MRowGAYDVQQKExFZ\nb3VyIE9yZ2FuaXphdGlvbjEvMA0GA1UECxMGY2xpZW50MA4GA1UECxMHY2xpZW50\nczAOBgNVBAsTB2V4YW1wbGUxMTAvBgNVBAMTKDcwMmM5ZGJjYmIxOTg4ZDIzMDY1\nMDBjMzBhZjRiODVlOTcwNGViMTUwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATY\n5tmh+d5LCAwSiXmym0m83mwMwYoqd/cUQNK/d37bZXPPW6XNxkwp0mZV2YMW6GnP\nG0gUoiCmkjasml5PPch2o4HuMIHrMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8E\nAjAAMB0GA1UdDgQWBBRdKPnQTc/iou3TS9/FnAC5ohnPkDAfBgNVHSMEGDAWgBRm\nPPIdKN8mAyoqxEuaul3FDmc7KjCBigYIKgMEBQYHCAEEfnsiYXR0cnMiOnsiaGYu\nQWZmaWxpYXRpb24iOiJleGFtcGxlLmNsaWVudHMiLCJoZi5FbnJvbGxtZW50SUQi\nOiI3MDJjOWRiY2JiMTk4OGQyMzA2NTAwYzMwYWY0Yjg1ZTk3MDRlYjE1IiwiaGYu\nVHlwZSI6ImNsaWVudCJ9fTAKBggqhkjOPQQDAgNIADBFAiEAvvAnoCLpfahSrvuk\nc6JBFESZTYothyRkTMMm7QuuxwMCIAIiNYKYhXhM59+L1rsfs9f8gUSHOrxc1KGx\nh9+Ic4xW\n-----END CERTIFICATE-----\n";
const enrollmentId = "702c9dbcbb1988d2306500c30af4b85e9704eb15";

const getTransactionStatus = async (txId) => {
    console.log("Fetching tx status!")
    if (txId == "") {
        alert("TxId is not set!");
    }

    const channelName = kalpChannelName;
    const chainCodeName = kalpStoreChainCodeName;
    const transactionName = "GetTxRecord";
    const transactionParams = [txId];

    console.log("enrollmentID", enrollmentId);
    console.log("transactionParams", transactionParams);
    console.log("privateKeyString", privateKeyString);
    console.log("publicKeyString", publicKeyString);
    console.log("Cert", cert);

    try {
        const txIdResponse = await evaluateTransaction(
            networkName,
            networkURL,
            enrollmentId,
            privateKeyString,
            cert,
            channelName,
            chainCodeName,
            transactionName,
            transactionParams
        );

        console.log(`tx received from kalp store :${txIdResponse}`);
        if (txIdResponse != "") {
            console.log(JSON.parse(txIdResponse).status)
            return {status: "success", data : {status: JSON.parse(txIdResponse).status, updatedAt: JSON.parse(txIdResponse).updatedAt}};
        } else {
            return {status: "failed", data : "Not yet captured"};
        }

    } catch (error) {
        console.log(`error happenned while evaluating transaction`, error);
        return {status: "failed", data : "Not yet captured"};
    }
};

module.exports = { getTransactionStatus }