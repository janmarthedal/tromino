import { h, Component } from 'preact';

function indexOfFirstTruthy(arr) {
    for (var k = 0; k < arr.length; k++) {
        if (arr[k])
            return k;
    }
    return -1;
}

const offsets = [[0, -1], [0, 0], [-1, 0], [-1, -1], [0, -1], [0, 0]];

class TreeGrid {

    constructor(size, x, y) {
        this.size = size;
        this.root = [];
        this.items = [];
        this._setCell(this.root, this.size, x, y);
    }

    _setCell(node, size, x, y) {
        let half = Math.floor(size/2), index = 0;
        if (x >= half) { index += 1; x -= half; }
        if (y >= half) { index = 3 - index; y -= half; }
        if (size > 2) {
            if (!node[index])
            node[index] = [];
            this._setCell(node[index], half, x, y)
        } else
            node[index] = true;
    }

    _fill(node, size, left, top) {
        let index = indexOfFirstTruthy(node), half = Math.floor(size/2);
        offsets.slice(index, index + 3).forEach((delta) => {
            this._setCell(node, size, half + delta[0], half + delta[1]);
        });
        this.items.push([left + half, top + half, index]);
        if (size > 2) {
            this._fill(node[0], half, left,        top       );
            this._fill(node[1], half, left + half, top       );
            this._fill(node[2], half, left + half, top + half);
            this._fill(node[3], half, left,        top + half);
        }
    }

    fill() {
        this._fill(this.root, this.size, 0, 0);
        return this.items;
    }
}

export default class TrominoBox extends Component {
	state = {
        x: this.props.initX,
        y: this.props.initY,
        buttonDown: false
    };
	render({ size }, { x, y }) {
        const strokeWidth = 0.1;
        const boxWidth = size + 2 * strokeWidth;
        const viewBox = [-strokeWidth, -strokeWidth, boxWidth, boxWidth].join(' ');
        const items = new TreeGrid(size, x, y).fill();
        return (
            <svg viewBox={viewBox}>
                <defs>
                    <path id="tromino0" d="M0 0L0 -1L1 -1L1 1L-1 1L-1 0Z" />
                    <path id="tromino1" d="M0 0L1 0L1 1L-1 1L-1 -1L0 -1Z" />
                    <path id="tromino2" d="M0 0L0 1L-1 1L-1 -1L1 -1L1 0Z" />
                    <path id="tromino3" d="M0 0L-1 0L-1 -1L1 -1L1 1L0 1Z" />
                </defs>
                <g stroke="#000" stroke-width={strokeWidth} fill="#81D4FA">
                    {items.map((item, idx) =>
                        <use x={item[0]} y={item[1]}
                            xlinkHref={"#tromino" + item[2]} key={idx} />
                    )}
                </g>
            </svg>
        );
    }
}
