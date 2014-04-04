var camera, scene, projector, renderer;
var objects = [];
var balls = [[],[],[],[],[],[]];
var turn = 0;
var colour = 0xFFFFFF;
var pivot;
var rotate = false;
var ydeg = 0;
var xdeg = 0;
var winners = [];
var win = false;
var tiecount = 0;

init();
animate();

function init() {
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 500);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 100;

scene.add(camera);

renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000, 1);
renderer.sortObjects = false;
//document.body.appendChild( renderer.domElement );
var container = document.getElementById("board");
document.body.appendChild(container);
container.appendChild(renderer.domElement);

pivot = new THREE.Object3D();
board = addBoard();
col1 = makeCol(0);
col2 = makeCol(1);
col3 = makeCol(2);
col4 = makeCol(3);
col5 = makeCol(4);
col6 = makeCol(5);
col7 = makeCol(6);

col1.col = 0;
col2.col = 1;
col3.col = 2;
col4.col = 3;
col5.col = 4;
col6.col = 5;
col7.col = 6;

objects.push(col1);
objects.push(col2);
objects.push(col3);
objects.push(col4);
objects.push(col5);
objects.push(col6);
objects.push(col7);

pivot = new THREE.Object3D();
pivot.add(col1);
pivot.add(col2);
pivot.add(col3);
pivot.add(col4);
pivot.add(col5);
pivot.add(col6);
pivot.add(col7);

scene.add(pivot);

var ballgeometry = new THREE.SphereGeometry(4,20,20);
row = -1;
for (i=0; i<42; i++) {
	var mesh = new THREE.Mesh(ballgeometry, new THREE.MeshBasicMaterial({color : 0xFFFFFF}));

	if (i % 7 == 0) {
		row++;
	} 

	if (i % 7 == 0) {
		col = 0;
	} else {
		col++;
	}

	mesh.position.x = col * 10 - 35;
	mesh.position.y = row * 10 - 25;
	balls[row].push(mesh);
	scene.add(mesh);
	pivot.add(mesh);
}

projector = new THREE.Projector();
document.addEventListener("mousedown", mouseDown, false);

controls = new THREE.OrbitControls(camera, container);
controls.noPan = true;
controls.noRoll = true;
controls.domElement = document.body;

window.addEventListener('resize', onWindowResize, false);
}

function mouseDown(event) {
	//event.preventDefault();

	var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);

	var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
	var intersects = raycaster.intersectObjects(objects);

	if (intersects.length > 0) {
		col = intersects[0].object.col;
		tiecount = tiecount + 1;
		addChip(intersects[0].object.col);	
		var url = "placeChip/" + col;
		$.post(url, function (){
			return;
		});		
	} 
}

//function callMe() {
//	console.log("you rang?");
//}

function gameOver(row, col, colour) {

	win = false;

	count = 1;
	winners = []
	i = row;
	j = col;
	//up total
	while (i-1 >= 0 && balls[i-1][j].material.color.getHex() == colour) {
		winners.push([[i-1],[j]]);
		count += 1;
		i -= 1;
	}
	i = row;
	j = col;
	
	//down total
	while (i+1 <= 5 && balls[i+1][j].material.color.getHex() == colour) {
		winners.push([[i+1],[j]]);
		count += 1;
		i += 1;
	}

	if (count >= 4) {
		win = true;
	}
	
	if (!win) {
	//left total
	count = 1;
	winners = []
	i = row;
	j = col;
	while (j-1 >= 0 && balls[i][j-1].material.color.getHex() == colour) {
		winners.push([[i],[j-1]]);
		count += 1;
		j -= 1;
	}
	i = row;
	j = col;
	
	//right total
	while (j+1 <= 5 && balls[i][j+1].material.color.getHex() == colour) {
		winners.push([[i],[j+1]]);
		count += 1;
		j += 1;
	}

	if (count >= 4) {
		win = true;
	}
	}

	if (!win) {
	count = 1;
	winners = []
	i = row;
	j = col;
	//diag up right
	while (i-1 >= 0 && j-1 >=0 && balls[i-1][j-1].material.color.getHex() == colour) {
		winners.push([[i-1],[j-1]]);
		count += 1;
		i -= 1;
		j -= 1;
	}
	
	i = row;
	j = col;
	//diag down left
	while (i+1 <= 5 && j+1 <= 6 && balls[i+1][j+1].material.color.getHex() ==  colour) {
		winners.push([[i+1],[j+1]]);
		count += 1;
		i += 1;
		j += 1;
	}
	if (count >= 4) {
		win = true;
	}
	}

	if (!win) {
	count = 1;
	winners = []
	i = row;
	j = col;
	//diag up left
	while (i-1 >= 0 && j+1 <= 6 && balls[i-1][j+1].material.color.getHex() == colour) {
		winners.push([[i-1],[j+1]]);
		count += 1;
		i -= 1;
		j += 1;
	}

	i = row;
	j = col;

	//diag down right
	while (i + 1 <= 5 && j-1 >= 0 && balls[i+1][j-1].material.color.getHex() == colour) {
		winners.push([[i+1],[j-1]]);
		count += 1;
		i += 1;
		j -= 1;
	}
	if (count >= 4) {
		win = true;
	}
	}

	if (win) {
		winners.push([[row],[col]]);
		rotate = true;
		for (i = 0; i < 4; i++) {
			balls[winners[i][0]][winners[i][1]].material.color.setHex(0x0000FF);

		}

		var url = "youWin/";
		$.post(url, function (){
			return;
		});
	}

	if (tiecount == 42) {
		var url = "youTie/";
		$.post(url, function (){
			return;
		});
	}
}

function addChip(col) {

	//get next available position in this column
	row = 0;
	if (turn == 0) {
		colour = 0xFF0000;
	} else {
		colour = 0x000000;
	}
	for (i = 0; i < 6; i++) {
		if (balls[row][col].material.color.getHex() != 0xFFFFFF) {
			row++;
		}

	}
	if (row < 6) {
		balls[row][col].material.color.setHex(colour);
	}

	if (turn == 0) {
		turn = 1;
	} else {
		turn = 0;
	}

	if (row >= 0 && row <= 5 && col >= 0 && col <= 6) {
		gameOver(row, col, colour);
	}

}

function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

	if (rotate) {
		ydeg += 5;
		//xdeg += 5;
		if (ydeg == 360) {
			ydeg = 0;
		}
		//if (xdeg == 360) {
		//	xdeg = 0;
		//}
		pivot.rotation.y = THREE.Math.degToRad(ydeg);
		//pivot.rotation.x = THREE.Math.degToRad(xdeg);
	}
	if (win) {
		for (i = 0; i < 4; i++) {
			wincolour = Math.random() * 0xFFFFFF;
			balls[winners[i][0]][winners[i][1]].material.color.setHex(wincolour);
		}

	}
        requestAnimationFrame( animate );
        controls.update(1);
        renderer.render( scene, camera );
}

function makeCol(x) {
	var geometry = new THREE.CubeGeometry(10,60,2);
	var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color : 0xFFFF00}));
	mesh.position.x = x*10 -35;	
	return mesh;

}

function addBoard() {
	var geometry = new THREE.CubeGeometry(70,60,5);
	var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color : 0xffff00, transparent: true, opacity: 0.5}));
	mesh.position.x = 0;
	mesh.position.y = 0;
	return mesh;
}
