"use strict";
var BasicWindow = require("./BasicWindow");

function ExampleApplication(id, x, y) {
    BasicWindow.call(this, id, x, y);
}

ExampleApplication.prototype = Object.create(BasicWindow.prototype);
ExampleApplication.prototype.constructor =  ExampleApplication;

ExampleApplication.prototype.print = function() {
    BasicWindow.prototype.print.call(this);
    console.log("printing example");
    document.querySelector("#" + this.id).classList.add("memory-app");

};

module.exports = ExampleApplication;