import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product, Category, Reservation, RestaurantSettings, GalleryItem, ManagerUser } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface DatabaseSchema {
  manager: ManagerUser | null;
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
  reservations: Reservation[];
  gallery: GalleryItem[];
  tokens: string[]; // Active valid session tokens
}

const defaultCategories: Category[] = [
  { id: 'cat-1', slug: 'starters', name: 'Starters', nameFr: 'Entrées', nameAr: 'المقبلات', order: 1, enabled: true },
  { id: 'cat-2', slug: 'seafood', name: 'Seafood Platters', nameFr: 'Fruits de Mer', nameAr: 'المأكولات البحرية', order: 2, enabled: true },
  { id: 'cat-3', slug: 'main-courses', name: 'Main Courses', nameFr: 'Plats Principaux', nameAr: 'الأطباق الرئيسية', order: 3, enabled: true },
  { id: 'cat-4', slug: 'grilled', name: 'Charcoal Grilled', nameFr: 'Grillades au Feu', nameAr: 'المشويات', order: 4, enabled: true },
  { id: 'cat-5', slug: 'pasta', name: 'Pasta & Risotto', nameFr: 'Pâtes & Risotto', nameAr: 'الباستا والريزوتو', order: 5, enabled: true },
  { id: 'cat-6', slug: 'salads', name: 'Salads & Greens', nameFr: 'Salades Fraîches', nameAr: 'السلطات', order: 6, enabled: true },
  { id: 'cat-7', slug: 'desserts', name: 'Desserts', nameFr: 'Douceurs & Desserts', nameAr: 'الحلويات', order: 7, enabled: true },
  { id: 'cat-8', slug: 'drinks', name: 'Cellar & Cocktails', nameFr: 'Cave & Cocktails', nameAr: 'المشروبات الفاخرة', order: 8, enabled: true },
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Grand Royal Seafood Plateau',
    nameFr: 'Grand Plateau Royal de la Mer',
    nameAr: 'طبق المأكولات البحرية الملكي الفاخر',
    description: 'An architectural tower of chilled Brittany oysters, whole Scottish lobster, wild king crab legs, poached langoustines, sea urchin, saffron aioli, and mignonette sauce.',
    descFr: 'Une tour magistrale d’huîtres de Bretagne, homard écossais entier, pattes de crabe royal sauvage, langoustines pochées, oursins, aïoli au safran et sauce mignonnette.',
    descAr: 'برج فاخر من محار بريتاني، كركند اسكتلندي كامل، أرجل سلطعون ملكي بري، روبيان لانغوستين مسلوق، قنافذ البحر، مع صلصة الأيولي بالزعفران وصلصة المينيونيت.',
    price: 135,
    category: 'seafood',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Brittany Oysters', 'Scottish Lobster', 'King Crab', 'Langoustines', 'Sea Urchin', 'Saffron Aioli'],
    allergens: ['Shellfish', 'Crustaceans', 'Eggs'],
    calories: 620,
    winePairing: 'Dom Pérignon Vintage 2013'
  },
  {
    id: 'prod-2',
    name: 'Wood-Fired Mediterranean Lobster',
    nameFr: 'Homard Bleu Rôti au Feu de Bois',
    nameAr: 'كركند البحر الأبيض المتوسط المشوي على الحطب',
    description: 'Whole Breton blue lobster roasted over olive wood embers, basted with coral herb butter, confit lemon, and sea asparagus.',
    descFr: 'Homard bleu breton rôti sur braises de bois d’olivier, arrosé d’un beurre de corail aux herbes, citron confit et salicornes.',
    descAr: 'كركند أزرق بريتوني كامل مشوي على جمر خشب الزيتون، مع زبدة المرجان والأعشاب، والليمون المخلل، ونبات الساليكورنيا.',
    price: 88,
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Whole Blue Lobster', 'Coral Butter', 'Rosemary', 'Garlic Confit', 'Fleur de Sel'],
    allergens: ['Crustaceans', 'Dairy'],
    calories: 540,
    winePairing: 'Meursault Premier Cru'
  },
  {
    id: 'prod-3',
    name: 'Charred Bluefin Tuna Tataki',
    nameFr: 'Tataki de Thon Rouge de Méditerranée',
    nameAr: 'تاتاكي تونة الزعانف الزرقاء المدخنة',
    description: 'Line-caught bluefin tuna with toasted sesame crust, oscietra caviar, white truffle ponzu, pickled ginger blossom, and creamy avocado silk.',
    descFr: 'Thon rouge de ligne en croûte de sésame torréfié, caviar osciètre, ponzu à la truffe blanche, fleurs de gingembre et soie d’avocat.',
    descAr: 'تونة زرقاء طازجة مع قشرة سمسم محمصة، كافيار أوسيترا، صلصة بونزو بالكمأة البيضاء، وزبدة الأفوكادو الناعمة.',
    price: 44,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Bluefin Tuna', 'White Sesame', 'Oscietra Caviar', 'Truffle Ponzu', 'Avocado'],
    allergens: ['Fish', 'Sesame', 'Soy'],
    calories: 380,
    winePairing: 'Sancerre Blanc Les Monts Damnés'
  },
  {
    id: 'prod-4',
    name: 'Wild Turbot Fillet in Champagne Velouté',
    nameFr: 'Pavé de Turbot Sauvage en Émulsion Champagne',
    nameAr: 'فيليه سمك التوربوت البري بصلصة الشمبانيا',
    description: 'Golden-seared Atlantic turbot fillet resting on braised baby leeks, chanterelle mushrooms, and an ethereal Laurent-Perrier Champagne emulsion.',
    descFr: 'Pavé de turbot doré sur blanc de poireau braisé, girolles de sous-bois et émulsion soyeuse au Champagne.',
    descAr: 'فيليه سمك التوربوت الأطلسي الذهبي يقدم مع الكراث المطهو، فطر الشانترال، ورغوة الشمبانيا الحريرية المخملية.',
    price: 66,
    category: 'main-courses',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Wild Turbot', 'Champagne Sauce', 'Chanterelle Mushrooms', 'Baby Leeks', 'Chervil'],
    allergens: ['Fish', 'Dairy', 'Sulphites'],
    calories: 490,
    winePairing: 'Puligny-Montrachet'
  },
  {
    id: 'prod-5',
    name: 'Handcrafted Squid Ink Tagliolini',
    nameFr: 'Tagliolini Noirs à l’Encre de Seiche & Oursins',
    nameAr: 'باستا التالياتيلي السوداء بحبر الحبار مع قنافذ البحر',
    description: 'Fresh squid ink pasta with tender baby calamari, sweet sea urchin emulsion, Sicilian bottarga shavings, and mild peperoncino.',
    descFr: 'Pâtes fraîches à l’encre de seiche, jeunes calamars fondants, corail d’oursin, copeaux de poutargue et peperoncino doux.',
    descAr: 'باستا طازجة محضرة بحبر الحبار مع قطع الكالاماري الطرية، صلصة قنافذ البحر، رقائق البطارخ الصقلية، وفلفل حار خفيف.',
    price: 48,
    category: 'pasta',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: ['House Pasta Dough', 'Squid Ink', 'Baby Calamari', 'Sea Urchin', 'Bottarga', 'Calabrian Chili'],
    allergens: ['Gluten', 'Eggs', 'Molluscs'],
    calories: 520,
    winePairing: 'Etna Bianco DOC'
  },
  {
    id: 'prod-6',
    name: 'Pan-Seared Hokkaido Scallops',
    nameFr: 'Noix de Saint-Jacques de Hokkaido & Risotto Safran',
    nameAr: 'سكالوب هوكايدو المشوي مع ريزوتو الزعفران',
    description: 'Caramelized jumbo scallops served with Carnaroli saffron risotto, crispy lardo di Colonnata, and ocean foam.',
    descFr: 'Saint-Jacques caramélisées sur risotto crémeux au safran d’Iran, lardo di Colonnata croustillant et écume marine.',
    descAr: 'محار سكالوب هوكايدو المحمر مع ريزوتو الأرز الإيطالي بالزعفران الإيراني الفاخر ورغوة البحر المنعشة.',
    price: 52,
    category: 'main-courses',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Hokkaido Scallops', 'Carnaroli Rice', 'Iranian Saffron', 'Aged Parmigiano', 'White Wine'],
    allergens: ['Molluscs', 'Dairy'],
    calories: 580,
    winePairing: 'Chablis Grand Cru Les Clos'
  },
  {
    id: 'prod-7',
    name: 'Charred Spanish Octopus Tentacle',
    nameFr: 'Poulpe de Galice Grillé à la Braise',
    nameAr: 'أخطبوط غاليسيا الإسباني المشوي',
    description: 'Tender slow-braised then flame-seared Galician octopus, smoked pimentón de la Vera oil, silky fava bean purée, and caperberries.',
    descFr: 'Tentacule de poulpe braisé puis grillé à la flamme, huile au pimentón fumé, purée soyeuse de fèves et câprons.',
    descAr: 'أخطبوط غاليسي طري مطهو على نار هادئة ثم مشوي على اللهب مع زيت البابريكا المدخنة وهريس الفول الأخضر الحريري.',
    price: 39,
    category: 'grilled',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: ['Galician Octopus', 'Smoked Paprika', 'Fava Beans', 'Caperberries', 'Extra Virgin Olive Oil'],
    allergens: ['Molluscs'],
    calories: 420,
    winePairing: 'Albariño Rías Baixas'
  },
  {
    id: 'prod-8',
    name: 'King Crab & Heirloom Citrus Salad',
    nameFr: 'Salade de Crabe Royal & Agrumes du Soleil',
    nameAr: 'سلطة السلطعون الملكي مع حمضيات البحر المتوسط',
    description: 'Sweet Alaskan red king crab meat tossed with blood orange segments, Hass avocado, organic watercress, and yuzu vinaigrette.',
    descFr: 'Chair de crabe royal rouge d’Alaska, suprêmes d’oranges sanguines, avocat crémeux, cresson et vinaigrette au yuzu.',
    descAr: 'لحم السلطعون الملكي الأحمر الحلو مع شرائح البرتقال الأحمر، الأفوكادو، الجرجير العضوي، وصلصة اليوزو الحمضية.',
    price: 36,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: ['Red King Crab', 'Blood Orange', 'Avocado', 'Watercress', 'Yuzu Vinaigrette'],
    allergens: ['Crustaceans'],
    calories: 310,
    winePairing: 'Provence Rosé Whispering Angel'
  },
  {
    id: 'prod-9',
    name: 'Artisan Burrata & House Smoked Salmon',
    nameFr: 'Burrata Crémeuse des Pouilles & Saumon Fumé Maison',
    nameAr: 'بوراتا إيطالية طازجة مع سلمون مدخن محلياً',
    description: 'Whole Pugliese burrata cheese, house beechwood-smoked Scottish salmon ribbons, aged Modena balsamic pearls, and grilled sourdough.',
    descFr: 'Burrata entière des Pouilles, fines lanières de saumon écossais fumé au bois de hêtre, perles de balsamique de Modène et pain au levain grillé.',
    descAr: 'جبنة بوراتا كاملة من بوليا مع شرائح سلمون اسكتلندي مدخن بخشب الزان، حبيبات بلسميك مودينا، وخبز الحبوب المشوي.',
    price: 32,
    category: 'salads',
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb225cc?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: ['Pugliese Burrata', 'Smoked Salmon', 'Balsamic Pearls', 'Heirloom Tomatoes', 'Sourdough'],
    allergens: ['Dairy', 'Fish', 'Gluten'],
    calories: 460,
    winePairing: 'Gavi di Gavi DOCG'
  },
  {
    id: 'prod-10',
    name: 'Grand Marnier Golden Soufflé',
    nameFr: 'Soufflé Chaud au Grand Marnier & Vanille Bourbon',
    nameAr: 'سوفليه غراند مارنييه الذهبي مع فانيليا مدغشقر',
    description: 'Cloud-light warm citrus liqueur soufflé, accompanied by Madagascar bourbon vanilla crème anglaise and salted caramel ice cream.',
    descFr: 'Soufflé chaud aérien à la liqueur Grand Marnier, crème anglaise à la vanille Bourbon de Madagascar et glace caramel fleur de sel.',
    descAr: 'سوفليه ساخن وخفيف كالغيمة بنكهة الحمضيات الفاخرة، يقدم مع كريمة الفانيليا البوربون وآيس كريم الكراميل المملح.',
    price: 24,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Free-Range Eggs', 'Grand Marnier', 'Bourbon Vanilla', 'Sea Salt Caramel Gelato'],
    allergens: ['Eggs', 'Dairy', 'Alcohol'],
    calories: 410,
    winePairing: 'Château d’Yquem Sauternes'
  },
  {
    id: 'prod-11',
    name: 'Valrhona Dark Chocolate Coral Reef',
    nameFr: 'Corail de Chocolat Noir Valrhona & Fruit de la Passion',
    nameAr: 'حلوى المرجان بشوكولاتة فالرونا الداكنة وباشن فروت',
    description: '70% Guanaja chocolate ganache sculpted like sea coral, crunchy hazelnut praline, exotic passion fruit sorbet, and 24k edible gold.',
    descFr: 'Ganache de chocolat Guanaja 70% sculptée façon corail, praliné noisette croustillant, sorbet passion et feuille d’or 24 carats.',
    descAr: 'غاناش شوكولاتة غواناخا 70% منحوت على شكل مرجان بحري مع برالين البندق المقرمش وسوربيه الباشن فروت ورقائق الذهب 24 قيراط.',
    price: 22,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: false,
    ingredients: ['Valrhona 70% Chocolate', 'Piedmont Hazelnut', 'Passion Fruit', 'Gold Leaf'],
    allergens: ['Dairy', 'Nuts', 'Soy'],
    calories: 450,
    winePairing: 'Taylor’s 20 Year Old Tawny Port'
  },
  {
    id: 'prod-12',
    name: 'Star Fish Signature Ocean Mist Cocktail',
    nameFr: 'Cocktail Signature « Brume de l’Océan »',
    nameAr: 'كوكتيل نجم البحر المميز «رذاذ المحيط»',
    description: 'Infused Mediterranean gin, blue curaçao, elderflower liqueur, sparkling saline mist, dry smoke cloche presentation.',
    descFr: 'Gin méditerranéen infusé, curaçao bleu, liqueur de fleur de sureau, brume saline scintillante, cloche de fumée aromatique.',
    descAr: 'مشروب الجن المتوسطي المقطر، كوراكاو أزرق، زهر البيلسان، رذاذ الملح البحري المتلألئ مع تقديم سحابي مدخن.',
    price: 20,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    available: true,
    featured: true,
    ingredients: ['Botanical Gin', 'Blue Curaçao', 'St-Germain Elderflower', 'Lime Essence', 'Saline Mist'],
    allergens: ['Alcohol'],
    calories: 190
  }
];

const defaultSettings: RestaurantSettings = {
  name: 'Star Fish',
  tagline: 'Haute Gastronomie de la Mer',
  description: 'Star Fish redefines ocean culinary artistry. Rooted in sustainable wild catch, Michelin-standard craft, and breathtaking waterfront views, we offer an unforgettable seafood dining journey.',
  phone: '+1 (555) 382-7474',
  email: 'reservations@starfish-restaurant.com',
  address: '74 Marina Boulevard, Waterfront Promenade, Coastal Bay',
  openingHours: {
    lunch: '12:00 PM – 3:30 PM',
    dinner: '7:00 PM – 11:30 PM',
    days: 'Tuesday – Sunday (Closed Mondays)'
  },
  currency: 'USD',
  currencyRates: {
    USD: 1,
    EUR: 0.92,
    MAD: 10.0
  },
  socials: {
    instagram: 'https://instagram.com/starfish.seafood',
    facebook: 'https://facebook.com/starfish.seafood',
    tripadvisor: 'https://tripadvisor.com/starfish-seafood'
  },
  aboutStory: 'Founded by Master Chef Adrian Laurent, Star Fish was born from an unyielding passion for pristine coastal waters. Every dawn, our culinary team hand-selects premier catches directly from artisanal fishermen, transforming the pure essence of the sea into refined culinary masterpieces.',
  heroImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1920&q=80'
};

const defaultGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    title: 'The Grand Royal Seafood Plateau',
    titleFr: 'Le Grand Plateau Royal de la Mer',
    titleAr: 'برج ثمار البحر الملكي',
    category: 'Cuisine'
  },
  {
    id: 'gal-2',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=1200&q=80',
    title: 'Wood-Fired Blue Lobster',
    titleFr: 'Homard Bleu Rôti',
    titleAr: 'كركند البحر المشوي',
    category: 'Cuisine'
  },
  {
    id: 'gal-3',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    title: 'Main Dining Hall Overlooking the Bay',
    titleFr: 'Salle Principale Face à la Baie',
    titleAr: 'صالة الطعام الرئيسية المطلة على الخليج',
    category: 'Ambience'
  },
  {
    id: 'gal-4',
    url: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    title: 'Bluefin Tuna Tataki & Caviar',
    titleFr: 'Tataki de Thon Rouge & Caviar',
    titleAr: 'تاتاكي التونة مع الكافيار الفاخر',
    category: 'Cuisine'
  },
  {
    id: 'gal-5',
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=80',
    title: 'Sunset Terrace by the Waterfront',
    titleFr: 'Terrasse Coucher de Soleil sur la Marina',
    titleAr: 'شرفة الغروب على المارينا',
    category: 'Ambience'
  },
  {
    id: 'gal-6',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1200&q=80',
    title: 'Squid Ink Tagliolini Preparation',
    titleFr: 'Tagliolini Noirs Fait Maison',
    titleAr: 'باستا حبر الحبار الطازجة',
    category: 'Artistry'
  }
];

const defaultReservations: Reservation[] = [
  {
    id: 'res-1',
    refCode: 'SF-9281',
    fullName: 'Lord Edward Hastings',
    phone: '+1 (555) 728-1920',
    email: 'e.hastings@luxury-estates.com',
    guests: 4,
    date: '2026-10-12',
    time: '20:00',
    specialRequest: 'Window table facing the marina. Celebrating 15th wedding anniversary.',
    status: 'confirmed',
    createdAt: '2026-10-06T14:30:00.000Z'
  },
  {
    id: 'res-2',
    refCode: 'SF-9282',
    fullName: 'Claire Delacroix',
    phone: '+33 6 12 34 56 78',
    email: 'c.delacroix@haute-mode.fr',
    guests: 2,
    date: '2026-10-14',
    time: '19:30',
    specialRequest: 'Prefers quiet corner. Sommelier wine pairing requested.',
    status: 'pending',
    createdAt: '2026-10-07T09:15:00.000Z'
  }
];

function initDatabase(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Ensure all fields exist
      return {
        manager: parsed.manager || null,
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
        categories: parsed.categories && parsed.categories.length > 0 ? parsed.categories : defaultCategories,
        products: parsed.products && parsed.products.length > 0 ? parsed.products : defaultProducts,
        reservations: parsed.reservations || defaultReservations,
        gallery: parsed.gallery && parsed.gallery.length > 0 ? parsed.gallery : defaultGallery,
        tokens: parsed.tokens || []
      };
    } catch (err) {
      console.error('Error reading db.json, creating fallback defaults:', err);
    }
  }

  const initialDb: DatabaseSchema = {
    manager: null,
    settings: defaultSettings,
    categories: defaultCategories,
    products: defaultProducts,
    reservations: defaultReservations,
    gallery: defaultGallery,
    tokens: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
  return initialDb;
}

let db: DatabaseSchema = initDatabase();

export function getDb(): DatabaseSchema {
  return db;
}

export function saveDb(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}
