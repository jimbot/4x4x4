
var camera, scene, renderer, mesh, material, controls;
var red = new THREE.Color(0xff0000);
var huPlayer = {r:1, g:0, b:0};
var aiPlayer = {r:0, g:0, b:1};
var tie = {r:0, g:0, b:0};
var count = 0;
var flag = false;
var targetList = [
  [[],[],[],[]],
  [[],[],[],[]],
  [[],[],[],[]],
  [[],[],[],[]]
];

console.log(targetList);

// var projector, mouse = { x: 0, y: 0 };
var projecter;
var mouse = new THREE.Vector2(), INTERSECTED;

init();
animate();

addCubes();
render();

//Create and add cubes to the scene.---------------------------
function addCubes() {
  var xDistance = 30;
  var zDistance = 15;
  var geometry = new THREE.BoxBufferGeometry(10,10,10);
  // var material = new THREE.MeshBasicMaterial({color:0x6C70A8});

  //1
  for(let i = 0; i < 4; i++){
    for(let j = 0; j < 4; j++){
      // Adds the 4 rows of cubes
      var mesh  = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( { color: 0xc3e4e5} ));
      mesh.position.y = xDistance * i;
      mesh.position.z = zDistance * j;
      // mesh.position.y += 15;
      scene.add(mesh);
      targetList[i][j].push(mesh);
    }

    for(let j = 0; j < 4; j++){
      var mesh2  = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( { color: 0xc3e4e5} ));
      mesh2.position.y = xDistance * i;
      mesh2.position.z = zDistance * j;
      mesh2.position.x = 15;
      scene.add(mesh2);
      targetList[i][j].push(mesh2);
    }
    for(let j = 0; j < 4; j++){
      var mesh3  = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( { color: 0xc3e4e5} ));
      mesh3.position.y = xDistance * i;
      mesh3.position.z = zDistance * j;
      mesh3.position.x = 30;
      scene.add(mesh3);
      targetList[i][j].push(mesh3);
    }
    for(let j = 0; j < 4; j++){
      var mesh4  = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial( { color: 0xc3e4e5} ));
      mesh4.position.y = xDistance * i;
      mesh4.position.z = zDistance * j;
      mesh4.position.x = 45;
      scene.add(mesh4);
      targetList[i][j].push(mesh4);
    }
  }

}//-------------------------------------------------




function init() {
  // Renderer.
  renderer = new THREE.WebGLRenderer({antialias:true});
  // renderer = new THREE.WebGLRenderer();
  //renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // Add renderer to page
  document.body.appendChild(renderer.domElement);

  // Create camera.
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 150;
  camera.position.x = -50;
  camera.position.y = 110;


  // Add controls
  // controls = new THREE.TrackballControls( camera );
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.enableDamping = false;
  controls.addEventListener( 'change', render );
  controls.target.set(50,0,-50);

  // Create scene.
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xffffff );

  // Create directional light and add to scene.
  var pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
  var pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
  pointLight1.position.set(1, 1, 1).normalize();
  pointLight1.position.y = 110;
  pointLight2.position.set(1, 1, 1).normalize();
  pointLight2.position.y = 55;

  scene.add(pointLight1);
  scene.add(pointLight2);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  // Add listener for window resize.
  window.addEventListener('resize', onWindowResize, false);
}


// initialize object to perform world/screen calculations
projector = new THREE.Projector();
// when the mouse moves, call the given function
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener('touchend', onDocumentMouseDown, false);

for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    for (let k = 0; k < 4; k++) {
      targetList[i][j][k].name = i + "" + j + "" + k;
    }
  }
}

//HERE IS THE CLICK FUNCTION---------------------------------------------

document.body.appendChild(renderer.domElement);


function onDocumentMouseDown(event)
{


  // update the mouse variable
  if(event.type === 'mousedown'){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }else if(event.type === 'touchend'){
    mouse.x = (event.changedTouches[0].clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.changedTouches[0].clientY / window.innerHeight) * 2 + 1;
  }
  // find intersections
  // create a Ray with origin at the mouse position
  //   and direction into the scene (camera direction)
  var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
  projector.unprojectVector( vector, camera );
  var ray = new THREE.Raycaster();
  ray.setFromCamera( mouse, camera );

  intersects = ray.intersectObjects( scene.children );
  if (intersects.length > 0 && INTERSECTED != intersects[0].object)
  {

    INTERSECTED = intersects[0].object;
    console.log("The Intersected Node: " + INTERSECTED.name);

    if(flag && count != 64){
      turn(INTERSECTED, aiPlayer);
      console.log(count);
      INTERSECTED = null;
    }else if( !flag && count != 64){
      turn(INTERSECTED, huPlayer);
      console.log(count);
      INTERSECTED = null;
    }

  }



  if (winning(targetList, huPlayer)){
    if(alert('Red Win')){}
    else    window.location.reload();
  }else if (winning(targetList, aiPlayer)){
    if(alert('Blue Win')){}
    else    window.location.reload();
  }else if (count == 64){
    if(alert('Tie game')){}
    else    window.location.reload();
  }



}
//CLICK Function Ended--------------/////////////////////////////////////

function turn (point, player){
  if (point === undefined){
    console.log('Not here');
  } else if (player === huPlayer && point.material.emissive.equals(tie)) {
    point.material.emissive.setHex( 0xff0000 );
    flag = true;
    count++;
  } else if (player === aiPlayer && point.material.emissive.equals(tie)) {

    point.material.emissive.setHex( 0x0000ff );
    flag = false;
    count++;
  }
  console.log(count);
}


function animate() {
  requestAnimationFrame(animate);
  render();
  controls.update();

}

function render() {
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  // controls.handleResize();
}

function winning(list, player){
  let win = false;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        (list[i][0][j].material.emissive.equals(player)
        && list[i][1][j].material.emissive.equals(player)
        && list[i][2][j].material.emissive.equals(player)
        && list[i][3][j].material.emissive.equals(player))||
        (list[i][j][0].material.emissive.equals(player)
        && list[i][j][1].material.emissive.equals(player)
        && list[i][j][2].material.emissive.equals(player)
        && list[i][j][3].material.emissive.equals(player))||
        (list[i][0][3].material.emissive.equals(player)
        && list[i][1][2].material.emissive.equals(player)
        && list[i][2][1].material.emissive.equals(player)
        && list[i][3][0].material.emissive.equals(player))||
        (list[i][3][3].material.emissive.equals(player)
        && list[i][2][2].material.emissive.equals(player)
        && list[i][1][1].material.emissive.equals(player)
        && list[i][0][0].material.emissive.equals(player))||
        (list[0][i][j].material.emissive.equals(player)
        && list[1][i][j].material.emissive.equals(player)
        && list[2][i][j].material.emissive.equals(player)
        && list[3][i][j].material.emissive.equals(player))||
        (list[0][i][3].material.emissive.equals(player)
        && list[1][i][2].material.emissive.equals(player)
        && list[2][i][1].material.emissive.equals(player)
        && list[3][i][0].material.emissive.equals(player))||
        (list[0][0][i].material.emissive.equals(player)
        && list[1][1][i].material.emissive.equals(player)
        && list[2][2][i].material.emissive.equals(player)
        && list[3][3][i].material.emissive.equals(player))||
        (list[0][i][0].material.emissive.equals(player)
        && list[1][i][1].material.emissive.equals(player)
        && list[2][i][2].material.emissive.equals(player)
        && list[3][i][3].material.emissive.equals(player))||
        (list[0][3][i].material.emissive.equals(player)
        && list[1][2][i].material.emissive.equals(player)
        && list[2][1][i].material.emissive.equals(player)
        && list[3][0][i].material.emissive.equals(player))||
        (list[0][0][3].material.emissive.equals(player)
        && list[1][1][2].material.emissive.equals(player)
        && list[2][2][1].material.emissive.equals(player)
        && list[3][3][0].material.emissive.equals(player))||
        (list[0][0][0].material.emissive.equals(player)
        && list[1][1][1].material.emissive.equals(player)
        && list[2][2][2].material.emissive.equals(player)
        && list[3][3][3].material.emissive.equals(player))||
        (list[0][3][3].material.emissive.equals(player)
        && list[1][2][2].material.emissive.equals(player)
        && list[2][1][1].material.emissive.equals(player)
        && list[3][0][0].material.emissive.equals(player))||
        (list[0][3][0].material.emissive.equals(player)
        && list[1][2][1].material.emissive.equals(player)
        && list[2][1][2].material.emissive.equals(player)
        && list[3][0][3].material.emissive.equals(player))
      ) {
        win = true;
      }

    }
  }
  return win;

}
