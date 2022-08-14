
//https://cdn.skypack.dev/three
import * as THREE from '../deps/three.js';
import { OrbitControls } from '../deps/OrbitControls.js';
import { GLTFExporter } from '../deps/GLTFExporter.js';
import { GUI } from '../deps/dat.gui.min.js';
import MushroomGenerator from './MushroomGenerator.js';
import Random from './Random.js';
import tokenData from './tokenData.js';

let hash = tokenData.hash;
let R = new Random();

//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.z = 300;
// camera.scale.set(0.01, 0.01, 0.01);
let myGenerator, numIter = 7, mushy, scaler = 1.5, inputAngle = 0;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let light1, light2;




// default L-System rules
let myRules = {
    K: 'I',
    L: 'KLK',
    I: 'LL',
    J: '',
    seed: 'I'
}
//default colors per type of structure
let myColors = {
    K: new THREE.Color(0x823F27),
    L: new THREE.Color(0x363E5A),
    I: new THREE.Color(0xF0F5F9),
    J: new THREE.Color(0xFF0000)
}
let wireframeMode = true;
const pointA = new THREE.Vector3(0, -1, -1);
const pointB = new THREE.Vector3(0, 1, -1);
const pointC = new THREE.Vector3(0, -1, 1);
const pointD = new THREE.Vector3(0, 1, 1);
const pointList = [pointA, pointB, pointC, pointD];


//setup gui controls
const guiControls = new function() {
    this.kRule = myRules.K,
    this.lRule = myRules.L,
    this.iRule = myRules.I,
    this.seed = myRules.seed,
    this.numIter = numIter,
    this.wireframe = true,
    this.angle = Math.PI;
    // this.exportScene = exportScene;
}

//create the guicontrols and listen for changes
const gui = new GUI();
const animationFolder = gui.addFolder('Mushroom');
const kListener = animationFolder.add(guiControls, 'kRule');
const lListener = animationFolder.add(guiControls, 'lRule');
const iListener = animationFolder.add(guiControls, 'iRule');
const seedListener = animationFolder.add(guiControls, 'seed');
const numListener = animationFolder.add(guiControls, 'numIter');
const wireframeListener = animationFolder.add(guiControls, 'wireframe');
const myAngle = animationFolder.add(guiControls, 'angle', 0, Math.PI, 0.01);
// animationFolder.add(guiControls, "exportScene").name("Export Scene");
animationFolder.open();

//listeners for gui changes
kListener.onFinishChange( (text) => {
    if(text.length == 1) {
        myRules.K = text;
        updateMushroom();
    } else {

    }
});
lListener.onFinishChange( (text) => {
    if(text.length == 3){
        myRules.L = text;
        updateMushroom();
    } else {
        //print error
    }
});
iListener.onFinishChange( (text) => {
    if(text.length == 2) {
        myRules.I = text;
        updateMushroom();
    } else {

    }
});
seedListener.onFinishChange((text) => {
    myRules.seed = text;
    updateMushroom();
})
numListener.onFinishChange((text) => {
    numIter = text;
    updateMushroom();
})
numListener.step(1);
wireframeListener.onFinishChange((boolean) => {
    console.log(boolean)
    wireframeMode = boolean;
    updateMushroom();
});
myAngle.onFinishChange((angle) => {
    inputAngle = angle;
    updateMushroom();
})


const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener( 'resize', onWindowResize );

//initialize mushroom
updateMushroom();



function animate() {
    requestAnimationFrame( animate );
    // mesh.rotation.x += 0.01;
    // mesh.rotation.z += 0.01;
    controls.update();
    renderer.render( scene, camera );
};

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function updateMushroom() {
    console.log("updating mushroom");

    //remove previous objects
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    //add new ones
    myGenerator = new MushroomGenerator(myRules, myColors, wireframeMode, scaler);
    mushy = myGenerator.createMushroom(pointList, numIter, inputAngle);
    scene.add(mushy);
    scene.add( new THREE.AmbientLight( 0x777777 ) );

    light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, - 1, 0 );
    scene.add( light2 );
}



