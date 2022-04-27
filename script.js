window.onload = function() {
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    // contexte du canavas
    let ctx;

    const delay = 100;
    const xCoord = 0;
    const yCoord = 0;
    let snakee;
    let applee;
    // largeur et hauteur du canvas en block
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;

    let score;
    let timeOut;
    // init est declaré plus haut grâce au "hoisting"
    init();

    function init (){
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid red";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.background = "#000";
        // ajout du canvas au HTML
        document.body.appendChild(canvas);

        ctx = canvas.getContext('2d');
        // creation du serpent et pomme via les block
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);

        score = 0;
        refreshCanvas();
    }

    function refreshCanvas() {
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
        }else{
            // si le serpent mange une pomme, incrémentation du score
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
            
                do{
                    // nouvelle position une fois la pomme mangé
                    applee.setNewPosition();
                    // cherche une nouvelle position tant que la pomme est sur le serpent
                } while(applee.isOnSnake(snakee));

                // si mon score se divise par 5, lance la fonction speedUp 
                if(score % 5 == 0){
                    speedUp();
                }
            }
            // clear mon canvas
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            // affiche score, serpent et pomme
            drawScrore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
        }
    }

    function speedUp(){
        delay /= 2;
    }

    function gameOver() {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.stokeStyle = "white";
        ctx.lineWidth = 5;
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.stokeText("Game Over", centerX, centerY - 180);
        ctx.fillText("Game Over",centerX, centerY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.stokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
        ctx.restore();
    }

    function restart(){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score = 0; 
        clearTimeout(timeOut);
        delay = 100;
        refreshCanvas();
    }

    function drawScore(){
        ctx.save();
        ctx.front = "bold 200px sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.baseline = "middle";
        let centerX = canvasWidth / 2;
        let centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#fff0000";
            for(var i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            var nextPosition = this.body[0].slice();
            switch(this.position){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[0] += 1;
                    break;
                case "up":
                    nextPosition[0] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if(!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };
    }
}