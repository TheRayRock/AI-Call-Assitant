from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_ai_response(user_message):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": """
                    You are Priya,
                    a smart Hindi AI
                    voice assistant.

                    Speak naturally.
                    Keep responses short.
                    """,
            },
            {"role": "user", "content": user_message},
        ],
    )

    return response.choices[0].message.content
