import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const DOMAIN = 'https://zedorolo.com';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Generates a URL-friendly slug from vehicle data
 * Mirrored from src/lib/slugify.ts
 */
function generateVehicleSlug(brand, model, yearModel, version) {
  const parts = [brand, model, yearModel.toString()];
  if (version) parts.push(version);
  return parts
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generate() {
  console.log('Fetching active vehicles from Supabase...');
  
  // Fetch vehicles. Filter by is_active and approved moderation status if applicable.
  // We only want vehicles that should be indexed.
  const { data: vehicles, error } = await supabase
    .from('vehicles')
    .select('id, brand, model, year_model, version')
    .eq('is_active', true)
    .eq('is_sold', false); // Optional: don't index sold cars if you prefer

  if (error) {
    console.error('Error fetching vehicles:', error);
    process.exit(1);
  }

  console.log(`Found ${vehicles.length} vehicles.`);

  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/busca', changefreq: 'daily', priority: 0.8 },
    { url: '/veiculos', changefreq: 'weekly', priority: 0.8 },
    { url: '/como-funciona', changefreq: 'monthly', priority: 0.5 },
    { url: '/faq', changefreq: 'monthly', priority: 0.5 },
    { url: '/tabela-fipe', changefreq: 'monthly', priority: 0.5 },
    { url: '/blog', changefreq: 'weekly', priority: 0.6 },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static routes
  staticRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${DOMAIN}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  // Dynamic routes (Vehicles)
  vehicles.forEach(v => {
    const slug = generateVehicleSlug(v.brand, v.model, v.year_model, v.version);
    const fullSlug = `${slug}-${v.id}`;
    xml += `
  <url>
    <loc>${DOMAIN}/veiculo/${fullSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  const outputPath = './public/sitemap.xml';
  fs.writeFileSync(outputPath, xml);
  console.log(`Successfully generated sitemap at ${outputPath}`);
}

generate().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
