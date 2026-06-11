import requests
from prompt_builder import build_prompt
from sql_executor import execute_sql
from db_router import detect_database


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
    text = text.replace("```sql", "").replace("```", "")
    return text.strip()


while True:

    question = input("\nAsk Warehouse AI: ")

    if question.lower() == "exit":
        break

    try:

        db = detect_database(question)
        print(f"Database → {db}")

        if db == "northwind":
            print("Northwind queries not supported yet.")
            continue

        prompt = build_prompt(question)

        sql = ask_qwen(prompt)

        print("\nGenerated SQL:")
        print(sql)

        if not sql.upper().startswith("SELECT"):
            print("\nOnly SELECT queries allowed.")
            continue

        try:
            result = execute_sql(sql)

        except Exception as e:
            print("\nSQL Error Detected:")
            print(str(e))

            fix_prompt = f"""
Fix this SQL Server query.

SQL:
{sql}

Error:
{str(e)}

Return ONLY corrected SQL.
No explanation.
SQL Server syntax only.
"""
            fixed_sql = ask_qwen(fix_prompt)

            print("\nCorrected SQL:")
            print(fixed_sql)

            result = execute_sql(fixed_sql)

        print("\nResult:\n")
        print(result)

    except Exception as e:
        print("\nError:")
        print(e)