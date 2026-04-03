import { useState } from 'react';
import Preloader from './components/Preloader';
import Routing from './Routing';

export default function App() {
  const [loading, setLoading] = useState(true);
  return loading ? <Preloader onFinish={() => setLoading(false)} /> : <Routing />;
}
