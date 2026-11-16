import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { servicesApi } from '../../services/api';
import ServiceCard from '../services/ServiceCard';

export const ServicesPreview = ({ onOpenCustomize, onQuickAdd }) => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const categories = await servicesApi.getAll();
        if (active) {
          setFeaturedServices(Array.isArray(categories) ? categories.slice(0, 4) : []);
        }
      } catch (err) {
        if (active) setError(err.message || 'Unable to load services.');
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="section" style={{ background: '#FFFDFB' }}>
      <div className="container">
        <div className="section-title-wrap">
          <span className="heading-sub">Curated Fabric Care</span>
          <h2 className="heading-section" style={{ color: 'var(--color-purple)' }}>
            Our Services
          </h2>
          <p className="text-lead" style={{ marginTop: '0.65rem' }}>
            Complete laundry care for your everyday and special wear.
          </p>
        </div>

        {isLoading ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: '2.5rem' }}>
            Loading services...
          </p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: '#B91C1C', marginBottom: '2.5rem' }}>
            {error}
          </p>
        ) : featuredServices.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: '2.5rem' }}>
            No active services available at the moment.
          </p>
        ) : (
          <div className="grid-4" style={{ marginBottom: '3.5rem' }}>
            {featuredServices.map((service) => (
              <ServiceCard
                key={service._id || service.categorySlug}
                service={service}
                onOpenCustomize={onOpenCustomize}
                onQuickAdd={onQuickAdd}
              />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center' }}>
          <Link
            to="/services"
            className="btn-pill-outline"
            style={{ padding: '0.95rem 2.5rem', fontSize: '0.98rem' }}
          >
            <span>Explore All Services</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
