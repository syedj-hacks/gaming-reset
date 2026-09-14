// lib/supabase.js — UI-only mock.
//
// The production app talks to Supabase for auth and data. This UI-only copy has
// no backend and no keys, so createClient() returns an in-memory stand-in with
// the same method shapes the pages call. Every query resolves to empty data.

const DEMO_USER = { id: 'demo-user', email: 'demo@example.com' }

function queryBuilder() {
  const result = Promise.resolve({ data: null, error: null, count: 0 })
  const builder = new Proxy(
    {},
    {
      get(_, prop) {
        if (prop === 'then') return result.then.bind(result)
        if (prop === 'catch') return result.catch.bind(result)
        if (prop === 'finally') return result.finally.bind(result)
        return () => builder
      },
    }
  )
  return builder
}

export function createClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: DEMO_USER }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithIdToken: async () => ({ data: null, error: null }),
      updateUser: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: () => queryBuilder(),
  }
}
