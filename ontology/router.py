from ontology.masterbin import MASTERBIN_ONTOLOGY
from ontology.masterbin_shadow import MASTERBIN_SHADOW_ONTOLOGY

_SHADOW_KEYWORDS = {
    "history", "audit", "audits", "change", "changes",
    "modified", "timeline", "audit trail", "how many times",
    "moved", "movement", "transfer", "relocated",
    "previous location", "location history",
    "idle", "stagnant", "inactive", "not moved",
    "non moving", "lying idle", "aging", "old inventory",
    "most active", "most audited",
}

_MASTERBIN_KEYWORDS = {
    "current", "latest", "now", "currently", "present",
    "today", "where is", "location", "material", "quantity",
    "weight", "status", "machine", "updated by",
    "who updated", "purchase", "purchased", "unused", "never used",
}


def get_ontology(question: str) -> str:
    q = question.lower()

    needs_masterbin = any(kw in q for kw in _MASTERBIN_KEYWORDS)
    needs_shadow    = any(kw in q for kw in _SHADOW_KEYWORDS)

    # Fallback: if nothing matched, load both
    if not needs_masterbin and not needs_shadow:
        needs_masterbin = True
        needs_shadow    = True

    parts = []
    if needs_masterbin:
        parts.append(MASTERBIN_ONTOLOGY)
    if needs_shadow:
        parts.append(MASTERBIN_SHADOW_ONTOLOGY)

    return "\n\n".join(parts)