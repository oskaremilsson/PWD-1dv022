"use strict";
var BlockShape = require("./BlockShape");
/**
 * To create this module I have read the following guide:
 * http://gamedevelopment.tutsplus.com/tutorials/implementing-tetris-collision-detection--gamedev-852
 */

function TetrisGame(element) {
    this.element = element;
    this.Jblock = new BlockShape();
    this.fallingBlock = this.Jblock;
    this.field = [];
    this.alive = true;

    this.fallingBlockInterval = undefined;
}

TetrisGame.prototype.init = function() {
    this.initField();

    this.print();
    this.render();
    this.fallingBlockInterval = window.setInterval(this.fallBlock.bind(this), 500);
};

TetrisGame.prototype.fallBlock = function() {
    if (this.isFallable()) {
        this.fallingBlock.topLeft.row += 1;
    }
    else {
        window.clearInterval(this.fallingBlockInterval);
        this.landFallingBlock();
        this.dropNewBlock();
    }

    this.render();
};

TetrisGame.prototype.dropNewBlock = function() {
    this.Jblock = new BlockShape();
    this.fallingBlock = this.Jblock;
    this.fallingBlockInterval = window.setInterval(this.fallBlock.bind(this), 500);

    if (this.isCollision()) {
        console.log("Game over");
        this.alive = false;
        window.clearInterval(this.fallingBlockInterval);
    }
};

TetrisGame.prototype.landFallingBlock = function() {
    this.clearFallingBlock();
    var shape = this.fallingBlock.shapes[this.fallingBlock.rotation];

    for (var row = 0; row < shape.length; row += 1) {
        for (var col = 0; col < shape[row].length; col += 1) {
            if (shape[row][col] !== 0) {
                this.field[row + this.fallingBlock.topLeft.row][col + this.fallingBlock.topLeft.col] = shape[row][col];
            }
        }
    }
};

TetrisGame.prototype.render = function() {
    this.clearFallingBlock();

    // Change the classes to render the blocks to user
    var trs = this.element.querySelectorAll("tr");
    var tds;
    for (var row = 0; row < this.field.length; row += 1) {
        tds = trs[row].querySelectorAll("td");
        for (var col = 0; col < this.field[row].length; col += 1) {
            if (this.field[row][col] === 1) {
                //should render class for block here
                tds[col].classList.add("tetris-block-part");
            }
        }
    }

    this.renderFallingBlock();
};

TetrisGame.prototype.renderFallingBlock = function() {
    var row;
    var col;

    //get the nodes
    var trs = this.element.querySelectorAll("tr");
    var tds = [];
    for (row = 0; row < this.field.length; row += 1) {
        tds.push(trs[row].querySelectorAll("td"));
    }

    var shape = this.fallingBlock.shapes[this.fallingBlock.rotation];
    for (row = 0; row < shape.length; row += 1) {
        for (col = 0; col < shape[row].length; col += 1) {
            if (shape[row][col] !== 0) {
                //draw block at position corresponding to the shapes position
                var y = row + this.fallingBlock.topLeft.row;
                var x = col + this.fallingBlock.topLeft.col;
                tds[y][x].classList.add("tetris-falling-block-part");
            }
        }
    }
};

TetrisGame.prototype.isCollision = function() {
    var collision = false;

    var shape = this.fallingBlock.shapes[this.fallingBlock.rotation];

    for (var row = 0; row < shape.length; row += 1) {
        for (var col = 0; col < shape[row].length; col += 1) {
            if (shape[row][col] !== 0) {
                if (row + this.fallingBlock.topLeft.row >= this.field.length) {
                    //this block would be below the playing field
                    collision = true;
                }
                //console.log(this.field[row + potentialTopLeft.row][col + potentialTopLeft.col]);
                else if (this.field[row + this.fallingBlock.topLeft.row][col + this.fallingBlock.topLeft.col] !== 0) {
                    //the space is taken
                    collision = true;
                }
            }
        }
    }

    return collision;
};

TetrisGame.prototype.isFallable = function() {
    var fallable = true;

    var shape = this.fallingBlock.shapes[this.fallingBlock.rotation];
    var potentialTopLeft = {
        row: this.fallingBlock.topLeft.row + 1,
        col: this.fallingBlock.topLeft.col
    };

    for (var row = 0; row < shape.length; row += 1) {
        for (var col = 0; col < shape[row].length; col += 1) {
            if (shape[row][col] !== 0) {
                if (row + potentialTopLeft.row >= this.field.length) {
                    //this block would be below the playing field
                    console.log("out of bounds");
                    fallable = false;
                }
                //console.log(this.field[row + potentialTopLeft.row][col + potentialTopLeft.col]);
                else if (this.field[row + potentialTopLeft.row][col + potentialTopLeft.col] !== 0) {
                    //the space is taken
                    console.log("collision");
                    fallable = false;
                }
            }
        }
    }

    return fallable;
};

TetrisGame.prototype.moveFallingBlock = function(dir) {
    if (this.isMovable(dir)) {
        this.fallingBlock.topLeft.col += dir;
    }

    this.render();
};

TetrisGame.prototype.isMovable = function(dir) {
    var movable = true;
    var shape = this.fallingBlock.shapes[this.fallingBlock.rotation];
    var potentialTopLeft = {
            row: this.fallingBlock.topLeft.row,
            col: this.fallingBlock.topLeft.col + dir
        };

    for (var row = 0; row < shape.length; row += 1) {
        for (var col = 0; col < shape[row].length; col += 1) {
            if (shape[row][col] !== 0) {
                if (col + potentialTopLeft.col < 0) {
                    //this block would be to the left of the playing field
                    movable = false;
                }
                if (col + potentialTopLeft.col >= this.field[0].length) {
                    //this block would be to the right of the playing field
                    movable = false;
                }
                if (this.field[row + potentialTopLeft.row][col + potentialTopLeft.col] !== 0) {
                    //the space is taken
                    movable = false;
                }
            }
        }
    }

    return movable;
};

TetrisGame.prototype.rotateFallingBlock = function(dir) {
    var newRotation = this.fallingBlock.rotation + dir;
    if (newRotation > 3) {
        newRotation = 0;
    }
    else if (newRotation < 0) {
        newRotation = 3;
    }

    this.fallingBlock.rotation = newRotation;

    this.render();
};

TetrisGame.prototype.clearFallingBlock = function() {
    //clear from last falling-block
    var trs = this.element.querySelectorAll("tr");
    var tds;
    for (var row = 0; row < this.field.length; row += 1) {
        tds = trs[row].querySelectorAll("td");
        for (var col = 0; col < this.field[row].length; col += 1) {
                tds[col].classList.remove("tetris-falling-block-part");
            }
        }
};

TetrisGame.prototype.print = function() {
    //print the chat-template to this.element
    var template = document.querySelector("#template-tetris-application").content.cloneNode(true);

    var frag = document.createDocumentFragment();
    var tr;
    var td;

    for (var row = 0; row < this.field.length; row += 1) {
        tr = document.createElement("tr");
        //tr.setAttribute("id", "row-" + row);
        for (var col = 0; col < this.field[row].length; col += 1) {
            td = document.createElement("td");
            //td.setAttribute("id", "col-" + col);
            tr.appendChild(td);
        }
        frag.appendChild(tr);
    }

    template.querySelector(".tetris-grid-body").appendChild(frag);

    this.element.querySelector(".window-content").appendChild(template);
};

TetrisGame.prototype.initField = function() {
    this.field = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
};

module.exports = TetrisGame;