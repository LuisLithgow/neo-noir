
'use strict'
// Main requirements for express node app
const express          = require('express');
const bodyParser       = require('body-parser');
const path             = require('path');
let expressValidator   = require("express-validator");
const mongojs          = require('mongojs');
const db               = mongojs('customerapp', ['users']);
let ObjectId           = mongojs.ObjectId;

const PORT       = process.env.PORT || process.argv[2] || 3000 ;
//initilaize the app
const app        = express();


// // middleware logger
// var logger = function(req, res, next) {
//     console.log("logging");
//     next();
// }
// // initiating logger
// app.use(logger);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// bodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Set static paths
app.use(express.static(path.join(__dirname, 'public')));

//Express Validator Middleware - setting up error formatter
app.use(expressValidator()); 

// Global variable for errors
app.use(function(req,res,next) {
    res.locals.errors = null;
    next();
});




// let users = [
//     {
//         id: 1,
//         first_name: 'John',
//         last_name: ' Doe',
//         email: 'jdoe@gmail.com'
//         },
//         {
//         id: 2,
//         first_name: 'Carmen',
//         last_name: ' Dod',
//         email: 'cdod@gmail.com'
//         },
//         {
//         id: 1,
//         first_name: 'Frank',
//         last_name: ' Rivas',
//         email: 'jrivas@gmail.com'
//         }
// ]

// RENDER a VIEW/ HOME Route
app.get('/', function(req, res) {
    // res.send(person);
    // res.json(people);
    // let title = "Customers";

    db.users.find(function (err, docs) {
        // console.log(docs)
        res.render('index', {
            title: 'Customers',
            users: docs
        });
    });
});

//POST request for user data
app.post('/users/add', function(req,res) {

    req.checkBody('first_name', 'First name is required').notEmpty();
    req.checkBody('last_name', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is not empty').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
        res.render('index', {
            title: 'Customers',
            users: users,
            errors: errors
        });
        console.log('There is an error(s)!!!')
    } else {
        let newUser= {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        }
        // console.log('Success');
        db.users.insert(newUser, function(err, result) {
            if(err) {
                console.log(err);
            } 
            res.redirect('/');
            
        });
    }
    // console.log(req.body.first_name);
});
//END of POST

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result) {
        if (err) {
            console.log(err);
        }
        res.redirect('/');
    }); 
});

// app.delete('/users/delete/:id', function(req, res){
//     db.users.remove({_id: ObjectId(req.params.id)});
//     res.redirect('/');
// })



// app will run on a port
app.listen(3000, function(){
    console.log("server engines started on port 3000....");
})