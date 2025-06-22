import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Tooltip } from './Tooltip';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

function useMilanTime() {
  const [date, setDate] = React.useState(() => dayjs().utc().add(2, 'hour')); // UTC+2 for Milan time

  React.useEffect(() => {
    // Update immediately
    setDate(dayjs().utc().add(2, 'hour'));

    // Then update every second
    const id = setInterval(() => {
      setDate(dayjs().utc().add(2, 'hour'));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return date;
}

function Navbar() {
  const location = useLocation();
  const date = useMilanTime();
  const hour = date.hour();
  const isSleeping = hour >= 1 && hour < 7;

  const getLinkClass = (path) => {
    const baseClass = "font-bold px-2 py-0.5 rounded-full transition-colors duration-200 hover:text-space-accent focus:outline-none text-sm font-palatino whitespace-nowrap";
    const activeClass = "text-space-accent";
    const inactiveClass = "text-white/80";
    
    const isActive = location.pathname === path || (path === '/blog' && location.pathname.startsWith('/blog'));
    
    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="w-full flex flex-col items-center py-3 px-4 bg-transparent fixed top-0 left-0 right-0 z-50">
      <div className="w-full max-w-6xl mx-auto relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden sm:block">
          <TimeDisplay />
        </div>
        
        <div className="flex justify-center">
          <div className="flex gap-3 sm:gap-4 rounded-full bg-space-card border border-space-border px-3 sm:px-4 py-1 shadow items-center">
            <img 
              src="/assets/logo.svg" 
              alt="KV Logo" 
              className="w-7 sm:w-8 h-7 sm:h-8 mr-1 sm:mr-2"
              style={{ borderRadius: '50%' }}
            />
            <Link
              to="/"
              className={getLinkClass('/')}
            >
              About
            </Link>
            <Link
              to="/blog"
              className={getLinkClass('/blog')}
            >
              Blog
            </Link>
            <a
              href="/assets/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold px-2 py-0.5 rounded-full transition-colors duration-200 hover:text-space-accent focus:outline-none text-sm font-palatino text-white/80 whitespace-nowrap"
            >
              Resume
            </a>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 sm:hidden">
          <Tooltip
            content={isSleeping ? "This is Kirill's time. He is somewhere in Europe.. Kirill is likely sleeping.." : "This is Kirill's time. He is somewhere in Europe, probably locked in"}
            className="whitespace-normal max-w-[200px] text-center"
            tooltipPosition="bottom"
          >
            <p className="text-white flex cursor-help flex-row items-center gap-1.5 text-[15px] sm:text-[16px] font-atkinson">
              <span className="font-medium">
                {isSleeping ? "Kirill is likely sleeping.." : date.format("HH:mm")}
              </span>
            </p>
          </Tooltip>
        </div>
      </div>
    </nav>
  );
}

function TimeDisplay() {
  const date = useMilanTime();
  const hour = date.hour();
  const isSleeping = hour >= 1 && hour < 7;
  
  return (
    <Tooltip
      content={isSleeping ? "This is Kirill's time. He is somewhere in Europe.. Kirill is likely sleeping.." : "This is Kirill's time. He is somewhere in Europe, probably locked in"}
      className="whitespace-normal max-w-[200px] text-center"
      tooltipPosition="bottom"
    >
      <p className="text-white flex cursor-help flex-row items-center gap-1.5 text-[15px] sm:text-[16px] font-atkinson">
        <span className="font-medium">
          {isSleeping ? "Kirill is likely sleeping.." : date.format("HH:mm")}
        </span>
        {!isSleeping && (
          <>
            <span className="bg-white block size-[3px] rounded-full" />
            <span className="text-white/70">
              {date.format("MMM D, YYYY")}
            </span>
          </>
        )}
      </p>
    </Tooltip>
  );
}

export default function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
} 