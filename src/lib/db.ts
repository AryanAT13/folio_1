type Args = (string | number | null)[];

type QueryResult = {
  rows: { [key: string]: string | number | null }[];
};

const QUERY_TIMEOUT_MS = 8000;

function getConfig() {
  // Trim: a trailing newline/space pasted into a hosting dashboard breaks the URL or token.
  const url = process.env.TURSO_DATABASE_URL?.trim().replace(/^libsql:\/\//, "https://");
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url || !authToken) {
    throw new Error("TURSO_DATABASE_URL or TURSO_AUTH_TOKEN is not set.");
  }
  return { url, authToken };
}

// Errors are thrown, never swallowed: returning empty rows on failure made a broken database
// look like "no posts yet" and made failed INSERTs look successful.
async function queryTurso(sql: string, args: Args): Promise<QueryResult> {
  const { url, authToken } = getConfig();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      statements: [{ q: sql, params: args }],
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(QUERY_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Turso request failed. Status: ${response.status}, Body: ${errorBody}`);
  }

  const data = await response.json();
  // SQL errors come back as HTTP 200 with `[{ "error": "..." }]`.
  if (data?.[0]?.error) {
    throw new Error(`Turso query failed: ${data[0].error}`);
  }

  const resultData = data?.[0]?.results;
  if (!resultData || !resultData.rows || !resultData.columns) {
    return { rows: [] };
  }

  const columns: string[] = resultData.columns;
  const rows = resultData.rows.map((row: QueryResult["rows"][number][string][]) => {
    const obj: QueryResult["rows"][number] = {};
    columns.forEach((col, index) => {
      obj[col] = row[index];
    });
    return obj;
  });

  return { rows };
}

export const db = {
  execute: async ({ sql, args }: { sql: string; args: Args }): Promise<QueryResult> => {
    return queryTurso(sql, args);
  },
};
