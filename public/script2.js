//SAFE FILE
var maxResult;
var bestSpot;
var limit;
var minResult;
var alphas, betas;
//game mode 0 is pvp
//game mode 1 is easy ai
//game mode 2 is medium ai
//game mode 3 is heuristic ai
//game mode 4 is hard  ai (extremely slow.
var gameMode = 1;
var count = 0;
var aiHard;
const winningCombo = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],

  [16, 17, 18, 19],
  [20, 21, 22, 23],
  [24, 25, 26, 27],
  [28, 29, 30, 31],

  [32, 33, 34, 35],
  [36, 37, 38, 39],
  [40, 41, 42, 43],
  [44, 45, 46, 47],

  [48, 49, 50, 51],
  [52, 53, 54, 55],
  [56, 57, 58, 59],
  [60, 61, 62, 63],

  [3, 18, 33, 48],
  [7, 22, 37, 52],
  [11, 26, 41, 56],
  [15, 30, 45, 60],
  [0, 17, 34, 51],
  [4, 21, 38, 55],
  [8, 25, 42, 59],
  [12, 29, 46, 63],
  [0, 4, 8, 12],
  [16, 20, 24, 28],
  [32, 36, 40, 44],
  [48, 52, 56, 60],
  [1, 5, 9, 13],
  [17, 21, 25, 29],
  [33, 37, 41, 45],
  [49, 53, 57, 61],
  [2, 6, 10, 14],
  [18, 22, 26, 30],
  [34, 38, 42, 46],
  [50, 54, 58, 62],
  [3, 7, 11, 15],
  [19, 23, 27, 31],
  [35, 39, 43, 47],
  [51, 55, 59, 63],
  [0, 16, 32, 48],
  [1, 17, 33, 49],
  [2, 18, 34, 50],
  [3, 19, 35, 51],
  [4, 20, 36, 52],
  [5, 21, 37, 53],
  [6, 22, 38, 54],
  [7, 23, 39, 55],
  [8, 24, 40, 56],
  [9, 25, 41, 57],
  [10, 26, 42, 58],
  [11, 27, 43, 59],
  [12, 28, 44, 60],
  [13, 29, 45, 61],
  [14, 30, 46, 62],
  [15, 31, 47, 63],
  [0, 21, 42, 63],
  [3, 22, 41, 60],
  [12, 25, 38, 51],
  [15, 26, 37, 48],
  [0, 20, 40, 60],
  [1, 21, 41, 61],
  [2, 22, 42, 62],
  [3, 23, 43, 63],
  [0, 5, 10, 15],
  [16, 21, 26, 31],
  [32, 37, 42, 47],
  [48, 53, 58, 63],
  [0, 5, 10, 15],
  [16, 21, 26, 31],
  [32, 37, 42, 47],
  [48, 53, 58, 63],
  [3, 6, 9, 12],
  [19, 22, 25, 28],
  [35, 38, 41, 44],
  [51, 54, 57, 60],
  [0, 20, 40, 60],
  [1, 21, 41, 61],
  [2, 22, 42, 62],
  [3, 23, 43, 63],
  [12, 24, 36, 48],
  [13, 25, 37, 49],
  [14, 26, 38, 50],
  [15, 27, 39, 51]
];
var scene, camera, renderer, controls, projector, geometry, dope;
var humanTurn = 1;
var mouse = new THREE.Vector2(),
  INTERSECTED;
const P1X = true;
const P2O = false;
var oneArr = [];
var tracker = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34,
  35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
  47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58,
  59, 60, 61, 62, 63
]

function addAxis() {
  //use utitilitit
  var axis = new THREE.AxisHelper(1000.25);
  scene.add(axis);
}
init();
animationLoop();
//addAxis();
//window resizeBy
function init() {
  //renders the whole scene to make it viewable
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  //setting the pixel size for the render
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //appending the render  to the container
  document.body.appendChild(renderer.domElement);
  // Create camera.
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 100;
  //trackball controllers
  //allows camera movement using mouse!!!
  controls = new THREE.TrackballControls(camera);
  controls.addEventListener('change', render);
  controls.rotateSpeed = 2.0;
  //how far you can zoom out
  controls.maxDistance = 240;
  //how far you zoom in
  controls.minDistance = 0;
  //controls the slipperiness after moving controllers
  controls.dynamicDampingFactor = 0.2;
  controls.staticMoving = false;
  controls.noPan = true;
  controls.noZoom = false;
  controls.panSpeed = 0.8;
  controls.zoomSpeed = 1.2;
  controls.target.set(0, 0, -4);
  //set the scene!
  scene = new THREE.Scene();
  scene.background = new THREE.Color('#191919');
  var light = new THREE.HemisphereLight(0x111111, 0x444444, 1);
  scene.add(light);
  // Add listener for window resize.
  window.addEventListener('resize', onWindowResize, false);
}

function animationLoop() {
  requestAnimationFrame(animationLoop);
  render();
  controls.update();
}
//to prevent the scene from constantly rendering over and over again
function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
}

function addCubes() {
  geometry = new THREE.BoxGeometry(10, 10, 1);
  for (let a = 0; a < 4; a++) {
    for (let b = 0; b < 4; b++) {
      for (let c = 0; c < 4; c++) {
        var cube = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
          color: 0xffffff
        }));
        cube.position.y = -25 * a;
        cube.position.z = -35 * b;
        cube.position.x = 15 * c;
        scene.add(cube);
        oneArr.push(cube);
      }
    }
  }
  for (let i = 0; i < 64; i++) {
    oneArr[i].name = i;
  }
}
//start the game!!
////console.log( Array.from(Array(16).keys()));
function startGame() {
  addCubes();
  projector = new THREE.Projector();
  // when the mouse moves, call the given function
  document.addEventListener('mousedown', onDocumentMouseDown, false);
}
// =========================================================================
//HERE IS THE CLICK FUNCTION!!!---------------------------------------------
// =========================================================================

function onDocumentMouseDown(event) {
  // the following line would stop any other event handler from firing
  // (such as the mouse's TrackballControls)
  event.preventDefault();
  // update the mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // find intersections
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3(mouse.x, mouse.y, 1);
  projector.unprojectVector(vector, camera);
  var raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  // create an arraycaster containing all objects in the scene with which the raycaster intersects
  var intersects = raycaster.intersectObjects(oneArr);
  //setting player 1 and player 2
  var index;
  var aiMove;
  // if there is one (or more) intersections
  ////console.log(oneArr.indexOf(intersects[0]));
  if (intersects.length > 0 && INTERSECTED != intersects[0].object) {
    // if it is a players ones turn and the intersected ray object first item is null
    if (typeof tracker[oneArr.indexOf(intersects[0].object)] == "number") {

      index = oneArr.indexOf(intersects[0].object);
      INTERSECTED = intersects[0].object;
      if (gameMode == 0) {
                  //console.log(index);
        onlyHumanTurn(INTERSECTED, index, tracker);
        if (tie()) {
          tie();
        }
      } else if (gameMode == 1) {
        turn(INTERSECTED, P1X, index, tracker);
        if (emptySpace().length > 0 && (tracker[0] != null)) {
          aiMove = aiEasyTurn();
          turn(oneArr[aiMove], P2O, aiMove, tracker);
          ////console.log(aiMove);
        } else if (tie() != false) {
          tie();
        }
      } else if (gameMode == 2) {
        ////console.log(tracker + "<state of tracker");
        turn(INTERSECTED, P1X, index, tracker);
        count++;
        ////console.log("count" + count);
        ////console.log("this is block : " + index + "<<<<< that you pressed");
        if (emptySpace().length > 0) {
          if (aiWin(tracker) != null) {
            aiMove = aiWin(tracker);
            //console.log("letting the ai win right away" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
          } else if (checkThree(tracker, P1X) != null) {
            aiMove = checkThree(tracker, P1X);
            //console.log("lpreventing p1x to win" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
            //console.log("lpreventing p1x to win" + aiMove);
          } else if (count < 10) {
            aiMove = aiMediumTurn();
            turn(oneArr[aiMove], P2O, aiMove, tracker);
            ////console.log("ai easy move" + aiMove);
            //console.log("this is ai move before count 10 :    " + aiMove);
          } else if (count > 9) {
            aiMove = aiHardTurn();
            ////console.log("this is block : " + index + "<<<<< that comp pressed");
            ////console.log("ai move" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
            //console.log("this is ai move MINIMAX! count 10 :    " + aiMove);
            ////console.log("ai hard turn" + aiMove);
          }
        }
        //console.log(tracker + "<state of tracker");
      } else if (gameMode == 3) {
        ////console.log(tracker + "state of tracker");
        turn(INTERSECTED, P1X, index, tracker);
        if (emptySpace().length > 0 && (tracker[0] != null)) {
          aiMove = aiMediumTurn();
          turn(oneArr[aiMove], P2O, aiMove, tracker);
          ////console.log(aiMove);
        } else if (tie() != false) {
          tie();
        }
      } else if (gameMode == 4) {
        ////console.log(tracker + "<state of tracker");
        turn(INTERSECTED, P1X, index, tracker);
        count++;
        ////console.log("count" + count);
        ////console.log("this is block : " + index + "<<<<< that you pressed");
        if (emptySpace().length > 0) {
          if (aiWin(tracker) != null) {
            aiMove = aiWin(tracker);
          //	//console.log("letting the ai win right away" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
          } else if (checkThree(tracker, P1X) != null) {
            aiMove = checkThree(tracker, P1X);
            //console.log("lpreventing p1x to win" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
            //console.log("lpreventing p1x to win" + aiMove);
          }else {
            aiMove = aiHardTurn();
            ////console.log("this is block : " + index + "<<<<< that comp pressed");
            ////console.log("ai move" + aiMove);
            turn(oneArr[aiMove], P2O, aiMove, tracker);
            //console.log("this is ai move MINIMAX! count 10 :    " + aiMove);
            ////console.log("ai hard turn" + aiMove);
          }
        }
        //console.log(tracker + "<state of tracker");
      }
    }
  }
}

function onlyHumanTurn(cube, index, keepTrack) {
  if (humanTurn == 1) {
    cube.material.emissive.setHex(0xFFA400);
    keepTrack[index] = true;
    let gameWin = checkWin(keepTrack, P1X);
    if (gameWin) {
      gameOver(gameWin);
    }
    humanTurn = 2;
  } else if (humanTurn == 2) {
    cube.material.emissive.setHex(0x19B5FE);
    keepTrack[index] = false;
    let gameWin = checkWin(keepTrack, P2O);
    if (gameWin) {
      gameOver(gameWin);
    }
    humanTurn = 1;
  }
}

function turn(cube, player, index, keepTrack) {
  keepTrack[index] = player;
  if (player == P1X) {
    cube.material.emissive.setHex(0xFFA400);
    let gameWin = checkWin(keepTrack, P1X);
    if (gameWin) {
      gameOver(gameWin);
    }
  } else if (player == P2O) {
    cube.material.emissive.setHex(0x19B5FE);
    let gameWin = checkWin(keepTrack, P2O);
    if (gameWin) {
      gameOver(gameWin);
    }
  }
}
//returns null if the there is no win
//returns the object win which is the index of the winning combo in the 2d array
// and returns the player of that winning combo.
function checkWin(board, player) {
  let notNull = board.reduce((ele, val, index) => (val === player) ? ele.concat(index) : ele, []);
  let isWin = null;
  for (let [index, win] of winningCombo.entries()) {
    /*  ////console.log("indinex of checkWin>>>" + index);
     ////console.log("win of checkWin" + win); */
    if (win.every(elem => notNull.indexOf(elem) > -1)) {
      isWin = {
        index: index,
        player: player
      };
      break;
    }
  }
  return isWin;
}

function checkWinner(board, player) {
  let notNull = board.reduce((ele, val, index) => (val === player) ? ele.concat(index) : ele, []);
  let isWin = false;
  for (let [index, win] of winningCombo.entries()) {
    //  //console.log("indinex of checkWiner 1334 >>>" + index);
    // //console.log("win of checkWin1334" + win);
    if (win.every(elem => notNull.indexOf(elem) > -1)) {
      isWin = true;
      //   //console.log("is isWin true? " + isWin );
      break;
    }
  }
  return isWin;
}

function aiWin(board) {
  if (checkThree(board, P2O) != null) {
    return checkThree(board, P2O);
  } else {
    return null;
  }
}
//returns null if the there is no win
//returns the object of the three and the null which is the index of the winning combo in the 2d array
// and returns the player of that winning combo.
function checkThree(board, player) {
  let notNull = board.reduce((ele, val, index) => (val === player) ? ele.concat(index) : ele, []);
  let isNumber = board.reduce((ele, val, index) => (typeof val === 'number') ? ele.concat(index) : ele, []);
  let isWin = null;
  //index of the win combo
  for (let [index, win] of winningCombo.entries()) {
    ////console.log("win[0] " + win[0]);
    ////console.log("win[1] " + win[1]);
    ////console.log("win[2] " + win[2]);
    ////console.log("win[3] " + win[3]);
    ////console.log("indeX" + index);
    //if the first, second, third, index of the winning combo is equal to the player
    //if the fourth index of the winning combo is equal to the number in the null array
    //return the index.
    if (notNull.includes(win[0]) && notNull.includes(win[1]) && notNull.includes(win[2]) && isNumber.includes(win[3])) {
      isWin = win[3];
      break;
    } else if (notNull.includes(win[0]) && notNull.includes(win[1]) && isNumber.includes(win[2]) && notNull.includes(win[3])) {
      isWin = win[2];
      break;
    } else if (notNull.includes(win[0]) && isNumber.includes(win[1]) && notNull.includes(win[2]) && notNull.includes(win[3])) {
      isWin = win[1];
      break;
    } else if (isNumber.includes(win[0]) && notNull.includes(win[1]) && notNull.includes(win[2]) && notNull.includes(win[3])) {
      ////console.log("WHY IS IT DNULLL??" + win[3]);
      isWin = win[0];
      break;
    }
  }
  return isWin;
}

function checkTwo(board, player) {
  let notNull = board.reduce((ele, val, index) => (val === true) ? ele.concat(index) : ele, []);
  ////console.log(notNull + "s<  523453 < not null");
  let isNumber = board.reduce((ele, val, index) => (typeof val === 'number') ? ele.concat(index) : ele, []);
  ////console.log(isNumber[0] + " <  isNumber[0] < not null");
  let isWin = null;
  //index of the win combo
  for (let [index, win] of winningCombo.entries()) {
    /*  ////console.log("win[0] " + win[0]);
      ////console.log("win[1] " + win[1]);
      ////console.log("win[2] " + win[2]);
      ////console.log("win[3] " + win[3]);
      ////console.log("indeX" + index);


      //if the first, second, third, index of the winning combo is equal to the player
      //if the fourth index of the winning combo is equal to the number in the null array
      //return the index.
      ////console.log("win[0]: " + win[0]
                  + notNull[0] + " notNull 9989");
      //player player null null
      */
    if (notNull.includes(win[0]) && notNull.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin = win[3];
      ////console.log(isWin.emptyPosition + " <isWin empty posi tion");
      break;
    }
    //player null   null player
    else if (notNull.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && notNull.includes(win[3])) {
      isWin = win[2];
      break;
    }
    // null   null player player
    else if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && notNull.includes(win[2]) && notNull.includes(win[3])) {
      isWin = win[0];
      break;
      // null player player null
    } else if (isNumber.includes(win[0]) && notNull.includes(win[1]) && notNull.includes(win[2]) && isNumber.includes(win[3])) {
      isWin = win[3];
      break;
    }
    // null player player null
    else if (isNumber.includes(win[0]) && notNull.includes(win[1]) && notNull.includes(win[2]) && isNumber.includes(win[3])) {
      isWin = win[0];
      break;
    }
    //player null null player
    else if (notNull.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && notNull.includes(win[3])) {
      isWin = win[2];
      break;
    }
  }
  return isWin;
}

function gameOver(gameWon) {
  for (let index of winningCombo[gameWon.index]) {
    gameWon.player == P1X ? oneArr[index].material.emissive.setHex(0xff00ff) : oneArr[index].material.emissive.setHex(0x00ffff);
  }
  tracker = new Array(64).fill(null);
}
//lights up the function based off player and array
function lightUp(lighter, player) {
  if (lighter.length > 1) {}
}

function tie() {
  if (emptySpace().length === 0 && (tracker[0] != null)) {
    lightUpWhite();
    return true;
  }
  return false;
}

function lightUpWhite() {
  for (let i = 0; i < 16; i++) {
    oneArr[i].material.emissive.setHex(0xffffff);
  }
}
//empty spaces in the tracker!
function emptySpace() {
  return tracker.filter(s => typeof s === 'number');
}
////console.log(emptyBoard(tracker));
function emptyBoard(t) {
  var arr = [];
  for (let i = 0; i < t.length; i++) {
    if (typeof t[i] == 'number') {
      arr.push(t[i]);
    }
  }
  ////console.log(arr + "function emptyBoard");
  return arr;
}

function aiEasyTurn() {
  let empty = tracker.reduce((ele, val, index) => (typeof val == "number") ? ele.concat(index) : ele, []);
  var randomTurn = empty[Math.floor(Math.random() * empty.length)];
  return randomTurn;
}
startGame();
//making the boolean 3d array to check the winning con
function aiMediumTurn() {
  var index;
  if (checkThree(tracker, P2O) != null) {
    index = checkThree(tracker, P2O);
    ////console.log("12341234 aiaiaiia checkThree not null: " + index.emptyPosition);
    return index;
  } else if (checkThree(tracker, P2O) == null) {
    if (checkTwo(tracker, P2O) != null) {
      index = checkTwo(tracker, P2O);
      return index;
      ////console.log("12341234 AI checkTwo not null: " + index.emptyPosition);
    } else if (checkTwo(tracker, P2O) == null) {
      index = aiEasyTurn();
      ////console.log(aiEasyTurn()+"<<<AI EASY TURn 12341234");
      return index;
      ////console.log(aiEasyTurn()+"<<<AI EASY TURn");
    }
  }
}

function aiHardTurn() {
  var newBoard = tracker;
  var avail = emptyBoard(newBoard);
  ////console.log(avail + "avail array 043");
  var depth = 3;
  alphas = Number.MIN_VALUE;
  var maxResult = Number.MIN_VALUE;
  betas = Number.MAX_VALUE;
  var bestMove = Number.MIN_VALUE;
  //returns the index of where the comp sohould play
  ////console.log(bestSpot + "   Best Spot in aiHardTurn 3335");




        for (var i = 0; i < avail.length; i++) {
      //the length of each
      newBoard[avail[i]] = P2O;
    //console.log(newBoard + "this is the newBoard with the player");
      result = minimax(newBoard, P1X, depth - 1, alphas, betas);
      //console.log(depth + "<<<depth level  resultQQ" + result + "with the index" + avail[i]);
      newBoard[avail[i]] = avail[i];
      //console.log(avail[i] + "availi" );

      //console.log(maxResult + "max resultation unmber" );

    }
  //console.log("ai best spot using minimax" + result);
  //console.log("ai HArd: " +aiHard);
  return aiHard;
}
/*
board score is 0
if maxdepth is smalerl than the depth, maxDepth is equal to depth
*/
//if depth is 1. computer goes through the loopgets
//gests to p2   o is false.
//if computer places their position in each child positionn
function minimax(newBoard, player, depth, alphas, betas) {

  var maxResult;
  var minResult;
  var result;
  var avail = emptyBoard(newBoard);
  //return {sco:score};
  if (avail.length == 0 || depth == 0) {
    return scoringBoard(newBoard);
  }

  if (player == P2O) {
    maxResult = Number.MIN_VALUE;
    for (var i = 0; i < avail.length; i++) {
      //the length of each
      newBoard[avail[i]] = P2O;
    //console.log(newBoard + "this is the newBoard with the player");
      result = minimax(newBoard, P1X, depth - 1, alphas, betas);
      //console.log(depth + "<<<depth level  resultQQ" + result + "with the index" + avail[i]);
      newBoard[avail[i]] = avail[i];
      //console.log(avail[i] + "availi" );

      //console.log(maxResult + "max resultation unmber" );
      if (maxResult < result) {
        maxResult = result;
        aiHard = avail[i];
        //  //console.log("player in for loop" + player );
        // //console.log("best spot in minmiax" + bestSpot );
      }
      console.log("max result" + maxResult + "betas" + betas + "alphas" + alphas + "DeptH" +  depth);
      alphas = Math.max(alphas, maxResult);
      console.log("new lapha" + alphas);
      if (betas <= alphas) {
        console.log("is this working");

        break;
      }
    }
    return maxResult;
  } else {
    minResult = Number.MAX_VALUE;
    for (var i = 0; i < avail.length; i++) {
      newBoard[avail[i]] = P1X;
      result = minimax(newBoard, P2O, depth - 1, alphas, betas);
      newBoard[avail[i]] = avail[i];
      if (minResult > result) {
        minResult = result;
        aiHard = avail[i];

      }
              console.log("min result" + minResult + "betas" + betas + "alphas" + alphas + "DeptH" +  depth);

      betas = Math.min(betas, minResult);
      console.log(betas + "BETA");
      if (betas <= alphas) {
        console.log("broken" + betas);
        break;
      }
    }
    return minResult;
  }
}


////console.log(calculate(bobo) + "this is the score");
function scoringBoard(board) {
  let human = board.reduce((ele, val, index) => (val === P1X) ? ele.concat(index) : ele, []);
  ////console.log("notnull>" + human + "the player" + player);
  let computer = board.reduce((ele, val, index) => (val === P2O) ? ele.concat(index) : ele, []);
  let isNumber = board.reduce((ele, val, index) => (typeof val === 'number') ? ele.concat(index) : ele, []);
  ////console.log("number>" + isNumber + "the player" + player);
  let isWin = 0;
  //index of the win combo
  for (let [index, win] of winningCombo.entries()) {
    ////console.log("win[0] " + win[0]);
    ////console.log("win[1] " + win[1]);
    ////console.log("win[2] " + win[2]);
    ////console.log("win[3] " + win[3]);
    ////console.log("indeX" + index);
    //if the first, second, third, index of the winning combo is equal to the player
    //if the fourth index of the winning combo is equal to the number in the null array
    //return the index.   if (
          if (human.includes(win[0]) && human.includes(win[1]) && human.includes(win[2]) && human.includes(win[3])) {
      isWin += 10000000;
      ////console.log(isWin.score + "isWinScore");
    }
    if (computer.includes(win[0]) && computer.includes(win[1]) && computer.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 10000000
      ////console.log(isWin.score + "isWinScore");
    }
    if (human.includes(win[0]) && human.includes(win[1]) && human.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 7;
      ////console.log(isWin.score + "isWinScore");
    }
    if (computer.includes(win[0]) && computer.includes(win[1]) && computer.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 7;
      ////console.log(isWin.score + "isWinScore");
    }
    if (human.includes(win[0]) && human.includes(win[1]) && isNumber.includes(win[2]) && human.includes(win[3])) {
      isWin += 7;
    }
    if (computer.includes(win[0]) && computer.includes(win[1]) && isNumber.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 7;
    }
    if (human.includes(win[0]) && isNumber.includes(win[1]) && human.includes(win[2]) && human.includes(win[3])) {
      isWin += 7;
    }
    if (computer.includes(win[0]) && isNumber.includes(win[1]) && computer.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 7;
    }
    if (isNumber.includes(win[0]) && human.includes(win[1]) && human.includes(win[2]) && human.includes(win[3])) {
      isWin += 7;
    }
    if (isNumber.includes(win[0]) && computer.includes(win[1]) && computer.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 7;
    }
    //player player null null
    if (human.includes(win[0]) && human.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 5;
    } //player player null null
    if (computer.includes(win[0]) && computer.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 5;
    }
    //player null   null player
    if (human.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && human.includes(win[3])) {
      isWin += 5;
    }
    if (computer.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 5;
    }
    // null   null player player
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && human.includes(win[2]) && human.includes(win[3])) {
      isWin += 5;
      // null player player null
    }
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && computer.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 5;
      // null player player null
    }
    if (isNumber.includes(win[0]) && human.includes(win[1]) && human.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 5;
    }
    if (isNumber.includes(win[0]) && computer.includes(win[1]) && computer.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 5;
    }
    // null player player null
    //player null null player
    if (human.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && human.includes(win[3])) {
      isWin += 5;
    }
    if (computer.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 5;
    }
    if (human.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 3;
    }
    if (computer.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 3;
    }
    if (isNumber.includes(win[0]) && human.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 3;
    }
    if (isNumber.includes(win[0]) && computer.includes(win[1]) && isNumber.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 3;
    }
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && human.includes(win[2]) && isNumber.includes(win[3])) {
      isWin += 3;
      ////console.log(isWin.score + "isWinScore");
    }
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && computer.includes(win[2]) && isNumber.includes(win[3])) {
      isWin -= 3;
      ////console.log(isWin.score + "isWinScore");
    }
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && human.includes(win[3])) {
      isWin += 3;
    }
    if (isNumber.includes(win[0]) && isNumber.includes(win[1]) && isNumber.includes(win[2]) && computer.includes(win[3])) {
      isWin -= 3;
    }
  }
  ////console.log(isWin.score + "is win score in " + player);
  return isWin;
}
/////////////////////////////
