var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mustacheExpress = require('mustache-express');

var app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// app.get('/', function(req, res) {
//     // console.log(req);
//
//     res.send('Yay for Node Girls!');
// });
//
// app.get('/chocolate', function (req, res) {
//     res.send('Mm chocolate :O');
// });
//
// app.get('/node', function(req, res) {
//     res.send('Yo Node School!');
// });
//
// app.get('/girls', function(req, res) {
//     res.send('Yo School for Girls!');
// });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create-post', function(req, res) {
    // console.log('/create-post');
    console.log(req.body);

    // Read from posts.json
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
        // console.log(file.toString());
        var parsedFile = JSON.parse(file);
        // console.log(parsedFile);

        // Add to parsedFile object
        var postedBody = req.body.blogpost;
        var currentDate = new Date();
        var currentTimeStamp = currentDate.getTime().toString();

        var newPost = {};
        newPost[currentTimeStamp] = postedBody;
        var updatedPosts = extend(parsedFile, newPost);
        // console.log(Object.keys(extendedPosts));

        // Write back to file
        writePosts(updatedPosts);
    });

    res.redirect('/');
});

app.get('/get-posts', function(req, res) {
    res.sendFile(__dirname + '/data/posts.json', {}, function(err) {
        if (err) {
            console.log("Ah oh! Can't send posts for display!");
        }
    });
});

app.get('/posts/:postId', function (req, res) {
    var postId = req.params.postId;
    // res.status(200).send('post id: ' + postId);
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
        // console.log(file.toString());
        var parsedFile = JSON.parse(file);
        var postContent = parsedFile[postId];
        if (postContent) {
            // res.status(200).send(postContent);
            res.render('post', { post: postContent});
        } else {
            res.status(404).send('Sorry, post ' + postId + ' does not exist!');
        }
    });
});

function extend(obj, src) {
    Object.keys(src).forEach(function(key) {
        obj[key] = src[key];
    });
    return obj;
}

function writePosts(posts) {
    var jsonPosts = JSON.stringify(posts);
    fs.writeFile(__dirname + '/data/posts.json', jsonPosts, function(error) {
        if (error) {
            console.log("Oh no we have errors: " + error);
        }
    });
}

app.listen(3000, function () {
   console.log('Server is listening on port 3000. Ready to accept requests!');
});
