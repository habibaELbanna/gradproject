import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './VendorProfile.css';

const SERVICES = [
  'Commercial Building Construction', 'Residential Construction & Development',
  'Industrial Facilities & Warehouses', 'Renovation & Remodeling',
  'Project Management & Consultation', 'Interior Fit-out Services',
];

const PROJECTS = [
  { title: 'Commercial Complex – New Cairo', img: null },
  { title: 'Office Tower Renovation', img: null },
  { title: 'Luxury Villa Development', img: null },
  { title: 'Shopping Mall Construction', img: null },
  { title: 'Industrial Warehouse', img: null },
  { title: 'Interior Renovation Project', img: null },
];

const CERTS = [
  { icon: '🛡', title: 'ISO 9001:2015 Certification', issuer: 'International Organization for Standardization', valid: 'Dec 2026' },
  { icon: '🛡', title: 'Safety Management Certification', issuer: 'Egyptian Construction Authority', valid: 'Jun 2027' },
  { icon: '🛡', title: 'Green Building Certification', issuer: 'LEED Certification Program', valid: 'Mar 2026' },
  { icon: '🛡', title: 'Quality Assurance License', issuer: 'Ministry of Housing', valid: 'Sep 2027' },
];

const SIMILAR = [
  { name: 'ConstructPro Egypt', category: 'Construction & Building', rating: 4.6, reviews: 178 },
  { name: 'Elite Builders', category: 'Construction & Renovation', rating: 4.7, reviews: 203 },
  { name: 'Modern Construction Co.', category: 'Building & Infrastructure', rating: 4.5, reviews: 156 },
];

const STATIC_REVIEWS = [
  { name: 'Mohamed Ahmed', company: 'TechCorp Egypt', rating: 5, time: '2 weeks ago', text: 'BuildRight exceeded our expectations with the office renovation project. They completed the work on time and within budget. The quality of workmanship is excellent, and their team was professional throughout the entire process.', project: 'Office Renovation - 5th Settlement' },
  { name: 'Sarah Hassan', company: 'StartupHub', rating: 5, time: '1 month ago', text: 'Outstanding service from start to finish. The team was responsive, detail-oriented, and delivered exceptional results. Highly recommend for any construction project.', project: 'Commercial Space Build-out' },
  { name: 'Ahmed Khalil', company: 'BuildCo Industries', rating: 4, time: '2 months ago', text: 'Very professional team with great attention to detail. Minor delays due to material availability, but they kept us informed throughout. Quality of work is top-notch.', project: 'Warehouse Expansion' },
  { name: 'Layla Mansour', company: 'RetailMax Group', rating: 5, time: '2 months ago', text: 'BuildRight completed our retail space renovation ahead of schedule. Their project management skills are excellent, and they coordinated all aspects seamlessly.', project: 'Retail Store Renovation' },
  { name: 'Omar Ibrahim', company: 'Propinvest', rating: 5, time: '3 months ago', text: "Best construction company we've worked with in Egypt. Professional, reliable, and deliver high-quality work consistently. Will definitely use them again.", project: 'Residential Villa Construction' },
];

export default function VendorProfile() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [reviewFilter, setReviewFilter] = useState('all');
  const [saved, setSaved] = useState(false);
  const [vendor, setVendor] = useState({
    name: 'BuildRight Construction', category: 'Construction & Building',
    rating: 4.8, reviews: 245, location: 'Cairo, Egypt',
    is_verified: true, since: '2024',
    about: 'BuildRight Construction is a leading construction and building company based in Cairo, Egypt, with over 8 years of experience delivering high-quality construction projects across residential, commercial, and industrial sectors.\n\nOur team of 45 skilled professionals is committed to excellence, innovation, and customer satisfaction. We specialize in complete construction solutions, from initial design and planning to final execution and handover.\n\nWith a strong track record of 89 successfully completed projects and a 95% on-time delivery rate, BuildRight has established itself as a trusted partner for businesses and individuals seeking reliable construction services in Egypt.',
  });
  const [stats, setStats] = useState({ projects: 89, responseTime: '4 hours', winRate: 72, onTime: 95 });
  const [reviews, setReviews] = useState(STATIC_REVIEWS);

  useEffect(() => {
    async function fetchVendor() {
      try {
        if (id) {
          const { data: comp } = await supabase.from('companies').select('*, vendor_profiles(*)').eq('id', id).single();
          if (comp) {
            setVendor(v => ({ ...v, name: comp.name_en, about: comp.description_en || v.about }));
            if (comp.vendor_profiles) {
              setStats({ projects: comp.vendor_profiles.projects_completed || 89, responseTime: `${comp.vendor_profiles.response_time_hours || 4} hours`, winRate: comp.vendor_profiles.win_rate || 72, onTime: comp.vendor_profiles.on_time_pct || 95 });
            }
          }
          const { data: reviewData } = await supabase.from('reviews').select('*, profiles!reviewer_company_id(full_name)').eq('vendor_company_id', id);
          if (reviewData && reviewData.length > 0) {
            setReviews(reviewData.map(r => ({ name: r.profiles?.full_name || 'User', company: '', rating: r.rating_stars, time: new Date(r.created_at).toLocaleDateString(), text: r.review_text_en, project: '' })));
          }
        }
      } catch(e) { console.error(e); }
    }
    fetchVendor();
  }, [id]);

  const breadcrumb = [{ label: 'Home', path: '/' }, { label: 'Vendors', path: '/browse' }, { label: vendor.name }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle="Vendor Profile">
      <div className="vp__wrap">

        {/* Hero */}
        <div className="vp__hero">
          <div className="vp__hero-left">
            <div className="vp__logo">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
            </div>
            <div>
              <div className="vp__name-row">
                <h1 className="vp__name">{vendor.name}</h1>
                {vendor.is_verified && (
                  <span className="vp__verified">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                )}
              </div>
              <span className="vp__category">{vendor.category}</span>
              <div className="vp__meta">
                <span className="vp__stars">{'★'.repeat(Math.round(vendor.rating))}</span>
                <span className="vp__rating">{vendor.rating} ({vendor.reviews} reviews)</span>
                <span className="vp__dot">·</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="vp__location">{vendor.location}</span>
                <span className="vp__dot">·</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                <span className="vp__since">Member since {vendor.since}</span>
              </div>
            </div>
          </div>
          <div className="vp__hero-actions">
            <button className="vp__btn-primary">{t('contact_vendor')}</button>
            <button className="vp__btn-secondary">{t('invite_to_bid')}</button>
            <button className={`vp__btn-icon ${saved ? 'vp__btn-icon--saved' : ''}`} onClick={() => setSaved(!saved)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={saved ? '#00A7E5' : 'none'} stroke="#00A7E5" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </button>
            <button className="vp__btn-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="vp__stats">
          {[
            { value: stats.projects, label: t('projects_completed') },
            { value: stats.responseTime, label: 'Response Time (avg)' },
            { value: `${stats.winRate}%`, label: 'Win Rate' },
            { value: `${stats.onTime}%`, label: 'On-Time Delivery' },
          ].map((s, i) => (
            <div key={i} className="vp__stat">
              <span className="vp__stat-value">{s.value}</span>
              <span className="vp__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="vp__body">
          <div className="vp__left">

            {/* About */}
            <div className="vp__card">
              <h3>{t('about_us')}</h3>
              {vendor.about.split('\n\n').map((para, i) => (
                <p key={i} className="vp__about-para">{para}</p>
              ))}
              <div className="vp__services">
                <h4>{t('services_offered')}</h4>
                {SERVICES.map((s, i) => (
                  <div key={i} className="vp__service-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00A7E5" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="vp__card">
              <h3>{t('recent_projects')} ({PROJECTS.length * 2})</h3>
              <div className="vp__projects-grid">
                {PROJECTS.map((p, i) => (
                  <div key={i} className="vp__project">
                    <div className="vp__project-img">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    </div>
                    <p className="vp__project-title">{p.title}</p>
                  </div>
                ))}
              </div>
              <button className="vp__show-more">{t('view_all_projects')}</button>
            </div>

            {/* Certifications */}
            <div className="vp__card">
              <h3>{t('certifications')}</h3>
              <div className="vp__certs-grid">
                {CERTS.map((c, i) => (
                  <div key={i} className="vp__cert">
                    <div className="vp__cert-icon">🛡</div>
                    <h4 className="vp__cert-title">{c.title}</h4>
                    <p className="vp__cert-issuer">Issued by: {c.issuer}</p>
                    <p className="vp__cert-valid">Valid until: {c.valid}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="vp__card">
              <div className="vp__reviews-header">
                <h3>{t('client_reviews')} ({vendor.reviews})</h3>
                <div className="vp__review-filters">
                  {['all', '5 Star', '4 Star', 'Recent'].map(f => (
                    <button key={f} className={`vp__review-filter ${reviewFilter === f ? 'vp__review-filter--active' : ''}`}
                      onClick={() => setReviewFilter(f)}>{f === 'all' ? 'All' : f}</button>
                  ))}
                </div>
              </div>
              <div className="vp__reviews">
                {reviews.map((r, i) => (
                  <div key={i} className="vp__review">
                    <div className="vp__review-top">
                      <div className="vp__review-avatar">{r.name[0]}</div>
                      <div className="vp__review-meta">
                        <h4 className="vp__review-name">{r.name}</h4>
                        <p className="vp__review-company">{r.company}</p>
                      </div>
                      <span className="vp__review-time">{r.time}</span>
                    </div>
                    <div className="vp__review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <p className="vp__review-text">{r.text}</p>
                    {r.project && <p className="vp__review-project">Project: {r.project}</p>}
                  </div>
                ))}
              </div>
              <button className="vp__show-more">{t('view_all_reviews')}</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="vp__right">
            <div className="vp__card">
              <h3>{t('contact_info')}</h3>
              {[
                { icon: '✉', value: 'info@buildright.com.eg' },
                { icon: '📞', value: '+20 2 1234 5678' },
                { icon: '🌐', value: 'www.buildright.eg' },
                { icon: '📍', value: '123 Construction Ave, New Cairo, Cairo, Egypt' },
                { icon: '🕒', value: 'Sun – Thu: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 2:00 PM' },
              ].map((c, i) => (
                <div key={i} className="vp__contact-row">
                  <span className="vp__contact-icon">{c.icon}</span>
                  <span className="vp__contact-value">{c.value}</span>
                </div>
              ))}
            </div>

            <div className="vp__card">
              <h3>{t('categories_served')}</h3>
              <div className="vp__cats">
                {['Construction', 'Renovation', 'Commercial Building', 'Residential', 'Industrial', 'Interior Design', 'Project Management', 'Consulting'].map(cat => (
                  <span key={cat} className="vp__cat-tag">{cat}</span>
                ))}
              </div>
            </div>

            <div className="vp__card">
              <h3>{t('team_size')}</h3>
              <div className="vp__team">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                <div>
                  <span className="vp__team-size">25-50</span>
                  <span className="vp__team-label">Employees</span>
                </div>
              </div>
            </div>

            <div className="vp__card">
              <h3>{t('response_rate')}</h3>
              <div className="vp__response">
                <span className="vp__response-rate">98%</span>
                <span className="vp__response-label">Response rate</span>
              </div>
              <p className="vp__response-note">Usually responds within 4 hours</p>
            </div>

            <div className="vp__card">
              <h3>{t('key_statistics')}</h3>
              {[
                { label: 'Projects completed', value: stats.projects },
                { label: 'Years in business', value: 8 },
                { label: 'Repeat clients', value: '45%' },
              ].map((s, i) => (
                <div key={i} className="vp__key-stat">
                  <span className="vp__key-label">{s.label}</span>
                  <span className="vp__key-value">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="vp__card">
              <h3>{t('similar_vendors')}</h3>
              {SIMILAR.map((v, i) => (
                <div key={i} className="vp__similar">
                  <div className="vp__similar-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>
                  </div>
                  <div className="vp__similar-info">
                    <h4 className="vp__similar-name">{v.name}</h4>
                    <p className="vp__similar-cat">{v.category}</p>
                    <p className="vp__similar-rating">★ {v.rating} ({v.reviews} reviews)</p>
                    <button className="vp__similar-view" onClick={() => navigate('/browse')}>{t('view_profile')}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}