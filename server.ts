import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Blog from './src/models/Blog.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Connect to MongoDB if MONGO_URI is provided and not a local address
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'undefined') {
  const isLocalhost = process.env.MONGO_URI.includes('localhost') || process.env.MONGO_URI.includes('127.0.0.1');
  
  // In this cloud environment, localhost MongoDB will always fail.
  // We only attempt connection if it looks like a remote URI (e.g. Atlas).
  if (isLocalhost) {
    console.log('💡 MongoDB Notice: A local MONGO_URI was detected. To use a database, please provide a remote MongoDB Atlas URI in the setttings.');
  } else {
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('✅ Connected to MongoDB'))
      .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
      });
  }
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'zfour-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,      // Required for SameSite=None
    sameSite: 'none',  // Required for cross-origin iframe
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  }, (req, accessToken, refreshToken, profile, done) => {
    const user = {
      uid: profile.id,
      email: profile.emails?.[0].value,
      displayName: profile.displayName,
      photoURL: profile.photos?.[0].value,
      provider: 'google'
    };
    return done(null, user);
  }));
}

// Auth API Routes
app.get('/api/auth/user', (req, res) => {
  res.json(req.user || null);
});

// Returns the Google Auth URL for the client to open in a popup
app.get('/api/auth/google/url', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    return res.status(500).json({ error: 'Google Client ID not configured' });
  }

  const redirectUri = `${req.protocol}://${req.get('host')}/auth/google/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'profile email',
    prompt: 'select_account'
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  res.json({ url: authUrl });
});

// Google Callback handler (returns postMessage script for iframe popup)
app.get(['/auth/google/callback', '/auth/google/callback/'], 
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: ${JSON.stringify(req.user)} }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  }
);

// Super Access Bypass Route
app.post('/api/auth/super-access', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@test.com' && password === 'admin123') {
    const adminUser = {
      uid: 'super-admin-root',
      email: 'umairmayo607@gmail.com', // Using your primary admin email for role matching
      displayName: 'Super Admin',
      photoURL: 'https://ui-avatars.com/api/?name=Super+Admin&background=c5a059&color=fff',
      role: 'admin'
    };
    
    req.login(adminUser, (err) => {
      if (err) return res.status(500).json({ error: 'Login failed' });
      return res.json(adminUser);
    });
  } else {
    res.status(401).json({ error: 'Invalid super access credentials' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

// Blog API Routes
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const { title, imageURL, description, category } = req.body;
    const newBlog = new Blog({
      title,
      imageURL,
      description,
      category
    });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  console.log('Initializing server...');
  
  // Force development mode in the preview environment
  const isDev = process.env.NODE_ENV !== "production" || process.env.VITE_DEV === 'true';

  if (isDev) {
    console.log('Starting in DEVELOPMENT mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    // Explicitly handle index.html transformation in dev
    app.get('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/auth')) return next();
      
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log('Starting in PRODUCTION mode...');
    const distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      console.warn('WARNING: dist folder not found. Falling back to development mode.');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
