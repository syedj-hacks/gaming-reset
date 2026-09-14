/**
 * POST JSON to one of our own API routes.
 *
 * This exists because the same five lines were written 38 times across 16 files:
 *
 *     const res = await fetch('/api/thing', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ ... }),
 *     })
 *
 * IT RETURNS THE RAW RESPONSE, and that restraint is the whole design. The
 * obvious version of this helper also parses the body and normalises errors —
 * and it cannot be dropped in here, because the 38 call sites do not agree on
 * what happens next. Some read `data.ok`, some branch on `res.ok`, some only
 * parse the body when the request failed, and some tolerate a non-JSON body via
 * `.catch(() => ({}))`. Folding all of that into one helper would mean changing
 * behaviour at most of them to save a line at each.
 *
 * So this collapses only the half that is genuinely identical everywhere. Every
 * caller keeps its own response handling, unchanged and visible where it runs.
 *
 * Omitting `body` sends no Content-Type at all, matching the bare
 * `fetch(url, { method: 'POST' })` calls that several loaders already used.
 */
export function postJson(url, body) {
  return fetch(url, {
    method: 'POST',
    ...(body === undefined
      ? {}
      : {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }),
  })
}
