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
		boneLength = 5; jointRadius = boneLength/5; boneDiameter = jointRadius;

		var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/2, 8*boneLength, new BABYLON.Vector3(0,0,3*boneLength), scene);
		// var camera = new BABYLON.ArcRotateCamera("Camera", 0, Math.PI/2, 8*boneLength, BABYLON.Vector3.Zero(), scene);

		// attach the camera to the canvas
		camera.attachControl(canvas, true);

		// create a basic light, aiming 0,1,0 - meaning, to the sky
		var light = new BABYLON.HemisphericLight('hemiLight1', new BABYLON.Vector3(0,0,2), scene);
		var redMat = new BABYLON.StandardMaterial("redMat", scene); redMat.diffuseColor = new BABYLON.Color3(1, 0, 0);
		var yelMat = new BABYLON.StandardMaterial("yelMat", scene); yelMat.diffuseColor = new BABYLON.Color3(1, 1, 0);
		var greMat = new BABYLON.StandardMaterial("greMat", scene); greMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
		var bluMat = new BABYLON.StandardMaterial("bluMat", scene); bluMat.diffuseColor = new BABYLON.Color3(0, 0, 1);

		// create a built-in "sphere" shape;
		var jointGlobal = BABYLON.MeshBuilder.CreateSphere('jointGlobal', {segments: 4, diameter: 2*jointRadius}, scene);jointGlobal.material = redMat;
		
		var boneIndex1Parent = new BABYLON.Mesh("boneIndex1Parent", scene);
		var boneIndex1 = BABYLON.MeshBuilder.CreateCylinder("boneIndex1", {height: 3*boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);
		var jointIndex1Parent = new BABYLON.Mesh("jointIndex1Parent", scene);
		var jointIndex1 = BABYLON.MeshBuilder.CreateSphere('jointIndex1', {segments: 4, diameter: 2*jointRadius}, scene); jointIndex1.material = bluMat;
		var boneIndex2 = BABYLON.MeshBuilder.CreateCylinder("boneIndex2", {height: boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);
		var jointIndex2 = BABYLON.MeshBuilder.CreateSphere('jointIndex2', {segments: 4, diameter: 2*jointRadius}, scene); jointIndex2.material = greMat;
		var boneIndex3 = BABYLON.MeshBuilder.CreateCylinder("boneIndex3", {height: boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);
		var jointIndex3 = BABYLON.MeshBuilder.CreateSphere('jointIndex3', {segments: 4, diameter: 2*jointRadius}, scene); jointIndex3.material = greMat;
		var boneIndex4 = BABYLON.MeshBuilder.CreateCylinder("boneIndex4", {height: boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);
		var jointIndex4 = BABYLON.MeshBuilder.CreateSphere('jointIndex4', {segments: 4, diameter: 2*jointRadius}, scene);// jointIndex4.material = bluMat;
		//helper empty nodes
		var jointIndex1OutPlaneTopHalf = new BABYLON.Mesh("jointIndex1OutPlaneTopHalf", scene);
		var jointIndex1OutPlaneBotHalf = new BABYLON.Mesh("jointIndex1OutPlaneBotHalf", scene);
		var jointIndex2Half = new BABYLON.Mesh("jointIndex2Half", scene);
		var jointIndex3Half = new BABYLON.Mesh("jointIndex3Half", scene);

		var boneMiddle1Parent = new BABYLON.Mesh("boneMiddle1Parent", scene);
		var boneMiddle1 = BABYLON.MeshBuilder.CreateCylinder("boneMiddle1", {height: 3*boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);

		var boneRing1Parent = new BABYLON.Mesh("boneRing1Parent", scene);
		var boneRing1 = BABYLON.MeshBuilder.CreateCylinder("boneRing1", {height: 3*boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);

		var boneLittle1Parent = new BABYLON.Mesh("boneLittle1Parent", scene);
		var boneLittle1 = BABYLON.MeshBuilder.CreateCylinder("boneLittle1", {height: 3*boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);

		var boneThumb1Parent = new BABYLON.Mesh("boneThumb1Parent", scene);
		var boneThumb1 = BABYLON.MeshBuilder.CreateCylinder("boneThumb1", {height: 2*boneLength-2*jointRadius, diameter: boneDiameter, tessellation: 6}, scene);

		// var myPath = [
		// 	new BABYLON.Vector3(-sphereDiameter/2, 0, sphereDiameter/2),
		//  	new BABYLON.Vector3(0, 0, sphereDiameter/2)
		// ];

		// pointSize = 0.1;
		// var point1c1 = BABYLON.MeshBuilder.CreateSphere('point1c1', {diameter: pointSize, segments:2}, scene);
		// var point1c2 = BABYLON.MeshBuilder.CreateSphere('point1c2', {diameter: pointSize, segments:2}, scene);

		boneIndex1.parent = boneIndex1Parent;
		boneIndex1Parent.parent = jointGlobal;
		jointIndex1.parent = jointIndex1Parent;
		jointIndex1Parent.parent = boneIndex1;
		boneIndex2.parent = jointIndex1;
		jointIndex2.parent = boneIndex2;
		boneIndex3.parent = jointIndex2;
		jointIndex3.parent = boneIndex3;
		boneIndex4.parent = jointIndex3;
		jointIndex4.parent = boneIndex4;
		//helper empty nodes
		jointIndex1OutPlaneTopHalf.parent = jointIndex1Parent;
		jointIndex1OutPlaneBotHalf.parent = boneIndex1;
		jointIndex2Half.parent = boneIndex2;
		jointIndex3Half.parent = boneIndex3;

		boneMiddle1.parent = boneMiddle1Parent;
		boneMiddle1Parent.parent = jointGlobal;

		boneRing1.parent = boneRing1Parent;
		boneRing1Parent.parent = jointGlobal;
		
		boneLittle1.parent = boneLittle1Parent;
		boneLittle1Parent.parent = jointGlobal;
		
		boneThumb1.parent = boneThumb1Parent;
		boneThumb1Parent.parent = jointGlobal;

		boneIndex1.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)
		jointIndex1Parent.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)
		boneIndex2.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		jointIndex2.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		boneIndex3.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		jointIndex3.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		boneIndex4.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		jointIndex4.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		//helper empty nodes
		jointIndex1OutPlaneBotHalf.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)
		jointIndex2Half.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)
		jointIndex3Half.translate(BABYLON.Axis.Y, boneLength/2, BABYLON.Space.LOCAL)

		boneMiddle1.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)

		boneRing1.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)
		
		boneLittle1.translate(BABYLON.Axis.Y, 3*boneLength/2, BABYLON.Space.LOCAL)
		
		boneThumb1.translate(BABYLON.Axis.Y, 2*boneLength/2, BABYLON.Space.LOCAL)

		boneIndex1Parent.rotate(BABYLON.Axis.X, Math.PI*(1-(70/180)), BABYLON.Space.LOCAL);
		boneMiddle1Parent.rotate(BABYLON.Axis.X, Math.PI*(1-(85/180)), BABYLON.Space.LOCAL);
		boneRing1Parent.rotate(BABYLON.Axis.X, Math.PI*(1-(95/180)), BABYLON.Space.LOCAL);
		boneLittle1Parent.rotate(BABYLON.Axis.X, Math.PI*(1-(120/180)), BABYLON.Space.LOCAL);
		boneThumb1Parent.rotate(BABYLON.Axis.X, Math.PI*(1-(25/180)), BABYLON.Space.LOCAL);

		DOFIndex1Inplane = 0; DOFIndex1OutPlane = 0; DOFIndex2 = 0; DOFIndex3 = 0;
		jointIndex1Parent.rotate(BABYLON.Axis.X, Math.PI*DOFIndex1Inplane/180, BABYLON.Space.LOCAL)
		jointIndex1.rotate(BABYLON.Axis.Z, Math.PI*DOFIndex1OutPlane/180, BABYLON.Space.LOCAL)
		jointIndex2.rotate(BABYLON.Axis.Z, Math.PI*DOFIndex2/180, BABYLON.Space.LOCAL)
		jointIndex3.rotate(BABYLON.Axis.Z, Math.PI*DOFIndex3/180, BABYLON.Space.LOCAL)
		//helper empty nodes
		jointIndex1OutPlaneTopHalf.rotate(BABYLON.Axis.Z, 0.5*Math.PI*DOFIndex1OutPlane/180, BABYLON.Space.LOCAL)
		jointIndex1OutPlaneBotHalf.rotate(BABYLON.Axis.Z, 0.5*Math.PI*DOFIndex1OutPlane/180, BABYLON.Space.LOCAL)
		jointIndex2Half.rotate(BABYLON.Axis.Z, 0.5*Math.PI*DOFIndex2/180, BABYLON.Space.LOCAL)
		jointIndex3Half.rotate(BABYLON.Axis.Z, 0.5*Math.PI*DOFIndex3/180, BABYLON.Space.LOCAL)

		var muscleNodeBoneIndex1TopAttach = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex1TopAttach', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex1TopAttach.parent = boneIndex1; muscleNodeBoneIndex1TopAttach.material = bluMat;
		muscleNodeBoneIndex1TopAttach.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex1TopAttach.translate(BABYLON.Axis.Y, (boneLength/2)+jointRadius, BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex1Top2 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex1Top2', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex1Top2.parent = boneIndex1
		muscleNodeBoneIndex1Top2.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex1Top2.translate(BABYLON.Axis.Y, (3*boneLength/2)-Math.sqrt(jointRadius*jointRadius*3/4), BABYLON.Space.LOCAL)
		var muscleNodeJointIndex1Top = BABYLON.MeshBuilder.CreateSphere('muscleNodeJointIndex1Top', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeJointIndex1Top.parent = jointIndex1OutPlaneTopHalf
		muscleNodeJointIndex1Top.translate(BABYLON.Axis.X, jointRadius, BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex2Top1 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex2Top1', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex2Top1.parent = boneIndex2
		muscleNodeBoneIndex2Top1.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex2Top1.translate(BABYLON.Axis.Y, Math.sqrt(jointRadius*jointRadius*3/4)-(boneLength/2), BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex2TopAttach = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex2TopAttach', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex2TopAttach.parent = boneIndex2; muscleNodeBoneIndex2TopAttach.material = bluMat;
		muscleNodeBoneIndex2TopAttach.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex2TopAttach.translate(BABYLON.Axis.Y, jointRadius-(boneLength/2), BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex2Top2 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex2Top2', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex2Top2.parent = boneIndex2
		muscleNodeBoneIndex2Top2.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex2Top2.translate(BABYLON.Axis.Y, (boneLength/2)-Math.sqrt(jointRadius*jointRadius*3/4), BABYLON.Space.LOCAL)
		var muscleNodeJointIndex2Top = BABYLON.MeshBuilder.CreateSphere('muscleNodeJointIndex2Top', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeJointIndex2Top.parent = jointIndex2Half
		muscleNodeJointIndex2Top.translate(BABYLON.Axis.X, jointRadius, BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex3Top1 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex3Top1', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex3Top1.parent = boneIndex3
		muscleNodeBoneIndex3Top1.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex3Top1.translate(BABYLON.Axis.Y, Math.sqrt(jointRadius*jointRadius*3/4)-(boneLength/2), BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex3TopAttach = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex3TopAttach', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex3TopAttach.parent = boneIndex3; muscleNodeBoneIndex3TopAttach.material = greMat;
		muscleNodeBoneIndex3TopAttach.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex3TopAttach.translate(BABYLON.Axis.Y, jointRadius-(boneLength/2), BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex3Top2 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex3Top2', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex3Top2.parent = boneIndex3
		muscleNodeBoneIndex3Top2.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex3Top2.translate(BABYLON.Axis.Y, (boneLength/2)-Math.sqrt(jointRadius*jointRadius*3/4), BABYLON.Space.LOCAL)
		var muscleNodeJointIndex3Top = BABYLON.MeshBuilder.CreateSphere('muscleNodeJointIndex3Top', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeJointIndex3Top.parent = jointIndex3Half
		muscleNodeJointIndex3Top.translate(BABYLON.Axis.X, jointRadius, BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex4Top1 = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex4Top1', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex4Top1.parent = boneIndex4
		muscleNodeBoneIndex4Top1.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex4Top1.translate(BABYLON.Axis.Y, Math.sqrt(jointRadius*jointRadius*3/4)-(boneLength/2), BABYLON.Space.LOCAL)
		var muscleNodeBoneIndex4TopAttach = BABYLON.MeshBuilder.CreateSphere('muscleNodeBoneIndex4TopAttach', {segments: 4, diameter: 2*jointRadius/5}, scene);
		muscleNodeBoneIndex4TopAttach.parent = boneIndex4; muscleNodeBoneIndex4TopAttach.material = greMat;
		muscleNodeBoneIndex4TopAttach.translate(BABYLON.Axis.X, boneDiameter/2, BABYLON.Space.LOCAL)
		muscleNodeBoneIndex4TopAttach.translate(BABYLON.Axis.Y, jointRadius-(boneLength/2), BABYLON.Space.LOCAL)
		
		// point1c1.parent = cylinder1;
		// point1c2.parent = cylinder2;
		// point1c1.translate(BABYLON.Axis.Y, -cylinderHeight/2, BABYLON.Space.LOCAL);
		// point1c1.translate(BABYLON.Axis.Z, sphereDiameter/2, BABYLON.Space.LOCAL);
		// point1c2.translate(BABYLON.Axis.Y, cylinderHeight/2 + 3*sphereDiameter/4, BABYLON.Space.LOCAL);
		// point1c2.translate(BABYLON.Axis.Z, sphereDiameter/2, BABYLON.Space.LOCAL);
		// var line1c1c2Path = [point1c1.getAbsolutePosition(),point1c2.getAbsolutePosition()];
		// var line1c1c2 = BABYLON.MeshBuilder.CreateTube("line1c1c2", {path: line1c1c2Path, radius: pointSize/2, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, scene);
		
		// var angle = 0, deltaAngle = 0.01;
		scene.registerBeforeRender(function(){
			// console.log(cylinder2.position)
			// tempAngle = angle;
			// angle += deltaAngle;
			// if(angle > 100 * Math.PI / 180 || angle < 0) {deltaAngle *= -1;}
			// sphere1.rotate(BABYLON.Axis.X, angle-tempAngle, BABYLON.Space.LOCAL);
			// line1c1c2Path = [point1c1.getAbsolutePosition(),point1c2.getAbsolutePosition()];
			// line1c1c2 = BABYLON.MeshBuilder.CreateTube("line1c1c2", {path: line1c1c2Path, radius: pointSize/2, instance: line1c1c2}, scene);

			// var distVec = new BABYLON.Vector3(line1c1c2Path[0].x-line1c1c2Path[1].x,line1c1c2Path[0].y-line1c1c2Path[1].y,line1c1c2Path[0].z-line1c1c2Path[1].z);
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