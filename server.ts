import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { getDb, saveDb } from './server/db.js';
import type { Product, Category, Reservation, RestaurantSettings, GalleryItem } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Helper to authenticate manager requests
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const db = getDb();
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Authentication required' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!token || !db.tokens.includes(token)) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
    return;
  }
  next();
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// Check if Manager account already exists on the server
app.get('/api/auth/status', (req: Request, res: Response) => {
  const db = getDb();
  const hasAccount = Boolean(db.manager && db.manager.username && db.manager.password);
  res.json({
    hasAccount,
    username: hasAccount && db.manager ? db.manager.username : null
  });
});

// Setup Manager Account for the very first time
app.post('/api/auth/setup', (req: Request, res: Response) => {
  const db = getDb();
  if (db.manager && db.manager.username && db.manager.password) {
    res.status(400).json({ error: 'Manager account has already been created. Please log in directly.' });
    return;
  }

  const { username, password, confirmPassword } = req.body;
  if (!username || typeof username !== 'string' || !username.trim()) {
    res.status(400).json({ error: 'Username is required.' });
    return;
  }
  if (!password || typeof password !== 'string' || password.length < 3) {
    res.status(400).json({ error: 'Password must be at least 3 characters long.' });
    return;
  }
  if (password !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.manager = {
    username: username.trim(),
    password: password,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  };
  db.tokens.push(token);
  saveDb();

  res.json({
    success: true,
    token,
    username: db.manager.username
  });
});

// Login for existing Manager
app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = getDb();
  if (!db.manager || !db.manager.username || !db.manager.password) {
    res.status(400).json({ error: 'No manager account found. Please initialize setup first.' });
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ error: 'Username and password are required.' });
    return;
  }

  if (db.manager.username !== username.trim() || db.manager.password !== password) {
    res.status(401).json({ error: 'Invalid username or password.' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.manager.lastLogin = new Date().toISOString();
  db.tokens.push(token);
  saveDb();

  res.json({
    success: true,
    token,
    username: db.manager.username
  });
});

// Change Manager Password
app.post('/api/auth/change-password', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  if (!db.manager) {
    res.status(400).json({ error: 'Manager account not found.' });
    return;
  }

  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmPassword) {
    res.status(400).json({ error: 'Current password, new password, and confirmation are all required.' });
    return;
  }

  if (db.manager.password !== currentPassword) {
    res.status(400).json({ error: 'Current password does not match.' });
    return;
  }

  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: 'New password and confirmation do not match.' });
    return;
  }

  if (newPassword.length < 3) {
    res.status(400).json({ error: 'New password must be at least 3 characters.' });
    return;
  }

  db.manager.password = newPassword;
  saveDb();

  res.json({
    success: true,
    message: 'Manager password has been successfully updated.'
  });
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const db = getDb();
    db.tokens = db.tokens.filter(t => t !== token);
    saveDb();
  }
  res.json({ success: true });
});

// Verify Current Session
app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  res.json({
    username: db.manager?.username,
    createdAt: db.manager?.createdAt
  });
});

// ==========================================
// SETTINGS & CURRENCY ROUTES
// ==========================================

app.get('/api/settings', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.settings);
});

app.put('/api/settings', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json(db.settings);
});

// ==========================================
// CATEGORIES ROUTES
// ==========================================

app.get('/api/categories', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.categories);
});

app.post('/api/categories', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const { name, nameFr, nameAr, slug } = req.body;
  if (!name || !slug) {
    res.status(400).json({ error: 'Category name and slug are required.' });
    return;
  }
  const newCat: Category = {
    id: `cat-${Date.now()}`,
    slug: slug.toLowerCase().replace(/\s+/g, '-'),
    name,
    nameFr: nameFr || name,
    nameAr: nameAr || name,
    order: db.categories.length + 1,
    enabled: true
  };
  db.categories.push(newCat);
  saveDb();
  res.status(201).json(newCat);
});

app.put('/api/categories/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.categories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Category not found.' });
    return;
  }
  db.categories[index] = { ...db.categories[index], ...req.body };
  saveDb();
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// ==========================================
// PRODUCTS ROUTES
// ==========================================

app.get('/api/products', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.products);
});

app.post('/api/products', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const { name, price, category } = req.body;
  if (!name || price === undefined || !category) {
    res.status(400).json({ error: 'Product name, price, and category are required.' });
    return;
  }
  const newProd: Product = {
    id: `prod-${Date.now()}`,
    name,
    nameFr: req.body.nameFr || name,
    nameAr: req.body.nameAr || name,
    description: req.body.description || '',
    descFr: req.body.descFr || '',
    descAr: req.body.descAr || '',
    price: Number(price),
    category,
    image: req.body.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    available: req.body.available !== false,
    featured: Boolean(req.body.featured),
    ingredients: req.body.ingredients || [],
    allergens: req.body.allergens || [],
    calories: req.body.calories ? Number(req.body.calories) : undefined,
    winePairing: req.body.winePairing || undefined
  };
  db.products.unshift(newProd);
  saveDb();
  res.status(201).json(newProd);
});

app.put('/api/products/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Product not found.' });
    return;
  }
  db.products[index] = {
    ...db.products[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.products[index].price
  };
  saveDb();
  res.json(db.products[index]);
});

app.delete('/api/products/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// ==========================================
// RESERVATIONS ROUTES
// ==========================================

app.get('/api/reservations', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.reservations);
});

app.post('/api/reservations', (req: Request, res: Response) => {
  const db = getDb();
  const { fullName, phone, email, guests, date, time, specialRequest } = req.body;
  if (!fullName || !phone || !email || !guests || !date || !time) {
    res.status(400).json({ error: 'All reservation fields are required.' });
    return;
  }

  const refCode = `SF-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReservation: Reservation = {
    id: `res-${Date.now()}`,
    refCode,
    fullName,
    phone,
    email,
    guests: Number(guests),
    date,
    time,
    specialRequest: specialRequest || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.reservations.unshift(newReservation);
  saveDb();
  res.status(201).json(newReservation);
});

app.put('/api/reservations/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const index = db.reservations.findIndex(r => r.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Reservation not found.' });
    return;
  }
  db.reservations[index] = { ...db.reservations[index], ...req.body };
  saveDb();
  res.json(db.reservations[index]);
});

app.delete('/api/reservations/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.reservations = db.reservations.filter(r => r.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// ==========================================
// GALLERY ROUTES
// ==========================================

app.get('/api/gallery', (req: Request, res: Response) => {
  const db = getDb();
  res.json(db.gallery);
});

app.post('/api/gallery', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  const { url, title, titleFr, titleAr, category } = req.body;
  if (!url || !title) {
    res.status(400).json({ error: 'Image URL and title are required.' });
    return;
  }
  const item: GalleryItem = {
    id: `gal-${Date.now()}`,
    url,
    title,
    titleFr: titleFr || title,
    titleAr: titleAr || title,
    category: category || 'Cuisine'
  };
  db.gallery.unshift(item);
  saveDb();
  res.status(201).json(item);
});

app.delete('/api/gallery/:id', requireAuth, (req: Request, res: Response) => {
  const db = getDb();
  db.gallery = db.gallery.filter(g => g.id !== req.params.id);
  saveDb();
  res.json({ success: true });
});

// ==========================================
// VITE DEV SERVER OR STATIC PRODUCTION
// ==========================================

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Star Fish Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
