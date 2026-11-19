export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return databaseUrl;
  }

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !port || !database || !user || password === undefined) {
    throw new Error(
      "Set DATABASE_URL or provide DB_HOST, DB_PORT, DB_NAME, DB_USER and DB_PASSWORD",
    );
  }

  const connectionUrl = new URL("postgresql://localhost");
  connectionUrl.hostname = host;
  connectionUrl.port = port;
  connectionUrl.username = user;
  connectionUrl.password = password;
  connectionUrl.pathname = `/${encodeURIComponent(database)}`;

  return connectionUrl.toString();
}
