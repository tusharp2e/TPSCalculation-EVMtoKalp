require('dotenv').config({ path: '../../../.env' });
const express = require("express");
const router = express.Router();

router.get("/tps", (req,res) => {
    res.send("res is sent!")
});

module.exports = router;
