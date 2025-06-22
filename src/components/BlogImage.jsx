import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BlogImage = ({ src, alt, title }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="my-8 relative">
      <div 
        className={`
          relative overflow-hidden rounded-lg border border-space-border
          ${!isLoaded ? 'min-h-[200px] bg-space-card animate-pulse' : ''}
          ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}
        `}
        onClick={toggleZoom}
      >
        <motion.img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`
            w-full h-auto object-cover
            ${error ? 'hidden' : ''}
          `}
        />
        {error && (
          <div className="flex items-center justify-center h-48 bg-space-card text-white/60">
            Failed to load image
          </div>
        )}
      </div>
      
      {title && (
        <motion.p 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-sm text-white/60 text-center mt-2 font-atkinson"
        >
          {title}
        </motion.p>
      )}

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={toggleZoom}
          >
            <motion.img
              src={src}
              alt={alt}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-full max-h-full object-contain"
            />
            {title && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 left-0 right-0 text-center text-white/80 text-sm font-atkinson"
              >
                {title}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 