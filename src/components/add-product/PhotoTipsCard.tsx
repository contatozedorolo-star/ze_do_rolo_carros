import { Camera } from "lucide-react";

export const PhotoTipsCard = () => {
  return (
    <div className="rounded-lg border-2 border-secondary/40 bg-secondary/5 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Camera className="w-5 h-5 text-secondary" />
        <h3 className="text-base font-bold text-foreground">
          📸 Dica do Zé do Rolo
        </h3>
      </div>

      <p className="text-sm text-foreground font-medium">
        Quanto mais fotos boas e detalhadas você enviar, maior a chance de
        conseguir um negócio mais rápido e melhor!
      </p>

      <ul className="space-y-2 text-sm text-foreground/85 list-disc pl-5">
        <li>
          Tire fotos detalhadas, imagine o que você gostaria de ver se estivesse
          comprando o veículo.
        </li>
        <li>
          Limpe a câmera do celular antes de fotografar e tire as fotos{" "}
          <strong>SEMPRE com o celular em pé (na vertical)</strong>.
        </li>
        <li>
          Tire várias fotos (o ideal é de <strong>8 a 15 fotos</strong> para
          cobrir tudo): frente, traseira, as 4 diagonais, porta-malas, motor e o
          interior mostrando o volante, painel com a quilometragem e os bancos.
        </li>
        <li>
          Mostre os detalhes de forma honesta (se houver algum amassado ou
          detalhe na pintura, tire foto).
        </li>
        <li>
          Evite fotos no escuro. Anúncios com apenas uma foto têm chances
          drasticamente menores de fechar negócio. Se quer um resultado rápido,
          capriche e envie o máximo de boas fotos que puder!
        </li>
      </ul>
    </div>
  );
};

export default PhotoTipsCard;
