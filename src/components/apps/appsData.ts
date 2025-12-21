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
    id: "xgremio",
    name: "XGremio",
    description: "Rede social para posts rápidos, debates e novidades do Grêmio",
    icon: "X",
    category: "Rede social",
    url: "apps/xgremio"
  }
];

export const categories = [...new Set(appsData.map(app => app.category))];