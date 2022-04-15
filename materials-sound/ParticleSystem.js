import "../deps/helpers.js"

import * as THREE from '../deps/three.js';
// ssssssssssssssssss#include "ParticleSystem.h"
// #include "helpers.h"

// //--------------------------------------------------------------
// void ParticleSystem::setupPlane(int gridSizeX, int gridSizeY, float planeRangeX, float planeRangeY, ofPrimitiveMode displayMode) {
// 	// Clear any existing particle and mesh data
// 	myParticles.clear();
// 	myMesh.clear();

// 	// Store grid size values into member variables
// 	myGridSizeX = gridSizeX;
// 	myGridSizeY = gridSizeY;

// 	// Set the display modeå
// 	myMesh.setMode(myDisplayMode);

// 	// Initialize the particles
// 	for (int i = 0; i < myGridSizeX; i++)
// 		for (int j = 0; j < myGridSizeY; j++) {
// 			vec3 pos = vec3(
// 				ofMap(i, 0, myGridSizeX - 1, -0.5 * planeRangeX, 0.5 * planeRangeX),
// 				0.0,
// 				ofMap(j, 0, myGridSizeY - 1, -0.5 * planeRangeY, 0.5 * planeRangeY));
// 			vec3 dir = vec3(0, 1, 0);
// 			Particle par;
// 			par.setup(pos, dir);
// 			myParticles.push_back(par);

// 			myMesh.addVertex(pos);
// 		}

// 	// Create a vertex for each particle
// 	for (int i = 0; i < myParticles.size(); i++) {
// 		vec3 pos = myParticles[i].getPos();
// 	}

// 	// Initialize the mesh
// 	if (myDisplayMode == OF_PRIMITIVE_POINTS) {
// 		// For points we don't need to declare anything more
// 	}
// 	else if (myDisplayMode == OF_PRIMITIVE_LINES) {
// 		// Declare lines connecting the vertices in a square grid using the vertex indices
// 		// We add lines by creating a list of pairs of vertex indices that should be
// 		// connected by lines
// 		for (int i = 0; i < myGridSizeX; i++) {
// 			for (int j = 0; j < myGridSizeY; j++) {
// 				if (i < myGridSizeX - 1) {
// 					myMesh.addIndex(getParticleIndex(i, j));
// 					myMesh.addIndex(getParticleIndex(i + 1, j));
// 				}

// 				if (j < myGridSizeY - 1) {
// 					myMesh.addIndex(getParticleIndex(i, j));
// 					myMesh.addIndex(getParticleIndex(i, j + 1));
// 				}
// 			}
// 		}
// 	}
// 	else if (myDisplayMode == OF_PRIMITIVE_TRIANGLES) {
// 		// Declare two triangles for each square in the grid
// 		for (int i = 0; i < myGridSizeX - 1; i++) {
// 			for (int j = 0; j < myGridSizeY - 1; j++) {
// 				myMesh.addTriangle(
// 					getParticleIndex(i, j),
// 					getParticleIndex(i + 1, j + 1),
// 					getParticleIndex(i + 1, j));

// 				myMesh.addTriangle(
// 					getParticleIndex(i, j),
// 					getParticleIndex(i, j + 1),
// 					getParticleIndex(i + 1, j + 1));
// 			}
// 		}

// 		// Add a normal for each vertex. This can be done by calling the
// 		// calcNormals helper function
// 		calcNormals(myMesh);
// 	}
// 	else {
// 		ofLogError("ParticleSystem::setup, displayMode set to invalid value");
// 	}
// }

// //--------------------------------------------------------------
// void ParticleSystem::setupSphere(int gridSizeX, int gridSizeY, float sphereRadius, ofPrimitiveMode displayMode) {
// 	// Setting up particles into a initial spherical formation

// 	// Clear any existing particle and mesh data
// 	myParticles.clear();
// 	myMesh.clear();

// 	// Store grid size values into member variables
// 	myGridSizeX = gridSizeX;
// 	myGridSizeY = gridSizeY;

// 	// Set the display mode
// 	myDisplayMode = displayMode;
// 	myMesh.setMode(myDisplayMode);

// 	// Initialize the particles
// 	vec3 pos;
// 	for (int i = 0; i < myGridSizeX; i++)
// 		for (int j = 0; j < myGridSizeY; j++) {
// 			// Use spherical co-ordinates to calculate initial position
// 			float theta = ofDegToRad(ofMap(i, 0, myGridSizeX, 360.0, 0.0));
// 			float phi = ofDegToRad(ofMap(j, -1, myGridSizeY, 0.0, 180.0));
// 			vec3 pos = sphereRadius * vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta));
// 			vec3 dir = normalize(pos);
// 			Particle par;
// 			par.setup(pos, dir);
// 			myParticles.push_back(par);
// 		}

// 	// Create additional particles for the top and bottom
// 	Particle topParticle;
// 	topParticle.setup(vec3(0, sphereRadius, 0), vec3(0, 1, 0));
// 	int topParticleIndex = myParticles.size();
// 	myParticles.push_back(topParticle);

// 	Particle bottomParticle;
// 	bottomParticle.setup(vec3(0, -sphereRadius, 0), vec3(0, -1, 0));
// 	int bottomParticleIndex = myParticles.size();
// 	myParticles.push_back(bottomParticle);

// 	// Create a vertex for each particle
// 	for (int i = 0; i < myParticles.size(); i++) {
// 		vec3 pos = myParticles[i].getPos();
// 		myMesh.addVertex(pos);
// 	}

// 	// Initialize the mesh
// 	if (myDisplayMode == OF_PRIMITIVE_POINTS) {
// 		// For points we don't need to declare anything more
// 	}
// 	else if (myDisplayMode == OF_PRIMITIVE_LINES) {
// 		// Declare lines connecting the vertices in a square grid using the vertex indices
// 		// We add lines by creating a list of pairs of vertex indices that should be
// 		// connected by lines
// 		for (int i = 0; i < myGridSizeX; i++) {
// 			for (int j = 0; j < myGridSizeY; j++) {

// 				myMesh.addIndex(getParticleIndex(i, j));
// 				myMesh.addIndex(getParticleIndex(i + 1, j));

// 				if (j < myGridSizeY - 1) {
// 					myMesh.addIndex(getParticleIndex(i, j));
// 					myMesh.addIndex(getParticleIndex(i, j + 1));
// 				}
// 			}
// 		}

// 		// Connect the bottom and top verices to all the other vertices in the first and last rows
// 		for (int i = 0; i < myGridSizeX; i++) {
// 			myMesh.addIndex(topParticleIndex);
// 			myMesh.addIndex(getParticleIndex(i, 0));

// 			myMesh.addIndex(bottomParticleIndex);
// 			myMesh.addIndex(getParticleIndex(i, myGridSizeY - 1));
// 		}
// 	}
// 	else if (myDisplayMode == OF_PRIMITIVE_TRIANGLES) {
// 		// Declare two triangles for each square in the grid
// 		for (int i = 0; i < myGridSizeX; i++) {
// 			for (int j = 0; j < myGridSizeY - 1; j++) {
// 				myMesh.addTriangle(
// 					getParticleIndex(i, j),
// 					getParticleIndex(i + 1, j + 1),
// 					getParticleIndex(i + 1, j));

// 				myMesh.addTriangle(
// 					getParticleIndex(i, j),
// 					getParticleIndex(i, j + 1),
// 					getParticleIndex(i + 1, j + 1));
// 			}
// 		}

// 		// Connect the bottom and top verices to all the other vertices in the first and last rows
// 		for (int i = 0; i < myGridSizeX; i++) {
// 			myMesh.addTriangle(
// 				topParticleIndex,
// 				getParticleIndex(i + 1, 0),
// 				getParticleIndex(i, 0));

// 			myMesh.addTriangle(
// 				bottomParticleIndex,
// 				getParticleIndex(i, myGridSizeY - 1),
// 				getParticleIndex(i + 1, myGridSizeY - 1));
// 		}

// 		// Add a normal for each vertex. This can be done by calling the
// 		// calcNormals helper function
// 		calcNormals(myMesh);
// 	}
// 	else {
// 		ofLogError("ParticleSystem::setup, displayMode set to invalid value");
// 	}
// }

// //--------------------------------------------------------------
// void ParticleSystem::update(float amplitude, float frequency, float scale) {
// 	for (int i = 0; i < myParticles.size(); i++) {
// 		myParticles[i].update(amplitude, frequency, scale);
// 		myMesh.setVertex(i, myParticles[i].getPos());
// 	}


class ParticleSystem {
    constructor(numX, numY) {
        this.numX = numX;
        this.numY = numY;
    }

    createPlane( width, height) {

        const positions = [];
        const normals = [];
        const colors = [];
        const indices = [];

        //create vec3 vectices and add them to an array
        for(let i = 0; i<this.numX; i++) {
            for (let j = 0; j<this.numY; j++) {
                let x = map(i, 0, this.numX, -0.5*width, 0.5*width);
                let y = map(j, 0, this.numY, -0.5*height, 0.5*height);
                let z = 0;
                positions.push(x,y,z);
                // normals.push(0, 0, 1);
                colors.push(1, 1, 1, 1);
                indices.push(
                    this.getParticleIndex(i,j), 
                    this.getParticleIndex(i, j+1),
                    this.getParticleIndex(i+1, j+1)
                    );
                indices.push(
                    this.getParticleIndex(i, j),
					this.getParticleIndex(i + 1, j + 1),
					this.getParticleIndex(i + 1, j)
                    );
            }
        }

        

        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ));
        // geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ));
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 4 ));
        geometry.computeVertexNormals();
        // geometry.computeBoundingSphere();

        const material = new THREE.MeshPhongMaterial( {
            // color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            side: THREE.DoubleSide, vertexColors: true, transparent: true,
        } );

        console.log(geometry);

        const mesh = new THREE.Mesh( geometry, material );
        return mesh;
    }

    // int ParticleSystem::getParticleIndex(int x, int y) {
// 	x = ofWrap(x, 0, myGridSizeX);
// 	y = ofWrap(y, 0, myGridSizeY);
// 	return myGridSizeY * x + y;
// }
    getParticleIndex(x, y) {
        x = x % this.numX;
        y = y % this.numY;
        return this.numY*x + y;
    }
}

export default ParticleSystem;


function map(n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}