"""Optional acquisition step, separate from the offline build; never submits forms."""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
URLS = {
    "owid-lpi-2024.csv": "https://ourworldindata.org/grapher/global-living-planet-index.csv?csvType=full&useColumnShortNames=true",
    "owid-lpi-2024.metadata.json": "https://ourworldindata.org/grapher/global-living-planet-index.metadata.json?csvType=full&useColumnShortNames=true",
    "LPI_Data_Use_Policy_2026.pdf": "https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf",
}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--retrieved-on", required=True, help="Explicit YYYY-MM-DD research date")
    args = parser.parse_args()
    from datetime import date
    date.fromisoformat(args.retrieved_on)
    target = ROOT / "data/raw/public"
    target.mkdir(parents=True, exist_ok=True)
    receipts = []
    for name, url in URLS.items():
        path = target / name
        if path.exists():
            raise SystemExit(f"Refusing to overwrite a source snapshot: {path}")
        try:
            with urlopen(Request(url, headers={"User-Agent": "VANISHING FREQUENCIES research/1.0"}), timeout=30) as response:
                payload = response.read()
            path.write_bytes(payload)
            receipts.append({"path": str(path.relative_to(ROOT)), "url": url,
                             "retrievedOn": args.retrieved_on,
                             "sha256": hashlib.sha256(payload).hexdigest(), "bytes": len(payload), "status": "acquired"})
            print(f"Acquired {name}: {len(payload)} bytes")
        except Exception as exc:
            receipts.append({"url": url, "retrievedOn": args.retrieved_on, "status": "inaccessible", "reason": str(exc)})
            print(f"Unavailable {name}: {exc}")
    (target / "acquisition-receipts.json").write_text(json.dumps(receipts, indent=2) + "\n")

if __name__ == "__main__":
    main()
