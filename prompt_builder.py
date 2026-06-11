from ontology.router import get_ontology


_SQL_RULES = """
T-SQL RULES
- SELECT only. No INSERT/UPDATE/DELETE/DROP/ALTER.
- Use TOP not LIMIT. TOP immediately after SELECT: SELECT TOP 10 ...
- Quote all string values: WHERE Barcode = 'G168-5000131'
- GROUP BY all non-aggregated columns with COUNT/SUM/AVG/MIN/MAX.
- Single-day filter: WHERE CAST(AuditDate AS DATE) = '2026-02-16'
"""


def build_prompt(question: str) -> str:
    return f"""You are a T-SQL expert assistant for Microsoft SQL Server.
CRITICAL RULES - NEVER VIOLATE:
- NEVER use LIMIT. ALWAYS use TOP after SELECT: SELECT TOP 10 ...
- NEVER add WHERE filters with placeholder values like '<value>'
- NEVER add explanation. Return ONLY the SQL query.

{_SQL_RULES}
{get_ontology(question)}
QUESTION: {question}

Return ONLY SQL. No explanation. No markdown.
"""