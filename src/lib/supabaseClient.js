import { createClient } from "@supabase/supabase-js";

const env =
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
const supabaseUrl = env.VITE_SUPABASE_URL?.trim() || "";
const supabaseKey = env.VITE_SUPABASE_ANON_KEY?.trim() || "";

const isValidSupabaseConfig = (url, key) => {
  if (!url || !key) return false;

  const placeholderValues = [
    "your-project.supabase.co",
    "your-anon-key",
    "placeholder",
  ];
  if (
    placeholderValues.some(
      (value) => url.includes(value) || key.includes(value),
    )
  ) {
    return false;
  }

  try {
    const parsedUrl = new URL(url);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

const createFallbackClient = () => {
  const buildError = () => ({
    data: null,
    error: new Error("Supabase is not configured."),
  });

  const createQueryBuilder = () => {
    let isMutation = false;
    const readResult = { data: [], error: null, count: 0 };
    const result = () => (isMutation ? buildError() : readResult);
    const queryBuilder = {
      select: () => queryBuilder,
      insert: () => { isMutation = true; return queryBuilder; },
      upsert: () => { isMutation = true; return queryBuilder; },
      update: () => { isMutation = true; return queryBuilder; },
      delete: () => { isMutation = true; return queryBuilder; },
      eq: () => queryBuilder,
      neq: () => queryBuilder,
      not: () => queryBuilder,
      is: () => queryBuilder,
      in: () => queryBuilder,
      contains: () => queryBuilder,
      overlaps: () => queryBuilder,
      ilike: () => queryBuilder,
      like: () => queryBuilder,
      gte: () => queryBuilder,
      lte: () => queryBuilder,
      gt: () => queryBuilder,
      lt: () => queryBuilder,
      or: () => queryBuilder,
      order: () => queryBuilder,
      limit: () => queryBuilder,
      range: () => queryBuilder,
      single: async () => (isMutation ? buildError() : { data: null, error: null }),
      maybeSingle: async () => (isMutation ? buildError() : { data: null, error: null }),
      then: (resolve, reject) => Promise.resolve(result()).then(resolve, reject),
      catch: (onRejected) => Promise.resolve(result()).catch(onRejected),
      finally: (onFinally) => Promise.resolve(result()).finally(onFinally),
    };
    return queryBuilder;
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe() {} } },
      }),
      signInWithPassword: async () => ({
        data: { session: null },
        error: new Error("Supabase is not configured."),
      }),
      signUp: async () => ({ data: { session: null }, error: new Error("Supabase is not configured.") }),
      signInWithOAuth: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
      signInWithOtp: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
      resetPasswordForEmail: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
      updateUser: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
      signOut: async () => ({
        error: new Error("Supabase is not configured."),
      }),
    },
    from: () => createQueryBuilder(),
    storage: {
      from: () => ({
        upload: async () => buildError(),
        getPublicUrl: () => ({ data: { publicUrl: "" }, error: null }),
      }),
    },
  };
};

const createSupabaseClient = () => {
  if (!isValidSupabaseConfig(supabaseUrl, supabaseKey)) {
    if (env.DEV) {
      console.info(
        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable live data.",
      );
    }
    return createFallbackClient();
  }

  return createClient(supabaseUrl, supabaseKey);
};

export const supabase = createSupabaseClient();
