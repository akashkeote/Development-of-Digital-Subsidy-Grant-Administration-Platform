import React, { useEffect, useRef } from 'react';

export const PhoneFarmerAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const frameIndex = useRef(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isLoaded = useRef(false);

  const TOTAL_FRAMES = 200;
  const FPS = 24;
  const frameInterval = 1000 / FPS;
  let lastTime = 0;

  useEffect(() => {
    // Preload images
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/anim-phone/frame_${i}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          isLoaded.current = true;
        }
      };
      images.push(img);
    }
    imagesRef.current = images;

    const render = (time: number) => {
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;

      if (isLoaded.current && deltaTime >= frameInterval) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const img = imagesRef.current[frameIndex.current];

        if (canvas && ctx && img && img.complete) {
          // Set canvas dimensions to match image on first render or window resize
          if (canvas.width !== img.naturalWidth) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
          }
          
          // Clear and draw
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }

        frameIndex.current = (frameIndex.current + 1) % TOTAL_FRAMES;
        lastTime = time - (deltaTime % frameInterval);
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-slate-50/50 rounded-[3rem] overflow-hidden border border-slate-100/50 shadow-inner p-4 relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <canvas
        ref={canvasRef}
        className="w-full max-w-[400px] h-auto object-contain transform group-hover:scale-105 transition-transform duration-700 ease-out"
        style={{ filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.1))' }}
      />
    </div>
  );
};
