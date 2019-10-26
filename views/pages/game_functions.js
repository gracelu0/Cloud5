var canvas, ctx, 
width = 1910, height = 920, 
right = false, left = false, up = false, down = false, 
player, player_x = 100, player_y = 100, player_w = 50, player_h = 50, 
bulletTotal = 5, bullets = [];

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    setInterval(gameLoop, 20);
   
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
}

function gameLoop(){
    clearCanvas();
    movebullet();

    drawplayer();
    drawbullet();
}

function clearCanvas(){
    ctx.clearRect(0,0,width,height);
}

function drawplayer(){
    if(right){
        player_x += 10;
    }
    else if(left){
        player_x -= 10;
    }
    if(up){
        player_y -= 10;
    }
    else if(down){
        player_y += 10;
    }

    if(player_x <= 0){
        player_x = 0;
    }
    if(player_y <= 0){
        player_y = 0;
    }
    if((player_x + player_w) >= width){
        player_x = width - player_w;
    }
    if((player_y + player_h) >= height){
        player_y = height - player_h;
    }

    var playerSprite = new Image();
    playerSprite.src = "pages/testBlue.png";
    ctx.drawImage(playerSprite, player_x, player_y, player_w, player_h);
}

function drawbullet(){
    if(bullets.length){
        for(var i = 0; i < bullets.length; i++){
            var bulletSprite = new Image();
            if(bullets[i].speedX < 0){
                bulletSprite.src = "pages/testBulletLeft.png";
            }
            if(bullets[i].speedX > 0){
                bulletSprite.src = "pages/testBulletRight.png";
            }
            if(bullets[i].speedY < 0){
                bulletSprite.src = "pages/testBulletUp.png";
            }
            if(bullets[i].speedY > 0){
                bulletSprite.src = "pages/testBulletDown.png";
            }
            ctx.drawImage(bulletSprite, bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        }
    }
}

function movebullet(){
    for(var i = 0; i < bullets.length; i++){
        bullets[i].x += bullets[i].speedX;
        bullets[i].y += bullets[i].speedY;
        /*console.log(bullets[i].x);
        console.log(bullets[i].y);
        console.log(bullets[i].speedX);
        console.log(bullets[i].speedY);*/
        if(bullets[i].x < 0 || bullets[i].x > width || bullets[i].y < 0 || bullets[i].y > height){
            bullets.splice(i, 1);
        }
    }
}

function keyDown(evt){
    console.log(evt.keyCode);
    if(evt.keyCode == 39) {right = true;}
    else if(evt.keyCode == 37) {left = true;}
    if(evt.keyCode == 38) {up = true;}
    else if(evt.keyCode == 40) {down = true;}

    //why does only (left && up) not register space press???
    if((evt.keyCode == 32 || (left && up)) && bullets.length <= bulletTotal){

        var b = {
            x: player_x + player_w/2,
            y: player_y + player_h/2,
            speedX: 0,
            speedY: 0,
            width: 30,
            height: 30
        };
        
        if(up){
            b.speedY -= 2;
            b.width = 10;
        }
        else if(down){
            b.speedY += 2;
            b.width = 10;
        }
        else if(left) {
            b.speedX -= 2;
            b.height = 10;
        }
        else if(right || (b.speedX === 0 && b.speedY === 0)){
            b.speedX += 2;
            b.height = 10;
        }
        bullets.push(b);
    }
}

function keyUp(evt){
    if(evt.keyCode == 39) {right = false;}
    else if(evt.keyCode == 37) {left = false;}
    if(evt.keyCode == 38) {up = false;}
    else if(evt.keyCode == 40) {down = false;}
}

init();