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
	return otherBees(entity, entities).reduce(function(v, bee) {
		if (vector.distance(entity.position, bee.position) < 100) {
			var away = vector.subtract(bee.position, entity.position);
			return vector.subtract(v, away);
		}
		return v;
	}, vector.zero());
}

function cohesion(entity, entities) {
	var velocities = otherBees(entity, entities).map(function(entity) {
		return entity.velocity;
	});

	var avg = velocities.reduce(function(center, position) {
		return vector.add(center, position);
	}, vector.zero());
	avg = vector.divide(avg, velocities.length);

	return vector.divide(vector.subtract(avg, entity.velocity), 8);
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
var target;

module.exports = function(ecs, data) {
	target = { x: data.canvas.width / 2, y: data.canvas.height / 2 };
	ecs.addEach(function(entity, elapsedMillis) {
		var steps = [];

		entity.collisions.map(function(id) {
			return data.entities.entities[id];
		}).filter(function(enemy) {
			return enemy && enemy.name === "enemy";
		}).forEach(function(enemy) {
			data.sounds.play("pop");
			enemy.dead = true;
		});
		steps.push(alignment(entity, data.entities.entities));
		steps.push(separation(entity, data.entities.entities));
		// steps.push(cohesion(entity, data.entities.entities));
		if (data.input.mouse.consumePressed(0)) {
			target = { x: data.input.mouse.x, y: data.input.mouse.y };
			data.sounds.play("buzz");
		}
		steps.push(goal(entity, target));

		steps = steps.map(function(step) { return limitSpeed(step, 0.1); });
		steps.push(limitSpeed(entity.velocity, 1));
		entity.velocity = vector.add.apply(this, steps);

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
			bee.image = {
				"sourceX": 0,
				"sourceY": 0,
				"sourceWidth": 0,
				"sourceHeight": 0,
				"destinationX": -7,
				"destinationY": -6,
				"destinationWidth": 14,
				"destinationHeight": 12
			};
			bee.animation = {
				"time": 0,
				"frame": 0,
				"loop": true,
				"speed": 1,
				"name": "bee-f2"
			};
		}
	}, ["flock"]);
};
