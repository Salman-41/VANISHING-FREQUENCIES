"""Write deterministic JSON Schema documentation from the Python contracts."""
import json
from pathlib import Path
from .models import Manifest, IndexObservation

def main():
    root=Path(__file__).resolve().parents[2]
    for name,model in [("import-manifest.schema.json",Manifest),("index-observation.schema.json",IndexObservation)]:
        (root/"data/schemas"/name).write_text(json.dumps(model.model_json_schema(),indent=2,sort_keys=True)+'\n')
        print(name)

if __name__=="__main__": main()
