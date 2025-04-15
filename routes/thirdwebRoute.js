const express = require("express");
const router = express.Router();
const {writeViaSDK, writeViaSDKForTPS} = require("../controllers/thirdwebController.js");

// Example to write on EVM via SDK
router.post("/writeToEVMViaSDK", writeViaSDK);

// Example to write on EVM via SDK
router.post("/writeToEVMViaSDKForTPS", writeViaSDKForTPS);

// // Example of Webhook - incomplete
// router.post("/webhook", webhook);

router.get("/test", (req, res) => {
  res.send("Tested!");
});

module.exports = router;
