"use strict";

var vector = require("../../lib/vector");

function alignment(entity, entities) {
	var positions = Object.keys(entities).map(function(id) {
		return entities[id];
	}).filter(function(bee) {
		return bee.flock !== undefined && bee.id !== entity.id;
	}).map(function(entity) {
		return entity.position;
	});
	
	var center = positions.reduce(function(center, position) {
		return vector.add(center, position);
	}, { x: 0, y: 0 });

	center = vector.divide(center, positions.length);

	return vector.multiply(vector.unit(vector.subtract(center, entity.position)), 0.01);
}

function separation(entity, entities) {
	return { x: 0, y: 0 };
}

function cohesion(entity, entities) {
	return { x: 0, y: 0 };
}

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		var a = alignment(entity, data.entities.entities);
		var b = separation(entity, data.entities.entities);
		var c = cohesion(entity, data.entities.entities);

		entity.velocity.x += a.x + b.x + c.x;
		entity.velocity.y += a.y + b.y + c.y;
	}, ["flock"]);
};
