// background.js

window.addEventListener('DOMContentLoaded', function() {
	// All the following code is entered here

	// get the canvas DOM element
	var canvas = document.getElementById('renderCanvas');

	// load the 3D engine
	var engine = new BABYLON.Engine(canvas, true);

	var velocity = 0;

	// createScene function that creates and return the scene
	var createScene = function() {

		// create a basic BJS Scene object
		var scene = new BABYLON.Scene(engine);

		// create a FreeCamera, and set its position to (x:0, y:5, z:-10)
		// var camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0,-10), scene);

		// target the camera to scene origin
		// camera.setTarget(BABYLON.Vector3.Zero());

		var camera = new BABYLON.ArcRotateCamera("Camera", Math.PI/-2, 0, 10, BABYLON.Vector3.Zero(), scene);

		// attach the camera to the canvas
		camera.attachControl(canvas, true);

		// create a basic light, aiming 0,1,0 - meaning, to the sky
		var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0,0,2), scene);

		// create a built-in "sphere" shape;
		sphereDiameter = 1;
		var sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments: 4}, scene);
		cylinderHeight = 5;
		var cylinder1 = BABYLON.MeshBuilder.CreateCylinder("cylinder1", {height: cylinderHeight, tessellation: 6}, scene);
		var cylinder2 = BABYLON.MeshBuilder.CreateCylinder("cylinder2", {height: cylinderHeight, tessellation: 6}, scene);
		// var sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere2', {segments:4, diameter:1}, scene);
		var myPath = [
			new BABYLON.Vector3(-sphereDiameter/2, 0, sphereDiameter/2),
		 	new BABYLON.Vector3(0, 0, sphereDiameter/2)
		];
		// var line1c1c2 = BABYLON.MeshBuilder.CreateTube("line1c1c2", {path: myPath, radius: pointSize/2, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
		pointSize = 0.1;
		var point1c1 = BABYLON.MeshBuilder.CreateSphere('point1c1', {diameter: pointSize, segments:2}, scene);
		var point1c2 = BABYLON.MeshBuilder.CreateSphere('point1c2', {diameter: pointSize, segments:2}, scene);

		// move the sphere upward 1/2 of its height
		cylinder1.rotation.z += Math.PI/2;
		cylinder1.position.x -= cylinderHeight/2 + sphereDiameter/2;
		// sphere1.position.x = 2;
		// cylinder2.rotation.z += Math.PI/2;
		// cylinder2.position.x += cylinderHeight/2 + sphereDiameter/2;

		sphere1.parent = cylinder1;
		cylinder2.parent = sphere1;

		sphere1.translate(BABYLON.Axis.Y, -(cylinderHeight/2 + sphereDiameter/2), BABYLON.Space.LOCAL);
		// sphere1.rotate(BABYLON.Axis.X, Math.PI/2, BABYLON.Space.LOCAL);
		cylinder2.translate(BABYLON.Axis.Y, -(cylinderHeight/2 + sphereDiameter/2), BABYLON.Space.LOCAL);

		point1c1.parent = cylinder1;
		point1c2.parent = cylinder2;
		point1c1.translate(BABYLON.Axis.Y, -cylinderHeight/2, BABYLON.Space.LOCAL);
		point1c1.translate(BABYLON.Axis.Z, sphereDiameter/2, BABYLON.Space.LOCAL);
		point1c2.translate(BABYLON.Axis.Y, cylinderHeight/2 + 3*sphereDiameter/4, BABYLON.Space.LOCAL);
		point1c2.translate(BABYLON.Axis.Z, sphereDiameter/2, BABYLON.Space.LOCAL);
		var line1c1c2Path = [point1c1.getAbsolutePosition(),point1c2.getAbsolutePosition()];
		var line1c1c2 = BABYLON.MeshBuilder.CreateTube("line1c1c2", {path: line1c1c2Path, radius: pointSize/2, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
		// console.log(point1c1.getAbsolutePosition());
		// console.log(point1c1.position);
		// create a built-in "ground" shape; 
		// var ground = BABYLON.MeshBuilder.CreateGround('ground1', {height:6, width:6, subdivisions: 2}, scene);
		var angle = 0, deltaAngle = 0.01;

		scene.registerBeforeRender(function(){
			// console.log(cylinder2.position)
			tempAngle = angle;
			angle += deltaAngle;
			if(angle > 100 * Math.PI / 180 || angle < 0) {deltaAngle *= -1;}
			// sphere1.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(BABYLON.Axis.X, angle);
			sphere1.rotate(BABYLON.Axis.X, angle-tempAngle, BABYLON.Space.LOCAL);
			line1c1c2Path = [point1c1.getAbsolutePosition(),point1c2.getAbsolutePosition()];
			line1c1c2 = BABYLON.MeshBuilder.CreateTube("line1c1c2", {path: line1c1c2Path, radius: pointSize/2, instance: line1c1c2}, scene);

			var distVec = new BABYLON.Vector3(line1c1c2Path[0].x-line1c1c2Path[1].x,line1c1c2Path[0].y-line1c1c2Path[1].y,line1c1c2Path[0].z-line1c1c2Path[1].z);
			// console.log(distVec.length())
			// code for reverse dof calculation
		});

		// return the created scene
		return scene;
	}
	// call the createScene function
	var scene = createScene();

	// run the render loop
	engine.runRenderLoop(function(){
		scene.render();
	});

	// the canvas/window resize event handler
	window.addEventListener('resize', function(){
		engine.resize();
	});
});