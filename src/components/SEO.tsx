import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
}

export function SEO({
  title = "Zé do Rolo | Compre, venda e troque veículos",
  description = "A melhor plataforma para compra e venda de caminhões, vans, ônibus e tratores.",
  canonical = "https://zedorolo.com",
  type = "website",
  image = "https://zedorolo.com/logo-zedorolo.png"
}: SEOProps) {
  
  // JSON-LD (Schema Markup) para Organização
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zé do Rolo",
    "url": "https://zedorolo.com",
    "logo": "https://zedorolo.com/logo-zedorolo.png",
    "description": "A melhor plataforma para compra e venda de caminhões, vans, ônibus e tratores."
  };

  return (
    <Helmet>
      {/* Standard SEO Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Dados Estruturados JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
