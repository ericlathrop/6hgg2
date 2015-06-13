"use strict";

module.exports = function(ecs, data) {
	ecs.addEach(function(entity, elapsedMillis) {
		delete data.entities.entities[entity.id];
	}, ["dead"]);
}
