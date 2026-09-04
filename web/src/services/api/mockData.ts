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
    tags: [
      { id: "turistika", name: "Turistika" },
      { id: "koncerty", name: "Koncerty" },
      { id: "knihy", name: "Knihy" },
      { id: "varenie", name: "Varenie" },
      { id: "cestovanie", name: "Cestovanie" },
    ],
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
    tags: [
      { id: "lezenie", name: "Lezenie" },
      { id: "kino", name: "Kino" },
      { id: "kava", name: "Káva" },
      { id: "cestovanie", name: "Cestovanie" },
      { id: "varenie", name: "Varenie" },
    ],
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
    tags: [
      { id: "beh", name: "Beh" },
      { id: "dizajn", name: "Dizajn" },
      { id: "vystavy", name: "Výstavy" },
      { id: "bistra", name: "Bistrá" },
      { id: "podcasty", name: "Podcasty" },
    ],
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
    tags: [
      { id: "gitara", name: "Gitara" },
      { id: "doskovky", name: "Doskovky" },
      { id: "koncerty", name: "Koncerty" },
      { id: "jedlo", name: "Jedlo" },
      { id: "vylety", name: "Výlety" },
    ],
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
    tags: [
      { id: "knihy", name: "Knihy" },
      { id: "plavanie", name: "Plávanie" },
      { id: "wellness", name: "Wellness" },
      { id: "vylety", name: "Výlety" },
      { id: "caj", name: "Čaj" },
    ],
  },
  {
    id: "mock-profile-lucia",
    name: "Lucia",
    age: "28 rokov",
    meta: ["Bratislava", "3 km", "Joga a knihy"],
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=1200&q=85",
    bio: "Pracujem v menšom tíme a po práci rada vypínam pri joge, knihách alebo dlhej prechádzke pri Dunaji. Baví ma spoznávať ľudí, ktorí majú pokojné tempo a vedia sa rozprávať aj o obyčajných veciach. Rada varím pre kamarátov a hľadám nové miesta, kam sa dá ísť bez veľkého plánovania.",
    photos: [
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "joga", name: "Joga" },
      { id: "knihy", name: "Knihy" },
      { id: "varenie", name: "Varenie" },
      { id: "prechadzky", name: "Prechádzky" },
      { id: "kava", name: "Káva" },
    ],
  },
  {
    id: "mock-profile-peter",
    name: "Peter",
    age: "34 rokov",
    meta: ["Pezinok", "18 km", "Bicykel a varenie"],
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
    bio: "Cez týždeň veľa sedím pri počítači, takže voľný čas najradšej trávim vonku na bicykli alebo v kuchyni. Mám rád výlety do Malých Karpát, dobré jedlo a rozhovory bez potreby stále niečo dokazovať. Hľadám ľudí na spoločné aktivity aj pokojné večery pri filme.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "bicykel", name: "Bicykel" },
      { id: "varenie", name: "Varenie" },
      { id: "vylety", name: "Výlety" },
      { id: "filmy", name: "Filmy" },
      { id: "priroda", name: "Príroda" },
    ],
  },
  {
    id: "mock-profile-veronika",
    name: "Veronika",
    age: "26 rokov",
    meta: ["Senec", "21 km", "Plávanie a cestovanie"],
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
    bio: "Najlepšie sa cítim pri vode, či už ide o plávanie, paddleboard alebo len pokojné sedenie pri jazere. Rada cestujem ľahko, bez presného programu, a skúšam malé lokálne podniky. Teší ma, keď stretnem človeka, ktorý vie byť spontánny, ale zároveň spoľahlivý.",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "plavanie", name: "Plávanie" },
      { id: "cestovanie", name: "Cestovanie" },
      { id: "bistra", name: "Bistrá" },
      { id: "leto", name: "Leto" },
      { id: "prechadzky", name: "Prechádzky" },
    ],
  },
  {
    id: "mock-profile-adam",
    name: "Adam",
    age: "30 rokov",
    meta: ["Bratislava", "4 km", "Koncerty a beh"],
    photo:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=1200&q=85",
    bio: "Veľa energie mi dáva hudba, beh a ľudia, ktorí sa vedia zasmiať aj po náročnom dni. Chodím na menšie koncerty, rád skúšam nové trasy v meste a občas organizujem spoločné večere. Hľadám niekoho, kto má chuť niekam vyraziť, ale ocení aj pokojný večer doma.",
    photos: [
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "koncerty", name: "Koncerty" },
      { id: "beh", name: "Beh" },
      { id: "hudba", name: "Hudba" },
      { id: "jedlo", name: "Jedlo" },
      { id: "vylety", name: "Výlety" },
    ],
  },
  {
    id: "mock-profile-michaela",
    name: "Michaela",
    age: "32 rokov",
    meta: ["Modra", "24 km", "Keramika a turistika"],
    photo:
      "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=1200&q=85",
    bio: "Vo voľnom čase chodím do keramického ateliéru, na trhy a na nenáročné túry. Mám rada miesta, kde sa dá rozprávať bez hluku a bez ponáhľania. Hľadám nových ľudí, s ktorými sa dá naplánovať výlet, káva alebo spoločné tvorivé popoludnie.",
    photos: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "keramika", name: "Keramika" },
      { id: "turistika", name: "Turistika" },
      { id: "trhy", name: "Trhy" },
      { id: "kava", name: "Káva" },
      { id: "umenie", name: "Umenie" },
    ],
  },
  {
    id: "mock-profile-jan",
    name: "Ján",
    age: "37 rokov",
    meta: ["Bratislava", "6 km", "Kino a kvízy"],
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=1200&q=85",
    bio: "Rád chodím do kina, na vedomostné kvízy a na večere s priateľmi. Som skôr pokojný typ, ale baví ma spoznávať ľudí cez spoločné zážitky a dobrý humor. Najviac si rozumiem s ľuďmi, ktorí sú zvedaví a vedia počúvať.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "kino", name: "Kino" },
      { id: "kvizy", name: "Kvízy" },
      { id: "jedlo", name: "Jedlo" },
      { id: "knihy", name: "Knihy" },
      { id: "prechadzky", name: "Prechádzky" },
    ],
  },
  {
    id: "mock-profile-zuzana",
    name: "Zuzana",
    age: "29 rokov",
    meta: ["Trnava", "36 km", "Podcasty a beh"],
    photo:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1200&q=85",
    bio: "Ráno rada behám a večer si púšťam podcasty alebo varím niečo nové. Mám rada úprimných ľudí, ktorí si vedia nájsť čas aj mimo obrazoviek. Chcela by som spoznať partiu na výlety, šport aj pokojné rozhovory pri káve.",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "podcasty", name: "Podcasty" },
      { id: "beh", name: "Beh" },
      { id: "varenie", name: "Varenie" },
      { id: "kava", name: "Káva" },
      { id: "sport", name: "Šport" },
    ],
  },
  {
    id: "mock-profile-robert",
    name: "Róbert",
    age: "35 rokov",
    meta: ["Nitra", "44 km", "Fotografia a hory"],
    photo:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85",
    bio: "Fotím krajinu, chodím do hôr a rád objavujem miesta, kde nie je veľa ľudí. Vo vzťahoch aj priateľstvách oceňujem spoľahlivosť, humor a schopnosť povedať veci priamo. Hľadám ľudí na výlety, fotenie alebo len dobrý rozhovor po práci.",
    photos: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "fotografia", name: "Fotografia" },
      { id: "hory", name: "Hory" },
      { id: "turistika", name: "Turistika" },
      { id: "vylety", name: "Výlety" },
      { id: "priroda", name: "Príroda" },
    ],
  },
  {
    id: "mock-profile-katarina",
    name: "Katarína",
    age: "31 rokov",
    meta: ["Bratislava", "7 km", "Divadlo a čaj"],
    photo:
      "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=1200&q=85",
    bio: "Chodím do divadla, čítam súčasnú literatúru a rada objavujem pokojné čajovne. Nepotrebujem veľké gestá, viac ma baví pozornosť v bežných veciach a rozhovor, ktorý prirodzene plynie. Hľadám ľudí na kultúru, prechádzky a občasné víkendové výlety.",
    photos: [
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "divadlo", name: "Divadlo" },
      { id: "caj", name: "Čaj" },
      { id: "knihy", name: "Knihy" },
      { id: "kultura", name: "Kultúra" },
      { id: "prechadzky", name: "Prechádzky" },
    ],
  },
  {
    id: "mock-profile-daniel",
    name: "Daniel",
    age: "27 rokov",
    meta: ["Bratislava", "9 km", "Lezenie a káva"],
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85",
    bio: "Po práci chodím liezť, cez víkendy rád cestujem vlakom a hľadám dobrú kávu v nových mestách. Som praktický človek, ktorý má rád jasné dohody a nekomplikovanú komunikáciu. Rád spoznám niekoho na šport, výlet alebo spoločné varenie.",
    photos: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "lezenie", name: "Lezenie" },
      { id: "kava", name: "Káva" },
      { id: "cestovanie", name: "Cestovanie" },
      { id: "varenie", name: "Varenie" },
      { id: "sport", name: "Šport" },
    ],
  },
  {
    id: "mock-profile-emilia",
    name: "Emília",
    age: "24 rokov",
    meta: ["Bratislava", "11 km", "Dizajn a galérie"],
    photo:
      "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=1200&q=85",
    bio: "Študujem dizajn, chodím na výstavy a najradšej spoznávam mesto cez malé podniky a galérie. Mám rada ľudí, ktorí sú tvoriví, otvorení a neberú sa príliš vážne. Rada by som našla niekoho na spoločné objavovanie kultúry aj obyčajné prechádzky.",
    photos: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "dizajn", name: "Dizajn" },
      { id: "galerie", name: "Galérie" },
      { id: "vystavy", name: "Výstavy" },
      { id: "bistra", name: "Bistrá" },
      { id: "umenie", name: "Umenie" },
    ],
  },
  {
    id: "mock-profile-martin",
    name: "Martin",
    age: "33 rokov",
    meta: ["Hainburg", "17 km", "Kajak a varenie"],
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85",
    bio: "Som najspokojnejší pri vode, v kuchyni alebo na krátkom výlete mimo mesta. Rád plánujem jednoduché aktivity, ktoré sa dajú zvládnuť aj po práci, a cez víkend pokojne niečo dlhšie. Hľadám ľudí, s ktorými sa dá rozprávať otvorene a tráviť čas bez tlaku.",
    photos: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "kajak", name: "Kajak" },
      { id: "varenie", name: "Varenie" },
      { id: "vylety", name: "Výlety" },
      { id: "voda", name: "Voda" },
      { id: "prechadzky", name: "Prechádzky" },
    ],
  },
  {
    id: "mock-profile-tereza",
    name: "Tereza",
    age: "30 rokov",
    meta: ["Bratislava", "5 km", "Tanec a cestovanie"],
    photo:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85",
    bio: "Rada tancujem, cestujem a učím sa nové veci, aj keď ide len o nový recept alebo trasu domov. Mám rada ľudí, ktorí sú srdeční, dochvíľni a vedia sa tešiť z malých plánov. Hľadám nové kontakty na kultúru, šport aj pokojné kávové rozhovory.",
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=900&q=85",
    ],
    tags: [
      { id: "tanec", name: "Tanec" },
      { id: "cestovanie", name: "Cestovanie" },
      { id: "kultura", name: "Kultúra" },
      { id: "sport", name: "Šport" },
      { id: "kava", name: "Káva" },
    ],
  },
];

export const mockIncomingLikePersonPreviewIds = new Set([
  "mock-profile-nina",
  "mock-profile-ela",
  "mock-profile-marek",
  "mock-profile-lucia",
  "mock-profile-peter",
  "mock-profile-veronika",
  "mock-profile-adam",
  "mock-profile-michaela",
  "mock-profile-jan",
  "mock-profile-zuzana",
  "mock-profile-robert",
  "mock-profile-katarina",
  "mock-profile-daniel",
  "mock-profile-emilia",
  "mock-profile-martin",
  "mock-profile-tereza",
]);

export const mockInitialChatMatchIds = [
  "mock-profile-nina",
  "mock-profile-ela",
  "mock-profile-marek",
  "mock-profile-lucia",
  "mock-profile-peter",
  "mock-profile-veronika",
  "mock-profile-adam",
  "mock-profile-michaela",
  "mock-profile-jan",
  "mock-profile-zuzana",
  "mock-profile-robert",
  "mock-profile-katarina",
  "mock-profile-daniel",
  "mock-profile-emilia",
  "mock-profile-martin",
  "mock-profile-tereza",
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
