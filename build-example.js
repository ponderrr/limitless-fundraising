/**
 * Example build script for injecting environment variables
 * This script demonstrates how to replace configuration values
 * with environment variables during the build process
 */

const fs = require("fs");
const path = require("path");

// Load environment variables (you can use dotenv or similar)
const EMAILJS_PUBLIC_KEY =
  process.env.EMAILJS_PUBLIC_KEY || "tmieiu124Ber32QOE";
const CONTACT_PHONE = process.env.CONTACT_PHONE || "(832) 572-0831";
const CONTACT_EMAIL =
  process.env.CONTACT_EMAIL || "Team@limitlessfundraising.com";

// Configuration template
const config = {
  emailjs: {
    publicKey: EMAILJS_PUBLIC_KEY,
  },
  contact: {
    phone: CONTACT_PHONE,
    email: CONTACT_EMAIL,
  },
  social: {
    linkedin: {
      tanner: "https://www.linkedin.com/in/tanner-blackwell15/",
      matt: "https://www.linkedin.com/in/matthew-tolve-838048276/",
    },
  },
};

// Write configuration to file
const configPath = path.join(__dirname, "config.json");
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

console.log("Configuration file generated successfully");
console.log(`EmailJS Public Key: ${EMAILJS_PUBLIC_KEY}`);
console.log(`Contact Phone: ${CONTACT_PHONE}`);
console.log(`Contact Email: ${CONTACT_EMAIL}`);

// Example usage:
// EMAILJS_PUBLIC_KEY=your_new_key_here node build-example.js
