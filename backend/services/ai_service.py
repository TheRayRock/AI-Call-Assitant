import requests
from services.memory_service import get_last_messages


def generate_ai_response(user_message):

    history = get_last_messages(10)

    messages = [
        {
            "role": "system",
            "content": """
            You are Priya, a smart Hindi AI voice assistant.

            Remember previous conversation.
            Speak naturally.
            Keep responses short.
            """,
        }
    ]

    for chat in history:

        messages.append({"role": "user", "content": chat["user"]})

        messages.append({"role": "assistant", "content": chat["assistant"]})

    messages.append({"role": "user", "content": user_message})

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={"model": "llama3", "messages": messages, "stream": False},
    )

    data = response.json()
    print(messages)

    return data["message"]["content"]
