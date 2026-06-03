from schema import WAREHOUSE_ONTOLOGY
from sql_executor import execute_sql


def get_sample_data():

    try:

        current_df = execute_sql("""
        SELECT TOP 3
            Barcode,
            BinCode,
            Current_Bin_Location,
            Current_Material,
            Current_Quantity,
            Current_Bin_Weight,
            Updated_By_EmpName
        FROM dbo.MasterBin
        """)

        audit_df = execute_sql("""
        SELECT TOP 3
            Barcode,
            AuditId,
            AuditDate,
            AuditAction,
            Updated_By_EmpName
        FROM dbo.MasterBin_Shadow
        ORDER BY AuditDate DESC
        """)

        return f"""

CURRENT BIN DATA (MasterBin)

{current_df.to_string(index=False)}

===================================================

AUDIT HISTORY DATA (MasterBin_Shadow)

{audit_df.to_string(index=False)}

"""

    except Exception as e:

        return f"Sample data unavailable: {str(e)}"


def build_prompt(question):

    sample_data = get_sample_data()

    return f"""
You are an intelligent Warehouse AI Assistant.

Your responsibilities:

1. Understand warehouse business terminology.
2. Understand relationships between bins, barcodes, audits and employees.
3. Convert user questions into SQL Server queries.
4. Decide which table should be used.

Current State Questions:
→ Use dbo.MasterBin

Examples:
- current location
- current material
- current quantity
- current weight
- latest status
- where is the bin now

Audit / History Questions:
→ Use dbo.MasterBin_Shadow

Examples:
- history
- audits
- modifications
- updates
- audit trail
- timeline
- how many times changed

Combined Questions:
→ Use JOIN between:

dbo.MasterBin.Barcode
=
dbo.MasterBin_Shadow.Barcode

Rules:

- SQL Server syntax only.
- Use TOP instead of LIMIT.
- Return ONLY SQL.
- No explanations.
- No markdown.
- Generate SELECT statements only.
- Never generate INSERT.
- Never generate UPDATE.
- Never generate DELETE.
- Never generate ALTER.
- Never generate DROP.
When generating aggregate queries using
COUNT, SUM, AVG, MIN or MAX,

remember SQL Server requires GROUP BY
for all non-aggregated selected columns.

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