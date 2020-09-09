// References
let express = require("express");
let morgan = require("morgan");
let bodyParser = require("body-parser");
let ejs = require("ejs");
let mongoose = require('mongoose');

let Book = require('./models/book');
let Author = require('./models/author');
const e = require("express");

let app = express();
let viewsPath = __dirname + "/views/";
let print = console.log;

const DB_URL = 'mongodb://localhost:27017/spaceLibraryDB';

//==============================================================================
// Connect to the Database
mongoose.connect(DB_URL, function(err){
    if(err) print (err);
    else {
        print('Connect to DB Successfully');
    }
});

//==============================================================================
// Middleware
// Configure the Express app to handle the engine
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// HTTP request logger
app.use(morgan("common"));

// Adding body-parser
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public/css"));
app.use(express.static("public/img"));

//==============================================================================
// Endpoints
// Homepage
app.get("/", (req, res) => {
    let fileName = viewsPath + "index.html";
    res.sendFile(fileName);
});

// Insert a new Author
app.get("/newAuthor", (req, res) => {
    let fileName = viewsPath + "newAuthor.html";
    res.sendFile(fileName);
});

app.post('/authorForm', (req,res) => {
    let authorDetail = req.body;
    let author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: authorDetail.firstName,
            lastName: authorDetail.lastName
        },
        dob: authorDetail.dob,
        address:{
            state: authorDetail.state,
            suburb: authorDetail.suburb,
            street: authorDetail.street,
            unit: parseInt(authorDetail.unit)
        },
        numBooks: parseInt(authorDetail.numBooks)
    });
    author.save(function(err){
        if (err){
            print('Error adding author');
            res.redirect('/newAuthor');
        }
        else{
            res.redirect('/listAuthor');
        }
    });
});

// Get all Authors
app.get("/listAuthor", (req, res) => {
    let fileName = viewsPath + "listAuthor.html";
    Author.find({}, function(err, data){
        res.render(fileName,{authors:data});
    })
});

// Insert new book
app.get("/newBook", (req, res) => {
    let fileName = viewsPath + "newBook.html";
    res.sendFile(fileName);
});

app.post('/bookForm', (req,res) => {
    let bookDetail = req.body;
    let object;
    if (bookDetail.dop == ""){
        object = {
            _id: new mongoose.Types.ObjectId(),
            title: bookDetail.title,
            author: bookDetail.author,
            isbn: bookDetail.isbn,
            summary: bookDetail.summary
        }
    }
    else{
        object = {
            _id: new mongoose.Types.ObjectId(),
            title: bookDetail.title,
            author: bookDetail.author,
            isbn: bookDetail.isbn,
            dop: bookDetail.dop,
            summary: bookDetail.summary
        }
    }
    let book = new Book(object);
    book.save(function(err){
        if (err){
            print('Error adding book');
            res.redirect('/newBook');
        }
        else{
            res.redirect('/listBook');
        }
    });
});

// Get all Books
app.get("/listBook", (req, res) => {
    let fileName = viewsPath + "listBook.html";
    Book.find({}).populate('author').exec(function (err,data){
        res.render(fileName,{books: data});
    });
});

// Delete book by ISBN
app.get("/deleteBookISBN", (req, res) => {
    let fileName = viewsPath + "deleteBookISBN.html";
    res.sendFile(fileName);
});

app.post('/deleteForm', (req,res) => {
    Book.findOneAndDelete(
        {'isbn': req.body.isbn},
        function(err, data){
            if(data == null){
                print('Error deleting book');
                res.redirect('/deleteBookISBN');
            }
            else{
                res.redirect('/listBook');
            }
        });
});

// Update Author numBooks by _id
app.get("/updateAuthorNumBooks", (req, res) => {
    let fileName = viewsPath + "updateAuthorNumBooks.html";
    res.sendFile(fileName);
});

app.post('/updateForm', (req,res) => {
    let authorID = req.body.authorID;
    let numBooks = req.body.numBooks;

    let opts = { runValidators: true };
    Author.updateOne({'_id':authorID}, {'numBooks':numBooks}, opts, function(err){
        if(err){
            print('Error updating author numBooks');
            res.redirect('/updateAuthorNumBooks');
        }
        else{
            res.redirect('/listAuthor');
        }
    })
});

// Error 404 page
app.get("*", (req, res) => {
    let fileName = viewsPath + "404.html";
    res.sendFile(fileName);
});

app.listen(8080);