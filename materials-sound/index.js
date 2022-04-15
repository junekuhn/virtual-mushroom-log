/*
the purpose of this sketch is to start workin with materials
and sound where the materials are computational and the sound 
reflects the texture of the material
*/
//https://cdn.skypack.dev/three
import * as THREE from '../deps/three.js';
import { OrbitControls } from '../deps/OrbitControls.js';
import { GUI } from '../deps/dat.gui.min.js';
import ParticleSystem from "./ParticleSystem.js";
import "../deps/helpers.js";

//setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 27, window.innerWidth / window.innerHeight, 1, 3500 );
camera.position.z = 300;
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//

scene.add( new THREE.AmbientLight( 0x444444 ) );

const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
light1.position.set( 1, 1, 1 );
scene.add( light1 );

const light2 = new THREE.DirectionalLight( 0xffffff, 1.5 );
light2.position.set( 0, - 1, 0 );
scene.add( light2 );
// const geometry = new THREE.BufferGeometry();

const controls = new OrbitControls(camera, renderer.domElement);


//add listeners to the camera and a positional audio
const listener = new THREE.AudioListener();
camera.add(listener);
const posAudio = new THREE.PositionalAudio(listener);
posAudio.setRefDistance(15);

//create Oscillator
const oscil = listener.context.createOscillator();
oscil.type = 'square';
oscil.frequency.value = '440';
oscil.volume = 0.6;
oscil.start();

const mod = listener.context.createOscillator();
mod.type = 'sine';
mod.frequency.value = '200';
mod.volume = 0.5;
mod.start()

const modGain = listener.context.createGain();
modGain.gain.value = 100;

//connect things together
mod.connect(modGain);
modGain.connect(oscil.frequency);
posAudio.setVolume(1);
posAudio.setNodeSource(oscil);
plane.add(posAudio)

window.addEventListener( 'resize', onWindowResize );

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
