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

	return vector.multiply(vector.unit(vector.subtract(center, entity.position)), 0.01);
}

function separation(entity, entities) {
	return otherBees(entity, entities).reduce(function(v, bee) {
		if (vector.distance(entity.position, bee.position) < 50) {
			var away = vector.multiply(vector.unit(vector.subtract(bee.position, entity.position)), 0.01);
			return vector.add(v, away);
		}
		return v;
	}, vector.zero());
}

function cohesion(entity, entities) {
	return vector.zero();
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		var a = alignment(entity, data.entities.entities);
		var b = separation(entity, data.entities.entities);
		var c = cohesion(entity, data.entities.entities);

		entity.velocity = vector.add(entity.velocity, a, b, c);
	}, ["flock"]);
};
