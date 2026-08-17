const crypto = require("crypto");

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

const getOTPExpiry = () => new Date(Date.now() + 5 * 60 * 1000);

module.exports = {
  generateOTP,
  getOTPExpiry,
};
