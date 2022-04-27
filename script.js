window.onload = function() {
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas = document.createElement('canvas');
    // contexte du canavas
    const ctx = canvas.getContext('2d');
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    let delay = 100;
    let snakee;
    let applee;
    // largeur et hauteur du canvas en block
    let score;
    let timeOut;
    // init est declaré plus haut grâce au "hoisting"

    init();

    function init (){
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid red";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.background = "#000";
        // ajout du canvas au HTML
        document.body.appendChild(canvas);
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
            drawScore();
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
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
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
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }

    function drawBlock(ctx, position){
        const x = position[0]*blockSize;
        const y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function Snake(body,direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

        this.draw = function(){
            ctx.save();
            ctx.fillStyle = "#fff0000";
            for(const i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };

        this.advance = function() {
            const nextPosition = this.body[0].slice();
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

        this.setDirection = function(newDirection) {
            let allowedDrections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDrections=["up", "down"];
                    break;
                case "down":
                case "up":
                    allowedDrections=["left", "right"];
                    break;
                default:
                    throw("invalid direction");
            }
            if (allowedDrections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        this.checkCollision = function(){
            const wallCollision = false;
            const snakeCollision = false;
            const head = this.body[0];
            const rest = this.body.slice(1);
            const snakeX = head[0];
            const snakeY = head[1];
            const minX = 0;
            const minY = 0;
            const maxX = widthInBlocks - 1;
            const maxY = heightInBlocks - 1;
            const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

            if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            wallCollision = true;

            for (const i = 0 ; i < rest.length ; i++){
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                snakeCollision = true;
            }

            return wallCollision || snakeCollision;
        };

        this.isEatingApple = function(appconstoEat){
            const head = this.body[0];
            if(head[0] === appconstoEat.position[0] && head[1] === appconstoEat.position[1])
                return true;
            else
                return false;
        }
    }

    function Apple(position){
        this.position = position;
        
        this.draw = function(){
          ctx.save();
          ctx.fillStyle = "#33cc33";
          ctx.beginPath();
          const radius = blockSize/2;
          const x = this.position[0]*blockSize + radius;
          const y = this.position[1]*blockSize + radius;
          ctx.arc(x, y, radius, 0, Math.PI*2, true);
          ctx.fill();
          ctx.restore();
        };
        
        this.setNewPosition = function(){
            const newX = Math.round(Math.random()*(widthInBlocks-1));
            const newY = Math.round(Math.random()*(heightInBlocks-1));
            this.position = [newX,newY];
        }; 
        
        this.isOnSnake = function(snakeToCheck){
            const isOnSnake = false;
            for (const i=0 ; i < snakeToCheck.body.length ; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;     
                }
            }
            return isOnSnake;
        };

    }

    document.onkeydown = function handleKeyDown(e){
        const key = e.keyCode;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
}