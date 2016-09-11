$(document).ready(function() {
    $.ajax({
        url: '/get-posts',
        dataType: 'json',
        success: function(data) {

            for (var blogPost in data) {
                var postDiv         = document.createElement('div');
                var postText        = document.createElement('p');
                var thumbnail       = document.createElement('img');
                var postContainer   = document.getElementsByClassName('post-container')[0];
                console.log(data[blogPost]);

                thumbnail.src = "./img/logo2.png";
                thumbnail.className = "thumbnail";
                postText.innerHTML = 'Posted at: ' + (new Date(parseInt(blogPost))).toUTCString() +
                    '<br/><br/>' + data[blogPost] +
                    '<br/><br><a href="/posts/' + blogPost + '">See more</a></br>';
                postDiv.className = "post";

                postDiv.appendChild(thumbnail);
                postDiv.appendChild(postText);
                postContainer.appendChild(postDiv);
                
            }
        },
        error: function(error){
            console.log(error);
        }
    });
});