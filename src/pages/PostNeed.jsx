import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../supabaseClient';
import './PostNeed.css';

const STR = {
  en: {
    backDash: 'Back to Dashboard', save: 'Save & Exit', title: 'Post a Need',
    step: 'Step', of: 'of', autosave: 'Your progress is automatically saved',
    back: 'Back', cont: 'Continue', publish: 'Publish Need', publishing: 'Publishing...',
    pick: 'What type of product or service are you offering?', pickSub: 'This helps procurement teams find your need',
    examples: 'Examples:', hint: 'Entire card clickable with border',
    detailsTitle: "Describe what you need", detailsSub: 'Make your request clear and specific',
    titleL: 'Title', titleAr: 'Title (Arabic)', optional: 'Optional', chars: 'characters',
    titlePh: 'e.g., Office furniture for 50 employees',
    descL: 'Description', descAr: 'Description (Arabic)',
    descPh: "Describe your need...\n\u2022 Specifications and quantities\n\u2022 Quality requirements\n\u2022 Delivery expectations",
    budgetTitle: 'Set your budget and timeline', budgetSub: 'Help vendors tailor their quotes',
    min: 'Minimum Budget', max: 'Maximum Budget', minHint: 'Leave blank if flexible',
    deadline: 'Proposal Deadline', urgency: 'Urgency Level', low: 'Low', normal: 'Normal', high: 'High',
    timelineTitle: 'Timeline & urgency', timelineSub: 'When do you need this, and how urgent is it?',
    reviewTitle: 'Review & Publish', reviewSub: 'Final review before publishing your need',
    category: 'Category', edit: 'Edit', notSet: 'Not set',
    required: 'Please fill in the required fields', noCompany: 'Complete your company profile before posting a need',
    error: "Couldn't post your need. Please try again.",
  },
  ar: {
    backDash: 'العودة للوحة التحكم', save: 'حفظ وخروج', title: 'انشر احتياجًا',
    step: 'خطوة', of: 'من', autosave: 'يتم حفظ تقدمك تلقائيًا',
    back: 'السابق', cont: 'التالي', publish: 'نشر الاحتياج', publishing: 'جارٍ النشر...',
    pick: 'ما نوع المنتج أو الخدمة التي تحتاجها؟', pickSub: 'يساعد هذا الموردين على فهم احتياجك',
    examples: 'أمثلة:', hint: 'البطاقة كاملة قابلة للضغط بحدودها',
    detailsTitle: 'صِف احتياجك', detailsSub: 'اجعل طلبك واضحًا ومحددًا',
    titleL: 'العنوان', titleAr: 'العنوان (عربي)', optional: 'اختياري', chars: 'حرف',
    titlePh: 'مثال: أثاث مكتبي لـ 50 موظفًا',
    descL: 'الوصف', descAr: 'الوصف (عربي)',
    descPh: 'صِف احتياجك...\n\u2022 المواصفات والكميات\n\u2022 متطلبات الجودة\n\u2022 توقعات التسليم',
    budgetTitle: 'حدد ميزانيتك وجدولك الزمني', budgetSub: 'ساعد الموردين على تقديم عروض دقيقة',
    min: 'الحد الأدنى للميزانية', max: 'الحد الأقصى للميزانية', minHint: 'اتركه فارغًا إن كان مرنًا',
    deadline: 'الموعد النهائي للعروض', urgency: 'مستوى الأولوية', low: 'منخفضة', normal: 'عادية', high: 'عاجلة',
    timelineTitle: 'الجدول الزمني والأولوية', timelineSub: 'متى تحتاج هذا وما مدى إلحاحه؟',
    reviewTitle: 'المراجعة والنشر', reviewSub: 'مراجعة أخيرة قبل نشر احتياجك',
    category: 'الفئة', edit: 'تعديل', notSet: 'غير محدد',
    required: 'يرجى ملء الحقول المطلوبة', noCompany: 'أكمل ملف شركتك قبل نشر احتياج',
    error: 'تعذّر نشر الاحتياج. حاول مرة أخرى.',
  },
};

const ICON = {
  physical: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
  digital: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  service: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
};
const CATEGORIES = [
  { id: 'physical', en: 'Physical Product', ar: 'منتج مادي', exEn: ['Furniture', 'Equipment', 'Supplies', 'Materials'], exAr: ['الأثاث', 'المعدات', 'اللوازم', 'المواد'] },
  { id: 'digital', en: 'Digital Product', ar: 'منتج رقمي', exEn: ['Software', 'E-books', 'Templates', 'Licenses'], exAr: ['البرمجيات', 'الكتب الإلكترونية', 'القوالب', 'التراخيص'] },
  { id: 'service', en: 'Service', ar: 'خدمة', exEn: ['Consulting', 'Installation', 'Training', 'Support'], exAr: ['الاستشارات', 'التركيب', 'التدريب', 'الدعم'] },
];
const STEPS = 5;

export default function PostNeed() {
  const { i18n } = useTranslation();
  const L = i18n.language === 'ar' ? 'ar' : 'en';
  const tr = STR[L];
  const dir = L === 'ar' ? 'rtl' : 'ltr';
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [d, setD] = useState({ cat: '', titleEn: '', titleAr: '', descEn: '', descAr: '', min: '', max: '', deadline: '', urgency: 'normal' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setD(p => ({ ...p, [k]: v }));
  const fmt = (n) => (n ? Number(n).toLocaleString() : '—');
  const urgTxt = (u) => u === 'low' ? tr.low : u === 'high' ? tr.high : tr.normal;
  const selCat = CATEGORIES.find(c => c.id === d.cat);

  const validate = (s) => {
    if (s === 1 && !d.cat) return tr.required;
    if (s === 2 && !d.titleEn.trim()) return tr.required;
    if (s === 3 && !d.max) return tr.required;
    return '';
  };
  const next = () => { const v = validate(step); if (v) return setError(v); setError(''); setStep(s => Math.min(STEPS, s + 1)); };
  const back = () => { setError(''); setStep(s => Math.max(1, s - 1)); };
  const goto = (s) => { setError(''); setStep(s); };

  const publish = async () => {
    for (let s = 1; s <= 3; s++) { const v = validate(s); if (v) { setError(v); setStep(s); return; } }
    setLoading(true); setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/login'); return; }
      const { data: company } = await supabase.from('companies').select('id').eq('owner_id', user.id).maybeSingle();
      if (!company) { setError(tr.noCompany); setLoading(false); return; }
      const row = {
        buyer_company_id: company.id,
        title_en: d.titleEn.trim(), title_ar: (d.titleAr.trim() || d.titleEn.trim()),
        body_en: d.descEn.trim(), body_ar: (d.descAr.trim() || d.descEn.trim()),
        budget_min_egp: d.min ? parseFloat(d.min) : null, budget_max_egp: d.max ? parseFloat(d.max) : null,
        deadline: d.deadline || null, urgency_level: d.urgency, status: 'open',
      };
      const { error: insErr } = await supabase.from('needs').insert([row]);
      if (insErr) { setError(insErr.message || tr.error); setLoading(false); return; }
      navigate('/buyer/dashboard');
    } catch (e) { setError(tr.error); setLoading(false); }
  };

  return (
    <div className="pn" dir={dir}>
      <div className="pn__panel">
        <header className="pn__head">
          <button className="pn__head-link" onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/buyer/dashboard')}>← {tr.backDash}</button>
          <h1 className="pn__head-title">{tr.title}</h1>
          <button className="pn__head-link" onClick={() => navigate('/buyer/dashboard')}>{tr.save}</button>
        </header>

        <div className="pn__prog">
          <div className="pn__dots">{Array.from({ length: STEPS }).map((_, i) => <span key={i} className={`pn__dot ${i < step ? 'pn__dot--on' : ''}`} />)}</div>
          <p className="pn__steplabel">{tr.step} {step} {tr.of} {STEPS}</p>
        </div>

        <div className="pn__content">
          {error && <div className="pn__error">{error}</div>}

          {step === 1 && (<>
            <h2 className="pn__h">{tr.pick}</h2>
            <p className="pn__sub">{tr.pickSub}</p>
            <div className="pn__grid">
              {CATEGORIES.map(c => {
                const sel = d.cat === c.id;
                return (
                  <button type="button" key={c.id} className={`pn__card ${sel ? 'pn__card--on' : ''}`} onClick={() => set('cat', c.id)}>
                    {sel && <span className="pn__check">✓</span>}
                    <span className="pn__card-icon">{ICON[c.id]}</span>
                    <span className="pn__card-label">{c[L]}</span>
                    <span className="pn__card-ex-title">{tr.examples}</span>
                    <span className="pn__card-ex">{(L === 'ar' ? c.exAr : c.exEn).map(e => <span key={e}>• {e}</span>)}</span>
                    <span className="pn__card-div" />
                    <span className="pn__card-hint">{tr.hint}</span>
                  </button>
                );
              })}
            </div>
          </>)}

          {step === 2 && (<>
            <h2 className="pn__h">{tr.detailsTitle}</h2>
            <p className="pn__sub">{tr.detailsSub}</p>
            <div className="pn__form">
              <div className="pn__field">
                <label className="pn__label">{tr.titleL} <span className="pn__req">*</span></label>
                <input className="pn__input" maxLength={100} value={d.titleEn} onChange={e => set('titleEn', e.target.value)} placeholder={tr.titlePh} />
                <span className="pn__counter">{d.titleEn.length}/100 {tr.chars}</span>
              </div>
              <div className="pn__field">
                <label className="pn__label">{tr.titleAr} <span className="pn__opt">({tr.optional})</span></label>
                <input className="pn__input" dir="rtl" value={d.titleAr} onChange={e => set('titleAr', e.target.value)} />
              </div>
              <div className="pn__field">
                <label className="pn__label">{tr.descL}</label>
                <div className="pn__editor">
                  <div className="pn__toolbar">
                    <button type="button" className="pn__tool"><b>B</b></button>
                    <button type="button" className="pn__tool"><i>I</i></button>
                    <button type="button" className="pn__tool">≡</button>
                    <button type="button" className="pn__tool">🔗</button>
                  </div>
                  <textarea className="pn__input pn__area" rows={6} value={d.descEn} onChange={e => set('descEn', e.target.value)} placeholder={tr.descPh} />
                </div>
              </div>
              <div className="pn__field">
                <label className="pn__label">{tr.descAr} <span className="pn__opt">({tr.optional})</span></label>
                <textarea className="pn__input pn__area" rows={4} dir="rtl" value={d.descAr} onChange={e => set('descAr', e.target.value)} />
              </div>
            </div>
          </>)}

          {step === 3 && (<>
            <h2 className="pn__h">{tr.budgetTitle}</h2>
            <p className="pn__sub">{tr.budgetSub}</p>
            <div className="pn__form">
              <div className="pn__field">
                <label className="pn__label">{tr.min} <span className="pn__opt">({tr.optional})</span></label>
                <div className="pn__money"><span>EGP</span><input type="number" min="0" value={d.min} onChange={e => set('min', e.target.value)} placeholder="0" /></div>
                <span className="pn__help">{tr.minHint}</span>
              </div>
              <div className="pn__field">
                <label className="pn__label">{tr.max} <span className="pn__req">*</span></label>
                <div className="pn__money"><span>EGP</span><input type="number" min="0" value={d.max} onChange={e => set('max', e.target.value)} placeholder="0" /></div>
              </div>
            </div>
          </>)}

          {step === 4 && (<>
            <h2 className="pn__h">{tr.timelineTitle}</h2>
            <p className="pn__sub">{tr.timelineSub}</p>
            <div className="pn__form">
              <div className="pn__field">
                <label className="pn__label">{tr.deadline} <span className="pn__opt">({tr.optional})</span></label>
                <input className="pn__input" type="date" value={d.deadline} onChange={e => set('deadline', e.target.value)} />
              </div>
              <div className="pn__field">
                <label className="pn__label">{tr.urgency} <span className="pn__req">*</span></label>
                <div className="pn__radios">
                  {['low', 'normal', 'high'].map(u => (
                    <label key={u} className="pn__radio"><input type="radio" name="urgency" checked={d.urgency === u} onChange={() => set('urgency', u)} /><span>{urgTxt(u)}</span></label>
                  ))}
                </div>
              </div>
            </div>
          </>)}

          {step === 5 && (<>
            <h2 className="pn__h">{tr.reviewTitle}</h2>
            <p className="pn__sub">{tr.reviewSub}</p>
            <div className="pn__review">
              <div className="pn__rrow"><span className="pn__rlabel">{tr.category}</span><span className="pn__rval">{selCat ? selCat[L] : tr.notSet}</span><button className="pn__redit" onClick={() => goto(1)}>{tr.edit}</button></div>
              <div className="pn__rrow"><span className="pn__rlabel">{tr.titleL}</span><span className="pn__rval">{d.titleEn || tr.notSet}</span><button className="pn__redit" onClick={() => goto(2)}>{tr.edit}</button></div>
              {d.titleAr && <div className="pn__rrow"><span className="pn__rlabel">{tr.titleAr}</span><span className="pn__rval">{d.titleAr}</span><button className="pn__redit" onClick={() => goto(2)}>{tr.edit}</button></div>}
              {(d.descEn || d.descAr) && <div className="pn__rrow"><span className="pn__rlabel">{tr.descL}</span><span className="pn__rval">{d.descEn || d.descAr}</span><button className="pn__redit" onClick={() => goto(2)}>{tr.edit}</button></div>}
              <div className="pn__rrow"><span className="pn__rlabel">{tr.max}</span><span className="pn__rval">{fmt(d.min)} — {fmt(d.max)} EGP</span><button className="pn__redit" onClick={() => goto(3)}>{tr.edit}</button></div>
              <div className="pn__rrow"><span className="pn__rlabel">{tr.deadline}</span><span className="pn__rval">{d.deadline || tr.notSet}</span><button className="pn__redit" onClick={() => goto(4)}>{tr.edit}</button></div>
              <div className="pn__rrow"><span className="pn__rlabel">{tr.urgency}</span><span className="pn__rval">{urgTxt(d.urgency)}</span><button className="pn__redit" onClick={() => goto(4)}>{tr.edit}</button></div>
            </div>
          </>)}
        </div>

        <footer className="pn__foot">
          <div className="pn__foot-row">
            {step > 1 ? <button className="pn__btn-back" onClick={back}>← {tr.back}</button> : <span />}
            {step < STEPS
              ? <button className="pn__btn-next" onClick={next}>{tr.cont} →</button>
              : <button className="pn__btn-next" onClick={publish} disabled={loading}>{loading ? tr.publishing : tr.publish + ' →'}</button>}
          </div>
          <p className="pn__autosave">{tr.autosave}</p>
        </footer>
      </div>
    </div>
  );
}