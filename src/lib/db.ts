type Args = (string | number | null)[];

type QueryResult = {
  rows: { [key: string]: string | number | null }[];
};

async function queryTurso(sql: string, args: Args): Promise<QueryResult> {
  const url = process.env.TURSO_DATABASE_URL?.replace("libsql://", "https://");
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    throw new Error("Turso URL or Auth Token is not configured.");
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        statements: [{ q: sql, params: args }],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to query database. Status: ${response.status}, Body: ${errorBody}`);
    }

    const data = await response.json();
    const resultData = data[0]?.results;

    if (!resultData || !resultData.rows || !resultData.columns) {
      return { rows: [] };
    }

    const columns = resultData.columns;
    const rawRows = resultData.rows;

    const rows = rawRows.map((row: any[]) => {
      const obj: { [key: string]: any } = {};
      columns.forEach((col: string, index: number) => {
        // This is the simplified, correct logic for your data format
        obj[col] = row[index];
      });
      return obj;
    });

    return { rows };
  } catch (error) {
    console.error("Failed to execute query:", error);
    return { rows: [] };
  }
}

export const db = {
  execute: async ({ sql, args }: { sql: string; args: Args }): Promise<QueryResult> => {
    return queryTurso(sql, args);
  },
};