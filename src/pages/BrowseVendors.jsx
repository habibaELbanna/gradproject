import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './BrowseVendors.css';

const STR = {
  en: { title: 'Browse Vendors', sub: 'Discover verified vendors across every category.', searchPh: 'Search vendors...', view: 'View Profile', verified: 'Verified', empty: 'No vendors found', emptySub: 'Try a different search.', home: 'Home', browse: 'Browse' },
  ar: { title: 'تصفّح الموردين', sub: 'اكتشف موردين موثّقين في كل فئة.', searchPh: 'ابحث عن موردين...', view: 'عرض الملف', verified: 'موثّق', empty: 'لا يوجد موردون', emptySub: 'جرّب بحثًا مختلفًا.', home: 'الرئيسية', browse: 'تصفّح' },
};

const PHOTOS = [
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/52.jpg',
  'https://randomuser.me/api/portraits/women/29.jpg',
  'https://randomuser.me/api/portraits/men/76.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
];
const GRADIENTS = [
  'linear-gradient(135deg,#0091c7,#00496b)', 'linear-gradient(135deg,#2a3950,#141c28)',
  'linear-gradient(135deg,#0a7d6c,#06463d)', 'linear-gradient(135deg,#5a468c,#2f2858)',
  'linear-gradient(135deg,#b06a2a,#5a3514)', 'linear-gradient(135deg,#1f6f8b,#0c2c38)',
];
const photoFor = (i) => PHOTOS[i % PHOTOS.length];
const gradFor = (s) => GRADIENTS[(String(s).charCodeAt(0) || 0) % GRADIENTS.length];

const DEMO = [
  { id: 'd1', en: 'BuildRight Construction', ar: 'بيلد رايت للإنشاءات', catEn: 'Construction & Building', catAr: 'البناء والتشييد', rating: 4.8, verified: true },
  { id: 'd2', en: 'TechFlow Solutions', ar: 'تك فلو', catEn: 'IT & Software', catAr: 'تقنية المعلومات', rating: 4.6, verified: true },
  { id: 'd3', en: 'Cairo Office Supplies', ar: 'مستلزمات القاهرة', catEn: 'Office Supplies', catAr: 'مستلزمات المكاتب', rating: 4.5, verified: false },
  { id: 'd4', en: 'Nile Furniture Co.', ar: 'أثاث النيل', catEn: 'Furniture', catAr: 'الأثاث', rating: 4.7, verified: true },
  { id: 'd5', en: 'BrandWave Agency', ar: 'براند ويف', catEn: 'Marketing & Advertising', catAr: 'التسويق والإعلان', rating: 4.4, verified: false },
  { id: 'd6', en: 'SwiftLine Logistics', ar: 'سويفت لاين', catEn: 'Logistics & Shipping', catAr: 'الشحن واللوجستيات', rating: 4.6, verified: true },
  { id: 'd7', en: 'PureClean Services', ar: 'بيور كلين', catEn: 'Cleaning & Facilities', catAr: 'النظافة والمرافق', rating: 4.3, verified: false },
  { id: 'd8', en: 'PrintPro Press', ar: 'برينت برو', catEn: 'Printing & Packaging', catAr: 'الطباعة والتغليف', rating: 4.5, verified: true },
];

const VendorImg = ({ src, name, i }) => {
  const [err, setErr] = useState(false);
  if (err) return <div className="bv__img bv__img--ph" style={{ background: gradFor(name) }}><span>{(name || '?')[0].toUpperCase()}</span></div>;
  return <div className="bv__img"><img src={src || photoFor(i)} alt="" loading="lazy" onError={() => setErr(true)} /></div>;
};

export default function BrowseVendors() {
  const { i18n } = useTranslation();
  const L = i18n.language === 'ar' ? 'ar' : 'en';
  const tr = STR[L];
  const navigate = useNavigate();

  const [vendors, setVendors] = useState(DEMO);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('companies').select('*, vendor_profiles(*)').eq('company_type', 'vendor');
        if (data && data.length) {
          setVendors(data.map(c => ({
            id: c.id,
            en: c.name_en || c.name_ar || '—', ar: c.name_ar || c.name_en || '—',
            catEn: c.industry || '', catAr: c.industry_ar || c.industry || '',
            rating: c.rating || c.vendor_profiles?.rating || 0,
            verified: c.is_verified || c.vendor_profiles?.is_verified || false,
            logo: c.logo_url || c.avatar_url || null,
          })));
        }
      } catch (e) {}
    })();
  }, []);

  const nameOf = (v) => (L === 'ar' ? v.ar : v.en) || v.en;
  const catOf = (v) => (L === 'ar' ? v.catAr : v.catEn) || v.catEn || '';
  const filtered = vendors.filter(v => nameOf(v).toLowerCase().includes(search.toLowerCase()));
  const breadcrumb = [{ label: tr.home, path: '/' }, { label: tr.browse, path: '/browse' }, { label: tr.title }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={tr.title}>
      <div className="bv" dir={L === 'ar' ? 'rtl' : 'ltr'}>
        <div className="bv__head">
          <h1 className="bv__title">{tr.title}</h1>
          <p className="bv__sub">{tr.sub}</p>
        </div>

        <div className="bv__search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#555" strokeWidth="1.5"/><path d="M21 21l-4.35-4.35" stroke="#555" strokeWidth="1.5"/></svg>
          <input placeholder={tr.searchPh} value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="bv__empty"><h3 className="bv__empty-title">{tr.empty}</h3><p className="bv__empty-sub">{tr.emptySub}</p></div>
        ) : (
          <div className="bv__grid">
            {filtered.map((v, i) => (
              <div key={v.id} className="bv__card" onClick={() => navigate(`/vendor/profile/${v.id}`)}>
                <VendorImg src={v.logo} name={nameOf(v)} i={i} />
                <div className="bv__body">
                  <div className="bv__row">
                    <h3 className="bv__name">{nameOf(v)}</h3>
                    {v.verified && (
                      <span className="bv__verified"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>{tr.verified}</span>
                    )}
                  </div>
                  {catOf(v) && <p className="bv__cat">{catOf(v)}</p>}
                  {v.rating > 0 && (
                    <div className="bv__rating"><span className="bv__stars">{'★'.repeat(Math.round(v.rating))}</span><span className="bv__rnum">{Number(v.rating).toFixed(1)}</span></div>
                  )}
                  <button type="button" className="bv__view" onClick={(e) => { e.stopPropagation(); navigate(`/vendor/profile/${v.id}`); }}>{tr.view}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}