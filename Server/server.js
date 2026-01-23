require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/dbConfig");
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
