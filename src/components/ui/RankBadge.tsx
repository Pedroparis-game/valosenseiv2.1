import React from 'react';
import { motion } from 'motion/react';
import { getOfficialRankIcon } from '../../utils/rankUtils';
import { useState, useEffect } from 'react';

interface RankBadgeProps {
  rank: string;
  rankImageUrl?: string;
  rr?: number;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rank, rankImageUrl, rr, className = '' }) => {
  const [iconUrl, setIconUrl] = useState<string>(
    rankImageUrl || "https://media.valorant-api.com/competitivetiers/03621f13-4c37-ad53-9043-695333d57551/0/largeicon.png"
  );

  useEffect(() => {
    if (rankImageUrl) {
      setIconUrl(rankImageUrl);
      return;
    }
    const loadIcon = async () => {
      const url = await getOfficialRankIcon(rank);
      setIconUrl(url);
    };
    loadIcon();
  }, [rank, rankImageUrl]);

  // Determine glow based on rank tier
  const isHighRank = rank.toLowerCase().includes('immortal') || rank.toLowerCase().includes('radiant');
  const isRadiant = rank.toLowerCase().includes('radiant');
  
  const glowColor = isRadiant ? 'rgba(255, 248, 214, 0.6)' : isHighRank ? 'rgba(255, 70, 85, 0.4)' : 'rgba(0, 229, 255, 0.2)';

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <motion.div 
        className="relative z-10 w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center"
        animate={isHighRank ? { y: [0, -5, 0] } : {}}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <img 
          src={iconUrl} 
          alt={rank} 
          className="w-full h-full object-contain drop-shadow-xl z-10 relative"
          style={{ filter: `drop-shadow(0 0 15px ${glowColor})` }}
          referrerPolicy="no-referrer"
        />
        
        {/* Continuous pulse for high ranks */}
        {isHighRank && (
          <motion.div
            className="absolute inset-0 rounded-full z-0"
            style={{ boxShadow: `0 0 40px ${glowColor}` }}
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
      
      <div className="mt-4 text-center">
        <h3 className="font-display text-2xl uppercase tracking-widest text-text-main drop-shadow-md">{rank}</h3>
        {rr !== undefined && (
          <div className="text-sm font-mono text-accent-secondary mt-1 tracking-widest">
            {rr} RR
          </div>
        )}
      </div>
    </div>
  );
};
