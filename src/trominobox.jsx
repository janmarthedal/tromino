import Preact from 'preact';

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

export default class TrominoBox extends Preact.Component {
    constructor() {
        super();
	    this.state = {
            x: 0,
            y: 0,
            buttonDown: false
        };
    }
    componentWillMount() {
        this.setState({
            x: this.props.initX,
            y: this.props.initY,
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.x !== this.state.x || nextState.y !== this.state.y;
    }
    checkMouse(e) {
        const svg = this.base;
        const rect = svg.getBoundingClientRect();
        const cellX = Math.floor(this.props.size * (e.clientX - rect.left) / rect.width);
        const cellY = Math.floor(this.props.size * (e.clientY - rect.top) / rect.height);
        this.setState({ x: cellX, y: cellY });
    }
    handleMouseButtons(e) {
        const leftDown = (e.buttons & 1) !== 0;
        this.setState({ buttonDown: leftDown });
        if (leftDown)
            this.checkMouse(e);
    }
    handleMouseMove(e) {
        if (this.state.buttonDown)
            this.checkMouse(e);
    }
	render({ size }, { x, y }) {
        const strokeWidth = 0.1;
        const boxWidth = size + 2 * strokeWidth;
        const viewBox = [-strokeWidth, -strokeWidth, boxWidth, boxWidth].join(' ');
        const items = new TreeGrid(size, x, y).fill();
        return (
            <svg viewBox={viewBox} onMouseDown={this.handleMouseButtons.bind(this)}
                onMouseUp={this.handleMouseButtons.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}>
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
