/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ams_ns/ams_module/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
