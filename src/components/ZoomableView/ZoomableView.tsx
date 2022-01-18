import panzoom, { PanZoom } from "panzoom";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import "./ZoomableView.css";

type Props = {
  children?: React.ReactElement
  maxScale: number;
  minScale?: number;
  onZoomChange?: (currentZoom: number) => void
};

export type HandleRef = {
  zoomUp: () => void;
  zoomDown: () => void;
};

const ZoomableView = forwardRef<HandleRef, Props>(
  ({ children, maxScale, minScale = 1, onZoomChange }, innerRef) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const panzoomInstanceRef = useRef<PanZoom>();
    const scaleRef = useRef({ minScale, maxScale });
    const [currentZoom, setCurrentZoom] = useState(
      minScale <= 0 ? 1 : minScale
    );

    useImperativeHandle(innerRef, () => ({
      zoomDown: handleZoomDown,
      zoomUp: handleZoomUp,
    }));

    const handleZoomUp = useCallback(() => {
      const { x: deltaX = 0, y: deltaY = 0 } = panzoomInstanceRef.current?.getTransform() || {}
      panzoomInstanceRef.current?.smoothZoom(Math.abs(deltaX), Math.abs(deltaY), 1.25)
    }, [maxScale]);
    
    const handleZoomDown = useCallback(() => {
      const { x: deltaX = 0, y: deltaY = 0 } = panzoomInstanceRef.current?.getTransform() || {}
      panzoomInstanceRef.current?.smoothZoom(Math.abs(deltaX), Math.abs(deltaY), 0.8);
    }, [minScale]);

    useEffect(() => {
      onZoomChange?.(currentZoom)
    }, [currentZoom])

    useLayoutEffect(() => {
      panzoomInstanceRef.current = panzoom(wrapperRef.current as HTMLElement, {
        maxZoom: scaleRef.current.maxScale,
        minZoom: scaleRef.current.minScale,
        bounds: true,
        boundsPadding: 1,
        zoomDoubleClickSpeed: 1,
      });

      panzoomInstanceRef.current.on('zoom', (e: PanZoom) => {
        const { scale } = e.getTransform()
        setCurrentZoom(+scale.toFixed(2))
      })

      return () => panzoomInstanceRef.current?.dispose();
    }, []);

    return (
      <div className="ZoomableView__wrapper" ref={wrapperRef}>
        {children}
      </div>
    );
  }
);

export default ZoomableView;
