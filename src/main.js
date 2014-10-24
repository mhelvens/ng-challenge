exampleUtils.initialize(); // Creates Three.js renderer & GoblinPhysics world

var sphere_material_1 = exampleUtils.createMaterial('rusted_metal', 1, 1),
	sphere_material_2 = exampleUtils.createMaterial('scratched_metal', 3, 2);

var ground = exampleUtils.createPlane(1, 20, 20, 0, exampleUtils.createMaterial('pebbles', 5, 5));
ground.goblin.position.y = -5;
ground.goblin.rotation.x = 0;
ground.goblin.rotation.y = 0;

var body = $('body');
var screenWidth = body.width();




var sphere = exampleUtils.createSphere(1.5, 300, sphere_material_1);
sphere.goblin.position.x = 0;
sphere.goblin.position.y = 20;
sphere.goblin.position.z = 0;
sphere.goblin.applyImpulse(new Goblin.Vector3(0, -10, 0));

exampleUtils.run();


///////////////// pusher /////////////////////

var pusher = new Pusher('7bbe1542a659c18b6ee7');
var channel = pusher.subscribe('presence-3d-positioning');

var ID;

channel.bind('pusher:subscription_succeeded', function (members) {

	ID = members.myID;

	console.log('my id:', ID);

	///////////////// orientation /////////////////////

	function noRenderer() {}

	window.addEventListener("deviceorientation", _.throttle(function listener(event) {
		if (!exampleUtils.physicsKilled && event.gamma !== null) {
			ground.goblin.rotation.x = -event.gamma / 90;
			ground.goblin.rotation.z = -event.beta / 90;
			if (sphere.position.y < -100) {
				sphere.goblin.position.x = 0;
				sphere.goblin.position.y = 20;
				sphere.goblin.position.z = 0;
			}
			pushUpdate();
		} else {
			exampleUtils.physicsKilled = true;
		}
	}, 1000 / 20));

	///////////////// pusher /////////////////////

	channel.bind('update-from-server', function(data) {
		console.log('(', data.userId, ID, ')');
		if (data.userId !== ID) {
			ground.goblin.rotation.x = data.groundRotation.x;
			ground.goblin.rotation.y = data.groundRotation.y;
			ground.goblin.rotation.z = data.groundRotation.z;
			sphere.goblin.position.x = data.spherePosition.x;
			sphere.goblin.position.y = data.spherePosition.y;
			sphere.goblin.position.z = data.spherePosition.z;
		}
	});

	//channel.bind_all(function(data, err) {
	//	console.log('=====', data, err);
	//});

	function pushUpdate() {
		console.log('pushing update');

		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("POST","/update",true);
		xmlhttp.setRequestHeader("Content-type","application/json");

		xmlhttp.send(JSON.stringify({
			userId: ID,
			groundRotation: {
				x: ground.goblin.rotation.x,
				y: ground.goblin.rotation.y,
				z: ground.goblin.rotation.z
			},
			spherePosition: {
				x: sphere.goblin.position.x,
				y: sphere.goblin.position.y,
				z: sphere.goblin.position.z
			}
		}));
	}

});
