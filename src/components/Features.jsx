import ScrollStack, { ScrollStackItem } from './Scrollstack';
import SectionLabel from './Sectionlabel';
import './Features.css';

const StarIcon = () => (
  <svg width="140" height="140" viewBox="0 0 236 236" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_star)">
      <path d="M100.83 16.7605C89.1231 80.3273 79.6411 89.8094 16.0742 101.516C79.6411 113.223 89.1231 122.705 100.83 186.272C112.537 122.705 122.019 113.223 185.586 101.516C122.019 89.8094 112.537 80.3273 100.83 16.7605Z" fill="#00A7E5" fillOpacity="0.5"/>
    </g>
    <defs><clipPath id="clip0_star"><rect width="169.512" height="169.512" fill="white" transform="translate(16.0781 16.7605)"/></clipPath></defs>
  </svg>
);

const ArrowsIcon = () => (
  <svg width="140" height="140" viewBox="0 0 203 203" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g clipPath="url(#clip0_arrows)">
      <path fillRule="evenodd" clipRule="evenodd" d="M-0.335938 45.2083C29.8848 45.9282 54.1623 70.6509 54.1623 101.045C54.1623 131.439 29.8848 156.162 -0.335938 156.882V45.2083Z" fill="#00A7E5" fillOpacity="0.5"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M49.3516 45.2083C79.5724 45.9282 103.85 70.6509 103.85 101.045C103.85 131.439 79.5724 156.162 49.3516 156.882V45.2083Z" fill="#00A7E5" fillOpacity="0.5"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M99.0273 45.2083C129.248 45.9282 153.526 70.6509 153.526 101.045C153.526 131.439 129.248 156.162 99.0273 156.882V45.2083Z" fill="#00A7E5" fillOpacity="0.5"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M148.707 45.2083C178.928 45.9282 203.205 70.6509 203.205 101.045C203.205 131.439 178.928 156.162 148.707 156.882V45.2083Z" fill="#00A7E5" fillOpacity="0.5"/>
    </g>
    <defs><clipPath id="clip0_arrows"><rect width="202.203" height="202.203" fill="white"/></clipPath></defs>
  </svg>
);

const CheckIcon = () => (
  <svg width="140" height="140" viewBox="0 0 197 197" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M87.7072 131.509L39.6992 83.497L50.2319 72.9643L87.2417 109.97L168.95 20.832L179.933 30.8992L87.7072 131.509ZM176.395 65.6468L94.6865 154.785L57.6768 117.779L47.1441 128.312L95.1521 176.323L187.378 75.7139L176.395 65.6468Z" fill="#00A7E5" fillOpacity="0.5"/>
  </svg>
);

const BoxesIcon = () => (
  <svg width="110" height="145" viewBox="0 0 138 180" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M68.8878 0L137.776 38.3044L68.8878 76.6088L0 38.3044L68.8878 0Z" fill="#00A7E5" fillOpacity="0.5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M68.8878 51.6641L137.776 89.9685L68.8878 128.273L0 89.9685L68.8878 51.6641Z" fill="#00A7E5" fillOpacity="0.5"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M68.8878 103.328L137.776 141.632L68.8878 179.936L0 141.632L68.8878 103.328Z" fill="#00A7E5" fillOpacity="0.5"/>
  </svg>
);

const FEATURES = [
  { icon: <StarIcon />, title: 'Smart Matching', desc: 'AI-powered algorithms connect buyers with the most relevant vendors based on requirements, location, and past performance.' },
  { icon: <ArrowsIcon />, title: 'Reviews & Ratings', desc: 'Transparent feedback system from verified transactions helps you make informed decisions and build trust.' },
  { icon: <CheckIcon />, title: 'Verified Users', desc: 'All vendors undergo business verification, background checks, and quality assessments before platform approval.' },
  { icon: <BoxesIcon />, title: 'Analytic Dashboard', desc: 'All vendors undergo business verification, background checks, and quality assessments before platform approval.' },
];

export default function Features() {
  return (
    <section className="features">
      <div className="features__label-wrap">
        <SectionLabel title="Features" number="004" />
      </div>

      <h2 className="features__title">
        EVERYTHING YOU NEED<br />IN ONE PLATFORM
      </h2>

      <ScrollStack
        itemDistance={100}
        itemScale={0.04}
        itemStackDistance={30}
        stackPosition="20%"
        scaleEndPosition="10%"
        baseScale={0.88}
      >
        {FEATURES.map((f, i) => (
          <ScrollStackItem key={i}>
            <div className="features__card">
              <div className="features__card-left">{f.icon}</div>
              <div className="features__card-right">
                <h3 className="features__card-title">{f.title}</h3>
                <p className="features__card-desc">{f.desc}</p>
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}