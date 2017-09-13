var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cfenv = require("cfenv");
var User = require('./models/UserSchema');
var appEnv = cfenv.getAppEnv();
var jwt = require('jsonwebtoken');

var mongoLabUrl = appEnv.getServiceURL('UserCredentialDbMongo');

if (mongoLabUrl == null) {
	//local or prod development url
    //mongoose.connect('mongodb://localhost/my-mongo-database');

    mongoose.connect("mongodb://root:root@ds129374.mlab.com:29374/CloudFoundry_fuhv4hcd_ndei44bl");
} else {
	//cloud foundry
	mongoose.connect(mongoLabUrl);
}





var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.get('/', function(req, res){

    res.send({"mongodburi":                 "             GET          /mongodburi",
              "signin":                     "             POST         /signin                Hint............ form Attribute (email:'    ', password:'   ' )",
              "signup":                     "             POST         /signup                Hint ............ form Attribute (email:'    ' , password:'   ' )",     
              "authenticate_with_Token":    "             GET          /seecureresource       Hint ............headers.Authorization = 'Bearer ' + token" });


});

app.get('/mongodburi', function (req,res){
  res.send(mongoLabUrl);
});

app.post(['/authenticate','/signin'], function(req, res) {
    console.log('------1-----',req.body);
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            console.log("----2----",user)
            if (user) {
               res.json({
                    type: true,
                    data: user,
                    token: user.token
                }); 
            } else {
                res.json({
                    type: false,
                    data: "Incorrect email/password"
                });    
            }
        }
    });
});


app.post('/signup', function(req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            if (user) {
                res.json({
                    type: false,
                    data: "User already exists!"
                });
            } else {
              

                var userModel = new User();
                userModel.email = req.body.email;
                userModel.password = req.body.password;
                userModel.save(function(err, user) {
                    user.token = jwt.sign({"email": user.email, "password": user.password }, 'accenture');
                    console.log(user.token);
                    user.save(function(err, user1) {
                        res.json({
                            type: true,
                            data: user1,
                            token: user1.token
                        });
                    });
                })
            }
        }
    });
});

app.get('/seecureresource', ensureAuthorized, function(req, res) {
    User.findOne({token: req.token}, function(err, user) {
        if (err) {
            res.json({
                type: false,
                data: "Error occured: " + err
            });
        } else {
            res.json({
                type: true,
                data: user
            });
        }
    });
});

function ensureAuthorized(req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

process.on('uncaughtException', function(err) {
    console.log(err);
});


app.listen(4000, function () {
  console.log('Server is  listening on port 4000!');

console.log("---------------------------------------------------------------------------------------------------------------------");
console.log({ "mongodburi":                 "             GET          /mongodburi",
              "signin":                     "             POST         /signin                Hint............ form Attribute (email:'    ', password:'   ' )",
              "signup":                     "             POST         /signup                Hint ............ form Attribute (email:'    ' , password:'   ' )",     
              "authenticate_with_Token":    "             GET          /seecureresource       Hint ............headers.Authorization = 'Bearer ' + token" });


console.log("-----------------------------------------------------------------------------------------------------------------------");
});


module.exports = app;
