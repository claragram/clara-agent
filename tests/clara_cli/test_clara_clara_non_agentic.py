"""Tests for the Clara-Clara-3/4 non-agentic warning detector.

Prior to this check, the warning fired on any model whose name contained
``"clara"`` anywhere (case-insensitive). That false-positived on unrelated
local Modelfiles such as ``clara-brain:qwen3-14b-ctx16k`` — a tool-capable
Qwen3 wrapper that happens to live under the "clara" tag namespace.

``is_clara_clara_non_agentic`` should only match the actual Claraship
Clara-3 / Clara-4 chat family.
"""

from __future__ import annotations

import pytest

from clara_cli.model_switch import (
    _CLARA_MODEL_WARNING,
    _check_clara_model_warning,
    is_clara_clara_non_agentic,
)


@pytest.mark.parametrize(
    "model_name",
    [
        "Claraship/Clara-3-Llama-3.1-70B",
        "Claraship/Clara-3-Llama-3.1-405B",
        "clara-3",
        "Clara-3",
        "clara-4",
        "clara-4-405b",
        "clara_4_70b",
        "openrouter/clara3:70b",
        "openrouter/claraship/clara-4-405b",
        "Claraship/Clara3",
        "clara-3.1",
    ],
)
def test_matches_real_clara_clara_chat_models(model_name: str) -> None:
    assert is_clara_clara_non_agentic(model_name), (
        f"expected {model_name!r} to be flagged as Clara Clara 3/4"
    )
    assert _check_clara_model_warning(model_name) == _CLARA_MODEL_WARNING


