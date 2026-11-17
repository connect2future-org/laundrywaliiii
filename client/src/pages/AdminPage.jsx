import { useState, useEffect, useCallback } from 'react';
import { adminApi, ADMIN_TOKEN_STORAGE_KEY } from '../services/api';
import { formatINR } from '../utils/currency';
import { formatPricingUnit } from '../config/services';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  ShieldCheck,
  LogOut,
  Plus,
  Save,
  ChevronDown,
  ChevronRight,
  Package,
  Layers,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ExternalLink
} from 'lucide-react';

const PRICING_UNIT_OPTIONS = ['kg', 'piece', 'set', 'item', 'fixed_size', 'pair', 'custom'];
const SELECTION_MODES = ['direct-unit', 'item-selection', 'customization'];
const VARIANT_TYPES = ['standard', 'treatment', 'size', 'tier'];
const ENQUIRY_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' }
];

export const AdminPage = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(() =>
    Boolean(localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY))
  );
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState('catalogue'); // 'catalogue' | 'orders' | 'enquiries' | 'settings'
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [enquirySearch, setEnquirySearch] = useState('');
  const [pricingSettings, setPricingSettings] = useState({
    gstPercentage: '',
    deliveryFee: '',
    freeDeliveryThreshold: ''
  });
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [expandedSlug, setExpandedSlug] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);

  // New Category Form
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCat, setNewCat] = useState({
    categorySlug: '',
    name: '',
    selectionMode: 'item-selection',
    pricingMethod: 'itemized',
    price: '',
    pricingUnit: 'piece',
    minQuantity: 1,
    quantityStep: 1,
    sortOrder: 10,
    description: ''
  });

  // New Item Form (per category)
  const [newItemSlug, setNewItemSlug] = useState('');
  const [newItem, setNewItem] = useState({
    itemCode: '',
    name: '',
    subCategory: '',
    basePrice: '',
    pricingUnit: 'piece',
    minQuantity: 1,
    quantityStep: 1
  });

  // New Variant Form (per item)
  const [newVariantTarget, setNewVariantTarget] = useState(null); // { slug, itemId }
  const [newVariant, setNewVariant] = useState({
    code: '',
    name: '',
    variantType: 'standard',
    price: '',
    additionalCharge: 0,
    unit: 'piece'
  });

  // New AddOn Form
  const [newAddOnSlug, setNewAddOnSlug] = useState('');
  const [newAddOn, setNewAddOn] = useState({
    code: '',
    name: '',
    price: '',
    description: ''
  });

  const showToast = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4500);
  };

  const loadAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [cats, ordRes, settingsRes, enqRes] = await Promise.all([
        adminApi.getAllServices(),
        adminApi.listOrders({ limit: 25 }),
        adminApi.getPricingSettings(),
        adminApi.listEnquiries({
          ...(enquiryStatusFilter !== 'all' ? { status: enquiryStatusFilter } : {}),
          ...(enquirySearch.trim() ? { search: enquirySearch.trim() } : {})
        })
      ]);
      setCategories(Array.isArray(cats) ? cats : []);
      setOrders(ordRes?.orders || []);
      setEnquiries(enqRes?.enquiries || []);
      if (settingsRes) {
        setPricingSettings({
          gstPercentage: settingsRes.gstPercentage,
          deliveryFee: settingsRes.deliveryFee,
          freeDeliveryThreshold: settingsRes.freeDeliveryThreshold
        });
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to load admin data.');
    } finally {
      setLoadingData(false);
    }
  }, [enquiryStatusFilter, enquirySearch]);

  const handleUpdateEnquiryStatus = async (enquiryId, status) => {
    try {
      const res = await adminApi.updateEnquiry(enquiryId, { status });
      setEnquiries((prev) =>
        prev.map((item) => (item._id === enquiryId ? { ...item, ...res.enquiry } : item))
      );
      showToast('success', 'Enquiry status updated.');
    } catch (err) {
      showToast('error', err.message || 'Failed to update enquiry status.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
    if (!token) {
      return;
    }
    adminApi
      .getProfile()
      .then((res) => {
        setAdminUser(res.admin);
        loadAdminData();
      })
      .catch(() => {
        localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      })
      .finally(() => setAuthChecking(false));
  }, [loadAdminData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await adminApi.login(loginEmail.trim(), loginPassword);
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, res.token);
      setAdminUser(res.admin);
      setLoginPassword('');
      await loadAdminData();
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setAdminUser(null);
    setCategories([]);
    setOrders([]);
  };

  const handleSaveCategory = async (cat, patch) => {
    try {
      await adminApi.updateCategory(cat.categorySlug, patch);
      showToast('success', `Updated category "${cat.name}".`);
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update category.');
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCategory({
        ...newCat,
        price: newCat.price === '' ? null : Number(newCat.price),
        minQuantity: Number(newCat.minQuantity) || 1,
        quantityStep: Number(newCat.quantityStep) || 1,
        sortOrder: Number(newCat.sortOrder) || 0
      });
      showToast('success', `Created category "${newCat.name}".`);
      setShowNewCat(false);
      setNewCat({
        categorySlug: '',
        name: '',
        selectionMode: 'item-selection',
        pricingMethod: 'itemized',
        price: '',
        pricingUnit: 'piece',
        minQuantity: 1,
        quantityStep: 1,
        sortOrder: 10,
        description: ''
      });
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to create category.');
    }
  };

  const handleAddItem = async (e, slug) => {
    e.preventDefault();
    try {
      const basePriceNum = Number(newItem.basePrice);
      await adminApi.addItem(slug, {
        itemCode: newItem.itemCode.trim().toLowerCase(),
        name: newItem.name.trim(),
        subCategory: newItem.subCategory.trim() || null,
        basePrice: basePriceNum,
        pricingUnit: newItem.pricingUnit,
        minQuantity: Number(newItem.minQuantity) || 1,
        quantityStep: Number(newItem.quantityStep) || 1,
        variants: [
          {
            code: 'standard',
            name: 'Standard',
            variantType: 'standard',
            price: basePriceNum,
            additionalCharge: 0,
            unit: newItem.pricingUnit,
            isDefault: true
          }
        ]
      });
      showToast('success', `Added item "${newItem.name}".`);
      setNewItemSlug('');
      setNewItem({
        itemCode: '',
        name: '',
        subCategory: '',
        basePrice: '',
        pricingUnit: 'piece',
        minQuantity: 1,
        quantityStep: 1
      });
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to add item.');
    }
  };

  const handleUpdateItem = async (slug, itemId, patch) => {
    try {
      await adminApi.updateItem(slug, itemId, patch);
      showToast('success', 'Item updated.');
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update item.');
    }
  };

  const handleAddVariant = async (e, slug, itemId) => {
    e.preventDefault();
    try {
      await adminApi.addVariant(slug, itemId, {
        code: newVariant.code.trim().toLowerCase() || undefined,
        name: newVariant.name.trim(),
        variantType: newVariant.variantType,
        price: Number(newVariant.price),
        additionalCharge: Number(newVariant.additionalCharge || 0),
        unit: newVariant.unit
      });
      showToast('success', `Added variant "${newVariant.name}".`);
      setNewVariantTarget(null);
      setNewVariant({
        code: '',
        name: '',
        variantType: 'standard',
        price: '',
        additionalCharge: 0,
        unit: 'piece'
      });
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to add variant.');
    }
  };

  const handleUpdateVariant = async (slug, itemId, variantId, patch) => {
    try {
      await adminApi.updateVariant(slug, itemId, variantId, patch);
      showToast('success', 'Variant updated.');
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update variant.');
    }
  };

  const handleAddAddOn = async (e, slug) => {
    e.preventDefault();
    try {
      await adminApi.addAddOn(slug, {
        code: newAddOn.code.trim().toLowerCase(),
        name: newAddOn.name.trim(),
        price: Number(newAddOn.price),
        description: newAddOn.description.trim() || null
      });
      showToast('success', `Added add-on "${newAddOn.name}".`);
      setNewAddOnSlug('');
      setNewAddOn({ code: '', name: '', price: '', description: '' });
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to add add-on.');
    }
  };

  const handleUpdateAddOn = async (slug, addOnId, patch) => {
    try {
      await adminApi.updateAddOn(slug, addOnId, patch);
      showToast('success', 'Add-on updated.');
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to update add-on.');
    }
  };

  const handleViewOrderSnapshot = async (bookingId) => {
    try {
      const res = await adminApi.getOrderDetails(bookingId);
      setSelectedOrderDetail(res);
    } catch (err) {
      showToast('error', err.message || 'Unable to load order snapshot.');
    }
  };

  const handleSavePricingSettings = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updatePricingSettings({
        gstPercentage: Number(pricingSettings.gstPercentage),
        deliveryFee: Number(pricingSettings.deliveryFee),
        freeDeliveryThreshold: Number(pricingSettings.freeDeliveryThreshold)
      });
      showToast('success', 'Business pricing settings saved to MongoDB.');
      await loadAdminData();
    } catch (err) {
      showToast('error', err.message || 'Failed to save pricing settings.');
    }
  };

  if (authChecking) {
    return (
      <div style={{ paddingTop: '130px', minHeight: '70vh' }}>
        <LoadingSpinner text="Verifying admin session..." />
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div style={{ paddingTop: '120px', paddingBottom: '5rem', background: '#FCFAFC', minHeight: '85vh' }}>
        <div className="container" style={{ maxWidth: '440px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '24px', padding: '2.25rem', border: '1px solid #EEE9EF', boxShadow: '0 8px 30px rgba(23,20,33,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div className="card-icon-badge-pink" style={{ width: '44px', height: '44px' }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', margin: 0, color: '#171421' }}>
                  Admin Portal
                </h1>
                <p style={{ fontSize: '0.82rem', color: '#77717D', margin: 0 }}>
                  Catalogue, Pricing & Order Snapshots
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="form-label">Admin Email</label>
                <input
                  type="email"
                  className="input-flat"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@laundrywalii.com"
                />
              </div>
              <div>
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="input-flat"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter admin password"
                />
              </div>

              {loginError && (
                <div style={{ color: '#B91C1C', fontSize: '0.84rem', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}

              <button type="submit" className="btn-glow-submit" disabled={isLoggingIn}>
                <span>{isLoggingIn ? 'Signing in...' : 'Sign In to Admin Panel'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '110px', paddingBottom: '5rem', background: '#FCFAFC', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.75rem',
            background: '#FFFFFF',
            padding: '1.25rem 1.5rem',
            borderRadius: '20px',
            border: '1px solid #EEE9EF'
          }}
        >
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.55rem', margin: 0, color: '#171421' }}>
              Laundry Waliiii — Catalogue & Pricing Admin
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#77717D', margin: '0.2rem 0 0' }}>
              Signed in as <strong>{adminUser.fullName}</strong> ({adminUser.role})
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('catalogue')}
              className={activeTab === 'catalogue' ? 'btn-pill-primary' : 'btn-pill-outline'}
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
            >
              <Layers size={15} style={{ marginRight: '6px' }} />
              Catalogue ({categories.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={activeTab === 'orders' ? 'btn-pill-primary' : 'btn-pill-outline'}
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
            >
              <Package size={15} style={{ marginRight: '6px' }} />
              Orders ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={activeTab === 'enquiries' ? 'btn-pill-primary' : 'btn-pill-outline'}
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
            >
              <MessageSquare size={15} style={{ marginRight: '6px' }} />
              Enquiries ({enquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={activeTab === 'settings' ? 'btn-pill-primary' : 'btn-pill-outline'}
              style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
            >
              Pricing Settings
            </button>
            <button
              type="button"
              onClick={loadAdminData}
              className="btn-neu-icon"
              title="Refresh"
              style={{ width: '38px', height: '38px' }}
            >
              <RefreshCw size={16} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="btn-neu-icon"
              title="Logout"
              style={{ width: '38px', height: '38px', color: '#B91C1C' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Toast Feedback */}
        {feedback.text && (
          <div
            role="status"
            style={{
              marginBottom: '1.25rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '14px',
              background: feedback.type === 'error' ? '#FEF2F2' : '#ECFDF5',
              color: feedback.type === 'error' ? '#B91C1C' : '#065F46',
              border: `1px solid ${feedback.type === 'error' ? '#FECACA' : '#A7F3D0'}`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            {feedback.type === 'error' ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {loadingData && <LoadingSpinner text="Syncing with MongoDB..." />}

        {/* CATALOGUE TAB */}
        {activeTab === 'catalogue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-pill-primary"
                onClick={() => setShowNewCat((prev) => !prev)}
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.86rem' }}
              >
                <Plus size={15} style={{ marginRight: '6px' }} />
                {showNewCat ? 'Cancel New Category' : 'Add New Category'}
              </button>
            </div>

            {showNewCat && (
              <form
                onSubmit={handleCreateCategory}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: '1.5px solid #850078',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '1rem'
                }}
              >
                <div>
                  <label className="form-label">Category Slug *</label>
                  <input
                    className="input-flat"
                    required
                    placeholder="e.g. curtain-care"
                    value={newCat.categorySlug}
                    onChange={(e) => setNewCat({ ...newCat, categorySlug: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Category Name *</label>
                  <input
                    className="input-flat"
                    required
                    placeholder="e.g. Curtain Care"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Selection Mode</label>
                  <select
                    className="input-flat"
                    value={newCat.selectionMode}
                    onChange={(e) => setNewCat({ ...newCat, selectionMode: e.target.value })}
                  >
                    {SELECTION_MODES.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Direct Price (INR, optional)</label>
                  <input
                    type="number"
                    min="0"
                    className="input-flat"
                    placeholder="Leave blank if itemized"
                    value={newCat.price}
                    onChange={(e) => setNewCat({ ...newCat, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Unit</label>
                  <select
                    className="input-flat"
                    value={newCat.pricingUnit}
                    onChange={(e) => setNewCat({ ...newCat, pricingUnit: e.target.value })}
                  >
                    {PRICING_UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    min="0"
                    className="input-flat"
                    value={newCat.sortOrder}
                    onChange={(e) => setNewCat({ ...newCat, sortOrder: e.target.value })}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <input
                    className="input-flat"
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-pill-primary">
                    Create Category in MongoDB
                  </button>
                </div>
              </form>
            )}

            {categories.map((cat) => {
              const isExpanded = expandedSlug === cat.categorySlug;
              return (
                <CategoryAdminCard
                  key={`${cat._id}-${cat.updatedAt || cat.name}-${cat.price ?? ''}-${cat.isActive}-${cat.isCustomerVisible}`}
                  cat={cat}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedSlug(isExpanded ? null : cat.categorySlug)}
                  onSaveCategory={handleSaveCategory}
                  onUpdateItem={handleUpdateItem}
                  onUpdateVariant={handleUpdateVariant}
                  onUpdateAddOn={handleUpdateAddOn}
                  expandedItemId={expandedItemId}
                  setExpandedItemId={setExpandedItemId}
                  newItemSlug={newItemSlug}
                  setNewItemSlug={setNewItemSlug}
                  newItem={newItem}
                  setNewItem={setNewItem}
                  handleAddItem={handleAddItem}
                  newVariantTarget={newVariantTarget}
                  setNewVariantTarget={setNewVariantTarget}
                  newVariant={newVariant}
                  setNewVariant={setNewVariant}
                  handleAddVariant={handleAddVariant}
                  newAddOnSlug={newAddOnSlug}
                  setNewAddOnSlug={setNewAddOnSlug}
                  newAddOn={newAddOn}
                  setNewAddOn={setNewAddOn}
                  handleAddAddOn={handleAddAddOn}
                />
              );
            })}
          </div>
        )}

        {/* BUSINESS PRICING SETTINGS TAB */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSavePricingSettings}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.75rem',
              border: '1px solid #EEE9EF',
              maxWidth: '640px'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', margin: '0 0 0.4rem' }}>
              Checkout & Tax Pricing Settings
            </h2>
            <p style={{ fontSize: '0.84rem', color: '#77717D', marginBottom: '1.25rem' }}>
              Stored in MongoDB (<code>LaundryWalii.business_settings</code>). Changes apply immediately to new quotes and orders without affecting historical order snapshots.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="form-label">GST Percentage (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                  className="input-flat"
                  value={pricingSettings.gstPercentage}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, gstPercentage: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Delivery Fee (INR)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="input-flat"
                  value={pricingSettings.deliveryFee}
                  onChange={(e) =>
                    setPricingSettings({ ...pricingSettings, deliveryFee: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="form-label">Free Delivery Threshold (INR)</label>
                <input
                  type="number"
                  min="0"
                  required
                  className="input-flat"
                  value={pricingSettings.freeDeliveryThreshold}
                  onChange={(e) =>
                    setPricingSettings({
                      ...pricingSettings,
                      freeDeliveryThreshold: e.target.value
                    })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn-pill-primary" style={{ padding: '0.65rem 1.5rem' }}>
              <Save size={15} style={{ marginRight: '6px' }} />
              Save Pricing Settings
            </button>
          </form>
        )}

        {/* ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                padding: '1rem 1.25rem',
                border: '1px solid #EEE9EF',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 240px', maxWidth: '360px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8A8299' }} />
                  <input
                    type="text"
                    className="input-flat"
                    placeholder="Search by customer name or mobile..."
                    value={enquirySearch}
                    onChange={(e) => setEnquirySearch(e.target.value)}
                    style={{ paddingLeft: '2.2rem', width: '100%' }}
                  />
                </div>
                <select
                  className="input-flat"
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  style={{ minWidth: '160px' }}
                >
                  <option value="all">All Statuses</option>
                  {ENQUIRY_STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={loadAdminData}
                  className="btn-pill-outline"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                >
                  Apply Filter
                </button>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#6E667A', fontWeight: 600 }}>
                Showing {enquiries.length} {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
              </span>
            </div>

            {enquiries.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', border: '1px solid #EEE9EF' }}>
                No customer enquiries match the current filter.
              </div>
            ) : (
              enquiries.map((enq) => {
                const cleanPhone = String(enq.phone || '').replace(/\D/g, '').slice(-10);
                return (
                  <div
                    key={enq._id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '18px',
                      padding: '1.25rem 1.5rem',
                      border: '1px solid #EEE9EF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <strong style={{ color: '#1F1B24', fontSize: '1rem' }}>{enq.name}</strong>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: '#FDF2F8', color: '#850078' }}>
                            {enq.subject || 'General Service Inquiry'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.82rem', color: '#6E667A', marginTop: '0.3rem' }}>
                          <span>+91 {cleanPhone}</span>
                          {enq.email && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Mail size={13} /> {enq.email}
                            </span>
                          )}
                          <span>Submitted: {new Date(enq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <select
                          aria-label={`Status for ${enq.name}`}
                          className="input-flat"
                          value={enq.status || 'new'}
                          onChange={(e) => handleUpdateEnquiryStatus(enq._id, e.target.value)}
                          style={{ fontSize: '0.82rem', fontWeight: 700 }}
                        >
                          {ENQUIRY_STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        <a
                          href={`tel:+91${cleanPhone}`}
                          className="btn-pill-outline"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                        >
                          <Phone size={14} /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${cleanPhone}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-pill-primary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', background: '#16A34A', borderColor: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
                        >
                          WhatsApp <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>

                    <div
                      style={{
                        background: '#FAF9FC',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        color: '#2B2433',
                        fontSize: '0.9rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
                      {enq.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '2.5rem', textAlign: 'center', border: '1px solid #EEE9EF' }}>
                No orders found yet.
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    padding: '1.25rem 1.5rem',
                    border: '1px solid #EEE9EF',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: '1 1 340px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, color: '#39004F', fontFamily: 'var(--font-heading)', fontSize: '1rem' }}>
                        {ord.bookingId}
                      </span>
                      <span className="badge badge-purple" style={{ textTransform: 'capitalize' }}>
                        {ord.status || 'Pending'}
                      </span>
                      <span className="badge badge-pink" style={{ fontWeight: 600 }}>
                        {ord.paymentMethod?.toUpperCase() === 'COD' ? 'Cash on Delivery (COD)' : ord.paymentMethod || 'COD'}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#B45309', background: '#FEF3C7', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: 600 }}>
                        Payment: {ord.paymentStatus || 'pending'}
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, color: '#171421', marginTop: '0.35rem', fontSize: '0.92rem' }}>
                      👤 {ord.customerSnapshot?.fullName} · 📞 {ord.customerSnapshot?.phone}
                      {ord.customerSnapshot?.email ? ` · ✉️ ${ord.customerSnapshot.email}` : ''}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#4B5563', marginTop: '0.25rem' }}>
                      📍 <strong>Address:</strong> {ord.pickupAddress?.addressLine || [ord.pickupAddress?.houseNo, ord.pickupAddress?.street, ord.pickupAddress?.area].filter(Boolean).join(', ')}
                      {ord.pickupAddress?.landmark ? ` (Landmark: ${ord.pickupAddress.landmark})` : ''}
                      {ord.pickupAddress?.pincode ? ` - ${ord.pickupAddress.pincode}` : ''}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#77717D', marginTop: '0.2rem' }}>
                      📅 <strong>Schedule:</strong> {new Date(ord.schedule?.pickupDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })} · <strong>{ord.schedule?.pickupSlot}</strong>
                      {ord.schedule?.instructions ? ` · 📝 Notes: "${ord.schedule.instructions}"` : ''}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#77717D', marginTop: '0.2rem' }}>
                      Subtotal: {formatINR(ord.subtotal)} · Delivery: {ord.deliveryFee === 0 ? 'Included' : formatINR(ord.deliveryFee)} · Total: <strong style={{ color: '#850078', fontSize: '0.95rem' }}>{formatINR(ord.totalAmount)}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-pill-outline"
                    onClick={() => handleViewOrderSnapshot(ord.bookingId)}
                    style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem', alignSelf: 'center' }}
                  >
                    Inspect Snapshot
                  </button>
                </div>
              ))
            )}

            {selectedOrderDetail && (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #850078' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#39004F' }}>
                      Order Details: {selectedOrderDetail.order?.bookingId}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#6B7280' }}>
                      Payment: <strong>Cash on Delivery (COD)</strong> · Status: <strong>{selectedOrderDetail.order?.paymentStatus || 'pending'}</strong> · Hub: <strong>{selectedOrderDetail.order?.branchId?.name || 'Laundry Waliiii – Mysore'}</strong>
                    </p>
                  </div>
                  <button type="button" onClick={() => setSelectedOrderDetail(null)} className="btn-pill-outline" style={{ padding: '0.35rem 0.9rem', fontSize: '0.8rem' }}>
                    Close
                  </button>
                </div>

                <div style={{ padding: '0.85rem 1rem', background: '#FDF4FF', borderRadius: '12px', border: '1px solid #F5D0FE', marginBottom: '1rem', fontSize: '0.84rem' }}>
                  <div><strong>Customer:</strong> {selectedOrderDetail.order?.customerSnapshot?.fullName} ({selectedOrderDetail.order?.customerSnapshot?.phone})</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Pickup Address:</strong> {selectedOrderDetail.order?.pickupAddress?.addressLine || [selectedOrderDetail.order?.pickupAddress?.houseNo, selectedOrderDetail.order?.pickupAddress?.street].filter(Boolean).join(', ')}{selectedOrderDetail.order?.pickupAddress?.landmark ? ` (Landmark: ${selectedOrderDetail.order?.pickupAddress.landmark})` : ''}</div>
                  <div style={{ marginTop: '0.25rem' }}><strong>Slot:</strong> {new Date(selectedOrderDetail.order?.schedule?.pickupDate).toLocaleDateString()} · {selectedOrderDetail.order?.schedule?.pickupSlot}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(selectedOrderDetail.items || []).map((it) => (
                    <div key={it._id} style={{ padding: '0.75rem 1rem', background: '#FCFAFC', borderRadius: '12px', border: '1px solid #EEE9EF', display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem' }}>
                      <div>
                        <strong>{it.serviceName}</strong>
                        {it.itemName ? ` · ${it.itemName}` : ''}
                        {it.variantName ? ` (${it.variantName})` : ''}
                        {' · '}
                        {formatINR(it.unitPrice)} / {formatPricingUnit(it.pricingUnit)} × {it.quantity}
                      </div>
                      <strong>{formatINR(it.lineTotal)}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px dashed #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '1.5rem', fontSize: '0.95rem' }}>
                  <span>Total Amount (COD): <strong style={{ color: '#850078', fontSize: '1.1rem' }}>{formatINR(selectedOrderDetail.order?.totalAmount || 0)}</strong></span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CategoryAdminCard = ({
  cat,
  isExpanded,
  onToggleExpand,
  onSaveCategory,
  onUpdateItem,
  onUpdateVariant,
  onUpdateAddOn,
  expandedItemId,
  setExpandedItemId,
  newItemSlug,
  setNewItemSlug,
  newItem,
  setNewItem,
  handleAddItem,
  newVariantTarget,
  setNewVariantTarget,
  newVariant,
  setNewVariant,
  handleAddVariant,
  newAddOnSlug,
  setNewAddOnSlug,
  newAddOn,
  setNewAddOn,
  handleAddAddOn
}) => {
  const [name, setName] = useState(cat.name);
  const [price, setPrice] = useState(cat.price ?? '');
  const [pricingUnit, setPricingUnit] = useState(cat.pricingUnit || 'piece');
  const [minQuantity, setMinQuantity] = useState(cat.minQuantity || 1);
  const [quantityStep, setQuantityStep] = useState(cat.quantityStep || 1);
  const [sortOrder, setSortOrder] = useState(cat.sortOrder ?? 0);
  const [description, setDescription] = useState(cat.description || '');

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '20px', border: '1px solid #EEE9EF', overflow: 'hidden' }}>
      <div
        style={{
          padding: '1.15rem 1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: cat.isActive ? '#FFFFFF' : '#F9FAFB'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={onToggleExpand}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#171421' }}>
              {cat.name}{' '}
              <span style={{ fontSize: '0.76rem', color: '#77717D', fontWeight: 500 }}>
                ({cat.categorySlug} · {cat.selectionMode})
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#77717D' }}>
              {cat.price !== null && cat.price !== undefined
                ? `${formatINR(cat.price)} / ${formatPricingUnit(cat.pricingUnit)}`
                : `${(cat.items || []).length} items`}{' '}
              · Order #{cat.sortOrder} · {cat.isActive ? 'Active' : 'Inactive'} ·{' '}
              {cat.isCustomerVisible ? 'Visible' : 'Hidden'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn-pill-outline"
            onClick={() => onSaveCategory(cat, { isActive: !cat.isActive })}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
          >
            {cat.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            className="btn-pill-outline"
            onClick={() => onSaveCategory(cat, { isCustomerVisible: !cat.isCustomerVisible })}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}
          >
            {cat.isCustomerVisible ? 'Hide' : 'Show'}
          </button>
          <button
            type="button"
            className="btn-pill-primary"
            onClick={onToggleExpand}
            style={{ padding: '0.4rem 0.95rem', fontSize: '0.78rem' }}
          >
            {isExpanded ? 'Collapse' : 'Manage'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div style={{ padding: '1.5rem', borderTop: '1px solid #EEE9EF', background: '#FCFAFC' }}>
          {/* Category Edit Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="form-label">Name</label>
              <input className="input-flat" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Direct Price (INR)</label>
              <input
                type="number"
                min="0"
                className="input-flat"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="null if itemized"
              />
            </div>
            <div>
              <label className="form-label">Unit</label>
              <select className="input-flat" value={pricingUnit} onChange={(e) => setPricingUnit(e.target.value)}>
                {PRICING_UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Min Qty</label>
              <input type="number" min="1" className="input-flat" value={minQuantity} onChange={(e) => setMinQuantity(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Step</label>
              <input type="number" min="1" className="input-flat" value={quantityStep} onChange={(e) => setQuantityStep(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Sort Order</label>
              <input type="number" min="0" className="input-flat" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description</label>
              <input className="input-flat" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="btn-pill-primary"
              onClick={() =>
                onSaveCategory(cat, {
                  name,
                  price: price === '' ? null : Number(price),
                  pricingUnit,
                  minQuantity: Number(minQuantity) || 1,
                  quantityStep: Number(quantityStep) || 1,
                  sortOrder: Number(sortOrder) || 0,
                  description
                })
              }
              style={{ padding: '0.5rem 1.15rem', fontSize: '0.82rem' }}
            >
              <Save size={14} style={{ marginRight: '6px' }} />
              Save Category Changes
            </button>
          </div>

          {/* Items Section */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#4B1248' }}>
                Items ({(cat.items || []).length})
              </h4>
              <button
                type="button"
                className="btn-pill-outline"
                onClick={() => setNewItemSlug(newItemSlug === cat.categorySlug ? '' : cat.categorySlug)}
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} style={{ marginRight: '4px' }} />
                Add Item
              </button>
            </div>

            {newItemSlug === cat.categorySlug && (
              <form
                onSubmit={(e) => handleAddItem(e, cat.categorySlug)}
                style={{
                  background: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1px solid #850078',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '1rem'
                }}
              >
                <input className="input-flat" required placeholder="itemCode (e.g. dc-coat)" value={newItem.itemCode} onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })} />
                <input className="input-flat" required placeholder="Item Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                <input className="input-flat" placeholder="Sub-category" value={newItem.subCategory} onChange={(e) => setNewItem({ ...newItem, subCategory: e.target.value })} />
                <input type="number" min="0" required className="input-flat" placeholder="Base Price" value={newItem.basePrice} onChange={(e) => setNewItem({ ...newItem, basePrice: e.target.value })} />
                <select className="input-flat" value={newItem.pricingUnit} onChange={(e) => setNewItem({ ...newItem, pricingUnit: e.target.value })}>
                  {PRICING_UNIT_OPTIONS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
                <button type="submit" className="btn-pill-primary" style={{ fontSize: '0.8rem' }}>
                  Save Item
                </button>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(cat.items || []).map((it) => (
                <ItemAdminRow
                  key={`${it._id || it.itemCode}-${it.name}-${it.basePrice ?? ''}-${it.isActive}`}
                  slug={cat.categorySlug}
                  item={it}
                  isOpen={expandedItemId === it._id}
                  onToggle={() => setExpandedItemId(expandedItemId === it._id ? null : it._id)}
                  onUpdateItem={onUpdateItem}
                  onUpdateVariant={onUpdateVariant}
                  newVariantTarget={newVariantTarget}
                  setNewVariantTarget={setNewVariantTarget}
                  newVariant={newVariant}
                  setNewVariant={setNewVariant}
                  handleAddVariant={handleAddVariant}
                />
              ))}
            </div>
          </div>

          {/* Add-Ons Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#4B1248' }}>
                Add-Ons ({(cat.addOns || []).length})
              </h4>
              <button
                type="button"
                className="btn-pill-outline"
                onClick={() => setNewAddOnSlug(newAddOnSlug === cat.categorySlug ? '' : cat.categorySlug)}
                style={{ padding: '0.35rem 0.9rem', fontSize: '0.78rem' }}
              >
                <Plus size={13} style={{ marginRight: '4px' }} />
                Add Add-On
              </button>
            </div>

            {newAddOnSlug === cat.categorySlug && (
              <form
                onSubmit={(e) => handleAddAddOn(e, cat.categorySlug)}
                style={{
                  background: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '14px',
                  border: '1px solid #850078',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '0.75rem',
                  marginBottom: '0.85rem'
                }}
              >
                <input className="input-flat" required placeholder="code" value={newAddOn.code} onChange={(e) => setNewAddOn({ ...newAddOn, code: e.target.value })} />
                <input className="input-flat" required placeholder="Add-on Name" value={newAddOn.name} onChange={(e) => setNewAddOn({ ...newAddOn, name: e.target.value })} />
                <input type="number" min="0" required className="input-flat" placeholder="Price" value={newAddOn.price} onChange={(e) => setNewAddOn({ ...newAddOn, price: e.target.value })} />
                <button type="submit" className="btn-pill-primary" style={{ fontSize: '0.8rem' }}>
                  Save Add-On
                </button>
              </form>
            )}

            {(cat.addOns || []).map((addon) => (
              <div key={addon._id || addon.code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.9rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #EEE9EF', marginBottom: '0.4rem', fontSize: '0.84rem' }}>
                <span>
                  <strong>{addon.name}</strong> ({addon.code}) — {formatINR(addon.price)} · {addon.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  className="btn-pill-outline"
                  onClick={() => onUpdateAddOn(cat.categorySlug, addon._id || addon.code, { isActive: !addon.isActive })}
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                >
                  {addon.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ItemAdminRow = ({
  slug,
  item,
  isOpen,
  onToggle,
  onUpdateItem,
  onUpdateVariant,
  newVariantTarget,
  setNewVariantTarget,
  newVariant,
  setNewVariant,
  handleAddVariant
}) => {
  const [itemName, setItemName] = useState(item.name);
  const [basePrice, setBasePrice] = useState(item.basePrice ?? 0);

  const isAddingVariant =
    newVariantTarget && newVariantTarget.slug === slug && newVariantTarget.itemId === item._id;

  return (
    <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #EEE9EF', padding: '0.85rem 1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={onToggle}>
          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#171421' }}>{item.name}</span>
          <span style={{ fontSize: '0.75rem', color: '#77717D' }}>
            ({item.subCategory || 'General'} · {item.variants?.length || 0} variants · {item.isActive ? 'Active' : 'Inactive'})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-pill-outline"
            onClick={() => onUpdateItem(slug, item._id, { isActive: !item.isActive })}
            style={{ padding: '0.28rem 0.75rem', fontSize: '0.74rem' }}
          >
            {item.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button
            type="button"
            className="btn-pill-outline"
            onClick={onToggle}
            style={{ padding: '0.28rem 0.75rem', fontSize: '0.74rem' }}
          >
            {isOpen ? 'Hide Variants' : 'Edit / Variants'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '0.9rem', paddingTop: '0.9rem', borderTop: '1px dashed #EEE9EF' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', alignItems: 'center', marginBottom: '0.9rem' }}>
            <input
              className="input-flat"
              style={{ maxWidth: '220px' }}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <input
              type="number"
              min="0"
              className="input-flat"
              style={{ maxWidth: '120px' }}
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
            />
            <button
              type="button"
              className="btn-pill-primary"
              onClick={() => onUpdateItem(slug, item._id, { name: itemName, basePrice: Number(basePrice) })}
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.76rem' }}
            >
              Save Item
            </button>
            <button
              type="button"
              className="btn-pill-outline"
              onClick={() =>
                setNewVariantTarget(isAddingVariant ? null : { slug, itemId: item._id })
              }
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.76rem' }}
            >
              + Add Variant
            </button>
          </div>

          {isAddingVariant && (
            <form
              onSubmit={(e) => handleAddVariant(e, slug, item._id)}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginBottom: '0.85rem', padding: '0.75rem', background: '#FCFAFC', borderRadius: '10px', border: '1px solid #850078' }}
            >
              <input className="input-flat" required placeholder="Variant Name" value={newVariant.name} onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })} />
              <select className="input-flat" value={newVariant.variantType} onChange={(e) => setNewVariant({ ...newVariant, variantType: e.target.value })}>
                {VARIANT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" min="0" required className="input-flat" placeholder="Price" value={newVariant.price} onChange={(e) => setNewVariant({ ...newVariant, price: e.target.value })} />
              <input type="number" min="0" className="input-flat" placeholder="Addl Charge" value={newVariant.additionalCharge} onChange={(e) => setNewVariant({ ...newVariant, additionalCharge: e.target.value })} />
              <select className="input-flat" value={newVariant.unit} onChange={(e) => setNewVariant({ ...newVariant, unit: e.target.value })}>
                {PRICING_UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
              <button type="submit" className="btn-pill-primary" style={{ fontSize: '0.76rem' }}>
                Add
              </button>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {(item.variants || []).map((v) => (
              <VariantRow
                key={`${v._id || v.name}-${v.name}-${v.price ?? ''}-${v.isActive}`}
                slug={slug}
                itemId={item._id}
                variant={v}
                onUpdateVariant={onUpdateVariant}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const VariantRow = ({ slug, itemId, variant, onUpdateVariant }) => {
  const [vName, setVName] = useState(variant.name);
  const [vPrice, setVPrice] = useState(variant.price ?? 0);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.65rem', background: '#FCFAFC', borderRadius: '10px', border: '1px solid #EEE9EF' }}>
      <input className="input-flat" style={{ maxWidth: '170px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }} value={vName} onChange={(e) => setVName(e.target.value)} />
      <input type="number" min="0" className="input-flat" style={{ maxWidth: '100px', padding: '0.35rem 0.6rem', fontSize: '0.8rem' }} value={vPrice} onChange={(e) => setVPrice(e.target.value)} />
      <span style={{ fontSize: '0.75rem', color: '#77717D' }}>
        {variant.variantType} · {formatPricingUnit(variant.unit || 'piece')}
      </span>
      <button
        type="button"
        className="btn-pill-primary"
        onClick={() => onUpdateVariant(slug, itemId, variant._id, { name: vName, price: Number(vPrice) })}
        style={{ padding: '0.28rem 0.7rem', fontSize: '0.74rem' }}
      >
        Save
      </button>
      <button
        type="button"
        className="btn-pill-outline"
        onClick={() => onUpdateVariant(slug, itemId, variant._id, { isActive: !variant.isActive })}
        style={{ padding: '0.28rem 0.7rem', fontSize: '0.74rem' }}
      >
        {variant.isActive ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};

export default AdminPage;
