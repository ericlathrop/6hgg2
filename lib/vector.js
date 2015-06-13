"use strict";

function zero() {
	return { x: 0, y: 0 };
}
function add() {
	var ret = zero();
	for (var i = 0; i < arguments.length; i++) {
		ret.x += arguments[i].x;
		ret.y += arguments[i].y;
	}
	return ret;
}
function subtract(a, b) {
	return { x: a.x - b.x, y: a.y - b.y };
}
function multiply(v, scalar) {
	return { x: v.x * scalar, y: v.y * scalar };
}
function divide(v, scalar) {
	return { x: v.x / scalar, y: v.y / scalar };
}
function magnitude(v) {
	return Math.sqrt((v.x * v.x) + (v.y * v.y));
}
function unit(v) {
	return divide(v, magnitude(v));
}
function distance(a, b) {
	return magnitude(subtract(a, b));
}

module.exports = {
	zero: zero,
	add: add,
	subtract: subtract,
	multiply: multiply,
	divide: divide,
	magnitude: magnitude,
	unit: unit,
	distance: distance
};
