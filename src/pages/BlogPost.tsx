import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug, getFeaturedPosts } from "@/data/blogData";
import BlogCard from "@/components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug || "");
  const relatedPosts = getFeaturedPosts(3).filter(p => p.slug !== slug).slice(0, 2);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O artigo que você procura não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/blog">Voltar ao Blog</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Parse markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let currentTable: string[][] = [];
    let inTable = false;
    let tableKey = 0;

    lines.forEach((line, index) => {
      // Check for table rows
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        const cells = line.split('|').filter(cell => cell.trim() !== '').map(cell => cell.trim());
        
        // Skip separator rows (|---|---|)
        if (!cells.every(cell => cell.match(/^-+$/))) {
          currentTable.push(cells);
        }
      } else {
        // If we were in a table, render it now
        if (inTable && currentTable.length > 0) {
          const tableHeaders = currentTable[0];
          const tableRows = currentTable.slice(1);
          
          elements.push(
            <div key={`table-${tableKey++}`} className="overflow-x-auto my-6">
              <table className="min-w-full border border-border rounded-lg overflow-hidden">
                <thead className="bg-muted">
                  <tr>
                    {tableHeaders.map((header, idx) => (
                      <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                        {header.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                      {row.map((cell, cellIdx) => (
                        <td key={cellIdx} className="px-4 py-3 text-sm text-foreground border-b border-border">
                          {cell.replace(/\*\*/g, '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          currentTable = [];
          inTable = false;
        }

        // Handle other markdown elements
        if (line.startsWith('## ')) {
          elements.push(
            <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
              {line.replace('## ', '')}
            </h2>
          );
        } else if (line.startsWith('### ')) {
          elements.push(
            <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
              {line.replace('### ', '')}
            </h3>
          );
        } else if (line.startsWith('---')) {
          elements.push(<hr key={index} className="my-8 border-border" />);
        } else if (line.trim() !== '') {
          // Parse bold text
          const parsedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          elements.push(
            <p 
              key={index} 
              className="text-foreground leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: parsedLine }}
            />
          );
        }
      }
    });

    // Handle any remaining table at the end
    if (inTable && currentTable.length > 0) {
      const tableHeaders = currentTable[0];
      const tableRows = currentTable.slice(1);
      
      elements.push(
        <div key={`table-${tableKey}`} className="overflow-x-auto my-6">
          <table className="min-w-full border border-border rounded-lg overflow-hidden">
            <thead className="bg-muted">
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-foreground border-b border-border">
                    {header.replace(/\*\*/g, '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIdx) => (
                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-background' : 'bg-muted/50'}>
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-4 py-3 text-sm text-foreground border-b border-border">
                      {cell.replace(/\*\*/g, '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Image */}
        <div className="w-full h-[300px] md:h-[400px] relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="container max-w-4xl -mt-20 relative z-10">
          <div className="bg-card rounded-lg shadow-lg p-6 md:p-10 border border-border">
            {/* Back Link */}
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Blog
            </Link>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {post.category}
              </Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Content */}
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              {renderContent(post.content)}
            </article>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 mb-8">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Leia também
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
