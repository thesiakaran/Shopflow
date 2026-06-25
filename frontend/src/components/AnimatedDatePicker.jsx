import { useState, useRef, useEffect } from 'react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function AnimatedDatePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('days'); // 'days' | 'months'
  const [currentDate, setCurrentDate] = useState(() => {
    return value ? new Date(value) : new Date(2000, 0, 1); // Default to year 2000 for DOB
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
            boxShadow: 'var(--shadow-lg)',
            minHeight: '280px', display: 'flex', flexDirection: 'column'
          }}
        >
          {view === 'days' ? (
            <div className="animate-fadeIn" style={{ flex: 1 }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <button className="btn btn-ghost btn-sm" onClick={prevMonth} style={{ padding: '4px 12px', fontSize: '16px' }}>←</button>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={(e) => { e.preventDefault(); setView('months'); }} 
                  style={{ fontWeight: 700, fontSize: '15px', padding: '4px 12px', borderRadius: '8px' }}
                >
                  {MONTHS[month]} {year} ▾
                </button>
                <button className="btn btn-ghost btn-sm" onClick={nextMonth} style={{ padding: '4px 12px', fontSize: '16px' }}>→</button>
              </div>

              {/* Days of Week */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-subtle)' }}>{d}</div>
                ))}
              </div>

              {/* Calendar Grid (Animated) */}
              <div style={{ position: 'relative', flex: 1 }}>
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
          ) : (
            <div className="animate-fadeIn" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Year & Month Selector View */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Select Year & Month</h3>
                <button 
                  className="btn btn-ghost btn-sm" 
                  onClick={(e) => { e.preventDefault(); setView('days'); }} 
                  style={{ padding: '4px 12px', fontSize: '14px' }}
                >
                  Cancel
                </button>
              </div>

              {/* Year Selector */}
              <div style={{ marginBottom: '16px' }}>
                <select 
                  className="input" 
                  value={year} 
                  onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), month, 1))}
                  style={{ fontWeight: 600, cursor: 'pointer' }}
                >
                  {Array.from({ length: 100 }).map((_, i) => {
                    const y = new Date().getFullYear() - i;
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>

              {/* Months Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1 }}>
                {MONTHS.map((mName, mIdx) => {
                  const isCurrentMonth = mIdx === month;
                  return (
                    <button
                      key={mName}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentDate(new Date(year, mIdx, 1));
                        setView('days');
                      }}
                      style={{
                        padding: '12px 4px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        fontSize: '13px', fontWeight: 600, transition: 'all 0.2s',
                        background: isCurrentMonth ? 'var(--primary)' : 'var(--bg-hover)',
                        color: isCurrentMonth ? 'white' : 'var(--text-primary)',
                        boxShadow: isCurrentMonth ? '0 0 12px rgba(124,58,237,0.4)' : 'none'
                      }}
                      onMouseEnter={(e) => { if (!isCurrentMonth) e.target.style.background = 'var(--border)'; }}
                      onMouseLeave={(e) => { if (!isCurrentMonth) e.target.style.background = 'var(--bg-hover)'; }}
                    >
                      {mName.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
