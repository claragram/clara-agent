"""Resolve CLARA_HOME for standalone skill scripts.

Skill scripts may run outside the Clara process (system Python, nix env,
CI) where ``clara_constants`` is not importable.  This module provides the
same ``get_clara_home()`` contract without requiring it on ``sys.path``.

When ``clara_constants`` IS available it is used directly so profile
resolution and any future enhancements are picked up automatically.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from clara_constants import get_clara_home as get_clara_home
except (ModuleNotFoundError, ImportError):

    def get_clara_home() -> Path:
        """Return the Clara home directory (default: ``~/.clara``)."""
        val = os.environ.get("CLARA_HOME", "").strip()
        return Path(val) if val else Path.home() / ".clara"
