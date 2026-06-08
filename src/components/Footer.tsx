import { Shield, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logoFooter from "@/assets/logo-zedorolo.png";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" aria-label="Ir para a página inicial">
              <img src={logoFooter} alt="Logotipo Zé do Rolo" className="h-20 md:h-28 w-auto" width={224} height={112} />
            </Link>
            <p className="text-primary-foreground/70 text-sm">
              Seu corretor de negócios pessoais. Trocas e vendas com segurança do início ao fim.
            </p>
            <div className="flex items-center gap-2 text-sm text-accent">
              <Shield className="h-4 w-4" />
              <span>Site Seguro e Verificado</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Navegação</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/" className="hover:text-secondary transition-colors">Início</Link></li>
              <li><Link to="/veiculos" className="hover:text-secondary transition-colors">Veículos</Link></li>
              
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
                <a href="mailto:contato@zedorolo.com.br" className="hover:text-secondary transition-colors">contato@zedorolo.com.br</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a 
                  href="https://wa.me/5543991972445" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-secondary transition-colors"
                >
                  (43) 99197-2445
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Apucarana, PR</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          {/* Social Media Icons */}
          <div className="flex items-center gap-2">
            <a 
              href="https://www.instagram.com/zedorolo.oficial" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground p-2 rounded-md transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.facebook.com/share/1HN8cjymq1/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary-foreground/10 hover:bg-secondary hover:text-secondary-foreground p-2 rounded-md transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
          
          <p>© {new Date().getFullYear()} Zé do Rolo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
