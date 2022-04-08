const mongoose = require("mongoose");
const dotenv = require("dotenv");

const dataBaseConnection = async () => {
  try {
    await mongoose
      .connect(process.env.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log(`Database is connect ! 😉👉📝`));
  } catch (err) {
    console.log("Database doesn't connect ! 🙈 :", err.message);
  }
};

module.exports = dataBaseConnection;
