import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import DashboardLayout from '../components/Dashboardlayout';
import './PostNeed.css';

export default function PostNeed() {
  const { t, i18n } = useTranslation();
  const L = i18n.language === 'ar' ? 'ar' : 'en';
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    titleEn: '', titleAr: '', descEn: '', descAr: '',
    categoryId: '', budgetMin: '', budgetMax: '', deadline: '', urgency: 'normal',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.from('categories').select('id, name_en, name_ar').order('name_en');
        if (data) setCategories(data);
      } catch (e) {}
    })();
  }, []);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError('');
    if (!form.titleEn.trim() || !form.categoryId || !form.budgetMax) {
      setError(t('pn_required'));
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).maybeSingle();
      if (!company) { setError(t('pn_no_company')); setLoading(false); return; }

      const row = {
        buyer_company_id: company.id,
        category_id: form.categoryId,
        title_en: form.titleEn.trim(),
        title_ar: (form.titleAr.trim() || form.titleEn.trim()),
        body_en: form.descEn.trim(),
        body_ar: (form.descAr.trim() || form.descEn.trim()),
        budget_min_egp: form.budgetMin ? parseFloat(form.budgetMin) : null,
        budget_max_egp: form.budgetMax ? parseFloat(form.budgetMax) : null,
        deadline: form.deadline || null,
        urgency_level: form.urgency,
        status: 'open',
      };
      const { error: insErr } = await supabase.from('needs').insert([row]);
      if (insErr) { setError(insErr.message || t('pn_error')); setLoading(false); return; }

      setSuccess(true);
      setTimeout(() => navigate('/buyer/dashboard'), 900);
    } catch (e) {
      setError(t('pn_error'));
      setLoading(false);
    }
  };

  const breadcrumb = [{ label: t('bd_home'), path: '/' }, { label: t('bd_title'), path: '/buyer/dashboard' }, { label: t('pn_title') }];

  return (
    <DashboardLayout breadcrumb={breadcrumb} pageTitle={t('pn_title')}>
      <div className="pn" dir={i18n.dir()}>
        <div className="pn__head">
          <h1 className="pn__title">{t('pn_title')}</h1>
          <p className="pn__subtitle">{t('pn_subtitle')}</p>
        </div>

        {error && <div className="pn__alert pn__alert--error">{error}</div>}
        {success && <div className="pn__alert pn__alert--success">{t('pn_success')}</div>}

        <div className="pn__card">
          <div className="pn__row">
            <div className="pn__field">
              <label className="pn__label">{t('pn_title_en')} *</label>
              <input className="pn__input" value={form.titleEn} onChange={set('titleEn')} placeholder={t('pn_title_ph')} />
            </div>
            <div className="pn__field">
              <label className="pn__label">{t('pn_title_ar')}</label>
              <input className="pn__input" dir="rtl" value={form.titleAr} onChange={set('titleAr')} />
            </div>
          </div>

          <div className="pn__field">
            <label className="pn__label">{t('pn_category')} *</label>
            <select className="pn__input pn__select" value={form.categoryId} onChange={set('categoryId')}>
              <option value="">{t('pn_category_ph')}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c['name_' + L] || c.name_en}</option>
              ))}
            </select>
          </div>

          <div className="pn__row">
            <div className="pn__field">
              <label className="pn__label">{t('pn_desc_en')}</label>
              <textarea className="pn__input pn__textarea" value={form.descEn} onChange={set('descEn')} placeholder={t('pn_desc_ph')} rows={4} />
            </div>
            <div className="pn__field">
              <label className="pn__label">{t('pn_desc_ar')}</label>
              <textarea className="pn__input pn__textarea" dir="rtl" value={form.descAr} onChange={set('descAr')} rows={4} />
            </div>
          </div>

          <div className="pn__field">
            <label className="pn__label">{t('pn_budget')} *</label>
            <div className="pn__budget">
              <input className="pn__input" type="number" min="0" value={form.budgetMin} onChange={set('budgetMin')} placeholder={t('pn_budget_min')} />
              <span className="pn__budget-sep">—</span>
              <input className="pn__input" type="number" min="0" value={form.budgetMax} onChange={set('budgetMax')} placeholder={t('pn_budget_max')} />
            </div>
          </div>

          <div className="pn__row">
            <div className="pn__field">
              <label className="pn__label">{t('pn_deadline')}</label>
              <input className="pn__input" type="date" value={form.deadline} onChange={set('deadline')} />
            </div>
            <div className="pn__field">
              <label className="pn__label">{t('pn_urgency')}</label>
              <select className="pn__input pn__select" value={form.urgency} onChange={set('urgency')}>
                <option value="low">{t('pn_urgency_low')}</option>
                <option value="normal">{t('pn_urgency_normal')}</option>
                <option value="high">{t('pn_urgency_high')}</option>
              </select>
            </div>
          </div>

          <div className="pn__actions">
            <button className="pn__btn-secondary" onClick={() => navigate('/buyer/dashboard')} disabled={loading}>{t('pn_cancel')}</button>
            <button className="pn__btn-primary" onClick={submit} disabled={loading}>{loading ? t('pn_submitting') : t('pn_submit')}</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}