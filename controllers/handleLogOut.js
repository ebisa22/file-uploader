const handleLogOut=async (req,res,next)=>{
   const user=req.user;
   if(!user)
      return res.redirect('/login');

   req.logout(err=>{
    if(err){
      return next(err);
    }
    res.redirect('/');
   })
}

export default handleLogOut;