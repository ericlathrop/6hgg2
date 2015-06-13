"use strict";

var vector = require("../../lib/vector");

function otherBees(entity, entities) {
	return Object.keys(entities).map(function(id) {
		return entities[id];
	}).filter(function(bee) {
		return bee.flock !== undefined && bee.id !== entity.id;
	});
}

function alignment(entity, entities) {
	var positions = otherBees(entity, entities).map(function(entity) {
		return entity.position;
	});

	var center = positions.reduce(function(center, position) {
		return vector.add(center, position);
	}, vector.zero());

	center = vector.divide(center, positions.length);

	return vector.divide(vector.subtract(center, entity.position), 100);
}

function separation(entity, entities) {
	return vector.multiply(otherBees(entity, entities).reduce(function(v, bee) {
		if (vector.distance(entity.position, bee.position) < 100) {
			var away = vector.subtract(bee.position, entity.position);
			return vector.subtract(v, away);
		}
		return v;
	}, vector.zero()), 2);
}

function cohesion(entity, entities) {
	var velocities = otherBees(entity, entities).map(function(entity) {
		return entity.velocity;
	});

	var avg = velocities.reduce(function(center, position) {
		return vector.add(center, position);
	}, vector.zero());
	avg = vector.divide(avg, velocities.length);

	// return vector.divide(vector.subtract(avg, entity.velocity), 8);
	return vector.zero();
}

function goal(entity, goal) {
	return vector.divide(vector.subtract(goal, entity.position), 100);
}

function limitSpeed(v, max) {
	if (vector.magnitude(v) > max) {
		return vector.multiply(vector.unit(v), max);
	}
	return v;
}

var counter = 0;

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		var a = alignment(entity, data.entities.entities);
		var b = separation(entity, data.entities.entities);
		var c = cohesion(entity, data.entities.entities);
		var center = { x: data.canvas.width / 2, y: data.canvas.height / 2 };
		var mouse = { x: data.input.mouse.x, y: data.input.mouse.y };
		var d = goal(entity, mouse);

		entity.velocity = vector.add(limitSpeed(entity.velocity, 1), limitSpeed(a, 0.1), limitSpeed(b, 0.1), limitSpeed(c, 0.1), limitSpeed(d, 0.1));
		if (data.input.button("down")) {
			counter += elapsedMillis;
		}
		while (counter > 1000) {
			counter -= 1000;

			var bee = data.entities.add();
			bee.position = { x: Math.random() * data.canvas.width, y: Math.random() * data.canvas.height };
			bee.size = { width: 10, height: 10 };
			bee.velocity = { x: 0, y: 0 };
			bee.flock = true;
		}
	}, ["flock"]);
};
