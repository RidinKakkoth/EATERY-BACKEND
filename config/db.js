const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect('mongodb+srv://ridinksr:KBFvqCoFLpjzJuxc@cluster0.e1xtkgs.mongodb.net/eatery?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB Connected"))
    .catch((error) => console.error("DB Connection Error:", error));
};

module.exports = connectDB;
