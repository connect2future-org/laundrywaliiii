import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { MapPin, Calendar, Clock, User, Phone, Store, ShieldCheck } from 'lucide-react';

export const OrderSummary = ({ customerData, addressData, scheduleData, branchData }) => {
  const { cartItems, subtotal, deliveryFee, gst, total, pricingSettings, verifiedQuote, isVerifyingQuote } = useCart();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Pickup Details Card */}
      <div
        className="card-modern-flat"
        style={{ padding: '1.15rem', borderRadius: 'var(--radius-lg)', background: '#FAFAFC' }}
      >
        <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--color-purple)' }}>
          Pickup & Delivery Schedule
        </h5>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={15} color="var(--color-pink)" />
            <span><strong>Date:</strong> {scheduleData?.date?.displayDay}, {scheduleData?.date?.displayDate}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={15} color="var(--color-pink)" />
            <span><strong>Slot:</strong> {scheduleData?.slot?.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', gridColumn: 'span 2' }}>
            <MapPin size={15} color="var(--color-pink)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Address:</strong> {addressData?.addressLine || [addressData?.houseNo, addressData?.street, addressData?.area].filter(Boolean).join(', ')}
              {addressData?.landmark ? ` (Landmark: ${addressData.landmark})` : ''}
              {addressData?.pincode ? ` - ${addressData.pincode}` : ''}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={15} color="var(--color-purple)" />
            <span><strong>Name:</strong> {customerData?.name}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Phone size={15} color="var(--color-purple)" />
            <span><strong>Phone:</strong> {customerData?.phone}</span>
          </div>

          {branchData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
              <Store size={15} color="var(--color-purple)" />
              <span><strong>Hub:</strong> {branchData.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div>
        <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', marginBottom: '0.65rem' }}>
          Items in Pickup ({cartItems.length})
        </h5>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto' }}>
          {cartItems.map((item) => (
            <div
              key={item.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 0.85rem',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.82rem'
              }}
            >
              <div>
                <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{item.name}</span>
                <span style={{ color: 'var(--color-muted)', marginLeft: '6px' }}>× {item.quantity}</span>
              </div>
              <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>
                {formatINR(item.unitPrice * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Price breakdown */}
      <div
        style={{
          padding: '1rem',
          background: 'var(--color-cream)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', fontWeight: 600, color: '#059669', marginBottom: '0.2rem' }}>
          <ShieldCheck size={14} />
          <span>{isVerifyingQuote ? 'Verifying live pricing with server...' : verifiedQuote ? 'Server-verified live pricing' : 'Live pricing'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
          <span>Pickup & Delivery Fee</span>
          <span style={{ color: deliveryFee === 0 ? '#10B981' : 'inherit', fontWeight: 600 }}>
            {deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
          <span>GST ({pricingSettings?.gstPercentage ?? 0}%)</span>
          <span>{formatINR(gst)}</span>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: '0.5rem',
            marginTop: '0.35rem',
            borderTop: '1px dashed var(--color-border)',
            fontSize: '1.05rem',
            fontWeight: 700,
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-purple)'
          }}
        >
          <span>Total Payable</span>
          <span>{formatINR(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

