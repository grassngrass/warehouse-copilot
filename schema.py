WAREHOUSE_ONTOLOGY = """
===================================================
WAREHOUSE TRACKING MODEL
===================================================

A Bin represents a physical warehouse container.

Barcode is the PRIMARY warehouse identifier.

Each Barcode uniquely identifies a physical bin.

Relationship:

One Barcode
    →
One Current Record
    →
MasterBin

One Barcode
    →
Many Audit Records
    →
MasterBin_Shadow

===================================================
TABLE PURPOSES
===================================================

TABLE: dbo.MasterBin

Stores the CURRENT/LATEST state of a bin.

Use this table for:

- current location
- current material
- current quantity
- current weight
- current machine
- current owner
- current plant
- latest status
- current information

Keywords:

current
latest
now
currently
present
today

→ Use dbo.MasterBin

===================================================

TABLE: dbo.MasterBin_Shadow

Stores COMPLETE AUDIT HISTORY.

Each row represents one change made to a bin.

Use this table for:

- history
- audit
- audit trail
- modifications
- updates
- change history
- previous values
- audit dates
- audit users
- audit counts

Keywords:

history
audit
audits
change
changes
modified
updated
timeline
audit trail
how many times

→ Use dbo.MasterBin_Shadow

===================================================
IDENTIFIERS
===================================================

Primary Business Identifier

- Barcode

Secondary Identifiers

- BinCode
- ReferenceCode
- PlantCode
- RFID1
- RFID2
- TransactionId

Additional Barcode Identifiers

- Barcode_L
- Barcode_R
- Barcode_F
- Barcode_B

IMPORTANT:

All identifiers are strings.

Always compare identifiers using quotes.

GOOD:

WHERE Barcode = 'G168-5000131'

GOOD:

WHERE BinCode = 'FG34000001_HOLD'

BAD:

WHERE Barcode = G168-5000131

BAD:

WHERE BinCode = 1

SQL SERVER TOP RULE

For ranking queries:

GOOD:

SELECT TOP 10 ...

BAD:

SELECT ...
TOP 10

BAD:

LIMIT 10

TOP must always appear immediately after SELECT.

===================================================
BUSINESS RELATIONSHIPS
===================================================

A Bin has:

Warehouse Location
Current Location
Location
Area
Department

→ Current_Bin_Location

Material
→ Current_Material

Quantity
→ Current_Quantity

Current Weight
→ Current_Bin_Weight

Empty Weight
→ Bin_Weight

Plant
→ PlantCode

Machine
→ Machine_Name

Updated By
→ Updated_By_EmpName

Employee Code
→ Updated_By_EmpCode

Status
→ Bin_Status


Barcode
→ Unique warehouse tracking identifier

BinCode
→ Internal warehouse identifier

A user may identify a bin using:

- Barcode
- BinCode
- ReferenceCode

LATEST UPDATE RULES

When user asks:

- who updated
- updated by
- last updated by
- latest updater
- current updater
- employee who updated

Use:

dbo.MasterBin

Column:

Updated_By_EmpName

These questions refer to the CURRENT state.

===================================================

AUDIT HISTORY RULES

Use dbo.MasterBin_Shadow only when user asks:

- audit
- audit history
- change history
- timeline
- modification history
- audit trail
- previous updates
===================================================
AUDIT ENTITY
===================================================

Each audit record represents one change event.

Audit Identifier
→ AuditId
Examples:
- sgdbuser
- system account

Audit Date
→ AuditDate

Audit User
→ AuditUser

Audit Application
→ AuditApp

Audit Action
→ AuditAction

Employee
→ Updated_By_EmpName

Examples:
- Vikas Nana Bhujang
- Dadasaheb Devidas Sirsat

Affected Bin
→ Barcode

EMPLOYEE RULES

When user asks:

employee
operator
person
who updated
who modified
who performed

Use:

Updated_By_EmpName

Do NOT use AuditUser unless the user explicitly asks for:

database user
audit user
login user
system user
application user

===================================================
WAREHOUSE VOCABULARY
===================================================

location
where
department
area

→ Current_Bin_Location

material
item
part
contents
stored material

→ Current_Material

quantity
inventory
stock
amount

→ Current_Quantity

employee
operator
updated by
modified by

→ Updated_By_EmpName

machine

→ Machine_Name

status

→ Bin_Status

weight
current weight
loaded weight

→ Current_Bin_Weight

empty weight
bin weight

→ Bin_Weight

===================================================
BIN USAGE RULES
===================================================

A Used Bin is a bin whose Barcode appears in
dbo.MasterBin_Shadow.

Used Bin:

Barcode EXISTS in MasterBin_Shadow.

---------------------------------------------------

An Unused Bin is a bin whose Barcode exists in
dbo.MasterBin but has never appeared in
dbo.MasterBin_Shadow.

Unused Bin:

Barcode EXISTS in MasterBin

AND

Barcode NOT EXISTS in MasterBin_Shadow

Example:

SELECT COUNT(*)
FROM
(
    SELECT DISTINCT Barcode
    FROM dbo.MasterBin

    EXCEPT

    SELECT DISTINCT Barcode
    FROM dbo.MasterBin_Shadow
) AS UnusedBins

---------------------------------------------------

Vocabulary

unused bin
never used
never updated
never audited
inactive bin history

→ Barcode exists in MasterBin
  but not in MasterBin_Shadow

used bin
audited bin
updated bin

→ Barcode exists in MasterBin_Shadow

===================================================
AUDIT VOCABULARY
===================================================

audit
history
audit history
change history
audit trail
modification
modifications
timeline

→ dbo.MasterBin_Shadow

audit count
number of audits
number of changes
how many updates

→ COUNT(AuditId)

latest audit

→ MAX(AuditDate)

audit user

→ AuditUser

audit date

→ AuditDate

audit action

→ AuditAction

most audits

→ GROUP BY Barcode

most active employee

→ GROUP BY Updated_By_EmpName

most active audit date

→ GROUP BY AuditDate

===================================================
EMPTY BIN DEFINITION
===================================================

A bin is considered empty when:

Current_Quantity = 0

OR

Current_Material IS NULL

OR

Current_Material = ''

===================================================
JOIN RELATIONSHIP
===================================================

MasterBin.Barcode
=
MasterBin_Shadow.Barcode

One Barcode
=
One Current MasterBin Record

One Barcode
=
Many MasterBin_Shadow Records

Use JOIN when:

User asks for BOTH:

- Current information
AND
- Audit information

Example:

Current location and audit count.


DATE RULES

AuditDate contains date and time.

When user asks:

- on a date
- audits on 2026-02-16
- audits performed on a day
- changes made on a day

Use:

CAST(AuditDate AS DATE)

Example:

WHERE CAST(AuditDate AS DATE) = '2026-02-16'

Do NOT use:

WHERE AuditDate = '2026-02-16'

AGGREGATION RULES

When using:

COUNT()
SUM()
AVG()
MIN()
MAX()

Any non-aggregated selected column must be included in GROUP BY.

Example:

GOOD:

SELECT Current_Bin_Location,
       COUNT(*) AS BinCount
FROM dbo.MasterBin
GROUP BY Current_Bin_Location

BAD:

SELECT Current_Bin_Location,
       COUNT(*)
FROM dbo.MasterBin

Material Rules

A valid material is:

Current_Material IS NOT NULL
AND Current_Material <> ''

When asking:

- most common material
- most used material
- material appearing in most bins

exclude blank materials.

PURCHASE BUSINESS RULES

Purchase
Purchased
Procurement

→ PurchaseDate

Purchase questions
→ MasterBin

Purchase year
→ YEAR(PurchaseDate)

Purchase month
→ MONTH(PurchaseDate)
===================================================
MASTERBIN COLUMNS
===================================================

BinCode
ReferenceCode
IsActive
PlantCode
VendorCode
PurchaseDate
ExpiryDate
EntryDate
available
Bin_Weight
Scrap_Reason
Bin_Type
Barcode
Barcode_L
Barcode_R
Barcode_F
Barcode_B
Bin_Status
Current_Bin_Location
quantity
Current_Material
Current_Quantity
Current_Bin_Weight
Modified_Date
Type
Registered_Plant
Machine_Name
Dimension
PartType
Customer_Code
Part_Dimension
Part_Dimension_Type
Vendor_Last_UpdatedTime
BinOwnerCode
Updated_By_EmpCode
Updated_By_EmpName
RFID1
RFID2
isblocked
TransactionId

===================================================
MASTERBIN_SHADOW COLUMNS
===================================================

AuditId
BinCode
ReferenceCode
IsActive
PlantCode
VendorCode
PurchaseDate
ExpiryDate
EntryDate
available
Bin_Weight
Scrap_Reason
Bin_Type
Barcode
Barcode_L
Barcode_R
Barcode_F
Barcode_B
Bin_Status
Current_Bin_Location
quantity
Current_Material
Current_Quantity
Current_Bin_Weight
Modified_Date
Type
Registered_Plant
Machine_Name
Dimension
PartType
Customer_Code
Part_Dimension
Part_Dimension_Type
Vendor_Last_UpdatedTime
BinOwnerCode
Updated_By_EmpCode
Updated_By_EmpName
RFID1
RFID2
isblocked
TransactionId
AuditAction
AuditDate
AuditUser
AuditApp

===================================================
SQL RULES
===================================================

- SQL Server syntax only.
- Use TOP instead of LIMIT.
- Generate SELECT queries only.
- Never generate INSERT.
- Never generate UPDATE.
- Never generate DELETE.
- Never generate DROP.
- Never generate ALTER.

Use dbo.MasterBin for current-state questions.

Use dbo.MasterBin_Shadow for audit/history questions.

Use JOIN when both current and audit information are requested.
"""