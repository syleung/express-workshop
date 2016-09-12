var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mustacheExpress = require('mustache-express');

var app = express();

// Register '.mustache' extension with The Mustache Express
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/create-post', function(req, res) {
    // Read from posts.json
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
        var parsedFile = JSON.parse(file);

        // Add to parsedFile object
        var postedBody = req.body.blogpost;
        var currentDate = new Date();
        var currentTimeStamp = currentDate.getTime().toString();

        var newPost = {};
        newPost[currentTimeStamp] = postedBody;
        var updatedPosts = extend(parsedFile, newPost);

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
    fs.readFile(__dirname + '/data/posts.json', function (error, file) {
        var parsedFile = JSON.parse(file);
        var postContent = parsedFile[postId];
        if (postContent) {
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
