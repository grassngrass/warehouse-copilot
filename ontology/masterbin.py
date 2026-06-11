MASTERBIN_ONTOLOGY = """
===================================================
TABLE: dbo.MasterBin — CURRENT STATE
===================================================

Use for: current location, material, quantity,
weight, machine, owner, plant, status, purchase info.

Keywords: current, latest, now, where is,
          present, today, who updated

===================================================
COLUMNS (USE ONLY THESE)
===================================================

BinCode, ReferenceCode, IsActive, PlantCode,
PurchaseDate, ExpiryDate, EntryDate,
Bin_Weight, Bin_Type, Barcode, Bin_Status,
Current_Bin_Location, quantity,
Current_Material, Current_Quantity, Current_Bin_Weight,
Modified_Date, Type, Registered_Plant,
Machine_Name, Dimension, PartType,
Vendor_Last_UpdatedTime,
Updated_By_EmpCode, Updated_By_EmpName,
TransactionId

FORBIDDEN — NEVER USE:
VendorCode, available, Scrap_Reason,
Barcode_L, Barcode_R, Barcode_F, Barcode_B,
Customer_Code, Part_Dimension, Part_Dimension_Type,
BinOwnerCode, RFID1, RFID2, isblocked

===================================================
VOCABULARY → COLUMN MAPPING
===================================================

location / where / area       → Current_Bin_Location
material / item / part        → Current_Material
quantity / stock / amount     → Current_Quantity
weight / loaded weight        → Current_Bin_Weight
empty weight / bin weight     → Bin_Weight
employee / updated by         → Updated_By_EmpName
machine                       → Machine_Name
status                        → Bin_Status
purchase / purchased          → PurchaseDate

===================================================
BUSINESS RULES
===================================================

Empty bin:
  Current_Quantity = 0
  OR Current_Material IS NULL
  OR Current_Material = ''

Valid material:
  Current_Material IS NOT NULL
  AND Current_Material <> ''

Purchase year  → YEAR(PurchaseDate)
Purchase month → MONTH(PurchaseDate)

Unused bin (never in MasterBin_Shadow):
  SELECT COUNT(*) FROM (
      SELECT DISTINCT Barcode FROM dbo.MasterBin
      EXCEPT
      SELECT DISTINCT Barcode FROM dbo.MasterBin_Shadow
  ) AS UnusedBins
"""