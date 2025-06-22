import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = forwardRef(({ 
  children, 
  content, 
  className = "", 
  style = {},
  textColor = "text-white",
  backgroundColor = "bg-black/90",
  borderColor = "border-t-black/90",
  showBorder = true,
  strokeColor = "border-white/20",
  strokeWidth = "border",
  tooltipPosition = "top"
}, ref) => {
  const [show, setShow] = useState(false);
  const [horizontalPosition, setHorizontalPosition] = useState('center');
  const tooltipRef = useRef();
  const triggerRef = useRef();

  useEffect(() => {
    if (show && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      const triggerCenter = triggerRect.left + triggerRect.width / 2;
      const tooltipLeft = triggerCenter - tooltipWidth / 2;
      const tooltipRight = tooltipLeft + tooltipWidth;
      
      let newHorizontalPosition = 'center';
      if (tooltipRight > windowWidth - 20) {
        newHorizontalPosition = 'right';
      } else if (tooltipLeft < 20) {
        newHorizontalPosition = 'left';
      }
      
      setHorizontalPosition(newHorizontalPosition);
    }
  }, [show, tooltipPosition]);

  const getPositionClasses = () => {
    const verticalPosition = tooltipPosition === 'top' ? 'bottom-full' : 'top-full';
    const marginClass = tooltipPosition === 'top' ? 'mb-2' : 'mt-2';
    
    switch (horizontalPosition) {
      case 'right':
        return `${verticalPosition} right-0 transform translate-x-0 ${marginClass}`;
      case 'left':
        return `${verticalPosition} left-0 transform translate-x-0 ${marginClass}`;
      default:
        return `${verticalPosition} left-1/2 transform -translate-x-1/2 ${marginClass}`;
    }
  };

  const getBorderPosition = () => {
    switch (horizontalPosition) {
      case 'right':
        return 'right-4';
      case 'left':
        return 'left-4';
      default:
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  const getBorderDirection = () => {
    const arrowPosition = tooltipPosition === 'top' ? 'top-full' : 'bottom-full';
    const borderDirection = tooltipPosition === 'top' ? 'border-t-4 border-l-4 border-r-4 border-b-0' : 'border-b-4 border-l-4 border-r-4 border-t-0';
    return `${arrowPosition} ${borderDirection}`;
  };

  return (
    <div className="relative inline-block">
      <div
        ref={(el) => {
          if (ref) ref.current = el;
          triggerRef.current = el;
        }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      
      <AnimatePresence>
        {show && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: tooltipPosition === 'top' ? -2 : 2, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: tooltipPosition === 'top' ? -2 : 2, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-[100] pointer-events-auto ${backgroundColor} ${textColor} text-xs px-3 py-2 rounded ${strokeWidth} ${strokeColor} ${getPositionClasses()} ${className} font-atkinson`}
            style={{ 
              whiteSpace: className.includes('whitespace-nowrap') ? 'nowrap' : 'normal', 
              wordWrap: 'break-word',
              marginBottom: style.marginBottom || '0.5rem',
              ...style 
            }}
          >
            {typeof content === "string" ? content : content}
            {showBorder && (
              <div className={`absolute w-0 h-0 border-transparent ${getBorderDirection()} ${borderColor} ${getBorderPosition()}`}></div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Tooltip.displayName = 'Tooltip'; 