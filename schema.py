SCHEMA = """
Table: dbo.MasterBin

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