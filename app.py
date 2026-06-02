import requests

from prompt_builder import build_prompt
from sql_executor import execute_sql


OLLAMA_URL = "http://localhost:11434/api/generate"


def ask_qwen(prompt):

    response = requests.post(
        OLLAMA_URL,
        json={
            "model": "qwen3:8b",
            "prompt": prompt,
            "stream": False,
            "think": False
        }
    )

    text = response.json()["response"]

    text = text.replace("```sql", "")
    text = text.replace("```", "")

    return text.strip()


while True:

    question = input("\nAsk Warehouse AI: ")

    if question.lower() == "exit":
        break

    try:

        prompt = build_prompt(question)

        sql = ask_qwen(prompt)

        print("\nGenerated SQL:")
        print(sql)

        if not sql.upper().startswith("SELECT"):
            print("\nOnly SELECT queries allowed.")
            continue

        result = execute_sql(sql)

        print("\nResult:\n")
        print(result)

    except Exception as e:

        print("\nError:")
        print(e)