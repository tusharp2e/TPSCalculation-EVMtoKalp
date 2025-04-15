const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the transaction schema
const TransactionSchema = new Schema({
  txid: {
    type: String,
    required: true,
    unique: true, // Ensure txid is unique
  },
  createTimestamp: {
    type: Number,
    default: Date.now,
  },
  endTimestamp: {
    type: Number,
    required: false, // Optional, as it might be set later
  },
  timeToComplete: {
    type: Number, // In milliseconds or seconds, depending on your preference
    required: false, // Calculated after endTimestamp is set
  },
}, {
  timestamps: true, 
});

// Optional: Add a method to calculate timeToComplete
TransactionSchema.methods.calculateTimeToComplete = function () {
  if (this.endTimestamp && this.createTimestamp) {
    this.timeToComplete = this.endTimestamp - this.createTimestamp; // Difference in milliseconds
    return this.timeToComplete;
  }
  return null;
};

// Create the model
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;