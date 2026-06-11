MASTERBIN_SHADOW_ONTOLOGY = """
===================================================
TABLE: dbo.MasterBin_Shadow — AUDIT HISTORY
===================================================

Use for: history, audit trail, change history,
previous locations, idle/movement analysis.

Keywords: history, audit, change, modified,
          timeline, how many times, moved,
          idle, stagnant, inactive, not moved

===================================================
COLUMNS
===================================================

AuditId, BinCode, ReferenceCode, IsActive,
PlantCode, VendorCode, PurchaseDate, ExpiryDate,
EntryDate, available, Bin_Weight, Scrap_Reason,
Bin_Type, Barcode,
Barcode_L, Barcode_R, Barcode_F, Barcode_B,
Bin_Status, Current_Bin_Location, quantity,
Current_Material, Current_Quantity, Current_Bin_Weight,
Modified_Date, Type, Registered_Plant,
Machine_Name, Dimension, PartType,
Customer_Code, Part_Dimension, Part_Dimension_Type,
Vendor_Last_UpdatedTime, BinOwnerCode,
Updated_By_EmpCode, Updated_By_EmpName,
RFID1, RFID2, isblocked, TransactionId,
AuditAction, AuditDate, AuditUser, AuditApp

===================================================
FIELD RULES
===================================================

Who performed action → Updated_By_EmpName
Use AuditUser ONLY for: database/login/system user

audit count          → COUNT(AuditId)
latest audit         → MAX(AuditDate)
most active employee → GROUP BY Updated_By_EmpName
most audited bin     → GROUP BY Barcode

===================================================
DATE RULES
===================================================

Always cast for single-day filter:
  WHERE CAST(AuditDate AS DATE) = '2026-02-16'

Never:
  WHERE AuditDate = '2026-02-16'

===================================================
IDLE / STAGNANT BIN RULES
===================================================

"idle since April 2026" means latest audit is before that date:
  GROUP BY Barcode
  HAVING MAX(AuditDate) <= '2026-04-30'

Do NOT search for audits during April.

Vocabulary: idle, stagnant, inactive, not moved,
            lying idle, aging inventory, old inventory

===================================================
MOVEMENT / LOCATION HISTORY (LAG)
===================================================

  SELECT
      AuditDate,
      LAG(Current_Bin_Location)
          OVER (PARTITION BY Barcode ORDER BY AuditDate) AS PreviousLocation,
      Current_Bin_Location
  FROM dbo.MasterBin_Shadow
  WHERE Barcode = '<value>'
  ORDER BY AuditDate ASC

Movement history: always ORDER BY AuditDate ASC (oldest first).
Location change: when Current_Bin_Location <> PreviousLocation.

Vocabulary: moved, movement history, location history,
            transfer, relocated, previous location
"""