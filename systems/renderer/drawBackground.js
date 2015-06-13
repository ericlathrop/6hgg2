"use strict";

module.exports = function(ecs, data) {
	ecs.add(function() {
		data.context.fillStyle = "#a6edff";
		data.context.fillRect(0, 0, data.canvas.width, data.canvas.height);

		data.context.fillStyle = "#04a400";
		data.context.fillRect(0, data.canvas.height - 50, data.canvas.width, 50);

		data.context.fillStyle = "#fff449";
		data.context.fillRect(100, 100, 100, 100);
	});
};
