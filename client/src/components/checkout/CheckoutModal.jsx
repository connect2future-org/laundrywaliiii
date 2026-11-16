import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Check,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Store,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Truck,
  FileText
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import { isValidEmail, isValidPhone, validateRequired } from '../../utils/validators';
import { getNextDays, getPickupSlots, getTodayDateString, isSlotPastForDate } from '../../utils/formatters';
import { PRIMARY_BRANCH } from '../../config/branches';
import { BRAND_CONFIG } from '../../config/brand';
import { ordersApi, branchesApi } from '../../services/api';
import OrderSummary from './OrderSummary';
import CheckoutTransitionOverlay from './CheckoutTransitionOverlay';

export const CheckoutModal = ({ isOpen, onClose }) => {
  const {
    cartItems,
    subtotal,
    deliveryFee,
    gst,
    total,
    clearCart,
    verifyCartWithBackend,
    toQuoteItemsPayload,
    quoteError,
    isVerifyingQuote
  } = useCart();

  // Active step: 1 = Details & Address, 2 = Schedule & Notes, 3 = Summary & COD, 4 = Confirmation
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [transitionStatus, setTransitionStatus] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [liveBranches, setLiveBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(PRIMARY_BRANCH);

  // Form State: Customer Details
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Form State: Pickup Address
  const [address, setAddress] = useState({
    addressLine: '',
    landmark: '',
    pincode: '',
    city: 'Mysore'
  });

  // Form State: Schedule
  const daysList = useMemo(() => getNextDays(7), []);
  const allSlots = useMemo(() => getPickupSlots(), []);

  const [selectedDateStr, setSelectedDateStr] = useState(daysList[0]?.dateStr || getTodayDateString());
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [instructions, setInstructions] = useState('');

  const [errors, setErrors] = useState({});

  // Fetch verified active branch from backend on open
  useEffect(() => {
    if (!isOpen) return;
    setSubmitError('');
    verifyCartWithBackend();
    branchesApi
      .getAll()
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          setLiveBranches(list);
          const activeMatch = list.find((b) => b.isActive !== false) || list[0];
          if (activeMatch) {
            setSelectedBranch(activeMatch);
          }
        }
      })
      .catch(() => {});
  }, [isOpen, verifyCartWithBackend]);

  // Compute available slots for selected date (disable past same-day slots)
  const slotsWithStatus = useMemo(() => {
    const isToday = selectedDateStr === getTodayDateString();
    return allSlots.map((slot) => {
      const isPast = isToday && isSlotPastForDate(slot, selectedDateStr);
      return {
        ...slot,
        disabled: isPast
      };
    });
  }, [selectedDateStr, allSlots]);

  // Auto-select first available slot if currently selected is disabled or unselected
  useEffect(() => {
    const current = slotsWithStatus.find((s) => s.id === selectedSlotId);
    if (!current || current.disabled) {
      const firstAvailable = slotsWithStatus.find((s) => !s.disabled);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable.id);
      } else {
        setSelectedSlotId('');
      }
    }
  }, [selectedDateStr, slotsWithStatus, selectedSlotId]);

  if (!isOpen) return null;

  // Selected date object
  const activeDateObj =
    daysList.find((d) => d.dateStr === selectedDateStr) || {
      dateStr: selectedDateStr,
      displayDay: new Date(selectedDateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      displayDate: new Date(selectedDateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      raw: new Date(selectedDateStr)
    };

  const activeSlotObj = slotsWithStatus.find((s) => s.id === selectedSlotId);

  // Validation functions
  const validateStep1 = () => {
    const errs = {};
    if (!validateRequired(customer.name)) {
      errs.name = 'Full name is mandatory.';
    }
    const cleanPhone = String(customer.phone).replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (customer.email && customer.email.trim() && !isValidEmail(customer.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!validateRequired(address.addressLine)) {
      errs.addressLine = 'Pickup address is mandatory. Please enter your complete address.';
    }
    if (address.pincode && address.pincode.trim() && !/^\d{6}$/.test(address.pincode.trim())) {
      errs.pincode = 'If entered, PIN code must be exactly 6 digits.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    const todayStr = getTodayDateString();
    if (!selectedDateStr || selectedDateStr < todayStr) {
      errs.date = 'Please select today or a future pickup date.';
    }
    if (!selectedSlotId || !activeSlotObj) {
      errs.slot = 'Please select an available pickup time slot.';
    } else if (activeSlotObj.disabled) {
      errs.slot = 'The selected time slot has already passed for today. Please select an upcoming slot.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    setSubmitError('');
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setSubmitError('');
    if (step > 1 && step < 4) {
      setStep((s) => s - 1);
    }
  };

  const handleFinalSubmit = async () => {
    setSubmitError('');
    if (!validateStep1() || !validateStep2()) {
      setSubmitError('Please resolve the required fields before confirming.');
      return;
    }

    if (cartItems.length === 0) {
      setSubmitError('Your cart is empty. Please add services before checkout.');
      return;
    }

    setIsSubmitting(true);
    setTransitionStatus('Saving your booking and connecting to WhatsApp...');

    const resolvedBranchId = selectedBranch?._id || '6af559e2882ab3872be9edc8';

    const orderPayload = {
      customer: {
        fullName: customer.name.trim(),
        phone: customer.phone.replace(/\D/g, '').trim(),
        email: customer.email?.trim() || null
      },
      branchId: resolvedBranchId,
      pickupAddress: {
        addressLine: address.addressLine.trim(),
        landmark: address.landmark?.trim() || '',
        pincode: address.pincode?.trim() || '',
        city: 'Mysore'
      },
      schedule: {
        pickupDate: new Date(`${selectedDateStr}T10:00:00`).toISOString(),
        pickupSlot: activeSlotObj?.label || '10:00 AM – 10:30 AM',
        instructions: instructions.trim()
      },
      items: toQuoteItemsPayload(cartItems),
      paymentMethod: 'cod'
    };

    // Pre-create popup window reference to avoid browser popup blockers
    let waWindow = null;
    try {
      waWindow = window.open('about:blank', '_blank');
    } catch {
      waWindow = null;
    }

    try {
      const response = await ordersApi.createOrder(orderPayload);
      setConfirmedOrder(response);
      clearCart();
      setStep(4);

      const msg = generateWhatsAppMessage(response);
      const phone = BRAND_CONFIG.contact.officialPhoneClean || '9035999272';
      const waUrl = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;

      if (waWindow && !waWindow.closed) {
        waWindow.location.href = waUrl;
      } else {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      if (waWindow && !waWindow.closed) {
        waWindow.close();
      }
      setSubmitError(err.message || 'Unable to place order. Please review your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBookingId = () => {
    if (confirmedOrder?.bookingId) {
      navigator.clipboard?.writeText(confirmedOrder.bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  // WhatsApp Message Generation
  const generateWhatsAppMessage = (orderData = confirmedOrder) => {
    const bookingId = orderData?.bookingId || confirmedOrder?.bookingId || 'LW-NEW';
    const name = customer.name.trim();
    const phone = customer.phone.trim();
    const addr = address.addressLine.trim();
    const landmark = address.landmark ? ` (Landmark: ${address.landmark.trim()})` : '';
    const pin = address.pincode ? ` - ${address.pincode.trim()}` : '';
    const dateText = `${activeDateObj.displayDay}, ${activeDateObj.displayDate}`;
    const slotText = activeSlotObj?.label || '';
    const branchName = selectedBranch.name || 'Laundry Waliii – Mysore';
    const totalAmount = formatINR(orderData?.order?.totalAmount ?? confirmedOrder?.order?.totalAmount ?? total);
    const notes = instructions.trim() ? `\n📝 *Notes:* ${instructions.trim()}` : '';

    const itemsSummary = (orderData?.items || confirmedOrder?.items || cartItems || [])
      .map((it) => {
        const itName = it.itemName || it.serviceName || it.name || 'Service';
        const itVariant = it.variantName ? ` (${it.variantName})` : '';
        const itQty = it.quantity || 1;
        const unitPrice = it.unitPrice || (it.lineTotal ? Math.round(it.lineTotal / itQty) : it.price) || 0;
        const lineTotal = it.lineTotal || unitPrice * itQty;
        return `• ${itName}${itVariant} — Qty: ${itQty} @ ${formatINR(unitPrice)} = ${formatINR(lineTotal)}`;
      })
      .join('\n');

    return `🧺 *NEW PICKUP ORDER - LAUNDRY WALIIII*
━━━━━━━━━━━━━━━━━━━━
🆔 *Order ID:* ${bookingId}
👤 *Customer Name:* ${name}
📞 *Customer Phone:* ${phone}
📍 *Pickup Address:* ${addr}${landmark}${pin}
📅 *Pickup Date:* ${dateText}
⏰ *Time Slot:* ${slotText}
🏢 *Assigned Outlet:* ${branchName}

🛍️ *Services Ordered:*
${itemsSummary || '• Standard wash & care package'}

💰 *Subtotal:* ${formatINR(subtotal)}
🚚 *Pickup & Delivery:* ${deliveryFee === 0 ? 'FREE' : formatINR(deliveryFee)}
✨ *Total Payable Amount:* ${totalAmount}
💵 *Payment Method:* Cash on Delivery (COD)
💳 *Payment Status:* Pending (Pay upon delivery)${notes}
━━━━━━━━━━━━━━━━━━━━
Thank you for choosing Laundry Waliiii!`.trim();
  };

  const handleOpenWhatsApp = () => {
    const msg = generateWhatsAppMessage(confirmedOrder);
    const phone = BRAND_CONFIG.contact.officialPhoneClean || '9035999272';
    const url = `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const resetAndClose = () => {
    setStep(1);
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1150,
        background: 'rgba(30, 10, 40, 0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && step !== 4 && !isSubmitting) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(57, 0, 79, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid #F0E6F5'
        }}
      >
        <CheckoutTransitionOverlay isVisible={isSubmitting} statusText={transitionStatus} />

        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #F1E9F5',
            background: 'linear-gradient(135deg, #FAF5FC 0%, #FFFFFF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #700F63, #E91E63)',
                  color: '#FFFFFF',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '100px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                {step <= 3 ? `Step ${step} of 3` : 'Booking Confirmed'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#700F63', fontWeight: 600 }}>
                {step === 1 && '• Details & Address'}
                {step === 2 && '• Pickup Schedule'}
                {step === 3 && '• Order Review & COD'}
                {step === 4 && '• Success'}
              </span>
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                color: '#39004F',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              {step === 1 && 'Customer Details & Pickup Address'}
              {step === 2 && 'Select Pickup Date & Time Slot'}
              {step === 3 && 'Review Order & Cash on Delivery'}
              {step === 4 && 'Pickup Scheduled Successfully!'}
            </h3>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close checkout"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid #EADDEC',
              background: '#FFFFFF',
              color: '#39004F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Line */}
        {step <= 3 && (
          <div style={{ width: '100%', height: '4px', background: '#F3E8F5' }}>
            <div
              style={{
                width: `${(step / 3) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #700F63, #E91E63)',
                transition: 'width 0.3s ease'
              }}
            />
          </div>
        )}

        {/* Scrollable Content */}
        <div className="checkout-modal-body" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 1.75rem' }}>
          <style>{`
            .checkout-grid-2col {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
              gap: 1rem;
            }
            .checkout-grid-full {
              grid-column: 1 / -1;
            }
            .checkout-grid-landmark {
              display: grid;
              grid-template-columns: 1.6fr 1fr;
              gap: 1rem;
            }
            .checkout-date-ribbon {
              display: flex;
              gap: 0.5rem;
              overflow-x: auto;
              padding-bottom: 0.45rem;
              margin-bottom: 0.85rem;
              scrollbar-width: thin;
              -webkit-overflow-scrolling: touch;
            }
            @media (max-width: 520px) {
              .checkout-grid-landmark {
                grid-template-columns: 1fr;
              }
              .checkout-modal-body {
                padding: 1.15rem 1.15rem !important;
              }
            }
          `}</style>
          {/* STEP 1: Customer Details & Pickup Address */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Section 1: Customer Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <User size={17} color="#700F63" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: '#39004F', margin: 0 }}>
                    1. Customer Information
                  </h4>
                </div>

                <div className="checkout-grid-2col">
                  {/* Full Name */}
                  <div className="checkout-grid-full">
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                      Full Name <span style={{ color: '#E91E63' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={customer.name}
                      onChange={(e) => {
                        setCustomer({ ...customer, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '12px',
                        border: errors.name ? '1.5px solid #EF4444' : '1px solid #D8C9DE',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: '#FCFAFD',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.name && <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                      Phone Number (10 digits) <span style={{ color: '#E91E63' }}>*</span>
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <div
                        style={{
                          padding: '0.75rem 0.85rem',
                          background: '#F5EEF7',
                          borderRadius: '12px',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          color: '#700F63',
                          border: '1px solid #E4D5E8',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        +91
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        placeholder="9876543210"
                        value={customer.phone}
                        onKeyDown={(e) => {
                          if (['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter'].includes(e.key)) {
                            return;
                          }
                          if (e.ctrlKey || e.metaKey) {
                            return;
                          }
                          if (!/^[0-9]$/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setCustomer({ ...customer, phone: digitsOnly });
                          if (errors.phone && digitsOnly.length === 10) setErrors({ ...errors, phone: '' });
                        }}
                        style={{
                          flex: 1,
                          padding: '0.75rem 0.95rem',
                          borderRadius: '12px',
                          border: errors.phone ? '1.5px solid #EF4444' : '1px solid #D8C9DE',
                          fontSize: '0.92rem',
                          outline: 'none',
                          background: '#FCFAFD',
                          letterSpacing: '0.04em',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    {errors.phone && <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
                  </div>

                  {/* Email Address (Optional) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                      Email Address <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#887B90' }}>(Optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="priya.sharma@example.com"
                      value={customer.email}
                      onChange={(e) => {
                        setCustomer({ ...customer, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '12px',
                        border: errors.email ? '1.5px solid #EF4444' : '1px solid #D8C9DE',
                        fontSize: '0.92rem',
                        outline: 'none',
                        background: '#FCFAFD',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.email && <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                  </div>
                </div>
              </div>

              {/* Section 2: Pickup Address */}
              <div style={{ borderTop: '1px dashed #EEDEF2', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <MapPin size={17} color="#700F63" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: '#39004F', margin: 0 }}>
                    2. Doorstep Pickup Address
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Complete Address Large Field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                      Complete Address <span style={{ color: '#E91E63' }}>*</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Enter your complete doorstep address (e.g. Flat 402, Oakwood Enclave, 2nd Cross, KD Road, Jayalakshmipuram, Mysore)"
                      value={address.addressLine}
                      onChange={(e) => {
                        setAddress({ ...address, addressLine: e.target.value });
                        if (errors.addressLine) setErrors({ ...errors, addressLine: '' });
                      }}
                      style={{
                        width: '100%',
                        padding: '0.85rem',
                        borderRadius: '12px',
                        border: errors.addressLine ? '1.5px solid #EF4444' : '1px solid #D8C9DE',
                        fontSize: '0.9rem',
                        lineHeight: 1.5,
                        outline: 'none',
                        background: '#FCFAFD',
                        resize: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    {errors.addressLine && (
                      <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.addressLine}
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: '#887B90', marginTop: '0.25rem', display: 'block' }}>
                      Enter your house/flat number, building, street, and area in one place.
                    </span>
                  </div>

                  {/* Landmark & PIN Code Grid */}
                  <div className="checkout-grid-landmark">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                        Landmark <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#887B90' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Near Westside / Kuvempu Trust"
                        value={address.landmark}
                        onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.95rem',
                          borderRadius: '12px',
                          border: '1px solid #D8C9DE',
                          fontSize: '0.9rem',
                          outline: 'none',
                          background: '#FCFAFD',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#39004F', marginBottom: '0.35rem' }}>
                        PIN Code <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#887B90' }}>(Optional)</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 570012"
                        value={address.pincode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                          setAddress({ ...address, pincode: val });
                          if (errors.pincode) setErrors({ ...errors, pincode: '' });
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.95rem',
                          borderRadius: '12px',
                          border: errors.pincode ? '1.5px solid #EF4444' : '1px solid #D8C9DE',
                          fontSize: '0.9rem',
                          outline: 'none',
                          background: '#FCFAFD',
                          boxSizing: 'border-box'
                        }}
                      />
                      {errors.pincode && (
                        <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.pincode}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Confirmed Outlet Badge */}
                  <div
                    style={{
                      padding: '0.9rem 1rem',
                      background: 'linear-gradient(135deg, #FAF4FC 0%, #F5ECFA 100%)',
                      borderRadius: '14px',
                      border: '1.5px solid #E8D5F0',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem'
                    }}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: '#700F63',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Store size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#39004F' }}>
                          {selectedBranch.name || 'Laundry Waliii – Mysore'}
                        </span>
                        <span
                          style={{
                            background: '#700F63',
                            color: '#FFFFFF',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '100px',
                            letterSpacing: '0.04em'
                          }}
                        >
                          Official Hub
                        </span>
                      </div>
                      <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: '#6A5E72', lineHeight: 1.4 }}>
                        {selectedBranch.address || '#5 Dr Dejagav Circle, near Westside, Kuvempu Trust Building, KD Road, Mysore – 570012'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Pickup Schedule & Special Instructions */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Pickup Date Selection */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={17} color="#700F63" />
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: '#39004F', margin: 0 }}>
                      1. Select Pickup Date <span style={{ color: '#E91E63' }}>*</span>
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#700F63', fontWeight: 600 }}>
                    Selected: {activeDateObj.displayDay}, {activeDateObj.displayDate}
                  </span>
                </div>

                {/* Quick Date Chips Ribbon */}
                <div className="checkout-date-ribbon">
                  {daysList.map((d) => {
                    const isSelected = selectedDateStr === d.dateStr;
                    return (
                      <button
                        key={d.dateStr}
                        type="button"
                        className="checkout-date-chip"
                        onClick={() => {
                          setSelectedDateStr(d.dateStr);
                          if (errors.date) setErrors({ ...errors, date: '' });
                        }}
                        style={{
                          padding: '0.65rem 0.4rem',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #700F63' : '1px solid #E8D9EC',
                          background: isSelected ? 'linear-gradient(135deg, #FAF2FB, #F4E5F6)' : '#FCFAFD',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          outline: 'none',
                          flex: '0 0 84px'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: isSelected ? '#700F63' : '#887B90',
                            display: 'block',
                            textTransform: 'uppercase'
                          }}
                        >
                          {d.displayDay}
                        </span>
                        <span
                          style={{
                            fontSize: '0.92rem',
                            fontWeight: 800,
                            color: isSelected ? '#39004F' : '#2D2833',
                            display: 'block',
                            marginTop: '2px'
                          }}
                        >
                          {d.displayDate}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Date Input (with min = today) */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#FBF8FD', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #EFE4F2' }}>
                  <span style={{ fontSize: '0.8rem', color: '#554A5D', fontWeight: 600 }}>
                    Or pick any future date:
                  </span>
                  <input
                    type="date"
                    min={getTodayDateString()}
                    value={selectedDateStr}
                    onChange={(e) => {
                      if (e.target.value >= getTodayDateString()) {
                        setSelectedDateStr(e.target.value);
                        if (errors.date) setErrors({ ...errors, date: '' });
                      }
                    }}
                    style={{
                      padding: '0.35rem 0.65rem',
                      borderRadius: '8px',
                      border: '1px solid #D8C9DE',
                      fontSize: '0.82rem',
                      color: '#39004F',
                      fontWeight: 600,
                      background: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>
                {errors.date && <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.25rem', display: 'block' }}>{errors.date}</span>}
              </div>

              {/* Pickup Time Slots (10:00 AM to 8:00 PM, 30-min intervals) */}
              <div style={{ borderTop: '1px dashed #EEDEF2', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={17} color="#700F63" />
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: '#39004F', margin: 0 }}>
                      2. Select 30-Minute Pickup Window <span style={{ color: '#E91E63' }}>*</span>
                    </h4>
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#887B90' }}>
                    Store hours: 10:00 AM – 8:00 PM
                  </span>
                </div>

                {selectedDateStr === getTodayDateString() && (
                  <p style={{ fontSize: '0.78rem', color: '#700F63', margin: '0 0 0.75rem 0', background: '#F8EEFA', padding: '0.45rem 0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={14} />
                    <span>Past slots for today are automatically disabled. Select an upcoming window below.</span>
                  </p>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: '0.55rem',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    padding: '0.2rem'
                  }}
                >
                  {slotsWithStatus.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isDisabled = slot.disabled;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (!isDisabled) {
                            setSelectedSlotId(slot.id);
                            if (errors.slot) setErrors({ ...errors, slot: '' });
                          }
                        }}
                        style={{
                          padding: '0.7rem 0.85rem',
                          borderRadius: '12px',
                          border: isSelected
                            ? '2px solid #700F63'
                            : isDisabled
                            ? '1px dashed #E2D7E5'
                            : '1px solid #E8D9EC',
                          background: isSelected
                            ? 'linear-gradient(135deg, #FAF2FB, #F4E5F6)'
                            : isDisabled
                            ? '#F8F6F9'
                            : '#FFFFFF',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          opacity: isDisabled ? 0.5 : 1,
                          transition: 'all 0.15s ease',
                          outline: 'none',
                          textAlign: 'left'
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: '0.84rem',
                              fontWeight: isSelected ? 700 : 600,
                              color: isSelected ? '#39004F' : isDisabled ? '#9E94A3' : '#2D2833',
                              display: 'block'
                            }}
                          >
                            {slot.label}
                          </span>
                          {isDisabled && (
                            <span style={{ fontSize: '0.68rem', color: '#B91C1C', fontWeight: 600, display: 'block', marginTop: '1px' }}>
                              Time passed
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              background: '#700F63',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Check size={11} strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.slot && <span style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '0.35rem', display: 'block' }}>{errors.slot}</span>}
              </div>

              {/* Special Instructions (Optional) */}
              <div style={{ borderTop: '1px dashed #EEDEF2', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem' }}>
                  <FileText size={17} color="#700F63" />
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.98rem', color: '#39004F', margin: 0 }}>
                    3. Special Instructions <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#887B90' }}>(Optional)</span>
                  </h4>
                </div>
                <textarea
                  rows={2}
                  placeholder="Special care notes for our laundry team (e.g., tough stain on white shirt, gentle cycle for silk saree, separate laundry bags)..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid #D8C9DE',
                    fontSize: '0.88rem',
                    outline: 'none',
                    background: '#FCFAFD',
                    resize: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
          )}

          {/* STEP 3: Order Review & Cash on Delivery Payment */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
              {/* Order Summary Component */}
              <OrderSummary
                customerData={customer}
                addressData={address}
                scheduleData={{
                  date: activeDateObj,
                  slot: activeSlotObj
                }}
                branchData={selectedBranch}
              />

              {/* Payment Method Section: Cash on Delivery ONLY */}
              <div style={{ borderTop: '1px dashed #EEDEF2', paddingTop: '1.25rem' }}>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: '#39004F', marginBottom: '0.75rem' }}>
                  Payment Method
                </h4>

                <div
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: '2px solid #700F63',
                    background: 'linear-gradient(135deg, #FAF4FC 0%, #F5ECFA 100%)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    boxShadow: '0 4px 16px rgba(112, 15, 99, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#700F63',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h5 style={{ fontSize: '1.02rem', fontWeight: 800, margin: 0, color: '#39004F' }}>
                          Cash on Delivery (COD)
                        </h5>
                        <span
                          style={{
                            background: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.55rem',
                            borderRadius: '100px'
                          }}
                        >
                          Only Method Available
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: '#554A5D', margin: '0.35rem 0 0 0', lineHeight: 1.45 }}>
                        Pay safely at your doorstep upon receiving your freshly washed, ironed, and packaged garments.
                        You can pay the pilot via <strong>Cash</strong> or <strong>UPI (GPay/PhonePe/Paytm)</strong> after inspection.
                      </p>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#700F63', fontWeight: 600 }}>
                        <Check size={14} color="#10B981" />
                        <span>No advance deduction • Zero cancellation charge</span>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#700F63',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Confirmation Screen */}
          {step === 4 && confirmedOrder && (
            <div style={{ textAlign: 'center', padding: '0.5rem 0 1rem 0' }}>
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #E6F9F0 0%, #D1F4E4 100%)',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.25rem auto',
                  boxShadow: '0 10px 25px rgba(5, 150, 105, 0.22)'
                }}
              >
                <CheckCircle2 size={46} />
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.45rem',
                  color: '#39004F',
                  marginBottom: '0.35rem'
                }}
              >
                Order Placed Successfully!
              </h4>

              <p
                style={{
                  fontSize: '0.92rem',
                  color: '#5E5466',
                  maxWidth: '460px',
                  margin: '0 auto 1.5rem auto',
                  lineHeight: 1.5
                }}
              >
                Thank you, <strong>{customer.name}</strong>! Your order has been recorded in our system. Our delivery pilot will visit your doorstep at the chosen time.
              </p>

              {/* Order Details Card */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #FAF4FC 0%, #F5ECFA 100%)',
                  borderRadius: '20px',
                  border: '1.5px solid #EADDEF',
                  padding: '1.35rem',
                  maxWidth: '460px',
                  margin: '0 auto 1.5rem auto',
                  textAlign: 'left'
                }}
              >
                {/* Booking ID Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', paddingBottom: '0.75rem', borderBottom: '1px dashed #DEC9E4' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#776B80', display: 'block', fontWeight: 600 }}>
                      Unique Booking ID
                    </span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: '#39004F' }}>
                      {confirmedOrder.bookingId}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBookingId}
                    style={{
                      padding: '0.4rem 0.8rem',
                      borderRadius: '8px',
                      border: '1px solid #D8C9DE',
                      background: '#FFFFFF',
                      color: '#700F63',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {copiedId ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                    <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>

                <div style={{ fontSize: '0.84rem', color: '#332A3A', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div><strong>Customer:</strong> {customer.name} ({customer.phone})</div>
                  <div><strong>Pickup Address:</strong> {address.addressLine}{address.landmark ? ` (Landmark: ${address.landmark})` : ''}</div>
                  <div><strong>Pickup Schedule:</strong> {activeDateObj.displayDay}, {activeDateObj.displayDate} · {activeSlotObj?.label}</div>
                  <div><strong>Assigned Outlet:</strong> {selectedBranch.name || 'Laundry Waliii – Mysore'}</div>
                  <div><strong>Payment Method:</strong> Cash on Delivery (COD)</div>
                  <div><strong>Payment Status:</strong> <span style={{ color: '#D97706', fontWeight: 700 }}>Pending (Pay upon delivery)</span></div>
                  {confirmedOrder.order?.totalAmount !== undefined && (
                    <div style={{ marginTop: '0.35rem', paddingTop: '0.45rem', borderTop: '1px dashed #DEC9E4', fontSize: '0.98rem', fontWeight: 800, color: '#700F63', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total Payable:</span>
                      <span>{formatINR(confirmedOrder.order.totalAmount)}</span>
                    </div>
                  )}
                </div>

                {/* Items snapshot */}
                {Array.isArray(confirmedOrder.items) && confirmedOrder.items.length > 0 && (
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px dashed #DEC9E4', fontSize: '0.78rem' }}>
                    <strong style={{ color: '#700F63' }}>Services Booked:</strong>
                    {confirmedOrder.items.map((it) => (
                      <div key={it._id || `${it.categorySlug}-${it.itemCode}`} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                        <span>
                          {it.itemName || it.serviceName}
                          {it.variantName ? ` (${it.variantName})` : ''} × {it.quantity}
                        </span>
                        <span style={{ fontWeight: 600 }}>{formatINR(it.lineTotal)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Clean Order Saved Confirmation Card */}
                <div style={{
                  marginTop: '0.95rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.82rem',
                  lineHeight: 1.45,
                  background: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  color: '#166534',
                  textAlign: 'left'
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="#16A34A" />
                    <span>Order Saved in System</span>
                  </div>
                  <div style={{ color: '#374151', fontSize: '0.78rem' }}>
                    WhatsApp was launched to connect you with our manager (+91 {BRAND_CONFIG.contact.phone}). If WhatsApp did not open automatically, you can{' '}
                    <button
                      type="button"
                      onClick={handleOpenWhatsApp}
                      style={{
                        color: '#15803D',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      click here to launch WhatsApp
                    </button>.
                  </div>
                </div>
              </div>

              {/* Action Buttons: Done / Return to Website */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '380px', margin: '0 auto' }}>
                <button
                  type="button"
                  onClick={resetAndClose}
                  style={{
                    padding: '0.95rem 1.75rem',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #700F63 0%, #E91E63 100%)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.65rem',
                    boxShadow: '0 8px 20px rgba(112, 15, 99, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Check size={18} strokeWidth={2.5} />
                  <span>Done &amp; Return to Home</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    padding: '0.25rem'
                  }}
                >
                  <MessageCircle size={15} />
                  <span>Reopen WhatsApp Message</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        {step <= 3 && (
          <div style={{ borderTop: '1px solid #F1E9F5', background: '#FCFAFD' }}>
            {(submitError || quoteError) && (
              <div
                style={{
                  padding: '0.65rem 1.75rem 0',
                  color: '#DC2626',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <AlertCircle size={15} />
                <span>{submitError || quoteError}</span>
              </div>
            )}

            <div
              style={{
                padding: '1.15rem 1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.7rem 1.25rem',
                    borderRadius: '100px',
                    border: '1px solid #D8C9DE',
                    background: '#FFFFFF',
                    color: '#39004F',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.85rem',
                    borderRadius: '100px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #700F63, #E91E63)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(112, 15, 99, 0.25)'
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting || isVerifyingQuote || Boolean(quoteError)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem 2.25rem',
                    borderRadius: '100px',
                    border: 'none',
                    background: isSubmitting ? '#9E94A3' : 'linear-gradient(135deg, #700F63 0%, #E91E63 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 6px 20px rgba(112, 15, 99, 0.3)'
                  }}
                >
                  <MessageCircle size={18} />
                  <span>
                    {isSubmitting
                      ? 'Saving & Opening WhatsApp...'
                      : 'Confirm & Continue to WhatsApp'}
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
