_NORTHWIND_KEYWORDS = {
    "customer", "customers", "order", "orders",
    "supplier", "suppliers", "category", "categories",
    "shipper", "shippers", "invoice", "freight", "region", "territory",
    "northwind"
}

_WAREHOUSE_KEYWORDS = {
    "bin", "bins", "barcode", "masterbin", "audit", "location",
    "material", "quantity", "weight", "warehouse", "shadow", "employee", "machine", "purchase", "purchased", "unused", "never used"
}


def detect_database(question: str) -> str:
    """
    Returns 'warehouse' or 'northwind'.
    Defaults to 'warehouse' if nothing matched.
    """
    q = question.lower()

    is_northwind = any(kw in q for kw in _NORTHWIND_KEYWORDS)
    is_warehouse = any(kw in q for kw in _WAREHOUSE_KEYWORDS)

    if is_northwind and not is_warehouse:
        return "northwind"

    return "warehouse"  # default always warehouse