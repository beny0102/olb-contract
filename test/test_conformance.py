import json
import pathlib

import pytest
from jsonschema import Draft202012Validator, FormatChecker

from olb_contract import load_schema, parse_event, validate

ROOT = pathlib.Path(__file__).resolve().parents[1]
FIXTURES = ROOT / "fixtures"


def read(relative: str) -> dict:
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


MANIFEST = read("fixtures/manifest.json")
VALIDATORS = {
    name: Draft202012Validator(load_schema(name), format_checker=FormatChecker())
    for name in ("event", "track", "realtime")
}


@pytest.mark.parametrize("entry", MANIFEST["valid"], ids=lambda e: e["file"])
def test_accepts_valid_fixture(entry):
    document = read(f"fixtures/valid/{entry['file']}")
    assert not list(VALIDATORS[entry["schema"]].iter_errors(document))


@pytest.mark.parametrize("entry", MANIFEST["invalid"], ids=lambda e: e["file"])
def test_rejects_invalid_fixture(entry):
    document = read(f"fixtures/invalid/{entry['file']}")
    assert list(VALIDATORS[entry["schema"]].iter_errors(document))


@pytest.mark.parametrize("entry", MANIFEST["forward"], ids=lambda e: e["file"])
def test_accepts_forward_compatible_fixture(entry):
    document = read(f"fixtures/forward/{entry['file']}")
    assert not list(VALIDATORS[entry["schema"]].iter_errors(document))


def test_typed_models_match_the_bundled_schemas():
    document = read("fixtures/valid/event-pitch-human.json")
    event = parse_event(document)
    assert event.type == "pitch"
    assert event.payload.call.value == "S"
    assert event.seq == 148


def test_validate_raises_on_bad_document():
    document = read("fixtures/invalid/event-bad-pitch-call.json")
    with pytest.raises(Exception):
        validate(document, "event")
