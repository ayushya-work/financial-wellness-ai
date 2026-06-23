import React, { useState } from 'react';

export default function TaxSimulation() {
  const [investment, setInvestment] = useState(0);
  const [result, setResult] = useState(null);

  const simulate = () => {
    const taxSaved = Math.min(investment, 150000) * 0.2; // simple Section 80C assumption
    setResult(`You could save approx ₹${taxSaved} in tax.`);
  };

  return (
    <div>
      <input type="number" value={investment} onChange={e => setInvestment(e.target.value)} />
      <button onClick={simulate}>Simulate Tax Saving</button>
      {result && <p>{result}</p>}
    </div>
  );
}
