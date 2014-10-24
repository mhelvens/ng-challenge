exampleUtils.initialize(); // Creates Three.js renderer & GoblinPhysics world

var sphere_material_1 = exampleUtils.createMaterial('rusted_metal', 1, 1),
	sphere_material_2 = exampleUtils.createMaterial('scratched_metal', 3, 2);

var ground = exampleUtils.createPlane(1, 20, 20, 0, exampleUtils.createMaterial('pebbles', 5, 5));
ground.goblin.position.y = -5;
ground.goblin.rotation.x = 0.1;

var body = $('body');
var screenWidth = body.width();

body.mousemove(function (event) {
	ground.goblin.rotation.x = 0.1 * (event.clientX - screenWidth / 2) / 400;
});


// 5th level

var sphere = exampleUtils.createSphere(1.5, 300, sphere_material_1);
sphere.goblin.position.x = 1.5;
sphere.goblin.position.y = 20;
sphere.goblin.position.z = 1.5;
sphere.goblin.applyImpulse(new Goblin.Vector3(0, -10, 0));

exampleUtils.run();


$(window).on("orientationchange", function(event) {
	console.log(event);
});

