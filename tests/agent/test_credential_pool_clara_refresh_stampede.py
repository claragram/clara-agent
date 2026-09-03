"""Concurrent Clara 401 recovery must not stampede the shared OAuth grant.

Sep 2 2026 incident: ~120 subagent processes shared one Clara OAuth pool entry
whose access token hit its hourly expiry. Every process got a 401, every
process force-refreshed, and each rotation invalidated the token a sibling had
just adopted — 81 refreshes and ~540 401s in eight minutes. Processes that
lost the auth-store flock race had their only entry benched ("matched no clara
entry ... pool size 0") and surfaced the 401 to the user as "out of funds".

Two invariants pinned here:

1. ``resolve_clara_runtime_credentials(force_refresh=True, stale_access_token=X)``
   does NOT POST a refresh when the store already holds a usable token that
   is not X — a peer already rotated; adopt it.
2. A lock-timeout during a pool-level Clara refresh leaves the entry
   untouched instead of marking it exhausted.
"""

import json
import logging

import clara_cli.auth as auth_mod
from agent.credential_pool import CredentialPool, PooledCredential

from tests.clara_cli.test_auth_clara_provider import _invoke_jwt, _setup_clara_auth


def test_forced_refresh_adopts_peer_rotation_instead_of_reposting(tmp_path, monkeypatch):
    clara_home = tmp_path / "clara"
    peer_token = _invoke_jwt(seconds=3600)
    failed_token = _invoke_jwt(seconds=3000)  # what THIS process still holds
    _setup_clara_auth(
        clara_home,
        access_token=peer_token,
        refresh_token="rt-after-peer-rotation",
        scope=auth_mod.DEFAULT_CLARA_SCOPE,
        expires_at=auth_mod.datetime.fromtimestamp(
            auth_mod.time.time() + 3600, tz=auth_mod.timezone.utc
        ).isoformat(),
        expires_in=3600,
    )
    monkeypatch.setenv("CLARA_HOME", str(clara_home))

    posts = []

    def _fake_refresh_access_token(*, client, portal_base_url, client_id, refresh_token):
        posts.append(refresh_token)
        return {
            "access_token": _invoke_jwt(seconds=7200),
            "refresh_token": "rt-should-not-happen",
            "expires_in": 7200,
            "token_type": "Bearer",
            "scope": auth_mod.DEFAULT_CLARA_SCOPE,
        }

    monkeypatch.setattr(auth_mod, "_refresh_access_token", _fake_refresh_access_token)

    creds = auth_mod.resolve_clara_runtime_credentials(
        force_refresh=True, stale_access_token=failed_token
    )

    assert posts == [], "peer already rotated — must not consume the refresh token again"
    assert creds["api_key"] == peer_token

    # Same call WITHOUT the hint keeps the pre-existing force semantics.
    auth_mod.resolve_clara_runtime_credentials(force_refresh=True)
    assert posts == ["rt-after-peer-rotation"]


def test_lock_timeout_during_clara_refresh_does_not_bench_entry(monkeypatch, caplog):
    entry = PooledCredential(
        id="267aed",
        provider="clara",
        auth_type="oauth",
        access_token=_invoke_jwt(seconds=3600),
        refresh_token="rt",
        label="test@clara",
        source="device_code",
        priority=0,
    )
    pool = CredentialPool.__new__(CredentialPool)
    pool._lock = __import__("threading").RLock()
    pool._entries = [entry]
    pool._active_leases = {}
    pool._current_id = None
    pool._max_concurrent = 2
    pool._unmatched_rotation_streak = 0
    pool.provider = "clara"

    monkeypatch.setattr(pool, "_sync_clara_entry_from_auth_store", lambda e: e)
    monkeypatch.setattr(pool, "_persist", lambda *a, **k: None)

    def _busy(*a, **k):
        raise TimeoutError("Timed out waiting for auth store lock")

    monkeypatch.setattr(auth_mod, "resolve_clara_runtime_credentials", _busy)

    result = pool._refresh_entry_impl(entry, force=True)

    assert result is entry
    assert pool._entries[0].last_status is None, "lock contention is not a credential failure"
