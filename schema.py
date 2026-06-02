WAREHOUSE_ONTOLOGY = """
WAREHOUSE ENTITY

A Bin represents a physical warehouse container.

Primary Identifier:
- BinCode

Identifiers (always strings):

- BinCode
- ReferenceCode
- PlantCode
- Barcode
- Barcode_L
- Barcode_R
- Barcode_F
- Barcode_B
- RFID1
- RFID2
- TransactionId

IMPORTANT:

Always compare identifiers as strings.

GOOD:
WHERE BinCode = 'FG34000001_HOLD'

BAD:
WHERE BinCode = 1

===================================================

BUSINESS RELATIONSHIPS

Each Bin has:

Location
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

Updated By
→ Updated_By_EmpName

Employee Code
→ Updated_By_EmpCode

===================================================

WAREHOUSE VOCABULARY

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

weight
current weight
loaded weight

→ Current_Bin_Weight

empty weight
bin weight

→ Bin_Weight

===================================================

EMPTY BIN

A bin is considered empty when:

Current_Quantity = 0

OR

Current_Material IS NULL

OR

Current_Material = ''

===================================================

TABLE

dbo.MasterBin

Columns:

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
Location_Code
isblocked
TransactionId


Rules:

- Use only dbo.MasterBin.
- Never use any other table.
- SQL Server syntax only.
"""