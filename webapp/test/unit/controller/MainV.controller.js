/*global QUnit*/

sap.ui.define([
	"ams_ns/ams_module/controller/MainV.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MainV Controller");

	QUnit.test("I should test the MainV controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
