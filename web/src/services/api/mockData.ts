import type { PersonPreview } from "src/features/person-preview";
import type { ChatMessage } from "src/services/api/types";

export const mockPersonPreviews: PersonPreview[] = [
  {
    id: "mock-profile-nina",
    name: "Nina",
    age: "27 rokov",
    meta: ["Bratislava", "2 km", "Káva a turistika"],
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85",
    bio: "Rada objavujem malé podniky, chodím na koncerty a cez víkendy miznem do prírody. Hľadám niekoho, kto vie plánovať aj spontánne meniť plán. Najlepšie si oddýchnem pri dlhej prechádzke, dobrom jedle a rozhovore, ktorý nikam netlačí. Mám rada ľudí, ktorí sú zvedaví, vedia sa smiať aj z bežných vecí a neboja sa skúsiť niečo nové.",
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
    ],
    tags: ["Turistika", "Koncerty", "Knihy", "Varím doma", "Pes"],
  },
  {
    id: "mock-profile-tomas",
    name: "Tomáš",
    age: "31 rokov",
    meta: ["Brno", "8 km", "Lezenie a filmy"],
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
    bio: "Po práci najradšej leziem, varím jednoduché jedlá a hľadám nové miesta na kávu. Baví ma dobrý film, krátky výlet vlakom a rozhovor bez mobilu na stole. Hľadám niekoho, kto má rád aktívny oddych aj pokojné večery.",
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    ],
    tags: ["Lezenie", "Kino", "Káva", "Cestovanie", "Varím"],
  },
  {
    id: "mock-profile-ela",
    name: "Ela",
    age: "25 rokov",
    meta: ["Trnava", "14 km", "Dizajn a beh"],
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85",
    bio: "Ráno behám, večer kreslím a cez víkend rada objavujem výstavy alebo malé bistrá. Som skôr pokojná, ale rada sa nechám nahovoriť na spontánny plán. Najviac mi sadnú ľudia, ktorí sa vedia pýtať a počúvať.",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=85",
    ],
    tags: ["Beh", "Dizajn", "Výstavy", "Bistrá", "Podcasty"],
  },
  {
    id: "mock-profile-marek",
    name: "Marek",
    age: "29 rokov",
    meta: ["Bratislava", "5 km", "Hudba a hry"],
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    bio: "Hrám na gitare, občas organizujem večery s doskovkami a rád chodím na menšie koncerty. Cez týždeň preferujem pokoj, cez víkend výlet alebo dobré jedlo. Hľadám partiu aj jednotlivcov na pravidelné stretká.",
    photos: [
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
    ],
    tags: ["Gitara", "Doskovky", "Koncerty", "Jedlo", "Výlet"],
  },
  {
    id: "mock-profile-sara",
    name: "Sára",
    age: "33 rokov",
    meta: ["Nitra", "22 km", "Knihy a wellness"],
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85",
    bio: "Rada čítam, chodím plávať a cez víkendy si plánujem menšie výlety mimo mesta. Mám rada pokojné tempo, úprimnosť a humor bez snahy niečo dokazovať. Chcela by som spoznať ľudí na pravidelné aktivity aj obyčajné rozhovory.",
    photos: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
    ],
    tags: ["Knihy", "Plávanie", "Wellness", "Výlety", "Čaj"],
  },
];

export const mockIncomingLikePersonPreviewIds = new Set([
  "mock-profile-nina",
  "mock-profile-ela",
  "mock-profile-marek",
]);

export const mockInitialChatMatchIds = [
  "mock-profile-nina",
  "mock-profile-ela",
  "mock-profile-marek",
];

export const mockChatMessagesByMatchId: Record<string, ChatMessage[]> = {
  "mock-profile-nina": [
    {
      id: "mock-message-nina-1",
      matchId: "mock-profile-nina",
      sender: "match",
      sentAt: "2026-08-29T08:24:00.000Z",
      text: "Ahoj, videla som, že máš rád/rada turistiku. Máš nejakú obľúbenú trasu?",
    },
    {
      id: "mock-message-nina-2",
      matchId: "mock-profile-nina",
      sender: "current-user",
      sentAt: "2026-08-29T08:31:00.000Z",
      text: "Ahoj, najčastejšie chodím na Kolibu. Je to blízko a stále sa tam dá niečo objaviť.",
    },
  ],
  "mock-profile-ela": [
    {
      id: "mock-message-ela-1",
      matchId: "mock-profile-ela",
      sender: "match",
      sentAt: "2026-08-29T09:12:00.000Z",
      text: "Ahoj, videla som, že tiež rád/rada objavuješ podniky. Máš tip na dobré bistro?",
    },
    {
      id: "mock-message-ela-2",
      matchId: "mock-profile-ela",
      sender: "current-user",
      sentAt: "2026-08-29T09:18:00.000Z",
      text: "Ahoj, v Trnave mám rád/rada pár malých miest pri centre. Môžem poslať tipy.",
    },
  ],
  "mock-profile-marek": [
    {
      id: "mock-message-marek-1",
      matchId: "mock-profile-marek",
      sender: "match",
      sentAt: "2026-08-29T10:04:00.000Z",
      text: "Čau, chystáme doskovky tento týždeň. Nechceš sa pridať?",
    },
  ],
};
