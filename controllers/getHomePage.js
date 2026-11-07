const getHomePage=async (req,res,next)=>{
   console.log("home page")
   res.render('home',{
    user:req.user || null
   })

}

export default getHomePage;