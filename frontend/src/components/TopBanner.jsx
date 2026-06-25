import { useState, useEffect } from 'react';

export default function TopBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 12, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) return prev;
        let h = prev.hours;
        let m = prev.minutes;
        let s = prev.seconds - 1;
        
        if (s < 0) { s = 59; m -= 1; }
        if (m < 0) { m = 59; h -= 1; }
        
        return { hours: h, minutes: m, seconds: s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (n) => n.toString().padStart(2, '0');

  return (
    <div style={{
      background: 'linear-gradient(90deg, #f97316, #ef4444)',
      color: 'white', padding: '8px', textAlign: 'center', fontSize: '13px', fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      position: 'relative', zIndex: 100
    }}>
      <span className="animate-pulse" style={{ animationDuration: '2s' }}>🔥 FLASH SALE</span>
      <span>|</span>
      <span>Up to 50% off premium items</span>
      <span>|</span>
      <span style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '4px' }}>
        Ends in: 
        <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}</span>
      </span>
    </div>
  );
}
