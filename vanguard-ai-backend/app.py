from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="VANGUARD AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"name": "VANGUARD AI Backend", "status": "operational"}

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/detect-crisis")
async def detect_crisis(supplier_id: str, risk_score: float, reliability_score: float, lead_time_days: int):
    if risk_score > 0.7:
        return {
            "detected": True,
            "crisis_type": "supplier_failure",
            "severity": "high",
            "confidence": risk_score * 0.9,
            "explanation": f"Crisis detected for supplier {supplier_id}"
        }
    return {"detected": False, "explanation": "No crisis detected"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
