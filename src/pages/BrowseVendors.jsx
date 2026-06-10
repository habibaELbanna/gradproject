import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './BrowseVendors.css';

const PHOTOS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
];
const photoFor = (n) => PHOTOS[Math.abs(Number(n) || 0) % PHOTOS.length];

export default function BrowseVendors() {
  const { t, i18n } = useTranslation();
  const L = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('companies').select('*, vendor_profiles(*)').eq('company_type', 'vendor');
        if (data) setVendors(data);
      } catch (e) {} finally { setLoading(false); }
    })();
  }, []);

  const nameOf = (c) => c['name_' + L] || c.name_en || c.name_ar || '\u2014';
  const descOf = (c) => c['description_' + L] || c.description_en || c.description_ar || '';
  const ratingOf = (c) => c.rating || c.vendor_profiles?.rating || c.vendor_profiles?.avg_rating || 0;
  const verifiedOf = (c) => c.is_verified || c.vendor_profiles?.is_verified || false;

  const filtered = vendors.filter(c => nameOf(c).toLowerCase().includes(search.toLowerCase()));
  const breadcrumb = [{ label: t('bd_home'), path: '/' }, { label: t('browse_categories'), path: '/browse' }, { label: t('browse_vendors') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={t('browse_vendors')}>
      <div className="bv" dir={i18n.dir()}>
        <div className="bv__head">
          <h1 className="bv__title">{t('browse_vendors')}</h1>
          <p className="bv__sub">{t('bv_sub')}</p>
        </div>

        <div className="bv__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
          <input placeholder={t('bv_search_ph')} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {loading && <p className="bv__muted">{t('bv_loading')}</p>}

        {!loading && filtered.length === 0 && (
          <div className="bv__empty">
            <h3 className="bv__empty-title">{t('bv_empty')}</h3>
            <p className="bv__empty-sub">{t('bv_empty_sub')}</p>
          </div>
        )}

        <div className="bv__grid">
          {filtered.map((c, i) => (
            <div key={c.id} className="bv__card" onClick={() => navigate(`/vendor/profile/${c.id}`)}>
              <div className="bv__card-top">
                <div className="bv__avatar"><img src={photoFor(i)} alt="" loading="lazy" /></div>
                {verifiedOf(c) && (
                  <span className="bv__verified">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {t('bv_verified')}
                  </span>
                )}
              </div>
              <h3 className="bv__name">{nameOf(c)}</h3>
              {descOf(c) && <p className="bv__desc">{descOf(c)}</p>}
              {ratingOf(c) > 0 && (
                <div className="bv__rating">
                  <span className="bv__stars">{'\u2605'.repeat(Math.round(ratingOf(c)))}</span>
                  <span className="bv__rating-num">{Number(ratingOf(c)).toFixed(1)}</span>
                </div>
              )}
              <button type="button" className="bv__view" onClick={(e) => { e.stopPropagation(); navigate(`/vendor/profile/${c.id}`); }}>{t('bv_view')}</button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}