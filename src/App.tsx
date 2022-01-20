import { useRef, useState } from "react";
import "./App.css";
import ZoomableView, { ZoomableViewRef } from "./components/ZoomableView";

function App() {
  const zoomableViewRef = useRef<ZoomableViewRef>(null);
  const [zoom, setZoom] = useState<number>(1);

  return (
    <div className="App">
      <div className="App__gallery-wrapper">
        <header className="App__gallery-header">
          <span className="zoom-info">{`x ${zoom}`}</span>
          <div className="buttons">
            <button onClick={() => zoomableViewRef.current?.zoomUp()}>+</button>
            <button onClick={() => zoomableViewRef.current?.zoomDown()}>
              -
            </button>
          </div>
        </header>
        <div className="App__gallery-content">
          <ZoomableView
            ref={zoomableViewRef}
            maxScale={2}
            onZoomChange={setZoom}
          >
            <>
              <img
                className="App__image"
                src="https://s3.amazonaws.com/catalogodigitalbelcorp/CR/202202/C/paginas/CR_C_202202_002-003.jpg"
              />
              <img
                className="App__image mobile"
                src="https://s3.amazonaws.com/catalogodigitalbelcorp/CR/202202/C/paginas/CR_C_202202_002.jpg"
              />
            </>
          </ZoomableView>
        </div>
      </div>
    </div>
  );
}

export default App;
