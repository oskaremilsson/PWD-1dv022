"use strict";

function IBlockShape() {
    this.shapes = [
        [
            [6],
            [6],
            [6],
            [6]
        ],
        [
            [6, 6, 6, 6]
        ],
        [
            [6],
            [6],
            [6],
            [6]
        ],
        [
            [6, 6, 6, 6]
        ]
    ];
    this.rotation = 0;
    this.topLeft = {
        row: 0,
        col: 4
    };
}

module.exports = IBlockShape;