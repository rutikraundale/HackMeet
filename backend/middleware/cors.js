import cors from "cors";

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://hackmeetdotcom.netlify.app", // Removed trailing slash
    "https://hack-meet-ten.vercel.app",    // Removed trailing slash
    "https://hack-meet-rutikraundale5-2433s-projects.vercel.app", // Removed trailing slash
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // 1. Allow requests with no origin (like mobile apps or Postman)
        if (!origin) return callback(null, true);

        // 2. Localhost development (any port)
        if (process.env.NODE_ENV !== "production") {
            if (/^http:\/\/localhost(:\d+)?$/.test(origin)) {
                return callback(null, true);
            }
        }

        // 3. Allow Netlify subdomains (previews, branch deploys)
        if (origin.endsWith(".netlify.app")) {
            return callback(null, true);
        }

        // 4. Allow Vercel subdomains (previews, branch deploys)
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }

        // 5. Final check against exact allowed origins list
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log the blocked origin to your server console for easier debugging
            console.error(`CORS blocked for origin: ${origin}`);
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