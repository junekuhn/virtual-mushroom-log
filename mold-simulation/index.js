/*
plans ----

modify the mesh to create a log looking thing 
add mushrooms

order of operations ----

select the points that will be affected for log maker
send regions to be operated on as if they were planes
maybe a plane would be a better starting place
this could also be made in blender without a three.js algorithm

--- this one is the important one ------
mushroom grower needs the four points to extrude from
l system where only the endpoints matter
the mushroom fans out from a single square
it's a flat fan with a some ripples or curling

*/
//https://cdn.skypack.dev/three
import * as THREE from '../deps/three.js';
import { OrbitControls } from '../deps/OrbitControls.js';
import { GLTFExporter } from '../deps/GLTFExporter.js';
import { GUI } from '../deps/dat.gui.min.js';
import "../deps/helpers.js";
import MushroomGenerator from './MushroomGenerator.js';

//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.z = 300;
// camera.scale.set(0.01, 0.01, 0.01);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//

scene.add( new THREE.AmbientLight( 0x777777 ) );

const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
light2.position.set( 0, - 1, 0 );
scene.add( light2 );
// const geometry = new THREE.BufferGeometry();
let myRules = {
    K: 'J',
    L: 'III',
    I: 'KK',
    J: '',
    seed: 'J'
}
let myColors = {
    K: new THREE.Color(0x823F27),
    L: new THREE.Color(0x363E5A),
    I: new THREE.Color(0xF0F5F9),
    J: new THREE.Color(0x5A6268)
}
let myGenerator = new MushroomGenerator(myRules, myColors);
const pointA = new THREE.Vector3(0, -1, -1);
const pointB = new THREE.Vector3(0, 1, -1);
const pointC = new THREE.Vector3(0, -1, 1);
const pointD = new THREE.Vector3(0, 1, 1);
const pointList = [pointA, pointB, pointC, pointD];
let numIter = 2;
let mushy = myGenerator.createMushroom(pointList, numIter);
scene.add( mushy );

const guiControls = new function() {
    this.kRule = myRules.K,
    this.lRule = myRules.L,
    this.iRule = myRules.I,
    this.seed = myRules.seed,
    this.numIter = numIter,
    this.kAngle = 90,
    this.lAngle = 90,
    this.iAngle = 90,
    this.exportScene = exportScene;
}

const gui = new GUI();
const animationFolder = gui.addFolder('Animation');
const kListener = animationFolder.add(guiControls, 'kRule');
const lListener = animationFolder.add(guiControls, 'lRule');
const iListener = animationFolder.add(guiControls, 'iRule');
const seedListener = animationFolder.add(guiControls, 'seed');
const numListener = animationFolder.add(guiControls, 'numIter');
animationFolder.add(guiControls, "exportScene").name("Export Scene");
animationFolder.add(guiControls, 'kAngle', 45, 135);
animationFolder.add(guiControls, 'lAngle', 60, 135);
animationFolder.add(guiControls, 'iAngle', 60, 135);
// animationFolder.onchange(animate);
animationFolder.open();

kListener.onFinishChange( (text) => {
    myRules.K = text;
    updateMushroom();
});
lListener.onFinishChange( (text) => {
    console.log("finish change")
    myRules.L = text;
    updateMushroom();
});
iListener.onFinishChange( (text) => {
    myRules.I = text;
    updateMushroom();
});
seedListener.onFinishChange((text) => {
    myRules.seed = text;
    updateMushroom();
})
numListener.onFinishChange((text) => {
    numIter = text;
    updateMushroom();
})


const controls = new OrbitControls(camera, renderer.domElement);
window.addEventListener( 'resize', onWindowResize );


// Instantiate a exporter
const exporter = new GLTFExporter();

function exportScene() {
    // Parse the input and generate the glTF output
    // const options = {
    //     trs: params.trs,
    //     onlyVisible: params.onlyVisible,
    //     truncateDrawRange: params.truncateDrawRange,
    //     binary: params.binary,
    //     maxTextureSize: params.maxTextureSize
    // };

    exporter.parse(
        scene,
        // called when the gltf has been generated
        function ( result ) {

            if ( result instanceof ArrayBuffer ) {

                saveArrayBuffer( result, 'scene.glb' );

            } else {

                const output = JSON.stringify( result, null, 2 );
                // console.log( output );
                saveString( output, 'scene.gltf' );

            }

        },
        // called when there is an error in the generation
        function ( error ) {

            console.log( 'An error happened' );

        }
    );
}


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

    // //remove previous objects
    // while(scene.children.length > 0){ 
    //     scene.remove(scene.children[0]); 
    // }

    //add new ones
    myGenerator = new MushroomGenerator(myRules, myColors);
    mushy = myGenerator.createMushroom(pointList, numIter);
    scene.add(mushy);
}

function saveString( text, filename ) {

    save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}


function saveArrayBuffer( buffer, filename ) {

    save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

}

const link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

function save( blob, filename ) {

    link.href = URL.createObjectURL( blob );
    link.download = filename;
    link.click();

    // URL.revokeObjectURL( url ); breaks Firefox...

}
