import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getFeaturedPosts } from "@/data/blogData";
import BlogCard from "./BlogCard";

const BlogSection = () => {
  const featuredPosts = getFeaturedPosts(3);

  return (
    <section className="pt-4 pb-1 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Novidades do Blog
            </h2>
            <p className="text-muted-foreground">
              Fique por dentro das últimas notícias do mundo automotivo
            </p>
          </div>
          <Link 
            to="/blog" 
            className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Ver todos os posts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        <Link 
          to="/blog" 
          className="flex md:hidden items-center justify-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors mt-6"
        >
          Ver todos os posts
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
