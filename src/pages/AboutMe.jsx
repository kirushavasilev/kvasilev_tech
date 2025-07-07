import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '../components/Tooltip';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Helmet } from 'react-helmet-async';

dayjs.extend(utc);

function useMilanTime() {
  const [date, setDate] = useState(() => dayjs().utc().add(2, 'hour')); // UTC+2 for Milan time

  useEffect(() => {
    const update = () => {
      setDate(dayjs().utc().add(2, 'hour'));
    };

    const id = setInterval(update, 60 * 1000); // Update every minute
    return () => clearInterval(id);
  }, []);

  return date;
}

const CurrentAge = () => {
  const ref = React.useRef(null);
  const [msVariation, setMsVariation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const update = () => {
    const age = (
      (new Date().getTime() - new Date("2007-09-26T20:25:00Z").getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
    ).toFixed(10);

    if (ref.current) {
      ref.current.innerText = `Roughly ${213 + msVariation}ms ago (factoring in display rendering, network latency, visual processing delays, and your brain's perceptual lag), \n I was precisely ${age} years old.`
    }
  };

  const animateNumber = (targetMs) => {
    setIsAnimating(true);
    let currentMs = 213;
    const steps = 20; // Number of animation steps
    const stepDuration = 50; // 50ms per step for fast animation
    
    for (let i = 0; i <= steps; i++) {
      setTimeout(() => {
        const progress = i / steps;
        const animatedMs = Math.round(213 + (targetMs - 213) * progress);
        setMsVariation(animatedMs - 213);
      }, i * stepDuration);
    }
    
    // Reset animation state after completion
    setTimeout(() => setIsAnimating(false), steps * stepDuration);
  };

  useEffect(() => {
    // Update the ms variation every second with animation
    const msInterval = setInterval(() => {
      if (!isAnimating) {
        const newVariation = Math.floor(Math.random() * 11) - 5; // Random number between -5 and +5
        animateNumber(213 + newVariation);
      }
    }, 1000);

    // Update the age calculation every millisecond
    const ageInterval = setInterval(update, 1);
    
    return () => {
      clearInterval(msInterval);
      clearInterval(ageInterval);
    };
  }, [msVariation, isAnimating]);

  return <span ref={ref} />;
};

function useWarpDriveStarfield(ref) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;

    const STAR_COUNT = 1000;
    const SPEED = 20; // higher = faster

    // Create stars with pre-calculated properties
    let stars = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * width * 2,
      y: (Math.random() - 0.5) * height * 2,
      z: Math.random() * width,
      speed: SPEED * (0.9 + Math.random() * 0.2) // Slight speed variation
    }));

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw() {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, width, height);

      for (let star of stars) {
        star.z -= star.speed;
        
        if (star.z <= 0) {
          star.z = width;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        const sx = centerX + (star.x / star.z) * width;
        const sy = centerY + (star.y / star.z) * height;
        
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const px = centerX + (star.x / (star.z + star.speed)) * width;
          const py = centerY + (star.y / (star.z + star.speed)) * height;

          const alpha = 1 - star.z / width;
          const brightness = Math.min(255, 200 + (1 - star.z / width) * 55);

          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.strokeStyle = `rgba(${brightness},${brightness},${brightness},${alpha})`;
          ctx.lineWidth = 2 * (1 - star.z / width);
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);

    return () => window.removeEventListener('resize', resize);
  }, [ref]);
}

const AboutMe = () => {
  const [mounted, setMounted] = useState(false);
  const starfieldRef = React.useRef();
  useWarpDriveStarfield(starfieldRef);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const textBoxVariants = {
    hidden: { 
      opacity: 0, 
      x: -100,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: 0.3,
        ease: "easeOut"
      }
    }
  };

  const starfieldVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Kirill Vasilev - Space Enthusiast & Berkeley Engineering Student</title>
        <meta name="description" content="Space enthusiast and Berkeley MechE/ECE '29 student passionate about technology, engineering, and making an impact in space exploration." />
        <meta name="google-site-verification" content="joL3O0O0oewwTtklpO3v4pruLcTkr9qJUSFo31v2a8U" />
        <link rel="canonical" href="https://kvasilev.tech/" />
      </Helmet>

      <main className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div 
          className="w-screen h-screen flex items-center sm:justify-start justify-center bg-space-dark transition-colors duration-500 relative"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.canvas 
            ref={starfieldRef} 
            className="absolute inset-0 w-full h-full z-0"
            variants={starfieldVariants}
            initial="hidden"
            animate="visible"
            aria-hidden="true"
          />
          <motion.section 
            className="relative z-10 bg-space-card rounded-2xl shadow-xl max-w-md w-[92%] sm:w-full px-5 sm:px-6 py-6 flex flex-col gap-4 text-left text-[13px] leading-relaxed border border-space-border text-space-textDark sm:ml-16 ml-0 font-palatino"
            variants={textBoxVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="sr-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Kirill Vasilev - Space Enthusiast and Berkeley Engineering Student
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="text-[13px] sm:text-base"
            >
              Hey! I'm <span className="font-bold text-space-accent">Kirill Vasilev</span> — a <span className="font-bold text-space-accent">space enthusiast</span> driven to make an impact in the future world of tech.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="text-[13px] sm:text-base"
            >
              <span className="font-bold text-space-accent">Berkeley MechE / ECE / Physics '29</span>
            </motion.p>

            <motion.ul 
              className="list-disc ml-6 text-[13px] sm:text-base space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              aria-label="Key interests and activities"
            >
              <li><span className="font-bold text-space-accent"></span> On a road to a chess title</li>
              <li>Failed <span className="font-bold text-space-accent">physics prodigy</span></li>
             
            </motion.ul>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-[13px] sm:text-base"
            >
              One day, I hope to <span className="font-bold text-space-accent">leave beyond Earth</span> — until then, I'm striving to build what might help it happen.
            </motion.p>

            <motion.div 
              className="mt-2 text-xs sm:text-sm text-space-accent/80 font-atkinson"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <CurrentAge />
            </motion.div>
          </motion.section>
          
          <div className="sm:hidden absolute bottom-20 left-1/2 -translate-x-1/2">
            <Tooltip
              content="This is what it would look like… if a perfectly efficient exotic energy transfer system were capable of amplifying the collective momentum of 100,000 electrons and applying it to accelerate a SpaceX Starship to 90% of the speed of light on a direct course toward Sagittarius A, the supermassive black hole at the center of the Milky Way. The visual phenomena displayed — including relativistic aberration, forward compression of starlight, and Doppler shifting — reflect the real predictions of special relativity at such velocities."
              className="text-xs leading-relaxed"
              style={{ width: '748px' }}
            >
              <span className="underline cursor-help text-white/80 text-xs font-atkinson">Peek behind the simulation</span>
            </Tooltip>
          </div>
          
          <Footer />
        </motion.div>
      </main>
    </>
  );
};

const Footer = () => {
  const location = useLocation();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-white/80 font-atkinson text-xs">
            <span className="whitespace-nowrap">MIT License © 2025 Kirill Vasilev</span>
            <span className="hidden md:inline text-white/40">|</span>
            <span className="hidden md:inline">be cooked but keep moving.</span>
            <div className="flex items-center gap-2">
              <a href="https://www.linkedin.com/in/vasilevkirill/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://github.com/kirushavasilev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="mailto:kvasilev@berkeley.edu" className="hover:text-white transition-colors" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="inline align-middle">
                  <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
                  <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
                </svg>
              </a>
            </div>
          </div>
          {location.pathname === '/' && (
            <div className="hidden sm:block">
              <Tooltip
                content="This is what it would look like… if a perfectly efficient exotic energy transfer system were capable of amplifying the collective momentum of 100,000 electrons and applying it to accelerate a SpaceX Starship to 90% of the speed of light on a direct course toward Sagittarius A, the supermassive black hole at the center of the Milky Way. The visual phenomena displayed — including relativistic aberration, forward compression of starlight, and Doppler shifting — reflect the real predictions of special relativity at such velocities."
                className="text-xs leading-relaxed"
                style={{ width: '748px' }}
              >
                <span className="underline cursor-help text-white/80 text-xs font-atkinson">Peek behind the simulation</span>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

export default AboutMe; 
