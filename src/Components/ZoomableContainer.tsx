import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@heroui/react";

interface ZoomableContainerProps {
  children: React.ReactNode;
  minZoom?: number;
  maxZoom?: number;
  initialZoom?: number;
}

export function ZoomableContainer({
  children,
  minZoom = 0.5,
  maxZoom = 3,
  initialZoom = 1,
}: ZoomableContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [zoom, setZoom] = useState(initialZoom);
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastTouchDistanceRef = useRef<number | null>(null);

  // Rileva se siamo su mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint di Tailwind
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, maxZoom));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, minZoom));
  };

  const handleResetZoom = () => {
    setZoom(initialZoom);
  };

  // Centra lo scroll inizialmente solo se il contenuto è più largo del viewport
  // Questo permette scroll in entrambe le direzioni senza spazio bianco extra
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const centerScroll = () => {
      // Forza un reflow per assicurarsi che le dimensioni siano aggiornate
      void container.offsetHeight;

      const containerWidth = container.clientWidth;
      const contentWidth = content.scrollWidth;

      // Centra solo se il contenuto è più largo del container
      if (contentWidth > containerWidth && contentWidth > 0) {
        const scrollLeft = (contentWidth - containerWidth) / 2;
        container.scrollLeft = scrollLeft;
      } else {
        // Se il contenuto è più piccolo, riporta lo scroll a sinistra
        container.scrollLeft = 0;
      }
    };

    // Usa requestAnimationFrame per assicurarsi che il rendering sia completo
    let rafId1: number;
    let rafId2: number;

    rafId1 = requestAnimationFrame(() => {
      rafId2 = requestAnimationFrame(() => {
        centerScroll();
        // Su mobile, fai un secondo tentativo dopo un breve delay
        if (isMobile) {
          setTimeout(() => {
            centerScroll();
          }, 100);
        }
      });
    });

    // Fallback con timeout per sicurezza
    const timeoutId = setTimeout(() => {
      centerScroll();
    }, 300);

    window.addEventListener("resize", centerScroll);
    return () => {
      cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      clearTimeout(timeoutId);
      window.removeEventListener("resize", centerScroll);
    };
  }, [zoom, isMobile]);

  // Gestione pinch-to-zoom (solo su mobile)
  useEffect(() => {
    if (!isMobile) return; // Disabilita zoom su desktop

    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const getTouchDistance = (touches: TouchList) => {
      if (touches.length < 2) return null;
      const touch1 = touches[0];
      const touch2 = touches[1];
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        setIsZooming(true);
        lastTouchDistanceRef.current = getTouchDistance(e.touches);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && lastTouchDistanceRef.current !== null) {
        e.preventDefault();
        const currentDistance = getTouchDistance(e.touches);
        if (currentDistance !== null && lastTouchDistanceRef.current !== null) {
          const scaleChange = currentDistance / lastTouchDistanceRef.current;
          setZoom((prev) => {
            const newZoom = prev * scaleChange;
            return Math.max(minZoom, Math.min(maxZoom, newZoom));
          });
          lastTouchDistanceRef.current = currentDistance;
        }
      }
    };

    const handleTouchEnd = () => {
      setIsZooming(false);
      lastTouchDistanceRef.current = null;
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [minZoom, maxZoom, isMobile]);

  return (
    <div className="relative w-full">
      {/* Controlli zoom */}
      <div className="fixed bottom-24 md:bottom-8 right-3 md:right-6 z-30 flex flex-col gap-2">
        {zoom !== initialZoom && (
          <Button
            onPress={handleResetZoom}
            size="sm"
            isIconOnly
            className="bg-white shadow-lg hover:bg-gray-50 touch-manipulation min-w-[44px] min-h-[44px]"
            aria-label="Reset zoom"
          >
            <Icon icon="mdi:fit-to-screen" className="text-xl" />
          </Button>
        )}
        <Button
          onPress={handleZoomIn}
          size="sm"
          isIconOnly
          className="bg-white shadow-lg hover:bg-gray-50 touch-manipulation min-w-[44px] min-h-[44px]"
          aria-label="Zoom in"
          isDisabled={zoom >= maxZoom}
        >
          <Icon icon="mdi:plus" className="text-xl" />
        </Button>
        <Button
          onPress={handleZoomOut}
          size="sm"
          isIconOnly
          className="bg-white shadow-lg hover:bg-gray-50 touch-manipulation min-w-[44px] min-h-[44px]"
          aria-label="Zoom out"
          isDisabled={zoom <= minZoom}
        >
          <Icon icon="mdi:minus" className="text-xl" />
        </Button>
      </div>

      {/* Container con zoom */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto touch-pan-x touch-pan-y"
        style={{
          touchAction: isZooming ? "none" : "pan-x pan-y pinch-zoom",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div
          ref={contentRef}
          className="origin-center transition-transform duration-200 ease-out flex items-start justify-start"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center top",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          {children}
        </div>
      </div>

      {/* Indicatore zoom */}
      {zoom !== initialZoom && (
        <div className="fixed top-24 md:top-28 right-3 md:right-6 z-30 bg-white/95 backdrop-blur-sm shadow-lg rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200">
          {Math.round(zoom * 100)}%
        </div>
      )}
    </div>
  );
}
