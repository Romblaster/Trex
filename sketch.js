var trex,trex_collided, trex_running;
var ground, groundImage;
var edges;
var obstacle, obstaclegroup, obstacle1_image, obstacle2_image, obstacle3_image, obstacle4_image, obstacle5_image, obstacle6_image;
var cloud, cloudgroup, cloud_image
var invisibleGround;
var START = "start";
var PLAY = "play";
var END ="end"
var gamestate = START;
var score=0
var restart
var gameover
var die, checkPoint, jump



function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  
  trex_collided = loadImage("trex_collided.png")
  
  cloud_image = loadImage("cloud.png")

  obstacle1_image = loadImage("obstacle1.png")

  obstacle2_image = loadImage("obstacle2.png")

  obstacle3_image = loadImage("obstacle3.png")

  obstacle4_image = loadImage("obstacle4.png")

  obstacle5_image = loadImage("obstacle5.png")

  obstacle6_image = loadImage("obstacle6.png")
  
  gameover_image = loadImage("gameover.png")
  
  restart_image = loadImage("restart.png")
  
  trex_standing = loadAnimation("trex1.png");

  groundImage = loadImage("ground2.png");
  
  die = loadSound("die.mp3")
  
  checkPoint = loadSound("checkPoint.mp3")
  
  jump = loadSound("jump.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  restart= createSprite(300, 140)
  restart.addImage(restart_image)
  restart.scale=0.4
  restart.visible=false
  
  gameover= createSprite(300, 90)
  gameover.addImage(gameover_image)
  gameover.scale=0.5
  gameover.visible=false


  ground = createSprite(200, 180, 400, 10);
  ground.addImage(groundImage);
  ground.x = ground.width / 2;

  // creating trex
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("standing", trex_standing);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.debug=true
  trex.setCollider("rectangle", 0, 0, 80, 90)


  // to help dino run on ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  edges = createEdgeSprites();

  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50;
  obstaclegroup=new Group()
  cloudgroup=new Group()
}



function draw() {
  //set background color 
  background("white");
  text("Score: "+score, 500, 50);


  if (gamestate === START && keyDown("space")) {
    gamestate = PLAY;
  }

  if (gamestate === PLAY) {
    ground.velocityX = -(6 + score/100)    
    score = score + Math.round(getFrameRate()/60)

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    trex.velocityY = trex.velocityY + 0.8;
    spawnclouds();
    spawnobstacle();
    

    trex.changeAnimation("running", trex_running);

    if (keyDown("space") && trex.y >= 160) {
      trex.velocityY = -15;

    }
    if (score %100 === 0){
      checkPoint.play();
    }
    if (trex.isTouching(obstaclegroup)){
      //trex.velocityY = -15;
      //jump.play();
      gamestate=END
      die.play();
    }
  }
  else if(gamestate===END){
  ground.velocityX=0
  obstaclegroup.setVelocityXEach(0);
  cloudgroup.setVelocityXEach(0);
  trex.changeAnimation("collided", trex_collided)
  gameover.visible=true
  restart.visible=true
  obstaclegroup.setLifetimeEach(-1)
  cloudgroup.setLifetimeEach(-1)
  trex.velocityY = 0;
    if(mousePressedOver(restart)){
  reset();
    }
  }
  

  console.log('ground.x' + ground.x)

  //logging the y position of the trex
  console.log('trex.y' + trex.y);

  
 
  trex.velocityY = trex.velocityY + 0.5;

  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function spawnclouds() {
  if (frameCount % 60 === 0) {
    cloud = createSprite(600, 100, 40, 10)
    cloud.addImage(cloud_image);
    cloud.velocityX = -(6 + score/100);
    cloud.y = Math.round(random(80, 120));
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.scale = 0.5;
    cloud.lifetime=Math.abs(width/cloud.velocityX)
    cloudgroup.add(cloud)
  }
}

function spawnobstacle() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 180, 10, 40)
    obstacle.velocityX = -(6 + score/100);

    
    var rand = Math.round(random(2, 7));
    switch (rand) {

      case 2:obstacle.addImage(obstacle1_image);
        break ;
      case 3: obstacle.addImage(obstacle2_image);
        break ;
      case 4: obstacle.addImage(obstacle3_image);
        break ;
      case 5: obstacle.addImage(obstacle4_image);
        break ;
      case 6: obstacle.addImage(obstacle5_image);
        break ;
      case 7: obstacle.addImage(obstacle6_image);
        break ;
      default:break;

    }
    obstacle.lifetime=Math.abs(width/obstacle.velocityX);
    obstacle.scale = 0.4;
    obstaclegroup.add(obstacle)
  }

}
function reset() {
  gamestate = PLAY
  gameover.visible=false
  restart.visible=false
  cloudgroup.destroyEach();
  obstaclegroup.destroyEach();
  score = 0

  }