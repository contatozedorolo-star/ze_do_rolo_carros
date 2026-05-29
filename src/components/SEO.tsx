import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: 'website' | 'article' | 'product';
  image?: string;
}

const SITE_URL = "https://zedorolo.com";

export function SEO({
  title = "Zé do Rolo | Compre, venda e troque veículos",
  description = "A melhor plataforma para compra e venda de caminhões, vans, ônibus e tratores.",
  canonical,
  type = "website",
  image = "https://zedorolo.com/logo-zedorolo.png"
}: SEOProps) {
  const location = useLocation();
  const resolvedUrl = canonical || `${SITE_URL}${location.pathname}`;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Zé do Rolo",
    "url": SITE_URL,
    "logo": "https://zedorolo.com/logo-zedorolo.png",
    "description": "A melhor plataforma para compra e venda de caminhões, vans, ônibus e tratores."
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={resolvedUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={resolvedUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={resolvedUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
