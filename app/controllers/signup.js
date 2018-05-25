var express = require('express');
var mongoose = require('mongoose');
var shortid = require("shortid");


//middlewares
var auth = require('../../middlewares/auth.js');
var validator = require('../../middlewares/validator.js');
var encrypt = require('../../libs/encrypt.js');

var router = express.Router();


var userModel = mongoose.model('User');


module.exports.controller = function(app){

  //route for signup
  router.get("/signup",auth.loggedIn,function(req,res){
    res.render('signup',
                {
                  title:"User Signup",
                  user:req.session.user,
                  chat:req.session.chat
                });
  });

  //api to create new user
  router.post("/api/v1/signup",auth.loggedIn,validator.emailExist,function(req,res){

    var today = Date.now();
    var id = shortid.generate();
    var epass = encrypt.encryptPassword(req.body.password);


    if(req.body.username !=  undefined || req.body.username == "" || req.body.email != undefined || epass == "" || epass != undefined || req.body.password == ""){
      userModel.findOne({ 'email' : req.body.email},function(err,user){
        if(err){
          req.flash('error','Something Went Wrong');
          res.render('signup');
        }else if(user &&  user != null){
          req.flash('error','Email Already Exists');
          res.render('signup');
        }else{
          //create user.
          var newUser = new userModel({

            userId : id,
            username : req.body.username,
            email : req.body.email,
            password : epass,
            createdOn : today,
            updatedOn : today

          });

          newUser.save(function(err,result){
            if(err){
              console.log(err);
              req.flash('error','Error Occured During Signing up');
              res.render('signup',
              {
                title : 'Error',
                user:req.session.user,
                chat:req.session.chat
              });
            }
            else if(result == undefined || result == null || result == ""){

              req.flash('info','User Not created.. Try Again');
              res.render('signup',{
                title : 'User Not Created. Try Again',
                user:req.session.user,
                chat:req.session.chat
              });
            }
            else{

              req.user = result;
              delete req.user.password;
              req.session.user = result;
              delete req.session.user.password;
              req.flash('success','Successfully signed up.');
              res.redirect('/chat');
            }
          });      
        }
      })
    }else{
      res.flash('error','Some Fields Are Missing!');
      res.render('signup');
    }
  });

  app.use('/user',router);

}//signup controller end
