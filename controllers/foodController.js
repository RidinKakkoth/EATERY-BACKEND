const foodModel=require('../models/foodModel')
const fs=require('fs')

//add food item

const addFood=async(req,res)=>{
    
    try {
    let image_filename=req.file.filename

    const{name,description,price,category}=req.body

    const food=new foodModel({
        name,description,price,category,image:image_filename
    })

        await food.save()
        res.json({success:true,message:"Food Added"})
    } catch (error) {
        console.error(error);
        res.status(500).json({success:false,message:"Error"})
    }

}

//all food list

const listFood=async(req,res)=>{

   try {
    
    const foods=await foodModel.find({})

    res.json({success:true,data:foods})

   } catch (error) {
        console.error(error)
        res.status(500).json({success:false,message:"Error"})
   }
}

//remove food item

const removeFood=async(req,res)=>{
    try {

        const food_id=req.body.id  
        // use params
        // const food_id=req.params.id


        const food=await foodModel.findById(food_id)
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findByIdAndDelete(food_id)


        res.json({ success: true, message: "Food item deleted" });
        
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


const updateListedStatus=async(req,res)=>{
    try {
        
         const food_id=req.params.id

        const food=await foodModel.findById(food_id)

        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
          }

          food.listed = !food.listed;
          await food.save();

          res.json({ success: true, message: 'Food listed status updated', listed: food.listed });
        } catch (error) {
          console.error(error);
          res.status(500).json({ success: false, message: 'Error updating food listed status' });
        }
      };

module.exports={addFood,listFood,removeFood,updateListedStatus}