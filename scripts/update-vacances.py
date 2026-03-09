#!/usr/bin/env python3
"""Fetch French school vacation data from data.education.gouv.fr and update data/vacances.json."""

import json
import os
import sys
from datetime import datetime
from urllib.request import Request, urlopen
from urllib.parse import urlencode

API_URL = "https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/fr-en-calendrier-scolaire/records"
FIELDS = "description,start_date,end_date,zones,annee_scolaire"
LIMIT = 100
OUTPUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "vacances.json")


def get_school_years():
    """Return 3 school years around today: previous, current, next."""
    now = datetime.now()
    start_year = now.year if now.month >= 8 else now.year - 1
    return [f"{y}-{y + 1}" for y in range(start_year - 1, start_year + 2)]


def fetch_all_records(api_key):
    """Fetch all Zone A/B/C vacation records for relevant school years, with pagination."""
    school_years = get_school_years()
    years_clause = " or ".join(f"annee_scolaire='{sy}'" for sy in school_years)
    where = f"zones in ('Zone A','Zone B','Zone C') and ({years_clause})"

    all_records = []
    offset = 0

    while True:
        params = urlencode({
            "select": FIELDS,
            "where": where,
            "limit": LIMIT,
            "offset": offset,
            "order_by": "annee_scolaire, start_date, zones",
        })
        url = f"{API_URL}?{params}"
        req = Request(url, headers={"Authorization": f"Apikey {api_key}"})

        with urlopen(req) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        records = data.get("results", [])
        if not records:
            break

        all_records.extend(records)
        offset += LIMIT

        if offset >= data.get("total_count", 0):
            break

    return all_records


def deduplicate(records):
    """Remove duplicates and merge date ranges per (description, zones, annee_scolaire).

    Multiple académies within the same zone may have slightly different end dates.
    We keep the widest range (earliest start, latest end) for each group.
    """
    groups = {}
    for r in records:
        if r["description"].startswith("Début"):
            continue
        key = (r["description"], r["zones"], r["annee_scolaire"])
        if key not in groups:
            groups[key] = dict(r)
        else:
            existing = groups[key]
            if r["start_date"] < existing["start_date"]:
                existing["start_date"] = r["start_date"]
            if r["end_date"] > existing["end_date"]:
                existing["end_date"] = r["end_date"]
    return list(groups.values())


def main():
    api_key = os.environ.get("DATAGOUV_API_KEY")
    if not api_key:
        print("Error: DATAGOUV_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    school_years = get_school_years()
    print(f"School years: {', '.join(school_years)}")

    print("Fetching vacation data from data.education.gouv.fr ...")
    records = fetch_all_records(api_key)
    print(f"  Fetched {len(records)} raw records")

    unique = deduplicate(records)
    unique.sort(key=lambda r: (r["annee_scolaire"], r["start_date"], r["zones"]))
    print(f"  Deduplicated to {len(unique)} records")

    output = {"total_count": len(unique), "results": unique}

    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"  Written to {OUTPUT}")


if __name__ == "__main__":
    main()
