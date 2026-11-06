const getHomePage=async (req,res,next)=>{
   res.render('home',{
    user:req.user || null
   })

}

export default getHomePage;