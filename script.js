// window.onload = function() {
//     const canvasWidth = 900;
//     const canvasHeight = 600;
//     const blockSize = 30;
//     const canvas = document.createElement('canvas');
//     // contexte du canavas
//     const ctx = canvas.getContext('2d');
//     const widthInBlocks = canvasWidth/blockSize;
//     const heightInBlocks = canvasHeight/blockSize;
//     const centerX = canvasWidth / 2;
//     const centerY = canvasHeight / 2;
//     let delay;
//     let snakee;
//     let applee;
//     let score;
//     let timeOut;

//     // init est declaré plus haut grâce au "hoisting"
//     init();

//     function init (){
//         canvas.width = canvasWidth;
//         canvas.height = canvasHeight;
//         canvas.style.border = "30px solid grey";
//         canvas.style.margin = "50px auto";
//         canvas.style.display = "block";
//         canvas.style.background = "#ddd";
//         document.body.appendChild(canvas);
//         launch();
//     }

//     function launch(){
//         snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
//         applee = new Apple([10,10]);
//         score = 0; 
//         clearTimeout(timeOut);
//         delay = 100;
//         refreshCanvas();
//     }

//     function refreshCanvas() {
//         snakee.advance();
//         if (snakee.checkCollision()){
//             gameOver();
//         }else{
//             // si le serpent mange une pomme, incrémentation du score
//             if(snakee.isEatingApple(applee)){
//                 score++;
//                 snakee.ateApple = true;
            
//                 do{
//                     // nouvelle position une fois la pomme mangé
//                     applee.setNewPosition();
//                     // cherche une nouvelle position tant que la pomme est sur le serpent
//                 } while(applee.isOnSnake(snakee));

//                 // si mon score se divise par 5, lance la fonction speedUp 
//                 if(score % 5 == 0){
//                     speedUp();
//                 }
//             }
//             // clear le canvas
//             ctx.clearRect(0,0,canvasWidth,canvasHeight);
//             // affiche score, serpent et pomme
//             drawScore();
//             snakee.draw();
//             applee.draw();
//             timeOut = setTimeout(refreshCanvas,delay);
//         }
//     }

//     function speedUp(){
//         delay /= 2;
//     }

//     function gameOver() {
//         ctx.save();
//         ctx.font = "bold 70px sans-serif";
//         ctx.fillStyle = "#fff";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         ctx.stokeStyle = "white";
//         ctx.lineWidth = 5;
//         ctx.stokeText("Game Over", centerX, centerY - 180);
//         ctx.fillText("Game Over",centerX, centerY - 180);
//         ctx.font = "bold 30px sans-serif";
//         ctx.stokeText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
//         ctx.fillText("Appuyer sur la touche Espace pour rejouer", centerX, centerY - 120);
//         ctx.restore();
//     }

   

//     function drawScore(){
//         ctx.save();
//         ctx.front = "bold 200px sans-serif";
//         ctx.fillStyle = "white";
//         ctx.textAlign = "center";
//         ctx.baseline = "middle";
//         ctx.fillText(score.toString(), centerX, centerY);
//         ctx.restore();
//     }

//     function drawBlock(ctx, position){
//         const x = position[0]*blockSize;
//         const y = position[1]*blockSize;
//         ctx.fillRect(x,y,blockSize,blockSize);
//     }

//     function Snake(body,direction){
//         this.body = body;
//         this.direction = direction;
//         this.ateApple = false;

//         this.draw = function(){
//             ctx.save();
//             ctx.fillStyle = "#fff0000";
//             for (let i=0 ; i < this.body.length ; i++){
//                 drawBlock(ctx,this.body[i]);
//             }
//             ctx.restore();
//         };

//         this.advance = function() {
//             const nextPosition = this.body[0].slice();
//             switch(this.position){
//                 case "left":
//                     nextPosition[0] -= 1;
//                     break;
//                 case "right":
//                     nextPosition[0] += 1;
//                     break;
//                 case "down":
//                     nextPosition[0] += 1;
//                     break;
//                 case "up":
//                     nextPosition[0] -= 1;
//                     break;
//                 default:
//                     throw("invalid direction");
//             }
//             this.body.unshift(nextPosition);
//             if(!this.ateApple)
//                 this.body.pop();
//             else
//                 this.ateApple = false;
//         };

//         this.setDirection = function(newDirection) {
//             let allowedDrections;
//             switch(this.direction){
//                 case "left":
//                 case "right":
//                     allowedDrections=["up", "down"];
//                     break;
//                 case "down":
//                 case "up":
//                     allowedDrections=["left", "right"];
//                     break;
//                 default:
//                     throw("invalid direction");
//             }
//             if (allowedDrections.indexOf(newDirection) > -1){
//                 this.direction = newDirection;
//             }
//         };

//         this.checkCollision = function(){
//             let wallCollision = false;
//             let snakeCollision = false;
//             const head = this.body[0];
//             const rest = this.body.slice(1);
//             const snakeX = head[0];
//             const snakeY = head[1];
//             const minX = 0;
//             const minY = 0;
//             const maxX = widthInBlocks - 1;
//             const maxY = heightInBlocks - 1;
//             const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
//             const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

//             if(isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
//             wallCollision = true;

//             for (let i = 0 ; i < rest.length ; i++){
//                 if(snakeX === rest[i][0] && snakeY === rest[i][1])
//                 snakeCollision = true;
//             }

//             return wallCollision || snakeCollision;
//         };

//         this.isEatingApple = function(appletoEat){
//             const head = this.body[0];
//             if(head[0] === appletoEat.position[0] && head[1] === appletoEat.position[1])
//                 return true;
//             else
//                 return false;
//         }
//     }

//     function Apple(position){
//         this.position = position;
        
//         this.draw = function(){
//         const radius = blockSize/2;
//         const x = this.position[0]*blockSize + radius;
//         const y = this.position[1]*blockSize + radius;
//           ctx.save();
//           ctx.fillStyle = "#33cc33";
//           ctx.beginPath();
//           ctx.arc(x, y, radius, 0, Math.PI*2, true);
//           ctx.fill();
//           ctx.restore();
//         };
        
//         this.setNewPosition = function(){
//             const newX = Math.round(Math.random()*(widthInBlocks-1));
//             const newY = Math.round(Math.random()*(heightInBlocks-1));
//             this.position = [newX,newY];
//         }; 
        
//         this.isOnSnake = function(snakeToCheck){
//             let isOnSnake = false;
//             for (let i=0 ; i < snakeToCheck.body.length ; i++){
//                 if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
//                     isOnSnake = true;     
//                 }
//             }
//             return isOnSnake;
//         };

//     }

//     document.onkeydown = function handleKeyDown(e){
//         const key = e.keyCode;
//         let newDirection;
//         switch(key){
//             case 37:
//                 newDirection = "left";
//                 break;
//             case 38:
//                 newDirection = "up";
//                 break;
//             case 39:
//                 newDirection = "right";
//                 break;
//             case 40:
//                 newDirection = "down";
//                 break;
//             case 32:
//                 launch();
//                 return;
//             default:
//                 return;
//         }
//         snakee.setDirection(newDirection);
//     };
// }

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

    function launch(){
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        clearTimeout(timeOut);
        delay = 100;
        refreshCanvas();
    }
    
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
    
    function speedUp(){
        delay /= 2;
    }
    
    function gameOver(){
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "grey";
        ctx.lineWidth = 4;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }
    
    function drawScore(){
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "blue";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }
    
    function drawBlock(ctx, position){
        const x = position[0]*blockSize;
        const y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    
    function Snake(body, direction){
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
        
        this.draw = function(){
            ctx.save();
            ctx.fillStyle="white";
            for (let i=0 ; i < this.body.length ; i++){
                drawBlock(ctx,this.body[i]);
            }
            ctx.restore();
        };
        
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
        
        this.isEatingApple = function(appleToEat){
            const head = this.body[0];
            if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        }
        
    }
    
    function Apple(position){
        this.position = position;
        
        this.draw = function(){
          const radius = blockSize/2;
          const x = this.position[0]*blockSize + radius;
          const y = this.position[1]*blockSize + radius;
          ctx.save();
          ctx.fillStyle = "green";
          ctx.beginPath();
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
            let isOnSnake = false;
            for (let i=0 ; i < snakeToCheck.body.length ; i++){
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
                launch();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
}

