import { useState, useRef, useEffect } from 'react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AnimatedDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => {
    return value ? new Date(value) : new Date();
  });
  const [slideDir, setSlideDir] = useState('');
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = (e) => {
    e.preventDefault();
    setSlideDir('slide-right');
    setTimeout(() => {
      setCurrentDate(new Date(year, month - 1, 1));
      setSlideDir('');
    }, 150);
  };

  const nextMonth = (e) => {
    e.preventDefault();
    setSlideDir('slide-left');
    setTimeout(() => {
      setCurrentDate(new Date(year, month + 1, 1));
      setSlideDir('');
    }, 150);
  };

  const selectDate = (day) => {
    const selected = new Date(year, month, day);
    // Format to yyyy-mm-dd
    const y = selected.getFullYear();
    const m = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const isSelected = (day) => {
    if (!value) return false;
    const vDate = new Date(value);
    return vDate.getDate() === day && vDate.getMonth() === month && vDate.getFullYear() === year;
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={containerRef}>
      {/* Input Field */}
      <div 
        className="input" 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: isOpen ? 'var(--bg-hover)' : 'var(--bg-surface)'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: value ? 'inherit' : 'var(--text-subtle)' }}>
          {value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select a date...'}
        </span>
        <span style={{ fontSize: '16px', opacity: 0.7, transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          📅
        </span>
      </div>

      {/* Animated Dropdown Calendar */}
      {isOpen && (
        <div 
          className="card glass animate-fadeIn" 
          style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            zIndex: 100, padding: '16px', overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <button className="btn btn-ghost btn-sm" onClick={prevMonth} style={{ padding: '4px 12px', fontSize: '16px' }}>←</button>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{MONTHS[month]} {year}</div>
            <button className="btn btn-ghost btn-sm" onClick={nextMonth} style={{ padding: '4px 12px', fontSize: '16px' }}>→</button>
          </div>

          {/* Days of Week */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {DAYS_OF_WEEK.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)' }}>{d}</div>
            ))}
          </div>

          {/* Calendar Grid (Animated) */}
          <div style={{ position: 'relative', minHeight: '200px' }}>
            <div 
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px',
                transition: 'all 0.15s ease',
                transform: slideDir === 'slide-left' ? 'translateX(-20px)' : slideDir === 'slide-right' ? 'translateX(20px)' : 'translateX(0)',
                opacity: slideDir ? 0 : 1
              }}
            >
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                return (
                  <button
                    key={day}
                    onClick={(e) => { e.preventDefault(); selectDate(day); }}
                    style={{
                      aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
                      transition: 'all 0.2s',
                      background: selected ? 'var(--primary)' : 'transparent',
                      color: selected ? 'white' : 'var(--text-primary)',
                      boxShadow: selected ? '0 0 12px rgba(124,58,237,0.5)' : 'none'
                    }}
                    onMouseEnter={(e) => { if (!selected) e.target.style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={(e) => { if (!selected) e.target.style.background = 'transparent'; }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
