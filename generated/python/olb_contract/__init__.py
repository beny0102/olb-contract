# GENERATED FILE - do not edit.
# Source: schema/*.schema.json. Rebuild with `npm run build`.
# 
"""Typed models and runtime validation for the Open League Baseball contract."""

from __future__ import annotations

import json
from pathlib import Path

from jsonschema import Draft202012Validator, FormatChecker

from .event import Event
from .realtime import RealtimeMessage
from .track import Track

__all__ = [
    "Event",
    "Track",
    "RealtimeMessage",
    "SCHEMA_VERSION",
    "load_schema",
    "validate",
    "parse_event",
]

SCHEMA_VERSION = "1"

_SCHEMA_DIR = Path(__file__).parent / "schemas"
_VALIDATORS: dict[str, Draft202012Validator] = {}


def load_schema(name: str = "event") -> dict:
    """Load one of the bundled, self-contained schemas: event, track, realtime, common."""
    path = _SCHEMA_DIR / f"{name}.schema.json"
    if not path.is_file():
        raise FileNotFoundError(f"unknown schema: {name}")
    return json.loads(path.read_text(encoding="utf-8"))


def validate(document: dict, schema: str = "event") -> None:
    """Raise jsonschema.ValidationError if the document does not match the wire contract."""
    validator = _VALIDATORS.get(schema)
    if validator is None:
        validator = Draft202012Validator(load_schema(schema), format_checker=FormatChecker())
        _VALIDATORS[schema] = validator
    validator.validate(document)


def parse_event(document: dict):
    """Validate and return the typed event union member."""
    validate(document, "event")
    return Event.model_validate(document).root
