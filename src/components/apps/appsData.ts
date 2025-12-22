export interface App {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  url?: string;
}

export const appsData: App[] = [
  {
    id: "xhorizonte",
    name: "XHorizonte",
    description:
      "Rede social para posts rápidos, debates e novidades do Grêmio",
    icon: "X",
    category: "Rede social",
    url: "apps/xhorizonte",
  },
  {
    id: "jogos",
    name: "Jogos",
    description: "Jogue, evolua de nível e dispute o topo do ranking.",
    icon: "J",
    category: "Jogos",
    url: "apps/jogos",
  }
];

export const categories = [...new Set(appsData.map((app) => app.category))];
