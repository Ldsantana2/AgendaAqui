import { Card } from "antd";
import { useRouter } from "next/router";
import Image from "next/image";
const accountTypes = [
  {
    route: "/cadastro/paciente",
    title: "Sou um paciente",
    description: "Encontre um médico e marque uma consulta",
    image: "/images/cadastro-paciente.jpg",
  },
  {
    route: "/cadastro/clinica",
    title: "Sou uma clínica",
    description: "Cadastre sua clínica e gerencie seus atendimentos",
    image: "/images/cadastro-clinica.png",
  },
];

export default function NewRegister() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="items-center grid grid-cols-1 md:grid-cols-2 gap-8 max-w-screen-xl">
        {accountTypes.map(({ title, description, route, image }) => (
          <Card
            key={title}
            hoverable
            onClick={() => router.push(route)}
            cover={
              <div className="relative w-full h-64 md:h-72">
                <Image
                  src={image}
                  alt={title}
                  layout="fill"
                  className="rounded-t-md object-scale-down fill-inherit"
                />
              </div>
            }
            className="max-h-96 min-w-fit"
          >
            <Card.Meta title={title} description={description} />
          </Card>
        ))}
      </div>
    </div>
  );
}
