"use strict";
var BasicWindow = require("../BasicWindow");
var TetrisGame = require("./TetrisGame");

/**
 * Constructor function for the tetris-app
 * @param options - the settings-object
 * @constructor
 */
function TetrisApplication(options) {
    BasicWindow.call(this, options);

    this.game = undefined;
}

TetrisApplication.prototype = Object.create(BasicWindow.prototype);
TetrisApplication.prototype.constructor =  TetrisApplication;

/**
 * Init the basics
 */
TetrisApplication.prototype.init = function() {
    this.print();

    //create new game
    this.game = new TetrisGame(this.element);
    this.game.init();

    //add eventlistener for the menu
    this.element.querySelector(".window-menu").addEventListener("click", this.menuClicked.bind(this));
};

/**
 * Function to print the app
 */
TetrisApplication.prototype.print = function() {
    BasicWindow.prototype.print.call(this);
    this.element.classList.add("tetris-app");
    this.element.querySelector("i").classList.add("tetris-icon");

    //add the menu
    var menu = this.element.querySelector(".window-menu");
    var alt = document.querySelector("#template-window-menu-alternative").content;
    var alt1 = alt.cloneNode(true);
    alt1.querySelector(".menu-alternative").appendChild(document.createTextNode("New Game"));

    menu.appendChild(alt1);
};

/**
 * Function to handle the menu-clicks
 * @param event - click-event
 */
TetrisApplication.prototype.menuClicked = function(event) {
    var target;
    if (event.target.tagName.toLowerCase() === "a") {
        target = event.target.textContent.toLowerCase();
    }

    if (target) {
        switch (target) {
            case "new game": {
                if (this.game) {
                    this.game.start();
                }

                break;
            }
        }
    }
};

/**
 * Function to handle the key-inputs
 * @param key - the key-code
 */
TetrisApplication.prototype.keyInput = function(key) {
    //If game is "alive" and not paused, call the correct functions in game
    if (this.game.alive && !this.game.paused) {
        this.inputToGameHandler(key);
    }
    else {
        if (key === 13) {
            if (this.game.paused) {
                this.game.resumeGame();
            }
            else {
                this.game.start();
            }
        }
    }
};

TetrisApplication.prototype.inputToGameHandler = function(key) {
    switch (key) {
        case 37: {
            //left
            this.game.moveFallingBlock(-1);
            break;
        }

        case 39: {
            //right
            this.game.moveFallingBlock(1);
            break;
        }

        case 38: {
            //up
            this.game.rotateFallingBlock(1);
            break;
        }

        case 40: {
            //down
            this.game.fallBlock();
            break;
        }

        case 32: {
            //space
            this.game.fallBlockToBottom();
            break;
        }

        case 13: {
            //enter
            this.game.pauseGame();
            break;
        }

        case 68: {
            //d
            this.game.demoGame();
            break;
        }
    }
};

/**
 * Function to destroy the app
 */
TetrisApplication.prototype.destroy = function() {
    if (this.game.fallingBlockInterval) {
        window.clearInterval(this.game.fallingBlockInterval);
    }

    if (this.game.bgMusic) {
        //stop background music
        this.game.bgMusic.pause();
    }

    document.querySelector("#main-frame").removeChild(this.element);
};

module.exports = TetrisApplication;
