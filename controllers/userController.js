const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const { OAuth2Client } = require('google-auth-library');
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET);
};

// Login user
const loginUser = async (req, res) => {
    const { password, email } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User Doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Register user
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password",
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, password: hashedPassword
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
// Google login
const googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { sub, email, name, picture } = payload;

      // Find the user in the database by Google ID
      let user = await userModel.findOne({ googleId: sub });

      if (!user) {
          // If user doesn't exist by Google ID, check by email
          user = await userModel.findOne({ email });

          if (!user) {
              // Create a new user if both Google ID and email are not found
              user = new userModel({
                  googleId: sub,
                  email,
                  name,
                  picture
              });
          } else {
              // User exists by email (registered with email/password previously)
              return res.status(400).json({ success: false, message: "Email already registered with password. Please use password login." });
          }
      } else {
          // Update existing user's details if found by Google ID
          user.name = name;
          user.picture = picture;
      }

      // Save or update user data
      await user.save();

      // Create a JWT token for your application
      const jwtToken = createToken(user._id);
      console.log(jwtToken,"jwwwwwwwwww");

      res.json({ success: true, token: jwtToken, user });

  } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid token' });
  }
};


module.exports = { loginUser, registerUser, googleLogin };
