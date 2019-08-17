var express = require('express');
var session = require('express-session');
var db = require('./models');
const fs = require('fs')
const path = require('path');
const AWS = require('aws-sdk');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
const fileUpload = require('express-fileupload');
require('dotenv').config()
var app = express();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

//* initialize connect-session-sequelize
var SequelizeStore = require('connect-session-sequelize')(session.Store);
//* Connect sequelize session to our sequelize db
var myStore = new SequelizeStore({
    db: db.sequelize
});
myStore.sync();


//* all of our express middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: myStore
}));
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(function (req, res, next) {
    if (req.session.user_id !== undefined) {
        next()
    } else if (req.path == "/login" || req.path == "/signup") {
        next()
    } else {
        res.redirect('/login');
    }
})
app.set('view engine', 'ejs');
app.set('views', 'app/views');




//* set the store to myStore where we connect the DB details
//! GET routes
app.get("/signup", function (req, res, next) {
    res.render('signup');
})

app.get("/signOut", function (req, res, next) {
    req.session.destroy()
    res.redirect('/login');
})
app.get("/welcome", function (req, res, next) {
    if (req.session.user_id === undefined) {
        res.redirect('login');
        return;
    }
    var user_id = req.session.user_id
    db.users.findByPk(user_id).then(user => {
        db.messages.findAll({ include: [{ model: db.users }, { model: db.users, as: 'likedUsers' }] }).then(messages => {
            var email = user.email;
            const name = user.firstName;
            const photo = user.photos
            messages = messages.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
            res.render('welcome', {
                email: email,
                photo: photo,
                name: name,
                user_id: user_id,
                messages: messages
            })
        })
    })
})
app.get("/myMessages", function (req, res, next) {
    if (req.session.user_id === undefined) {
        res.redirect('login');
        return;
    }
    var user_id = req.session.user_id
    db.users.findByPk(user_id).then(user => {
        db.messages.findAll({ include: [{ model: db.users }, { model: db.users, as: 'likedUsers' }], where: { userId: user_id } }).then(messages => {
            var email = user.email;
            const name = user.firstName;
            const photo = user.photos;
            res.render('welcome', {
                email: email,
                photo: photo,
                name: name,
                user_id: user_id,
                messages: messages
            })
        })

    })
})


app.get("/login", function (req, res, next) {
    res.render('login', { error_message: '' })
})
app.get('/', (req, res, next) => {
    res.redirect('/welcome');
})

app.get('/deleteMessage/:id', (req, res, next) => {
    const messageId = req.params.id;
    const userId = req.session.user_id;
    db.Like.destroy({ where: { messageId: messageId } }).then(() => {
        db.messages.destroy({ where: { id: messageId, userId: userId } }).then(results => {
            res.redirect('/welcome');
        })
    })
})

app.get('/deleteProfile', (req, res, next) => {
    const messageId = req.params.id;
    const userId = req.session.user_id;
    db.users.findOne({ where: { id: userId } }).then(user => {
        fs.unlinkSync(__dirname + "/public" + user.photos)
    })
    db.Like.destroy({ where: { userId: userId } }).then(() => {
        db.messages.destroy({ where: { userId: userId } }).then(results => {
            db.users.destroy({ where: { id: userId } }).then(() => {
                req.session.destroy()
                res.redirect('/welcome');
            })
        })
    })
})
app.get('/likeMessage/:id', (req, res, next) => {
    const messageId = req.params.id;
    const userId = req.session.user_id;
    db.Like.findAll({ where: { messageId: messageId } }).then(likes => {
        const userLike = likes.filter(like => {
            return like.dataValues.userId == userId
        })
        if (userLike.length < 1) {
            db.Like.create({ userId: userId, messageId: messageId }).then(results => {
                res.redirect('/welcome');
            })
        } else {
            res.redirect('/welcome');
        }

    })
})


//! POST routes
app.post("/signup", function (req, res, next) {
    if (req.session.user_id) {
        res.redirect('/welcome')
        return;
    }
    var email = req.body.email;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var alias = req.body.alias;
    bcrypt.hash(password, 10, function (err, hash) { //* the hash allows the password to be private 
        db.users.create({ email: email, password_hash: hash, 'firstName': firstName, 'lastName': lastName, 'alias': alias }).then(function (user) {  //* creating new values in the database and saving it to the db
            req.session.user_id = user.id;
            res.redirect('/welcome');
        });
    });
});

app.post("/login", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    db.users.findOne({ where: { email: email } }).then(user => {
        if (user === null) {
            res.render('login', { error_message: 'User & Password incorrect' })
        } else {
            bcrypt.compare(password, user.password_hash, function (err, matched) {
                if (matched) {
                    req.session.user_id = user.id
                    res.redirect("/welcome")
                } else {
                    res.render("login", { error_message: 'User & Password incorrect' })
                }
            })
        }
    })
})

app.post("/messages", (req, res, next) => {
    const body = req.body.body;
    const user_id = req.session.user_id;
    if (body.length > 1) {
        //! Create new message with the user_id 
        db.messages.create({ body: body, userId: user_id }).then(message => {
            res.redirect('/welcome');
        })
    } else {
        res.redirect('/welcome')
    }
})

app.post("/profilePic", (req, res, next) => {
    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let profilePic = req.files.profilePic;
    let fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let user_id = req.session.user_id;
    const params = {
        Bucket: 'chirperimages',
        Key: `${fileName}.jpeg`,
        Body: profilePic.data,
        ACL: 'public-read'
    }
    s3.upload(params, function (s3Err, data) {
        if (s3Err) throw s3Err
        db.users.findOne({ where: { id: user_id } }).then(user => {
            user.update({ photos: `${data.Location}` }).then(() => {
                res.redirect('/welcome');
            })
        })
    });
});

const port = process.env.PORT || 3000
app.listen(port, function () {
    console.log("listening on port 3000...");
})