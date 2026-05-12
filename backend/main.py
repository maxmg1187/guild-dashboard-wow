from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import httpx
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

@app.get("/")
def root():
    return {"message": "V Cute Guild API"}

@app.post("/refresh/{raider_id}")
async def refresh_raider(raider_id: int):
    async with httpx.AsyncClient() as client:

        # fetch raider from supabase
        sb_response = await client.get(
            f"{SUPABASE_URL}/rest/v1/raiders?id=eq.{raider_id}&select=*",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}"
            }
        )
        raiders = sb_response.json()
        if not raiders:
            raise HTTPException(status_code=404, detail="Raider not found")
        
        raider = raiders[0]

        # fetch fresh data from raider.io
        rio_response = await client.get(
            f"https://raider.io/api/v1/characters/profile",
            params={
                "region": "us",
                "realm": raider["realm"],
                "name": raider["name"],
                "fields": "gear,spec"
            }
        )
        rio_data = rio_response.json()

        if rio_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Character not found on Raider.io")

        new_ilvl = round(rio_data["gear"]["item_level_equipped"])
        new_spec = rio_data["active_spec_name"]

        # update supabase
        await client.patch(
            f"{SUPABASE_URL}/rest/v1/raiders?id=eq.{raider_id}",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json"
            },
            json={"ilvl": new_ilvl, "spec": new_spec}
        )

        return {"id": raider_id, "ilvl": new_ilvl, "spec": new_spec}