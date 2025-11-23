var express = require('express');
var router = express.Router();
const passport = require('passport');
let DB = require('../../config/db');
let userModel = require('../../server/models/user')
let User = userModel.User

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'MyFitnessLog',displayName: req.user?req.user.displayName:""
   });
});

//Get method for login
router.get('/login', function (req, res, next) {
  if (!req.user) {
    res.render('authentication/login',
      {
        title: 'Login',
        message: req.flash('loginMessage')
      }
    )
  }
  else {
    return res.redirect('/workouts')  // Changed from '/' to '/workouts'
  }
});

//post method for login - AUTHENTICATE existing user
router.post('/login', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('loginMessage', 'Authentication Error: Invalid credentials');
      return res.redirect('/login');
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/workouts');
    });
  })(req, res, next);
});

//Get method for register
router.get('/register', function (req, res, next) {
  if (!req.user) {
    res.render('authentication/register',
      {
        title: 'Register',
        message: req.flash('registerMessage')
      }
    )
  }
  else {
    return res.redirect('/workouts')  // Changed from '/' to '/workouts'
  }
});

//post method for register - CREATE new user
router.post('/register', function (req, res, next) {
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    displayName: req.body.displayName
  })
  
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log("Error: Inserting the new user", err);
      if (err.name == "UserExistsError") {
        req.flash('registerMessage', 'Registration Error: User already exists');
      }
      return res.render('authentication/register',
        {
          title: 'Register',
          message: req.flash('registerMessage')
        }
      )
    }
    else {
      return passport.authenticate('local')(req, res, () => {
        res.redirect("/workouts");
      })
    }
  })
});
router.get('/logout',function(req,res,next){
req.logout(function(err)
{
  if(err)
  {
    return next(err)
  }
})
res.redirect('/')
})
module.exports = router;