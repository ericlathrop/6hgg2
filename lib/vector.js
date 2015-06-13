"use strict";

function add(a, b) {
	return { x: a.x + b.x, y: a.y + b.y };
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

module.exports = {
	add: add,
	subtract: subtract,
	multiply: multiply,
	divide: divide,
	magnitude: magnitude,
	unit: unit
};
