const express = require("express");
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
// const MONGODB_URI = 'mongodb://localhost:27017/myapp';
const MONGODB_URI = "mongodb+srv://mohitgupta034:mohitgupta034@cluster0.z91qdka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const { Agent, setGlobalDispatcher } = require("undici");
const agent = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

setGlobalDispatcher(agent);

app.use(express.json());
app.use(cors());
app.use(session({ secret: "Secret_Key" }));
require("dotenv").config();

app.use(bodyParser.text());

// MongoDB Connection
async function connectToMongo() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit if connection fails
  }
}

// Call the connection function
connectToMongo();

const thirdwebRoute = require("./routes/thirdwebRoute.js");

app.use("/thirdweb", thirdwebRoute);

const tpsRoute = require("./routes/tpsRoute.js");
app.use("/tps", tpsRoute);

const server = app.listen(3001, () => {
  console.log("app is listening on port 3001");
});

module.exports = { server };
