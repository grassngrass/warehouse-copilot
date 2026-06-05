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

One Barcode
→ One Current Location

One Barcode
→ Many Historical Locations

One Barcode
→ Many Movements

Movement
→ Location Change between audits

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
BIN MOVEMENT ANALYTICS
===================================================

Idle Bin

A bin is considered idle when it has had
NO audit activity after a given date.

Use:

MAX(AuditDate)

---------------------------------------------------

Stagnant Bin

A bin whose latest audit activity is very old.

Example:

No audit activity for 90 days.

Use:

MAX(AuditDate)

---------------------------------------------------

Non-Moving Bin

A bin whose location has not changed for a long period.

Use:

Current_Bin_Location history from MasterBin_Shadow.

---------------------------------------------------

IMPORTANT DATE INTERPRETATION

When user asks:

- idle since April
- not moved since April
- stagnant since April
- inactive since April

DO NOT search for audits during April.

Instead:

Find bins whose latest audit date is
before or equal to the specified date.

Example:

idle since April 2026

→

MAX(AuditDate) <= '2026-04-30'

Idle Since Date

A barcode whose latest audit activity
occurred before the specified date.

Implementation:

GROUP BY Barcode

HAVING MAX(AuditDate) <= specified_date

Examples:

Idle since April 2026
Idle since January 2025
Not moved since March
No activity after June

---------------------------------------------------

Vocabulary

idle
stagnant
inactive
not moved
non moving
lying idle
aging inventory
old inventory

→ MasterBin_Shadow
→ MAX(AuditDate)

Idle Inventory

Inventory with no audit activity after a date.

Example:

Show bins lying idle since April

Meaning:

Latest audit occurred before May 1st
and no further audits exist.

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

===================================================
JOIN RELATIONSHIPS
===================================================

Primary Join

MasterBin.Barcode
=
MasterBin_Shadow.Barcode

---------------------------------------------------

Current State

MasterBin stores:

- Current Location
- Current Material
- Current Quantity
- Current Weight
- Current Employee

---------------------------------------------------

Historical State

MasterBin_Shadow stores:

- Audit History
- Previous Locations
- Previous Materials
- Audit Dates
- Audit Actions

---------------------------------------------------

Common Join Analytics

Current Location + Audit Count

Current Material + Change Count

Current Employee + Audit Activity

Current State + Latest Audit Date

Current State + First Audit Date

Current State + Historical Changes

Never Audited Bins

Idle Bins

Inventory Aging


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

===================================================
LOCATION MOVEMENT ANALYTICS
===================================================

A Barcode can move between warehouse locations.

Location history is stored in:

dbo.MasterBin_Shadow

Current location:

MasterBin.Current_Bin_Location

Historical locations:

MasterBin_Shadow.Current_Bin_Location

Movement History Query

When user asks:

- Show movement history
- Show location history
- Show movement timeline
- Show location changes

Use:

LAG(Current_Bin_Location)
OVER (
    PARTITION BY Barcode
    ORDER BY AuditDate
)

Return:

AuditDate
PreviousLocation
Current_Bin_Location

Movement history should show:

From Location
→
To Location

---------------------------------------------------

Previous Location

Use:

LAG(Current_Bin_Location)

over

PARTITION BY Barcode
ORDER BY AuditDate

---------------------------------------------------

Location Change

A location change occurs when:

Current_Bin_Location
<>
PreviousLocation

---------------------------------------------------

Movement History

Movement history is the sequence of location changes
for a barcode ordered by AuditDate.

---------------------------------------------------

Vocabulary

moved
movement
movement history
location history
location changes
bin movement
transfer
relocated
previous location

→ MasterBin_Shadow
→ AuditDate
→ Current_Bin_Location

---------------------------------------------------

Movement History Ordering

Movement history must always be displayed
chronologically.

Use:

ORDER BY AuditDate ASC

Oldest audit first.

Newest audit last.

Do NOT use:

ORDER BY AuditDate DESC

for movement history.

---------------------------------------------------

Movement Timeline

Movement timeline shows how a barcode moved
from one location to another over time.

Display order:

Oldest
→
Newest

===================================================

===================================================
SQL AGGREGATION RULES
===================================================

When using:

COUNT()
SUM()
AVG()
MIN()
MAX()

All non-aggregated selected columns must be included in GROUP BY.

GOOD:

SELECT Current_Bin_Location,
       COUNT(*) AS BinCount
FROM dbo.MasterBin
GROUP BY Current_Bin_Location

GOOD:

SELECT Barcode,
       MAX(AuditDate)
FROM dbo.MasterBin_Shadow
GROUP BY Barcode

BAD:

SELECT Current_Bin_Location,
       COUNT(*)
FROM dbo.MasterBin


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