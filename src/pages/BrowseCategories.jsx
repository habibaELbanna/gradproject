import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './BrowseCategories.css';

const ALL_CATEGORIES = [
  { name: 'Agriculture & Farming', count: 67 },
  { name: 'Automotive Parts', count: 134 },
  { name: 'Construction & Building', count: 567 },
  { name: 'Electronics & Technology', count: 445 },
  { name: 'Energy & Utilities', count: 76 },
  { name: 'Events & Catering', count: 156 },
  { name: 'Fashion & Textiles', count: 98 },
  { name: 'Food & Beverage', count: 188 },
  { name: 'Furniture & Interior', count: 234 },
  { name: 'Healthcare & Medical', count: 189 },
  { name: 'Industrial Machinery', count: 298 },
  { name: 'Janitorial & Cleaning', count: 112 },
  { name: 'Laboratory Equipment', count: 67 },
  { name: 'Marketing & Advertising', count: 345 },
  { name: 'Office Supplies', count: 389 },
  { name: 'Packaging & Printing', count: 143 },
  { name: 'Professional Services', count: 512 },
  { name: 'Raw Materials', count: 201 },
  { name: 'Security & Safety', count: 156 },
  { name: 'Transportation & Logistics', count: 267 },
];

const FEATURED = [
  { name: 'Office Supplies', desc: 'Everything for your workplace needs', needs: 234, vendors: 156, avgResponse: '4.2 hrs', slug: 'office-supplies' },
  { name: 'Electronics', desc: 'Latest tech and electronic equipment', needs: 189, vendors: 203, avgResponse: '3.8 hrs', slug: 'electronics' },
  { name: 'Construction Materials', desc: 'Building and construction supplies', needs: 142, vendors: 89, avgResponse: '5.1 hrs', slug: 'construction' },
  { name: 'Food & Beverage', desc: 'Catering and food services', needs: 89, vendors: 124, avgResponse: '2.9 hrs', slug: 'food' },
  { name: 'Marketing Services', desc: 'Advertising and digital marketing', needs: 167, vendors: 178, avgResponse: '6.3 hrs', slug: 'marketing' },
  { name: 'Professional Services', desc: 'Consulting and business services', needs: 213, vendors: 287, avgResponse: '4.7 hrs', slug: 'professional' },
  { name: 'IT Services', desc: 'Software and IT solutions', needs: 298, vendors: 312, avgResponse: '3.2 hrs', slug: 'software' },
  { name: 'Furniture', desc: 'Office and commercial furniture', needs: 127, vendors: 94, avgResponse: '5.6 hrs', slug: 'furniture' },
];

const CAT_ICONS = {
  'Agriculture & Farming': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M12 22V12"/><path d="M12 12C12 7 7 4 2 6"/><path d="M12 12C12 7 17 4 22 6"/></svg>,
  'Automotive Parts': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>,
  'Construction & Building': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>,
  'Electronics & Technology': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  'Energy & Utilities': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  'Events & Catering': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  'Fashion & Textiles': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/></svg>,
  'Food & Beverage': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>,
  'Furniture & Interior': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M20 9V6a2 2 0 00-2-2H4a2 2 0 00-2 2v3"/><path d="M2 11v5a2 2 0 002 2h16a2 2 0 002-2v-5a2 2 0 00-4 0v2H6v-2a2 2 0 00-4 0z"/></svg>,
  'Healthcare & Medical': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  'Industrial Machinery': <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
};

const DefaultIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><circle cx="12" cy="10" r="3"/></svg>
);

export default function BrowseCategories() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryRequest, setCategoryRequest] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data } = await supabase.from('categories').select('*').order('name_en');
        if (data && data.length > 0) {
          setCategories(data.map(c => ({ name: c.name_en, count: Math.floor(Math.random() * 400) + 50, slug: c.slug })));
        } else {
          setCategories(ALL_CATEGORIES);
        }
      } catch(e) {
        setCategories(ALL_CATEGORIES);
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const filtered = categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const breadcrumb = [{ label: 'Home', path: '/' }, { label: t('browse_categories') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="Browse">
      <div className="bc__wrap">

        {/* Hero */}
        <div className="bc__hero">
          <h1 className="bc__title">{t('browse_categories')}</h1>
          <p className="bc__sub">{t('browse_categories_sub')}</p>
          <div className="bc__search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
            <input placeholder={t('search_categories')} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {/* All Categories Grid */}
        <div className="bc__section">
          <h2 className="bc__section-title">{t('all_categories')}</h2>
          <div className="bc__all-grid">
            {filtered.map((cat, i) => (
              <div key={i} className="bc__cat-item" onClick={() => navigate('/browse/vendors')}>
                <div className="bc__cat-icon">{CAT_ICONS[cat.name] || <DefaultIcon />}</div>
                <div>
                  <p className="bc__cat-name">{cat.name}</p>
                  <p className="bc__cat-count">{cat.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="bc__section">
          <div className="bc__featured-grid">
            {FEATURED.map((cat, i) => (
              <div key={i} className="bc__featured-card" onClick={() => navigate('/browse/vendors')}>
                <div className="bc__featured-img">
                  <div className="bc__featured-overlay" />
                </div>
                <div className="bc__featured-body">
                  <h3 className="bc__featured-name">{cat.name}</h3>
                  <p className="bc__featured-desc">{cat.desc}</p>
                  <div className="bc__featured-stats">
                    <div className="bc__featured-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
                      <span>{t('active_needs')}</span>
                      <span className="bc__stat-num" style={{ color: '#00A7E5' }}>{cat.needs}</span>
                    </div>
                    <div className="bc__featured-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                      <span>{t('vendors')}</span>
                      <span className="bc__stat-num">{cat.vendors}</span>
                    </div>
                    <div className="bc__featured-stat">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/></svg>
                      <span>{t('avg_response')}</span>
                      <span className="bc__stat-num">{cat.avgResponse}</span>
                    </div>
                  </div>
                  <button className="bc__featured-btn">{t('view_category')}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Request Category */}
        <div className="bc__request">
          <h3 className="bc__request-title">{t('cant_find_category')}</h3>
          <p className="bc__request-sub">{t('request_category')}</p>
          <div className="bc__request-form">
            <input className="bc__request-input" placeholder={t('enter_category')} value={categoryRequest} onChange={e => setCategoryRequest(e.target.value)} />
            <button className="bc__request-btn" onClick={() => {
              if (categoryRequest.trim()) {
                setCategoryRequest('');
                alert('Request submitted! We will review your category request.');
              }
            }}>{t('submit_request')}</button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}