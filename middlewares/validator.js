//requiring dependencies.
var mongoose = require('mongoose');

var userModel = mongoose.model('User');

//router level middleware for checking existing user.
module.exports.emailExist = function(req,res,next){
  userModel.findOne({'email':req.body.email},function(err,result){
    if(err){
      req.flash('error','Some Error Occured During Email Checking..');
      res.render('signup',
      {
        title:'Error',
        user:req.session.user
      });
    } else if(result){
      req.flash('error','Email Addred Alreday Exists');
      res.render('signup',
      {
        title:"Error",
        user:req.session.user
      });
    } else{
      next();
    }
  });
};
