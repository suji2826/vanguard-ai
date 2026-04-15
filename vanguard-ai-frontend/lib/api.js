const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function healthCheck() {
  const response = await fetch(${API_URL}/health);
  return response.json();
}

export async function detectCrisis(supplierId, riskScore, reliabilityScore, leadTimeDays) {
  const response = await fetch(${API_URL}/api/detect-crisis, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      supplier_id: supplierId,
      risk_score: riskScore,
      reliability_score: reliabilityScore,
      lead_time_days: leadTimeDays
    })
  });
  return response.json();
}

export async function optimizeAllocation(demand) {
  const response = await fetch(${API_URL}/api/optimize-allocation, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ demand })
  });
  return response.json();
}

export async function encryptAsset(assetName, ownerId, payload) {
  const response = await fetch(${API_URL}/api/encrypt, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      asset_name: assetName,
      owner_id: ownerId,
      payload: payload
    })
  });
  return response.json();
}

export async function decryptAsset(assetId) {
  const response = await fetch(${API_URL}/api/decrypt, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset_id: assetId })
  });
  return response.json();
}

export async function aiChat(message, sessionId = null) {
  const response = await fetch(${API_URL}/api/ai/chat, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId })
  });
  return response.json();
}
