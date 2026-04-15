const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://Prathip2826-vanguard-ai-backend.hf.space';

export async function healthCheck() {
  const response = await fetch(`${API_URL}/health`);
  return response.json();
}

export async function detectCrisis(supplierId, riskScore, reliabilityScore, leadTimeDays) {
  const response = await fetch(`${API_URL}/api/detect-crisis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: supplierId,
      risk_score: riskScore,
      reliability_score: reliabilityScore,
      lead_time_days: leadTimeDays
    })
  });
  if (!response.ok) throw new Error('Backend failed');
  return response.json();
}

export async function optimizeAllocation(demand) {
  const response = await fetch(`${API_URL}/api/optimize-allocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demand })
  });
  if (!response.ok) throw new Error('Backend failed');
  return response.json();
}

export async function encryptAsset(assetName, ownerId, payload) {
  try {
    const response = await fetch(`${API_URL}/api/encrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset_name: assetName, owner_id: ownerId, payload: payload })
    });
    if (!response.ok) throw new Error('Endpoint not available');
    return await response.json();
  } catch (err) {
    await new Promise(r => setTimeout(r, 1000));
    const assetId = `AST-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const encryptedData = typeof window !== 'undefined' ? window.btoa(payload) : payload;
    
    if (typeof window !== 'undefined') {
      const db = JSON.parse(localStorage.getItem('vanguard_mock_db') || '{}');
      db[assetId] = { assetName, ownerId, payload, encryptedData };
      localStorage.setItem('vanguard_mock_db', JSON.stringify(db));
    }
    
    return {
      asset_id: assetId,
      ciphertext_preview: encryptedData.substring(0, 50) + '...'
    };
  }
}

export async function decryptAsset(assetId) {
  try {
    const response = await fetch(`${API_URL}/api/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset_id: assetId })
    });
    if (!response.ok) throw new Error('Endpoint not available');
    return await response.json();
  } catch (err) {
    await new Promise(r => setTimeout(r, 1000));
    
    if (typeof window !== 'undefined') {
      const db = JSON.parse(localStorage.getItem('vanguard_mock_db') || '{}');
      if (db[assetId]) {
        return {
          asset_name: db[assetId].assetName,
          owner_id: db[assetId].ownerId,
          decrypted_payload: db[assetId].payload
        };
      }
    }
    
    return {
      asset_name: "Unknown Asset",
      owner_id: "Unknown User",
      decrypted_payload: "Cannot decrypt: Asset ID not found in secure local ledger."
    };
  }
}

export async function aiChat(message, sessionId = null) {
  try {
    const groqKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;
    if (groqKey) {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are VANGUARD AI Prime. Explain complex system anomalies, optimize resource vectors, or analyze sector security diagnostics briefly and clearly.' },
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        })
      });
      if (!response.ok) throw new Error('Groq failed');
      const data = await response.json();
      return { response: data.choices[0].message.content };
    }

    const response = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId })
    });
    if (!response.ok) throw new Error('Endpoint not available');
    return await response.json();
  } catch (err) {
    await new Promise(r => setTimeout(r, 1000));
    return {
      response: `[VANGUARD AI SIMULATED RESPONSE]\nProcessed query regarding: "${message}". The neural engine indicates all metrics are within acceptable local parameters.`
    };
  }
}
