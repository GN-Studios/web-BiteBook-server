export const env = {
  PORT: Number(process.env.PORT || 4000),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017",
  MONGO_DB: process.env.MONGO_DB || "auth_demo",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "amazing_secret",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
};

export function assertEnv() {
  const missing: string[] = [];
  ["JWT_ACCESS_SECRET", "GOOGLE_CLIENT_ID", "MONGO_URI", "MONGO_DB"].forEach((k) => {
    const val = (env as any)[k];
    if (!val) missing.push(k);
  });
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error("Missing env vars:", missing.join(", "));
    process.exit(1);
  }
}
