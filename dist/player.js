"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Player = function Player(name, positions, team, color) {
	_classCallCheck(this, Player);

	this.name = name;
	this.positions = positions || [];
	this.color = color;
	this.team = team;
};