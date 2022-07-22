exports.isAdmin = (req,res,next)=>{
    if(req.session.admin) next()
    else{ res.redirect('/admin')}
}
exports.isUser = (req,res,next)=>{
    if(req.session.user) next()
    else res.redirect('/login')
}
