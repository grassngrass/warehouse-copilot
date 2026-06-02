from schema import WAREHOUSE_ONTOLOGY
from sql_executor import execute_sql


def get_sample_data():

    try:

        df = execute_sql("""
        SELECT TOP 5
            BinCode,
            PlantCode,
            Current_Bin_Location,
            Current_Material,
            Current_Quantity,
            Current_Bin_Weight,
            Updated_By_EmpName
        FROM dbo.MasterBin
        """)

        return df.to_string(index=False)

    except Exception:

        return "No sample data available."


def build_prompt(question):

    sample_data = get_sample_data()

    return f"""
You are an intelligent Warehouse AI Assistant.

Your job is:

1. Understand warehouse business language.
2. Translate user questions into SQL Server queries.
3. Use warehouse relationships and business meaning.
4. Return ONLY SQL.
5. No explanations.
6. No markdown.
7. SQL Server syntax only.
8. Use TOP instead of LIMIT.
9. Use ONLY dbo.MasterBin.
10. Generate SELECT statements only.

{WAREHOUSE_ONTOLOGY}

===================================================
SAMPLE DATA
===================================================

{sample_data}

===================================================
USER QUESTION
===================================================

{question}

===================================================
OUTPUT
===================================================

Return ONLY SQL.
"""