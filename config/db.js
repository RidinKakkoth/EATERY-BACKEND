const mongoose = require('mongoose');



const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log("DB Connected"))
    .catch((error) => console.error("DB Connection Error:", error));
};

module.exports = connectDB;
