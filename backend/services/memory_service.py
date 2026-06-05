import json
import os

FILE_PATH = "data/conversations.json"


def load_history():

    if not os.path.exists(FILE_PATH):
        return []

    try:
        with open(FILE_PATH, "r") as f:
            return json.load(f)

    except:
        return []


def save_chat(user_message, ai_response):

    history = load_history()

    history.append(
        {
            "user": user_message,
            "assistant": ai_response,
        }
    )

    with open(FILE_PATH, "w") as f:
        json.dump(history, f, indent=4)


def clear_history():

    with open(FILE_PATH, "w") as f:
        json.dump([], f)


def get_last_messages(limit=10):

    history = load_history()

    return history[-limit:]
