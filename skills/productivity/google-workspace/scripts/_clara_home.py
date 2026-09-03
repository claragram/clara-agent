"""Resolve CLARA_HOME for standalone skill scripts.

Skill scripts may run outside the Clara process (e.g. system Python,
nix env, CI) where ``clara_constants`` is not importable.  This module
provides the same ``get_clara_home()`` and ``display_clara_home()``
contracts as ``clara_constants`` without requiring it on ``sys.path``.

When ``clara_constants`` IS available it is used directly so that any
future enhancements (profile resolution, Docker detection, etc.) are
picked up automatically.  The fallback path replicates the core logic
from ``clara_constants.py`` using only the stdlib.

All scripts under ``google-workspace/scripts/`` should import from here
instead of duplicating the ``CLARA_HOME = Path(os.getenv(...))`` pattern.
"""

from __future__ import annotations

import os
from pathlib import Path

try:
    from clara_constants import display_clara_home as display_clara_home
    from clara_constants import get_clara_home as get_clara_home
except (ModuleNotFoundError, ImportError):

    def get_clara_home() -> Path:
        """Return the Clara home directory (default: ~/.clara).

        Mirrors ``clara_constants.get_clara_home()``."""
        val = os.environ.get("CLARA_HOME", "").strip()
        return Path(val) if val else Path.home() / ".clara"

    def display_clara_home() -> str:
        """Return a user-friendly ``~/``-shortened display string.

        Mirrors ``clara_constants.display_clara_home()``."""
        home = get_clara_home()
        try:
            return "~/" + home.relative_to(Path.home()).as_posix()
        except ValueError:
            return str(home)
