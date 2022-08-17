
//https://cdn.skypack.dev/three
import * as THREE from '../deps/three.js';
import { OrbitControls } from '../deps/OrbitControls.js';
import { GLTFExporter } from '../deps/GLTFExporter.js';
import MushroomGenerator from './MushroomGenerator.js';
import Random from './Random.js';
import tokenData from './tokenData.js';

/* CSS HEX */
const palettes = {
    "0":[0x4c956c,0xfefee3,0xffc9b9,0xd68c45],
    "1":[0x823F27,0x363E5A,0xF0F5F9,0xFF0000],
    "2":[0x96cdff,0xd8e1ff,0xdbbadd,0xbe92a2],
    "3":[0x7a6c5d,0x2a3d45,0xddc9b4,0xbcac9b],
}

let hash = tokenData.hash;
let R = new Random();

//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.z = 300;
// camera.scale.set(0.01, 0.01, 0.01);
let myGenerator, numIter = R.random_int(5, 12), mushy, scaler = R.random_num(1.1, 1.9), inputAngle = R.random_num(0, 1);

let wireframeMushroomGen, wireFrameMushroom

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
let light1, light2;

// default L-System rules
let myRules = {
    K: ruleLookup(R.random_int(2,3)),
    L: ruleLookup(R.random_int(1,2))+ruleLookup(R.random_int(0,3))+ruleLookup(R.random_int(1,2)),
    I: ruleLookup(R.random_int(1,3))+ruleLookup(R.random_int(1,3)),
    J: '',
    seed: ruleLookup(R.random_int(1,2))
}
console.log(myRules);
//default colors per type of structure

const random_palette = R.random_int(0,Object.keys(palettes).length-1);

let myColors = {
    K: new THREE.Color(palettes[random_palette][0]),
    L: new THREE.Color(palettes[random_palette][1]),
    I: new THREE.Color(palettes[random_palette][2]),
    J: new THREE.Color(palettes[random_palette][3])
}
let wireframeMode = false;
const pointA = new THREE.Vector3(0, -1, -1);
const pointB = new THREE.Vector3(0, 1, -1);
const pointC = new THREE.Vector3(0, -1, 1);
const pointD = new THREE.Vector3(0, 1, 1);
const pointList = [pointA, pointB, pointC, pointD];

const pointE = new THREE.Vector3(10, -1, -1);
const pointF = new THREE.Vector3(10, 1, -1);
const pointG = new THREE.Vector3(10, -1, 1);
const pointH = new THREE.Vector3(10, 1, 1);
const pointListW = [pointE, pointF, pointG, pointH];


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

    wireframeMushroomGen = new MushroomGenerator(myRules, myColors, true, scaler);
    wireFrameMushroom = wireframeMushroomGen.createMushroom(pointList, numIter, inputAngle);

    scene.add(mushy);
    scene.add(wireFrameMushroom);
    scene.add( new THREE.AmbientLight( 0x777777 ) );

    light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( 1, 1, 1 );
    scene.add( light1 );

    light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
    light2.position.set( 0, - 1, 0 );
    scene.add( light2 );
}

function ruleLookup(number) {
    let numBranches;
    switch(number) {
        case 0:
            numBranches = 'J';
            break;
        case 1:
            numBranches = 'K';
            break;
        case 2:
            numBranches = 'I';
            break;
        case 3:
            numBranches = 'L';
            break;
        default:
            break;
    }
    return numBranches;
}





