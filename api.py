from fastapi import FastAPI
from pydantic import BaseModel
import requests
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from prompt_builder import build_prompt
from sql_executor import execute_sql

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

OLLAMA_URL = "http://localhost:11434/api/generate"


class ChatRequest(BaseModel):
    question: str


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

    return response.json()["response"].strip()


@app.post("/chat")
def chat(data: ChatRequest):

    prompt = build_prompt(data.question)

    sql = ask_qwen(prompt)

    result = execute_sql(sql)
    result = result.replace({np.nan: None})

    return {
        "question": data.question,
        "sql": sql,
        "result": result.to_dict(orient="records")
    }