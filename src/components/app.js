import { h, Component } from "preact";

import TrominoBox from "./trominobox";

export default class App extends Component {
  render() {
    return (
      <div id="tromino-fig">
        <TrominoBox size={32} initX={7} initY={5} />
      </div>
    );
  }
}
