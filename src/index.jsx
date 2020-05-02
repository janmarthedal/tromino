import Preact from 'preact'

import TrominoBox from "./trominobox"

Preact.render(
  <TrominoBox size={32} initX={7} initY={5} />,
  document.getElementById('tromino-fig')
)
