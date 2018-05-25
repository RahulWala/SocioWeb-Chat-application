var express = require('express');
var mongoose = require('mongoose');

//middlewares
var auth = require('../../middlewares/auth.js');
var encrypt = require('../../libs/encrypt.js');

var router = express.Router();

var userModel = mongoose.model('User');

module.exports.controller = function(app){

  //route for login
  router.get('/login',auth.loggedIn,function(req,res){
    res.render('login',
                {
                  title:"User Login",
                  user:req.session.user,
                  chat:req.session.chat
                });
  });

  //route for logout
  router.get('/logout',function(req,res){

    delete req.session.user;
    req.flash('success','Successfully Logged Out');
    res.redirect('/user/login');

  });

  //route for login
  router.post('/api/v1/login',auth.loggedIn,function(req,res){

    var epass = encrypt.encryptPassword(req.body.password);

    userModel.findOne({$and:[{'email':req.body.email},{'password':epass}]},function(err,result){
      if(err){
        req.flash('error','Some Error Occured during Login');
        res.render('login',
        {
          title : 'Error',
          user:req.session.user,
          chat:req.session.chat
        });
      }
      else if(result == null || result == undefined || result == ""){
        req.flash('error','User Not Found. Check Email And Password');
        res.render('login',{
          title : 'error',
          user:req.session.user,
          chat:req.session.chat
        });
      }
      else{
        req.user = result;
        delete req.user.password;
        req.session.user = result;
        delete req.session.user.password;
        req.flash('Successfully Logged In');
        res.redirect('/chat');
      }
    });
  });

  app.use('/user',router);

} // login controller end
