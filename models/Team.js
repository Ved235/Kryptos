const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    max: 50,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  discord: {
    type: String,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  created_at: {
    type: String,
    default: Date().toLocaleString(),
  },
  fp: {
    type: Number,
    default: 0,
    min: 0,
  },
  bp: {
    type: Number,
    default: 0,
    min: 0,
  },
  dp: {
    type: String
  },
  questions: [
    {
      type: String,
    },
  ],
  questionsGamble: [
    {
      type: String,
    },
  ],
  jumpscare: {
    type: Boolean,
    default: false,
  },
  sabotage:{
    type: Boolean,
    default: false,
  },
  hintspire:{
    type: Boolean,
    default: false,
  },
  gamble:{
    type: Boolean,
    default: false,
  },
  powerupTimer: {
    type: Number,
    default: 0,
  },
  tempPowerup: {
    type: String,
    default: "",
  },
  attackCooldown: {
    type: Number,
    default: 0,
  }
});

teamSchema.pre("updateOne", function (next) {
  data = this.getUpdate();
  try {
    if (data["$set"].powerupTimer > 0) {
      next();
    } else if (data["$set"].powerupTimer < 0) {
      data["$set"].powerupTimer = 0;
      next();
    }else{
      next();
    }
  } catch (err) {
    next();
  }
});

module.exports = mongoose.model("Team", teamSchema);
