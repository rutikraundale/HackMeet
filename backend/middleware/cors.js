import cors from "cors";

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://hackmeetdotcom.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like curl or Postman)
        if (!origin) return callback(null, true);

        // In development, allow any localhost port so Vite port shifts don't break the app
        if (process.env.NODE_ENV !== "production") {
            if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }
        }

        // Allow any Netlify subdomain (previews, branch deploys, etc.)
        if (origin && origin.endsWith(".netlify.app")) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Access-Control-Allow-Credentials",
    ],
    credentials: true,
    maxAge: 86400,
    exposedHeaders: ["set-cookie"],
    optionsSuccessStatus: 200,
};

const corsMiddleware = cors(corsOptions);

export { corsOptions, corsMiddleware };
