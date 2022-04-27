window.onload = function(){
    const canvasWidth = 900;
    const canvasHeight = 600;
    const blockSize = 30;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    let delay;
    let snakee;
    let applee; 
    let score;
    let timeOut;
    
    init();
    
/**
 * Fonction permettant de définir le canvas et de l'afficher en HTML
 */
    function init(){
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid red";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "black";
        document.body.appendChild(canvas);
        launch();
    }

/**
 * Fonction permettant de lancer le jeu et de définir la position des élements
 */
    function launch(){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        delay = 100;
        refreshCanvas();
    }

/**
 * Fonction permettant de rafraichir le canvas lors de certaines actions
 */
    function refreshCanvas(){
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
        } else {
            if (snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;
                
                do {
                    applee.setNewPosition(); 
                } while(applee.isOnSnake(snakee));
                
                if(score % 5 == 0){
                    speedUp();
                }
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeOut = setTimeout(refreshCanvas,delay);
         }
    }

/**
 * Fonction permettant d'augmenter la vitesse par tranche de 5
 */
    function speedUp(){
        delay /= 2;
    }

/**
 * Fonction permettant d'afficher la fin de partie et d'orienter le user
 */
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "#7AF809";
        ctx.lineWidth = 7;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

/**
* Fonction permettant d'afficher le score en temps réel
*/
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
    
/**
 * Fonction permettant de définir la position des blocks
 */
    function drawBlock(ctx, position){
        const x = position[0]*blockSize;
        const y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

/**
 * Fonction permettant de définir le serpent
 */
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;

/**
 * Fonction permettant de définir sa couleur et longueur de son corps
 */
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="#7AF809";
            for (let i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };

/**
 * Fonction permettant l'orientation des blocks du serpent
 */
        this.advance = function(){
            const nextPosition = this.body[0].slice();
            switch(this.direction){
                case "left":
                    nextPosition[0] -= 1;
                    break;
                case "right":
                    nextPosition[0] += 1;
                    break;
                case "down":
                    nextPosition[1] += 1;
                    break;
                case "up":
                    nextPosition[1] -= 1;
                    break;
                default:
                    throw("invalid direction");
            }
            this.body.unshift(nextPosition);
            if (!this.ateApple)
                this.body.pop();
            else
                this.ateApple = false;
        };

/**
 * Fonction permettant de donner une direction au serpent
 */       
        this.setDirection = function(newDirection){
            let allowedDirections;
            switch(this.direction){
                case "left":
                case "right":
                    allowedDirections=["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirections=["left","right"];
                    break;  
               default:
                    throw("invalid direction");
            }
            if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
 
/**
 * Fonction permettant de définir les collisions
 */
        this.checkCollision = function(){
            let wallCollision = false;
            let snakeCollision = false;
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
            
            if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                wallCollision = true;
            
            for (let i=0 ; i<rest.length ; i++){
                if (snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }
            
            return wallCollision || snakeCollision;        
        };

/**
 * Fonction permettant de définir si le serpent a mangé une pomme ou non
 */
        this.isEatingApple = function(appleToEat){
            const head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }
        
    }

/**
 * Fonction permettant de créer et de fixer une position de départ à la pomme
 */
    function Apple(position){
        this.position = position;
        
        this.draw = function(){
          const radius = blockSize/2;
          const x = this.position[0]*blockSize + radius;
          const y = this.position[1]*blockSize + radius;
          ctx.save();
          ctx.fillStyle = "#7AF809";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI*2, true);
          ctx.fill();
          ctx.restore();
        };

/**
 * Fonction permettant de définir une nouvelle position une fois mangée
 */
        this.setNewPosition = function(){
            const newX = Math.round(Math.random()*(widthInBlocks-1));
            const newY = Math.round(Math.random()*(heightInBlocks-1));
            this.position = [newX,newY];
        }; 

/**
 * Fonction permettant d'éviter que la pomme apparaisse sur le serpent
 */
        this.isOnSnake = function(snakeToCheck){
            let isOnSnake = false;
            for (let i=0 ; i < snakeToCheck.body.length ; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;     
                }
            }
            return isOnSnake;
        };

    }

/**
 * Fonction permettant les touches du clavier
 */
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
                launch();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
}

