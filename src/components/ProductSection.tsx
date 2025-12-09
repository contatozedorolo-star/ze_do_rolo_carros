import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
  location: string;
  sellerLevel?: "bronze" | "prata" | "ouro";
  verified?: boolean;
  acceptsTrade?: boolean;
  category?: string;
}

interface ProductSectionProps {
  title: string;
  description?: string;
  products: Product[];
  showViewAll?: boolean;
  icon?: React.ReactNode;
}

const ProductSection = ({
  title,
  description,
  products,
  showViewAll = true,
  icon,
}: ProductSectionProps) => {
  return (
    <section className="py-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {showViewAll && (
          <Button variant="ghost" className="shrink-0 text-primary">
            Ver todos
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
