function getName(){
    var username = document.getElementById("username").value;
    var anotherData = "other";
    console.log(username);
    // This is on page1.html
    var myData = [ username, anotherData ];
    var insert = localStorage.setItem( "username", username );
    document.getElementById("usernameGame").innerHTML = insert;
}
