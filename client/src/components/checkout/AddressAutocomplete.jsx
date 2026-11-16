import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

export const MYSORE_AREAS = [
  { area: 'KD Road (Dr Dejagav Circle)', pincode: '570012', city: 'Mysore' },
  { area: 'Jayalakshmipuram', pincode: '570012', city: 'Mysore' },
  { area: 'Gokulam 1st & 2nd Stage', pincode: '570002', city: 'Mysore' },
  { area: 'Gokulam 3rd & 4th Stage', pincode: '570002', city: 'Mysore' },
  { area: 'Saraswathipuram', pincode: '570009', city: 'Mysore' },
  { area: 'Kuvempunagar', pincode: '570023', city: 'Mysore' },
  { area: 'Vijayanagar 1st & 2nd Stage', pincode: '570017', city: 'Mysore' },
  { area: 'Vontikoppal', pincode: '570002', city: 'Mysore' },
  { area: 'Yadavagiri', pincode: '570020', city: 'Mysore' },
  { area: 'Siddhartha Layout', pincode: '570011', city: 'Mysore' },
  { area: 'Hebbal 1st & 2nd Stage', pincode: '570016', city: 'Mysore' },
  { area: 'Chamundipuram', pincode: '570004', city: 'Mysore' }
];

export const AddressAutocomplete = ({ value, onChange, onSelectArea }) => {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLocating, setIsLocating] = useState(false);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (val.trim().length > 1) {
      const filtered = MYSORE_AREAS.filter(
        (item) =>
          item.area.toLowerCase().includes(val.toLowerCase()) ||
          item.pincode.includes(val)
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (item) => {
    const formatted = `${item.area}, Mysore - ${item.pincode}`;
    setQuery(formatted);
    onChange(formatted);
    setSuggestions([]);
    if (onSelectArea) {
      onSelectArea(item);
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    setTimeout(() => {
      setIsLocating(false);
      const defaultArea = MYSORE_AREAS[0];
      const formatted = `KD Road, Mysore - 570012`;
      setQuery(formatted);
      onChange(formatted);
      if (onSelectArea) {
        onSelectArea(defaultArea);
      }
    }, 400);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          className="input-flat"
          placeholder="Search apartment, street, or area in Mysore..."
          value={query}
          onChange={handleInputChange}
          style={{ paddingRight: '120px' }}
        />
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'var(--color-pink-soft)',
            color: 'var(--color-pink)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '4px 10px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Navigation size={12} className={isLocating ? 'animate-spin' : ''} />
          <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>
      </div>

      {suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
            border: '1px solid var(--color-border)',
            marginTop: '4px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              style={{
                padding: '0.65rem 1rem',
                borderBottom: '1px solid var(--color-border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-pink-soft)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#FFFFFF')}
            >
              <MapPin size={14} color="var(--color-pink)" />
              <div>
                <strong>{item.area}</strong>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginLeft: '6px' }}>
                  ({item.pincode})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;
