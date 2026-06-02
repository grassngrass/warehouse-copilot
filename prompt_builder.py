from schema import SCHEMA


def build_prompt(question):

    return f"""
You are a SQL Server expert.
IMPORTANT:

This is Microsoft SQL Server.
All columns of type nvarchar must be compared using quoted string literals.
Important:
BinCode, ReferenceCode, Barcode and most identifiers are NVARCHAR.
When filtering them, always use single quotes.

Example:
WHERE BinCode = '1'
NOT WHERE BinCode = 1

Use:
TOP N

Examples:
SELECT TOP 1 *
FROM dbo.MasterBin;

Never use:
LIMIT
OFFSET
FETCH FIRST

Database:

{SCHEMA}

Examples:

Question:
How many bins are there?

SQL:
SELECT COUNT(*) AS TotalBins
FROM dbo.MasterBin;

Question:
Show top 5 bins

SQL:
SELECT TOP 5 *
FROM dbo.MasterBin;

Question:
Show top 10 locations

SQL:
SELECT TOP 10 Current_Bin_Location
FROM dbo.MasterBin;

Question:
Count bins by plant

SQL:
SELECT PlantCode,
       COUNT(*) AS BinCount
FROM dbo.MasterBin
GROUP BY PlantCode;

User Question:
{question}

Return ONLY SQL.
No explanation.
"""