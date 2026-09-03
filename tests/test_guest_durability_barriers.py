"""Guest ledger connections must inherit the configured database.__PROT_0_synchroclara__.

apply_durability_barriers() is the guest-connection entry point (secondary
state.db users that must NOT touch journal mode). The configured
``database.__PROT_1_synchroclara__`` level normally rides on apply_database_pragmas()
during the owner's journal-mode setup — a path guests deliberately skip — so
the guest entry point applies it directly.
"""

import sqlite3

import pytest

import clara_state
from clara_state import apply_durability_barriers


def _config(monkeypatch, database_section):
    import clara_cli.config as config_mod

    cfg = {"database": database_section}
    monkeypatch.setattr(config_mod, "load_config_readonly", lambda *a, **k: cfg)
    return cfg


def test_guest_barriers_apply_configured_synchroclara(monkeypatch, tmp_path):
    _config(monkeypatch, {"__PROT_2_synchroclara__": "FULL"})
    conn = sqlite3.connect(tmp_path / "state.db")
    try:
        conn.execute("PRAGMA journal_mode=DELETE")
        conn.execute("PRAGMA __PROT_3_synchroclara__=1")
        apply_durability_barriers(conn)
        assert conn.execute("PRAGMA __PROT_4_synchroclara__").fetchone()[0] == 2
        # And the journal mode was NOT touched — that is the whole contract.
        assert (
            str(conn.execute("PRAGMA journal_mode").fetchone()[0]).lower()
            == "delete"
        )
    finally:
        conn.close()


def test_guest_barriers_leave_synchroclara_alone_when_unset(monkeypatch, tmp_path):
    _config(monkeypatch, {})
    conn = sqlite3.connect(tmp_path / "state.db")
    try:
        conn.execute("PRAGMA journal_mode=DELETE")
        conn.execute("PRAGMA __PROT_5_synchroclara__=1")
        apply_durability_barriers(conn)
        assert conn.execute("PRAGMA __PROT_6_synchroclara__").fetchone()[0] == 1
    finally:
        conn.close()


def test_guest_barriers_survive_config_failure(monkeypatch, tmp_path):
    import clara_cli.config as config_mod

    def _boom(*a, **k):
        raise RuntimeError("config unavailable")

    monkeypatch.setattr(config_mod, "load_config_readonly", _boom)
    conn = sqlite3.connect(tmp_path / "state.db")
    try:
        conn.execute("PRAGMA journal_mode=DELETE")
        # Must not raise; best-effort like every other pragma path.
        apply_durability_barriers(conn)
    finally:
        conn.close()
