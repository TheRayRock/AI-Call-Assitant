from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


@app.get("/")
def home():
    return {"message": "Backend running"}


@app.post("/chat")
async def chat(data: dict):
    user_message = data.get("message")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": user_message}],
    )

    return {"response": response.choices[0].message.content}
