import pyodbc
import pandas as pd


def execute_sql(query):

    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=localhost;"
        "DATABASE=Warehouse;"
        "Trusted_Connection=yes;"
    )

    df = pd.read_sql(query, conn)

    conn.close()

    return df