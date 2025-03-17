const bcrypt = require("bcrypt");

const testPassword = "testpassword";
const storedHash = "$2b$10$ANPcUjExMxajdqLXbqpaduPTY3uyj4DhhJlezJ1.2Y.eIEwzrlFGy"; // Copy this from your DB

(async () => {
  const isMatch = await bcrypt.compare(testPassword, storedHash);
  console.log("Manual Password Match:", isMatch);
})();
