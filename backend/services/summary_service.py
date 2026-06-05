import requests


def generate_summary(conversation):

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "llama3",
            "messages": [
                {
                    "role": "system",
                    "content": """
                    Summarize the conversation.
                    Keep it short.
                    Mention key points only.
                    """,
                },
                {"role": "user", "content": conversation},
            ],
            "stream": False,
        },
    )

    data = response.json()

    return data["message"]["content"]
