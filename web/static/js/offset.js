var offsets = {
    "level0": {
        font: "bold 24px XX",
        fontSize: 22,
        text_dwidth: 118,

        text_dx: -50,
        text_dy: 10,

        lineWidth: 4.5,
        next_offset_level: "level1",
        height: 118,

        box_dwidth: 1000,
        box_height: 118 * 1.5,
        box_x: 0,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    "level1": {
        font: "bold 22px XX",
        fontSize: 22,
        text_dwidth: 50,

        text_dx: -40,
        text_dy: 9,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35,

        box_dwidth: 80,
        box_height: 35 * 1.36,
        box_x: 280,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    },
    "levelN": {
        font: "bold 19px Arial",
        fontSize: 19,
        text_dwidth: 50,

        text_dx: -36,
        text_dy: 7,

        lineWidth: 2.5,
        next_offset_level: "levelN",
        height: 35,

        box_dwidth: 80,
        box_height: 35 * 1.36,
        box_x: 250,
        box_y: 0,

        box_parent_x: 0,
        box_parent_y: 0
    }
};
