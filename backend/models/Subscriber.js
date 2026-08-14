const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const SubscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

const SubscriberModel = mongoose.models.Subscriber || model("Subscriber", SubscriberSchema);

module.exports = SubscriberModel;
