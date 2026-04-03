import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './CreateOffering.css';

const STEPS = 5;

// Step 1 - Type Selection
function Step1({ data, setData }) {
  const { t } = useTranslation();
  const types = [
    {
      id: 'physical', label: t('physical_product'), color: '#00A7E5',
      icon: <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.2"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
      examples: ['Furniture', 'Equipment', 'Supplies', 'Materials'],
    },
    {
      id: 'digital', label: t('digital_product'), color: '#00A7E5',
      icon: <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
      examples: ['Software', 'E-books', 'Templates', 'Licenses'],
    },
    {
      id: 'service', label: t('service'), color: '#00A7E5',
      icon: <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
      examples: ['Consulting', 'Installation', 'Training', 'Support'],
    },
  ];

  return (
    <div className="co__step">
      <h2 className="co__step-title">{t('offering_type_title')}</h2>
      <p className="co__step-sub">{t('offering_type_sub')}</p>
      <div className="co__type-grid">
        {types.map(type => (
          <div key={type.id} className={`co__type-card ${data.type === type.id ? 'co__type-card--active' : ''}`}
            onClick={() => setData(d => ({ ...d, type: type.id }))}>
            {data.type === type.id && (
              <div className="co__type-check">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            )}
            <div className="co__type-icon">{type.icon}</div>
            <h3 className="co__type-label" style={{ color: type.color }}>{type.label}</h3>
            <div className="co__type-divider" />
            <p className="co__type-examples-title">{t('examples')}</p>
            {type.examples.map(e => <p key={e} className="co__type-example">• {e}</p>)}
            <div className="co__type-divider" />
            <p className="co__type-hint">Entire card clickable with border</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 2 - Description
function Step2({ data, setData }) {
  const { t } = useTranslation();
  const maxChars = 100;
  return (
    <div className="co__step co__step--narrow">
      <h2 className="co__step-title">{t('describe_offering')}</h2>
      <p className="co__step-sub">{t('describe_sub')}</p>

      <div className="co__field">
        <label className="co__label">{t('title')} <span className="co__required">*</span></label>
        <input className="co__input" placeholder="e.g., Premium Corporate Gift Boxes – Custom Branding"
          maxLength={maxChars} value={data.title || ''} onChange={e => setData(d => ({ ...d, title: e.target.value }))} />
        <p className="co__hint">{(data.title || '').length}/{maxChars} characters</p>
      </div>

      <div className="co__field">
        <label className="co__label">{t('category')} <span className="co__required">*</span></label>
        <select className="co__input co__select" value={data.category || ''} onChange={e => setData(d => ({ ...d, category: e.target.value }))}>
          <option value="">Select category</option>
          {['Office Supplies', 'Electronics', 'Construction', 'Food & Beverage', 'Software & IT', 'Marketing', 'Medical', 'Logistics', 'Furniture', 'Professional Services'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="co__field">
        <label className="co__label">{t('description')} <span className="co__required">*</span></label>
        <div className="co__editor">
          <div className="co__editor-toolbar">
            <button className="co__editor-btn" title="Bold"><b>B</b></button>
            <button className="co__editor-btn" title="Italic"><i>I</i></button>
            <button className="co__editor-btn" title="List">≡</button>
            <button className="co__editor-btn" title="Link">🔗</button>
          </div>
          <textarea className="co__textarea" rows={8} placeholder={`Describe your product or service...\n• What makes your offering unique?\n• What benefits does it provide?\n• What's included?`}
            value={data.description || ''} onChange={e => setData(d => ({ ...d, description: e.target.value }))} />
        </div>
      </div>
    </div>
  );
}

// Step 3 - Pricing
function Step3({ data, setData }) {
  const toggle = (key, val) => {
    const arr = data[key] || [];
    setData(d => ({ ...d, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  };

  return (
    <div className="co__step co__step--narrow">
      <h2 className="co__step-title">Set your pricing and availability</h2>
      <p className="co__step-sub">Help buyers understand your offering details</p>

      <div className="co__field">
        <label className="co__label">Price <span className="co__required">*</span></label>
        <div className="co__input-prefix"><span>EGP</span><input type="number" placeholder="0" value={data.price || ''} onChange={e => setData(d => ({ ...d, price: e.target.value }))} /></div>
        <div className="co__radio-group">
          {['Per unit', 'Per project', 'Per hour (for services)', 'Custom pricing (requires quote)'].map(opt => (
            <label key={opt} className="co__radio"><input type="radio" name="priceType" value={opt} checked={data.priceType === opt} onChange={() => setData(d => ({ ...d, priceType: opt }))} /><span>{opt}</span></label>
          ))}
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Stock Availability <span className="co__required">*</span></label>
        <div className="co__radio-group">
          {['In Stock (Ready to ship/deliver immediately)', 'Made to Order (Specify lead time below)', 'Limited Stock (Quantity:___)', 'Always Available (Service or digital product)'].map(opt => (
            <label key={opt} className="co__radio"><input type="radio" name="stock" value={opt} checked={data.stock === opt} onChange={() => setData(d => ({ ...d, stock: opt }))} /><span>{opt}</span></label>
          ))}
        </div>
      </div>

      <div className="co__two-col">
        <div className="co__field">
          <label className="co__label">Minimum Order Quantity (Optional)</label>
          <div className="co__input-suffix"><input type="number" placeholder="" value={data.minQty || ''} onChange={e => setData(d => ({ ...d, minQty: e.target.value }))} /><span>units</span></div>
          <p className="co__hint co__hint--blue">Leave blank if no minimum</p>
        </div>
        <div className="co__field">
          <label className="co__label">Maximum Order Quantity (Optional)</label>
          <div className="co__input-suffix"><input type="number" placeholder="" value={data.maxQty || ''} onChange={e => setData(d => ({ ...d, maxQty: e.target.value }))} /><span>units</span></div>
          <p className="co__hint co__hint--blue">Leave blank if unlimited</p>
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Lead Time/Delivery Time <span className="co__required">*</span></label>
        <div className="co__input-suffix"><input type="number" placeholder="" value={data.leadTime || ''} onChange={e => setData(d => ({ ...d, leadTime: e.target.value }))} /><span>days</span></div>
        <p className="co__hint co__hint--blue">How long from order to delivery?</p>
      </div>

      <div className="co__field">
        <label className="co__label">Location/Service Area <span className="co__required">*</span></label>
        <input className="co__input" placeholder='City, State, Country, or "Worldwide"' value={data.location || ''} onChange={e => setData(d => ({ ...d, location: e.target.value }))} />
      </div>

      <div className="co__field">
        <label className="co__label">Certifications & Compliance (Optional)</label>
        <div className="co__checkbox-group">
          {['ISO Certified', 'Quality Tested', 'Licensed/Certified', 'Other'].map(opt => (
            <label key={opt} className="co__checkbox"><input type="checkbox" checked={(data.certs || []).includes(opt)} onChange={() => toggle('certs', opt)} /><span>{opt}</span></label>
          ))}
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Customization Available</label>
        <p className="co__sublabel">Can you be customized per client needs?</p>
        <div className="co__radio-group">
          {['Yes, fully customizable', 'Limited customization available', 'No customization (as is only)'].map(opt => (
            <label key={opt} className="co__radio"><input type="radio" name="custom" value={opt} checked={data.customization === opt} onChange={() => setData(d => ({ ...d, customization: opt }))} /><span>{opt}</span></label>
          ))}
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Bulk Discounts (Optional)</label>
        <label className="co__checkbox"><input type="checkbox" checked={data.bulkDiscount || false} onChange={e => setData(d => ({ ...d, bulkDiscount: e.target.checked }))} /><span>Volume discounts available</span></label>
      </div>

      <div className="co__field">
        <label className="co__label">Return/Refund Policy <span className="co__required">*</span></label>
        <textarea className="co__textarea" rows={4} placeholder={`Describe your return/refund policy...\ne.g., "30-day money-back guarantee" or\n"No returns on custom orders"`}
          value={data.refundPolicy || ''} onChange={e => setData(d => ({ ...d, refundPolicy: e.target.value }))} />
      </div>
    </div>
  );
}

// Step 4 - Media
function Step4({ data, setData }) {
  return (
    <div className="co__step co__step--narrow">
      <h2 className="co__step-title">Showcase your product or service</h2>
      <p className="co__step-sub">Visuals help buyers see the value</p>

      <div className="co__field">
        <label className="co__label">Product Images (at least 1 required)</label>
        <div className="co__upload-zone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p>Drag & drop or click to upload</p>
          <p className="co__upload-hint">PNG, JPG, up to 5MB each (max 5 images)</p>
        </div>
        <div className="co__image-slots">
          {['Image 1', 'Image 2', 'Image 3', 'Image 4', 'Image 5'].map(label => (
            <div key={label} className="co__image-slot">{label}</div>
          ))}
        </div>
        <p className="co__hint co__hint--blue">You can drag and reorder these images</p>
      </div>

      <div className="co__field">
        <label className="co__label">Product/Use Videos (Optional)</label>
        <div className="co__upload-zone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p>Upload product video or demo</p>
          <p className="co__upload-hint">MP4, MOV, YouTube link (max size: 100MB)</p>
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">3D Model/AR Preview (Optional)</label>
        <div className="co__upload-zone">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p>Upload 3D model for AR visualization</p>
          <p className="co__upload-hint">GLB or GLTF files</p>
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Product Specifications/Documents (Optional)</label>
        <p className="co__sublabel">Upload datasheets or other relevant documents</p>
        {['Datasheet (datasheet.pdf) (1 MB)', 'User Manual (user-manual.pdf) (3 MB)', 'warranty.pdf (2 MB)'].map(doc => (
          <div key={doc} className="co__doc-row">
            <span>{doc}</span>
            <button className="co__doc-remove">✕</button>
          </div>
        ))}
      </div>

      <div className="co__field">
        <label className="co__label">Product/Use Links (Optional)</label>
        <p className="co__sublabel">Add links to additional information</p>
        <input className="co__input" placeholder="https://your-site.com/product-demo" value={data.link || ''} onChange={e => setData(d => ({ ...d, link: e.target.value }))} />
        <div className="co__link-tabs">
          {['Website', 'LinkedIn', 'Video'].map(t => <button key={t} className="co__link-tab">{t}</button>)}
        </div>
      </div>

      <div className="co__field">
        <label className="co__label">Use Cases/Client Success Stories (Optional)</label>
        <p className="co__sublabel">Share specific examples or client testimonials</p>
        <textarea className="co__textarea" rows={4} placeholder={`e.g., "Helped XYZ Company reduce costs by 30%..."`}
          value={data.useCases || ''} onChange={e => setData(d => ({ ...d, useCases: e.target.value }))} />
      </div>

      <div className="co__field">
        <label className="co__label">Estimated/Certified Credentials (Optional)</label>
        <p className="co__sublabel">Upload certificates, credentials, or warranties</p>
        {['ISO_9001_Certificate.pdf', 'Quality_Test_Certificate.pdf'].map(doc => (
          <div key={doc} className="co__doc-row">
            <span>{doc}</span>
            <button className="co__doc-remove">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 5 - Review & Publish
function Step5({ data, setData }) {
  const toggle = (key, val) => {
    const arr = data[key] || [];
    setData(d => ({ ...d, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] }));
  };

  return (
    <div className="co__step co__step--wide">
      <h2 className="co__step-title">Review & Publish</h2>
      <p className="co__step-sub">Final review before publishing your offering</p>

      <div className="co__review-layout">
        {/* Preview */}
        <div className="co__preview">
          <h3>Preview your offering</h3>
          <p className="co__preview-hint">This is how buyers will see it</p>
          <div className="co__preview-card">
            <div className="co__preview-img" />
            <h4>Your Name · Your Company</h4>
            <p className="co__preview-type">🔖 Service Vendor</p>
            <span className="co__preview-tag">{data.category || 'Electronics Tag'}</span>
            <div className="co__preview-details">
              <p>💰 Price: EGP {data.price || '29'} per unit/project</p>
              <p>📦 {data.stock || 'Ready to Stock / Made to Order'}</p>
              <p>⏱ Lead Time: {data.leadTime || '7'} days</p>
              <p>📍 Location: {data.location || 'Cairo, Egypt'}</p>
            </div>
            <div className="co__preview-media">
              {['Main Image', 'Image2', 'Video thumbnail', 'AR View'].map(m => (
                <div key={m} className="co__preview-media-item">{m}</div>
              ))}
            </div>
            <div className="co__preview-certs">
              <p>✅ Certifications: 2 files</p>
              <p>✅ Certifications: ISO, Quality Tested</p>
              <p>✅ Customization available</p>
            </div>
            <div className="co__preview-rating">★ 4.8 rating · ✅ Verified Vendor</div>
            <div className="co__preview-actions">
              <button className="co__preview-btn">Request Quote</button>
              <button className="co__preview-btn">Message Vendor</button>
              <button className="co__preview-btn co__preview-btn--primary">Save</button>
            </div>
            <button className="co__edit-link">Edit Offering</button>
          </div>
        </div>

        {/* Final touches */}
        <div className="co__final">
          <h3>Final touches (optional)</h3>

          <div className="co__field">
            <label className="co__label">Tags</label>
            <input className="co__input" placeholder="Add tags to help buyers find your offering" value={data.tagInput || ''} onChange={e => setData(d => ({ ...d, tagInput: e.target.value }))} />
            <div className="co__tags">
              {['premium', 'custom', 'fast-delivery', 'bulk-discounts'].map(tag => (
                <span key={tag} className="co__tag">{tag} ✕</span>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Featured Keywords</label>
            <p className="co__sublabel">What keywords should buyers search to find this?</p>
            <input className="co__input" placeholder="e.g., corporate gifts, branded merchandise" value={data.keywords || ''} onChange={e => setData(d => ({ ...d, keywords: e.target.value }))} />
          </div>

          <div className="co__field">
            <label className="co__label">Target Industries (Optional)</label>
            <p className="co__sublabel">Which industries is this offering best suited for?</p>
            <div className="co__checkbox-group">
              {['Technology', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Hospitality', 'Other'].map(ind => (
                <label key={ind} className="co__checkbox"><input type="checkbox" checked={(data.industries || []).includes(ind)} onChange={() => toggle('industries', ind)} /><span>{ind}</span></label>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Company Size Preference</label>
            <p className="co__sublabel">What company sizes are you targeting?</p>
            <div className="co__checkbox-group">
              {['Small (1-10 employees)', 'Medium (11-50 employees)', 'Large (50+ employees)', 'Enterprise (1000+ employees)', 'All sizes'].map(s => (
                <label key={s} className="co__checkbox"><input type="checkbox" checked={(data.companySizes || []).includes(s)} onChange={() => toggle('companySizes', s)} /><span>{s}</span></label>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Response Time</label>
            <p className="co__sublabel">How quickly can you respond to inquiries?</p>
            <div className="co__radio-group">
              {['Within 1 hour (during business hours)', 'Within 4 hours', 'Within 24 hours', 'Within 2-3 days'].map(opt => (
                <label key={opt} className="co__radio"><input type="radio" name="responseTime" value={opt} checked={data.responseTime === opt} onChange={() => setData(d => ({ ...d, responseTime: opt }))} /><span>{opt}</span></label>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Special Offers/Promotions (Optional)</label>
            <textarea className="co__textarea" rows={3} placeholder="Any current promotions or special offers?" value={data.promotions || ''} onChange={e => setData(d => ({ ...d, promotions: e.target.value }))} />
          </div>

          <div className="co__field">
            <label className="co__label">Contact Preferences</label>
            <p className="co__sublabel">How should buyers reach out? (Include at least one option)</p>
            <div className="co__checkbox-group">
              {['Email:', 'Phone:', 'Schedule a call/demo:'].map(opt => (
                <label key={opt} className="co__checkbox"><input type="checkbox" checked={(data.contactPrefs || []).includes(opt)} onChange={() => toggle('contactPrefs', opt)} /><span>{opt}</span></label>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Offering Visibility</label>
            <div className="co__radio-group">
              {['Public (visible to all procurement professionals)', 'Limited (only to premium/verified buyers)', 'Private (only to invited buyers)'].map(opt => (
                <label key={opt} className="co__radio"><input type="radio" name="visibility" value={opt} checked={data.visibility === opt} onChange={() => setData(d => ({ ...d, visibility: opt }))} /><span>{opt}</span></label>
              ))}
            </div>
          </div>

          <div className="co__field">
            <label className="co__label">Offering Duration</label>
            <p className="co__sublabel">How long would you like this offering to remain active?</p>
            <div className="co__radio-group">
              {['Always active (until manually removed)', 'Limited time (___ days)'].map(opt => (
                <label key={opt} className="co__radio"><input type="radio" name="duration" value={opt} checked={data.duration === opt} onChange={() => setData(d => ({ ...d, duration: opt }))} /><span>{opt}</span></label>
              ))}
            </div>
          </div>

          <label className="co__checkbox co__checkbox--block">
            <input type="checkbox" checked={data.autoRenew || false} onChange={e => setData(d => ({ ...d, autoRenew: e.target.checked }))} />
            <span>Automatically renew this offering monthly</span>
          </label>

          <div className="co__agreements">
            <label className="co__checkbox co__checkbox--block">
              <input type="checkbox" checked={data.agree1 || false} onChange={e => setData(d => ({ ...d, agree1: e.target.checked }))} />
              <span>I confirm that I have the right to sell this product/service and all information is accurate</span>
            </label>
            <label className="co__checkbox co__checkbox--block">
              <input type="checkbox" checked={data.agree2 || false} onChange={e => setData(d => ({ ...d, agree2: e.target.checked }))} />
              <span>I agree to the Vendor Terms of Service and understand the platform fees</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateOffering() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).single();
        if (company) {
          await supabase.from('proposals').insert([{
            need_id: 1,
            vendor_company_id: company.id,
            quoted_price: parseFloat(data.price) || 0,
            delivery_days: parseInt(data.leadTime) || 7,
            cover_letter: data.description || '',
            proposal_status: 'pending',
          }]);
        }
      }
      navigate('/vendor/dashboard');
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="co__page" dir={i18n.dir()}>
      {/* Top Nav */}
      <header className="co__header">
        <button className="co__back-btn" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/vendor/dashboard')}>
          ← {t('back_to_dashboard')}
        </button>
        <h1 className="co__header-title">{t('create_offering')}</h1>
        <button className="co__save-exit" onClick={() => navigate('/vendor/dashboard')}>{t('save_exit')}</button>
      </header>

      {/* Progress */}
      <div className="co__progress">
        <div className="co__dots">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={`co__dot ${i < step ? 'co__dot--active' : ''}`} />
          ))}
        </div>
        <p className="co__step-label">{t('step')} {step} {t('of')} {STEPS}</p>
      </div>

      {/* Step Content */}
      <div className="co__body">
        {step === 1 && <Step1 data={data} setData={setData} />}
        {step === 2 && <Step2 data={data} setData={setData} />}
        {step === 3 && <Step3 data={data} setData={setData} />}
        {step === 4 && <Step4 data={data} setData={setData} />}
        {step === 5 && <Step5 data={data} setData={setData} />}
      </div>

      {/* Bottom Nav */}
      <footer className="co__footer">
        {step > 1 && (
          <button className="co__btn-back" onClick={() => setStep(s => s - 1)}>← {t('back')}</button>
        )}
        <p className="co__auto-save">{t('progress_saved')}</p>
        {step < STEPS ? (
          <button className="co__btn-continue" onClick={() => setStep(s => s + 1)}>{t('continue')} →</button>
        ) : (
          <button className="co__btn-continue" onClick={handlePublish} disabled={loading}>
            {loading ? '...' : t('publish_offering') + ' →'}
          </button>
        )}
      </footer>
    </div>
  );
}