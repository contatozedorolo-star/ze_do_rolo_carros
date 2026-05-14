import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blogData";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Blog do Zé do Rolo — Mercado de Veículos, Dicas e Lançamentos</title>
        <meta name="description" content="Notícias, comparativos, dicas de manutenção e análises do mercado de carros, caminhões e veículos comerciais no Brasil." />
        <link rel="canonical" href="https://zedorolo.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Blog do Zé do Rolo" />
        <meta property="og:description" content="Notícias, comparativos e dicas do mercado automotivo brasileiro." />
        <meta property="og:url" content="https://zedorolo.com/blog" />
      </Helmet>
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Blog do Zé do Rolo
          </h1>
          <p className="text-muted-foreground text-lg">
            Dicas, novidades e tudo sobre o mercado automotivo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
