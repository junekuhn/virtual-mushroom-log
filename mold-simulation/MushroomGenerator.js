import "../deps/helpers.js"

import * as THREE from '../deps/three.js';

class MushroomGenerator {
    constructor(lSystemRules, colors, wireframeMode, scaler) {
        this.rules = lSystemRules;
        this.colors = colors;
        this.wireframeMode = wireframeMode;
        this.scaler = scaler;
    }

    createMushroom(fourPoints, numIter=1, angle) {

        this.myFanPoints = {
            positions: [],
            indices: [],
            colors: [],
            //k represents the seed, and n represents the end
            nextRow: this.rules.seed,
            structure: '',
            currentIndex: 0,
            numIter: numIter
        };

        const pointA = fourPoints[0];
        const pointB = fourPoints[1];
        const pointC = fourPoints[2];
        const pointD = fourPoints[3];

        //initialize the first two points in the object
        this.myFanPoints.positions.push(pointA.x, pointA.y, pointA.z);
        this.myFanPoints.positions.push(pointB.x, pointB.y, pointB.z);
        this.myFanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
        this.myFanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);

        //initialize the second two points in the object
        this.myFanPoints.positions.push(pointC.x, pointC.y, pointC.z);
        this.myFanPoints.positions.push(pointD.x, pointD.y, pointD.z);

        //create the first two faces
        this.myFanPoints.indices.push(0, 3, 1);
        this.myFanPoints.indices.push(0, 2, 3);
        this.myFanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
        this.myFanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);

        console.log("before creating points" + this.myFanPoints.positions);
        console.log(this.myFanPoints.colors);

        this.createFanPoints(numIter, this.myFanPoints, angle);

        console.log("after creating points" + this.myFanPoints.indices);
        console.log("positions + " + this.myFanPoints.positions);
        console.log("resulting structure" + this.myFanPoints.structure);

        const mushroomMesh = this.createMushroomMesh(this.myFanPoints);
       
        return mushroomMesh;
    }

    createFanPoints(numIter, fanPoints, angle) {

        console.log(numIter + "is the remaining rows");
        let scalingYFactor = (fanPoints.numIter - numIter)*0.03 +1;
        //starting radius of 2, then increase by 1 per row
        let radius = this.scaler**(fanPoints.numIter - numIter)+2;

        const currentRow = fanPoints.nextRow;
        console.log(currentRow)
        // will always be the number of letters + the final vertex
        let rowPointsLength;
        rowPointsLength = currentRow.length+1;
        fanPoints.nextRow = '';
        let nextRowLength = 0;
        let weirdRowLength = rowPointsLength;
        let myNextRow = 0;

        for(let i = 0; i< currentRow.length; i++) {
            myNextRow += this.ruleLookup(currentRow[i]);
            console.log(myNextRow + "current")
            // to account for the first point
        }
        myNextRow++;

        if(numIter == 0 || currentRow.length == 0) {
            //add the last faces on the far end of the mushroom
            //there is a forloop but no switch

            for(let i = 0; i<currentRow.length; i++) {
                fanPoints.indices.push(
                    fanPoints.currentIndex+1, 
                    fanPoints.currentIndex+rowPointsLength,
                    fanPoints.currentIndex 
                );

                //push(5,6,7);
                fanPoints.indices.push(
                    fanPoints.currentIndex+1, 
                    fanPoints.currentIndex+rowPointsLength+1,
                    fanPoints.currentIndex+rowPointsLength,
                );

                fanPoints.currentIndex++;
            }

            return;
        }

        // console.log(myNextRow + " my next row")
        let thetaStep;
        if(myNextRow==1) {
            thetaStep = Math.PI
        } else {
            thetaStep = (Math.PI + angle) / (myNextRow-1);
        }
        // console.log(thetaStep + " is theta step")
        let rowPointsCounter = 0;


        //create the first fan
        for(let i = 0; i<currentRow.length; i++) {

            //pull pointA
            const pointA = this.getPositionByIndex(fanPoints.currentIndex);
            //pull pointB
            const pointB = this.getPositionByIndex(fanPoints.currentIndex+1);

            //weird row!!
            // where I have to calculate the remaining length of the current row 
            // and add that to the length of the first bit of the next row
            weirdRowLength = rowPointsLength-i+fanPoints.nextRow.length;
            let zero = fanPoints.currentIndex;
            let one = fanPoints.currentIndex+1;
            let four = fanPoints.currentIndex+rowPointsLength+weirdRowLength;
            let five = fanPoints.currentIndex+rowPointsLength+weirdRowLength+1;
            let six = fanPoints.currentIndex+rowPointsLength+weirdRowLength+2;
            let seven = fanPoints.currentIndex+rowPointsLength+weirdRowLength+3;



    
            switch(currentRow[i]) {
                case 'K':
                    //merge branches by not pushing the first point
                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointA.z
                        );
                        rowPointsCounter++;
                    }
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;

                    //counterclockwise indices
                    fanPoints.indices.push(zero, five, four);
                    fanPoints.indices.push(zero, one, five);

                    if(i<1) fanPoints.colors.push(this.colors.K.r, this.colors.K.g, this.colors.K.b);
                    fanPoints.colors.push(this.colors.K.r, this.colors.K.g, this.colors.K.b);

                    fanPoints.nextRow += this.rules.K;
                    //in units of vectices
                    fanPoints.structure += 'K';
                    break;
                case 'J':
                    //merge branches by not pushing the first point
                    if(i<1) {
                        rowPointsCounter+= 0.5;
                        console.log(thetaStep);
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointA.z
                        );
                        rowPointsCounter+= 0.5;
                    }

            
                    fanPoints.indices.push(zero, one, four);

                    if(i<1) fanPoints.colors.push(this.colors.J.r, this.colors.J.g, this.colors.J.b);
                    
                    fanPoints.nextRow += this.rules.J;
                    fanPoints.structure += 'J';
                    break;
                case 'L':
                    //merge branches by not pushing the first point
                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointA.z
                        );
                        rowPointsCounter++;
                    }
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;           
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;

//generate the three triangles

                    fanPoints.indices.push(zero, five, four);
                    fanPoints.indices.push(zero, one, five);
                    fanPoints.indices.push(one, six, five);
                    fanPoints.indices.push(one, seven, six)

                    if(i<1) fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);

                    fanPoints.nextRow += this.rules.L;
                    fanPoints.structure += 'L';
                    nextRowLength = fanPoints.nextRow.length+1;
                    break;
                case 'I':
                    const midY = pointA.y + (pointB.y - pointA.y) /2 ;

                    //merge branches by not pushing the first point
                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointA.z
                        );
                        rowPointsCounter++;
                    }
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointA.z);
                    rowPointsCounter++;


                    //generate the three triangles
                    fanPoints.indices.push(zero, five, four);
                    fanPoints.indices.push(zero, one, five);
                    fanPoints.indices.push(one, six, five);


                    fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
                    fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);

                    if(i<1) {
                        fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
                    }

                    fanPoints.nextRow += this.rules.I;
                    fanPoints.structure += 'I';
                    break;
                default:
                    break;

            }
            //should be equal to the amount of points pushed
            nextRowLength = fanPoints.nextRow.length+1;
            fanPoints.currentIndex++;
        }


        fanPoints.currentIndex++;

        // we should have an idea what the next row is going to
        // be therefore we'll know the length

        //create the side face on the left side
        // no switch and no for loop
        // no positions either
        // at this point the index should be at the end of the first fan
        //push(2,6,4)
        console.log(nextRowLength + "next row length");
        fanPoints.indices.push(
            fanPoints.currentIndex,
            fanPoints.currentIndex+rowPointsLength,
            fanPoints.currentIndex+rowPointsLength+nextRowLength,
        );
        //push(2,4,0)
        fanPoints.indices.push(
            fanPoints.currentIndex,
            fanPoints.currentIndex-rowPointsLength,
            fanPoints.currentIndex+rowPointsLength,
        );
        // fanPoints.colors.push(1, 1, 1);
        // fanPoints.colors.push(1, 1, 1);

        let rowLengthTracker = 0
        rowPointsCounter = 0;
        //create the second fan
        for(let i = 0; i<currentRow.length; i++) {

            //pull pointC
            const pointC = this.getPositionByIndex(fanPoints.currentIndex);
            //pull pointD
            const pointD = this.getPositionByIndex(fanPoints.currentIndex+1);

            weirdRowLength = rowPointsLength-i+rowLengthTracker;
            let zero = fanPoints.currentIndex;
            let one = fanPoints.currentIndex+1;
            let four = fanPoints.currentIndex+nextRowLength+weirdRowLength;
            let five = fanPoints.currentIndex+nextRowLength+weirdRowLength+1;
            let six = fanPoints.currentIndex+nextRowLength+weirdRowLength+2;
            let seven = fanPoints.currentIndex+nextRowLength+weirdRowLength+3;


            switch(currentRow[i]) {
                case 'K':

                    //merge branches by not pushing the first point
                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointC.z
                        );
                        rowPointsCounter ++;
                    }
                    // rowPointsCounter+=0.5;
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointC.z);
                    // rowPointsCounter+=0.5;
                    rowPointsCounter++;


                    //counterclockwise indice
                    // fanPoints.indices.push(0, 5, 4)
                    //fanPoints.indices.push(0, 1, 5)
                    fanPoints.indices.push(zero, four, five);
                    fanPoints.indices.push(zero, five, one);

                    if(i<1) fanPoints.colors.push(this.colors.K.r, this.colors.K.g, this.colors.K.b);
                    fanPoints.colors.push(this.colors.K.r, this.colors.K.g, this.colors.K.b);

                    rowLengthTracker += 1;
                    break;
                case 'J':
                    // for this one we only create one point to make a triangular shape
                    //merge branches by not pushing the first point
                    if(i<1) {
                        rowPointsCounter += 0.5;
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointC.z
                        );
                        rowPointsCounter += 0.5;
                    }

                    fanPoints.indices.push(zero, four, one);

                    if(i<1) fanPoints.colors.push(this.colors.J.r, this.colors.J.g, this.colors.J.b);
                    break;
                case 'I':
                    const midY = pointC.y + (pointD.y - pointC.y) /2 ;

                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointC.z
                            );
                        rowPointsCounter++;
                    }
                    fanPoints.positions.push(
                        radius*Math.sin(thetaStep*rowPointsCounter),
                        -radius*Math.cos(thetaStep*rowPointsCounter),
                        pointC.z
                        );
                        rowPointsCounter++;
                    fanPoints.positions.push(
                        radius*Math.sin(thetaStep*rowPointsCounter),
                        -radius*Math.cos(thetaStep*rowPointsCounter),
                        pointD.z
                        );
                        rowPointsCounter++;

                    //generate the three triangles
                    //(2,7,8)
                    fanPoints.indices.push(zero, four, five);
                    //(2,8,3)
                    fanPoints.indices.push(zero, five, one);
                    //(3,8,9)
                    fanPoints.indices.push(one, five, six);

                    if(i<1) fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
                    fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);
                    fanPoints.colors.push(this.colors.I.r, this.colors.I.g, this.colors.I.b);

                    rowLengthTracker += 2;
                    break;
               case 'L':
                    //merge branches by not pushing the first point
                    if(i<1) {
                        fanPoints.positions.push(
                            radius*Math.sin(thetaStep*rowPointsCounter),
                            -radius*Math.cos(thetaStep*rowPointsCounter),
                            pointC.z
                        );
                        rowPointsCounter ++;
                    }
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointC.z);
                    rowPointsCounter++;
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointC.z);
                    rowPointsCounter++;
                    fanPoints.positions.push(radius*Math.sin(thetaStep*rowPointsCounter), -radius*Math.cos(thetaStep*rowPointsCounter), pointC.z);
                    rowPointsCounter++;

                    //generate the three triangles
                    //(2,7,8)
                    fanPoints.indices.push(zero, four, five);
                    //(2,8,3)
                    fanPoints.indices.push(zero, five, one);
                    //(3,8,9)
                    fanPoints.indices.push(one, five, six);
                    //(1, 7, 6)
                    fanPoints.indices.push(one, six, seven);


                    if(i<1) fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);
                    fanPoints.colors.push(this.colors.L.r, this.colors.L.g, this.colors.L.b);

                    rowLengthTracker += 3;
                    break;
                default:
                    break;

            }

            fanPoints.currentIndex++;
        }

        
        fanPoints.indices.push(
            fanPoints.currentIndex-rowPointsLength, //1
            fanPoints.currentIndex+nextRowLength*2, //7
            fanPoints.currentIndex+nextRowLength, //5
        );
        fanPoints.indices.push(
            fanPoints.currentIndex-rowPointsLength,  //1
            fanPoints.currentIndex,//3
            fanPoints.currentIndex+nextRowLength*2, //7
        );
        
        console.log(fanPoints.positions.length);

        //indicating the end of a row
        fanPoints.structure += 'N';
        fanPoints.currentIndex++;


        this.createFanPoints(numIter-1, fanPoints, angle);
    }

    createMushroomMesh(upperFanPoints) {
        const geometry = new THREE.BufferGeometry();
        geometry.setIndex(upperFanPoints.indices);
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( upperFanPoints.positions, 3 ));
        geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( upperFanPoints.colors, 3 ));
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial( {
            // color: 0xaaaaaa, specular: 0xffffff, shininess: 250,
            // side: THREE.DoubleSide,
            vertexColors: true, 
            transparent: true,
        } );

        const wires = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments( wires);
        line.material.depthTest = false;
        line.material.opacity = 0.9;
        line.material.transparent = true;

        const mesh = new THREE.Mesh( geometry, material );

        if(this.wireframeMode) return line;
        else return mesh;
    }

    getPositionByIndex(index) {
        return new THREE.Vector3(
            this.myFanPoints.positions[index*3],
            this.myFanPoints.positions[index*3+1],
            this.myFanPoints.positions[index*3+2]
        );
    }

    ruleLookup(letter) {
        let numBranches = 0;
        switch(letter) {
            case 'K':
                numBranches = 1;
                break;
            case 'J':
                numBranches = 0;
                break;
            case 'L':
                numBranches = 3;
                break;
            case 'I':
                numBranches = 2;
                break;
            default:
                break;
        }
        return numBranches;
    }
}

export default MushroomGenerator;
