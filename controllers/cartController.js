const userModel = require("../models/userModel");

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData;
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    // if(!cartData[itemId]){
    //     cartData[itemId]=1
    // }
    // else{
    //     cartData[itemId]+=1
    // }
    await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true, useFindAndModify: false }
    );
    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "error" });
  }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
    
        const user = await userModel.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
    
        const cartData = user.cartData;
        cartData[itemId] = (cartData[itemId] || 0) - 1;
    
        await userModel.findByIdAndUpdate(
          userId,
          { cartData },
          { new: true, useFindAndModify: false }
        );
        res.json({ success: true, message: "Removed from Cart" });
      } catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
      }
};

const getCart = async (req, res) => {
    try {
        const { userId} = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
          return res
            .status(404)
            .json({ success: false, message: "User not found" });
        }
    
        const cartData = user.cartData;
        
        res.json({success:true,cartData})

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "error" });
    }
};

module.exports = { addToCart, removeFromCart, getCart };
