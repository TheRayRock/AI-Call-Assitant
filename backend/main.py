from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.ai_service import generate_ai_response

from services.summary_service import generate_summary

import json
import os

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# REQUEST MODEL
class ChatRequest(BaseModel):
    message: str


# HOME ROUTE
@app.get("/")
def home():
    return {"message": "Backend running"}


# CHAT ROUTE
@app.post("/chat")
async def chat(data: ChatRequest):

    try:

        user_message = data.message

        # AI RESPONSE
        ai_response = generate_ai_response(user_message)

        # SAVE CHAT
        conversation = {"user": user_message, "assistant": ai_response}

        file_path = "data/conversations.json"

        # CREATE FILE
        if not os.path.exists(file_path):
            with open(file_path, "w") as f:
                json.dump([], f)

        # READ OLD DATA
        with open(file_path, "r") as f:

            conversations = json.load(f)

        # ADD NEW CHAT
        conversations.append(conversation)

        # SAVE UPDATED DATA
        with open(file_path, "w") as f:

            json.dump(conversations, f, indent=4)

        return {"response": ai_response}

    except Exception as e:

        print("ERROR:", e)

        return {"response": "Backend Error"}


# SUMMARY ROUTE
@app.get("/summary")
async def summary():

    try:

        file_path = "data/conversations.json"

        with open(file_path, "r") as f:

            conversations = json.load(f)

        full_conversation = ""

        for chat in conversations:

            full_conversation += (
                f"User: " f"{chat['user']}\n" f"Assistant: " f"{chat['assistant']}\n\n"
            )

        summary_text = generate_summary(full_conversation)

        return {"summary": summary_text}

    except Exception as e:

        print("SUMMARY ERROR:", e)

        return {"summary": "Summary failed"}


@app.get("/history")
async def history():

    try:

        with open("data/conversations.json", "r") as f:

            conversations = json.load(f)

        return {"history": conversations}

    except Exception as e:

        print(e)

        return {"history": []}
