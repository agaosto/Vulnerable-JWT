//var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function submit_review() {

    // check if none:
    //1. authcookie
    //2. get item localStorage
    //3. get item session storage
    //create post with the first to bo not none
    // .cookie = authcookie
    // .Bearer = localstorage
    // .Bearer = session storage
    cookie = doesHttpOnlyCookieExist('authcookie')
    let session_token = window.sessionStorage.getItem('token')
    let local_token = window.localStorage.getItem('token')
    data = document.getElementById("123").value
    console.log(cookie)
    if(cookie){
        fetch('/reviews', {
            method: 'post',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: 'newReview='+data
        });
        window.location.reload();
        return true;
    }
    if(local_token != null){
        fetch('/reviews', {
            method: 'post',
            headers: {'Content-Type':'application/x-www-form-urlencoded', "Authorization": "Bearer "+local_token},
            body: 'newReview='+data
        });
        window.location.reload();
        return true;
    }
    if(session_token != null){
        let bearer =  "Bearer "+session_token
        fetch('/reviews', {
            method: 'post',
            headers: {'Content-Type':'application/x-www-form-urlencoded', "Authorization": bearer},
            body: 'newReview='+data
        });
        window.location.reload();
        return true;
    }
    }

    function doesHttpOnlyCookieExist(cookiename) {
        var d = new Date();
        d.setTime(d.getTime() + (1000));
        var expires = "expires=" + d.toUTCString();
      
        document.cookie = cookiename + "=empty;path=/;" + expires;
        return document.cookie.indexOf(cookiename + '=') == -1;
      }
