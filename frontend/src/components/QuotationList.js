import React, { useState, useEffect } from 'react';

function QuotationList() {
  const [quotations, setQuotations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch quotations from backend
    fetch('http://localhost:5000/api/quotations')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setQuotations(data.data || []);
        } else {
          setError(data.error || 'Failed to fetch quotations');
        }
      })
      .catch(error => {
        console.error('Error fetching quotations:', error);
        setError('Failed to fetch quotations');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="quotation-list">
      <h2>Quotations</h2>
      {quotations.length === 0 ? (
        <p>No quotations found</p>
      ) : (
        quotations.map(quotation => (
          <div key={quotation.id} className="quotation-item">
            <h3>Quote #{quotation.ref_number}</h3>
            <p>Date: {new Date(quotation.date).toLocaleDateString()}</p>
            <p>Total Items: {quotation.items?.length || 0}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default QuotationList;
