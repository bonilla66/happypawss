import { useState } from 'react';

export default function useWizard(totalSteps) {
  const [step, setStep] = useState(1);
  const next = () => setStep(s => Math.min(s + 1, totalSteps));
  const prev = () => setStep(s => Math.max(s - 1, 1));
  return { step, next, prev };
  
}
