import { Shield, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logoFooter from "@/assets/logo-zedorolo.png";

// TikTok icon component (not available in lucide-react)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/">
              <img src={logoFooter} alt="Zé do Rolo" className="h-20 md:h-28 w-auto" />
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Seu corretor de negócios pessoais. Trocas e vendas com segurança do início ao fim.
            </p>
            <div className="flex items-center gap-2 text-sm text-accent">
              <Shield className="h-4 w-4" />
              <span>100% Seguro e Verificado</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-secondary transition-colors">Início</Link></li>
              <li><Link to="/veiculos" className="hover:text-secondary transition-colors">Veículos</Link></li>
              <li><Link to="/tabela-fipe" className="hover:text-secondary transition-colors">Tabela FIPE</Link></li>
              <li><Link to="/how-it-works" className="hover:text-secondary transition-colors">Como Funciona</Link></li>
            </ul>
          </div>

          {/* Institucional */}
          <div className="space-y-4">
            <h4 className="font-semibold">Institucional</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/faq" className="hover:text-secondary transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/how-it-works" className="hover:text-secondary transition-colors">Como Funciona</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-secondary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/politica-de-privacidade" className="hover:text-secondary transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/politica-de-cookies" className="hover:text-secondary transition-colors">Política de Cookies</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contato</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>contato@zedorolo.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a 
                  href="https://wa.me/5511983765437" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  (11) 98376-5437
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            <a 
              href="https://instagram.com/zedorolo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground p-2 rounded-md transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com/zedorolo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground p-2 rounded-md transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://tiktok.com/@zedorolo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground p-2 rounded-md transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
          
          <p>© {new Date().getFullYear()} Zé do Rolo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
