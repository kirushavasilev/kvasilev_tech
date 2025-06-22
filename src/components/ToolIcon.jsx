import React from 'react';

const toolConfig = {
  kicad: {
    name: 'KiCAD',
    icon: '/assets/tools/kicad.png',
    invert: false
  },
  fusion360: {
    name: 'Fusion 360',
    icon: '/assets/tools/fusion360.png',
    invert: false
  },
  solidworks: {
    name: 'SolidWorks',
    icon: '/assets/tools/solidworks.png',
    invert: false
  },
  raspberrypi: {
    name: 'Raspberry Pi',
    icon: '/assets/tools/raspberry-pi.png',
    invert: false
  },
  soldering: {
    name: 'Soldering',
    icon: '/assets/tools/soldering-iron.png',
    invert: true
  },
  arduino: {
    name: 'Arduino',
    icon: '/assets/tools/arduino.png',
    invert: true
  },
  criticalthinking: {
    name: "Engineer's Thought",
    icon: '/assets/tools/thought.png',
    invert: true
  },
  vpshosting: {
    name: 'VPS Hosting',
    icon: '/assets/tools/servers.png',
    invert: true
  }
};

export const ToolIcon = ({ tool }) => {
  const config = toolConfig[tool.toLowerCase()];
  
  if (!config) return null;

  return (
    <div className="group relative inline-flex flex-col items-center">
      <div className="rounded-lg bg-space-card border border-space-border p-3 transition-all duration-300 ease-in-out hover:border-space-accent/50 hover:scale-105">
        <img 
          src={config.icon} 
          alt={config.name}
          className={`w-6 h-6 object-contain ${config.invert ? 'brightness-0 invert' : ''}`}
          onError={(e) => {
            console.warn(`Failed to load icon for ${config.name}`);
            e.target.src = '/assets/tools/placeholder.svg';
          }}
        />
      </div>
      <div className="absolute -bottom-8 pointer-events-none">
        <div 
          className="
            opacity-0 scale-95 -translate-y-1
            group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
            transition-all duration-150 ease-out
            px-3 py-2 rounded
            bg-black/90
            border border-white/20
            text-xs text-white font-atkinson whitespace-nowrap
          "
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 rotate-45 border-t border-l border-white/20"></div>
          {config.name}
        </div>
      </div>
    </div>
  );
};

export const ToolsShowcase = ({ tools }) => {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {tools.map((tool, index) => (
        <ToolIcon key={index} tool={tool} />
      ))}
    </div>
  );
}; 