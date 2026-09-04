from __future__ import annotations

# ruff: noqa: E501

from dataclasses import dataclass

import psycopg
from psycopg.rows import dict_row

from app.shared.auth.passwords import hash_password
from app.shared.config.settings import get_settings


@dataclass(frozen=True)
class SeedProfile:
    nickname: str
    email: str
    birth_date: str
    location: str
    latitude: float
    longitude: float
    bio: str
    photos: list[str]
    interests: list[str]


MIRKO = SeedProfile(
    nickname="mirko",
    email="mirko@priatelia.local",
    birth_date="1994-05-16",
    location="Bratislava, Slovensko",
    latitude=48.1486,
    longitude=17.1077,
    bio=(
        "Rád spoznávam ľudí cez pokojné rozhovory, výlety a dobré jedlo. "
        "Cez týždeň chodím na prechádzky po meste a cez víkend rád vypadnem do "
        "prírody. Hľadám ľudí, s ktorými sa dá tráviť čas prirodzene a bez tlaku."
    ),
    photos=[
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    ],
    interests=["turistika", "kava", "varenie", "vylety"],
)


CONNECTIONS = [
    SeedProfile(
        nickname="lucia-dev",
        email="lucia-dev@priatelia.local",
        birth_date="1998-03-14",
        location="Bratislava, Slovensko",
        latitude=48.1517,
        longitude=17.1093,
        bio=(
            "Po práci najradšej vypínam pri joge, knihách alebo dlhej prechádzke "
            "pri Dunaji. Baví ma spoznávať ľudí, ktorí majú pokojné tempo a vedia "
            "sa rozprávať aj o obyčajných veciach. Rada varím pre kamarátov a "
            "hľadám nové miesta, kam sa dá ísť bez veľkého plánovania."
        ),
        photos=[
            "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["knihy", "varenie", "kava", "vylety"],
    ),
    SeedProfile(
        nickname="peter-dev",
        email="peter-dev@priatelia.local",
        birth_date="1992-11-22",
        location="Pezinok, Slovensko",
        latitude=48.2899,
        longitude=17.2666,
        bio=(
            "Cez týždeň veľa sedím pri počítači, takže voľný čas najradšej trávim "
            "vonku na bicykli alebo v kuchyni. Mám rád výlety do Malých Karpát, "
            "dobré jedlo a rozhovory bez potreby stále niečo dokazovať. Hľadám "
            "ľudí na spoločné aktivity aj pokojné večery pri filme."
        ),
        photos=[
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["bicykel", "varenie", "vylety", "kino"],
    ),
    SeedProfile(
        nickname="veronika-dev",
        email="veronika-dev@priatelia.local",
        birth_date="2000-07-09",
        location="Senec, Slovensko",
        latitude=48.2195,
        longitude=17.4004,
        bio=(
            "Najlepšie sa cítim pri vode, či už ide o plávanie alebo len pokojné "
            "sedenie pri jazere. Rada cestujem ľahko, bez presného programu, a "
            "skúšam malé lokálne podniky. Teší ma, keď stretnem človeka, ktorý vie "
            "byť spontánny, ale zároveň spoľahlivý."
        ),
        photos=[
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["plavanie", "cestovanie", "bistra", "vylety"],
    ),
    SeedProfile(
        nickname="adam-dev",
        email="adam-dev@priatelia.local",
        birth_date="1996-01-27",
        location="Bratislava, Slovensko",
        latitude=48.1461,
        longitude=17.1188,
        bio=(
            "Veľa energie mi dáva hudba, beh a ľudia, ktorí sa vedia zasmiať aj po "
            "náročnom dni. Chodím na menšie koncerty, rád skúšam nové trasy v meste "
            "a občas organizujem spoločné večere. Hľadám niekoho, kto má chuť niekam "
            "vyraziť, ale ocení aj pokojný večer doma."
        ),
        photos=[
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["koncerty", "beh", "jedlo", "vylety"],
    ),
    SeedProfile(
        nickname="michaela-dev",
        email="michaela-dev@priatelia.local",
        birth_date="1993-09-18",
        location="Modra, Slovensko",
        latitude=48.3335,
        longitude=17.3076,
        bio=(
            "Vo voľnom čase chodím do keramického ateliéru, na trhy a na nenáročné "
            "túry. Mám rada miesta, kde sa dá rozprávať bez hluku a bez ponáhľania. "
            "Hľadám nových ľudí, s ktorými sa dá naplánovať výlet, káva alebo "
            "spoločné tvorivé popoludnie."
        ),
        photos=[
            "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["turistika", "kava", "vystavy", "fotografia"],
    ),
    SeedProfile(
        nickname="jan-dev",
        email="jan-dev@priatelia.local",
        birth_date="1989-12-04",
        location="Bratislava, Slovensko",
        latitude=48.1549,
        longitude=17.0646,
        bio=(
            "Rád chodím do kina, na vedomostné večery a na večere s priateľmi. Som "
            "skôr pokojný typ, ale baví ma spoznávať ľudí cez spoločné zážitky a "
            "dobrý humor. Najviac si rozumiem s ľuďmi, ktorí sú zvedaví a vedia "
            "počúvať."
        ),
        photos=[
            "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["kino", "jedlo", "knihy", "kava"],
    ),
    SeedProfile(
        nickname="zuzana-dev",
        email="zuzana-dev@priatelia.local",
        birth_date="1997-06-30",
        location="Trnava, Slovensko",
        latitude=48.3774,
        longitude=17.5872,
        bio=(
            "Ráno rada behám a večer si púšťam podcasty alebo varím niečo nové. Mám "
            "rada úprimných ľudí, ktorí si vedia nájsť čas aj mimo obrazoviek. "
            "Chcela by som spoznať partiu na výlety, šport aj pokojné rozhovory pri "
            "káve."
        ),
        photos=[
            "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["podcasty", "beh", "varenie", "kava"],
    ),
    SeedProfile(
        nickname="robert-dev",
        email="robert-dev@priatelia.local",
        birth_date="1991-02-11",
        location="Nitra, Slovensko",
        latitude=48.3061,
        longitude=18.0764,
        bio=(
            "Fotím krajinu, chodím do hôr a rád objavujem miesta, kde nie je veľa "
            "ľudí. Vo vzťahoch aj priateľstvách oceňujem spoľahlivosť, humor a "
            "schopnosť povedať veci priamo. Hľadám ľudí na výlety, fotenie alebo "
            "len dobrý rozhovor po práci."
        ),
        photos=[
            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["fotografia", "turistika", "vylety", "knihy"],
    ),
    SeedProfile(
        nickname="katarina-dev",
        email="katarina-dev@priatelia.local",
        birth_date="1995-10-06",
        location="Bratislava, Slovensko",
        latitude=48.1607,
        longitude=17.1394,
        bio=(
            "Chodím do divadla, čítam súčasnú literatúru a rada objavujem pokojné "
            "čajovne. Nepotrebujem veľké gestá, viac ma baví pozornosť v bežných "
            "veciach a rozhovor, ktorý prirodzene plynie. Hľadám ľudí na kultúru, "
            "prechádzky a občasné víkendové výlety."
        ),
        photos=[
            "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["caj", "knihy", "vystavy", "vylety"],
    ),
    SeedProfile(
        nickname="daniel-dev",
        email="daniel-dev@priatelia.local",
        birth_date="1999-04-21",
        location="Bratislava, Slovensko",
        latitude=48.1348,
        longitude=17.1137,
        bio=(
            "Po práci chodím liezť, cez víkendy rád cestujem vlakom a hľadám dobrú "
            "kávu v nových mestách. Som praktický človek, ktorý má rád jasné dohody "
            "a nekomplikovanú komunikáciu. Rád spoznám niekoho na šport, výlet "
            "alebo spoločné varenie."
        ),
        photos=[
            "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["lezenie", "kava", "cestovanie", "varenie"],
    ),
    SeedProfile(
        nickname="emilia-dev",
        email="emilia-dev@priatelia.local",
        birth_date="2001-08-25",
        location="Bratislava, Slovensko",
        latitude=48.1498,
        longitude=17.1327,
        bio=(
            "Študujem dizajn, chodím na výstavy a najradšej spoznávam mesto cez "
            "malé podniky a galérie. Mám rada ľudí, ktorí sú tvoriví, otvorení a "
            "neberú sa príliš vážne. Rada by som našla niekoho na spoločné "
            "objavovanie kultúry aj obyčajné prechádzky."
        ),
        photos=[
            "https://images.unsplash.com/photo-1524503033411-c9566986fc8f?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["dizajn", "vystavy", "bistra", "kava"],
    ),
    SeedProfile(
        nickname="martin-dev",
        email="martin-dev@priatelia.local",
        birth_date="1992-05-12",
        location="Hainburg an der Donau, Rakúsko",
        latitude=48.1460,
        longitude=16.9456,
        bio=(
            "Som najspokojnejší pri vode, v kuchyni alebo na krátkom výlete mimo "
            "mesta. Rád plánujem jednoduché aktivity, ktoré sa dajú zvládnuť aj po "
            "práci, a cez víkend pokojne niečo dlhšie. Hľadám ľudí, s ktorými sa dá "
            "rozprávať otvorene a tráviť čas bez tlaku."
        ),
        photos=[
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["varenie", "vylety", "plavanie", "turistika"],
    ),
    SeedProfile(
        nickname="tereza-dev",
        email="tereza-dev@priatelia.local",
        birth_date="1996-12-19",
        location="Bratislava, Slovensko",
        latitude=48.1712,
        longitude=17.1893,
        bio=(
            "Rada tancujem, cestujem a učím sa nové veci, aj keď ide len o nový "
            "recept alebo trasu domov. Mám rada ľudí, ktorí sú srdeční, dochvíľni a "
            "vedia sa tešiť z malých plánov. Hľadám nové kontakty na kultúru, šport "
            "aj pokojné kávové rozhovory."
        ),
        photos=[
            "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
        ],
        interests=["cestovanie", "varenie", "kava", "koncerty"],
    ),
]


def upsert_user(cursor: psycopg.Cursor, profile: SeedProfile) -> str:
    cursor.execute(
        """
        INSERT INTO users (nickname, email, password_hash, status)
        VALUES (%s, %s, %s, 'active')
        ON CONFLICT (nickname) DO UPDATE
        SET email = EXCLUDED.email,
            password_hash = EXCLUDED.password_hash,
            status = 'active',
            updated_at = now()
        RETURNING id
        """,
        (profile.nickname, profile.email, hash_password("heslo123")),
    )
    user_id = cursor.fetchone()["id"]

    cursor.execute(
        """
        INSERT INTO profiles
            (user_id, birth_date, location, latitude, longitude, bio)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON CONFLICT (user_id) DO UPDATE
        SET birth_date = EXCLUDED.birth_date,
            location = EXCLUDED.location,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            bio = EXCLUDED.bio,
            updated_at = now()
        """,
        (
            user_id,
            profile.birth_date,
            profile.location,
            profile.latitude,
            profile.longitude,
            profile.bio,
        ),
    )

    cursor.execute("DELETE FROM profile_photos WHERE user_id = %s", (user_id,))
    for position, photo_url in enumerate(profile.photos):
        cursor.execute(
            """
            INSERT INTO profile_photos
                (id, user_id, name, url, is_primary, position)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                f"seed-{profile.nickname}-photo-{position}",
                user_id,
                f"{profile.nickname}-{position + 1}.jpg",
                photo_url,
                position == 0,
                position,
            ),
        )

    cursor.execute("DELETE FROM profile_interests WHERE user_id = %s", (user_id,))
    for position, interest_id in enumerate(profile.interests):
        cursor.execute(
            """
            INSERT INTO profile_interests (user_id, interest_id, position)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id, interest_id) DO NOTHING
            """,
            (user_id, interest_id, position),
        )

    return str(user_id)


def create_match(cursor: psycopg.Cursor, user_id: str, other_user_id: str) -> str:
    cursor.execute(
        """
        INSERT INTO matches (first_user_id, second_user_id)
        VALUES (LEAST(%s::uuid, %s::uuid), GREATEST(%s::uuid, %s::uuid))
        ON CONFLICT (first_user_id, second_user_id) DO UPDATE
        SET first_user_id = EXCLUDED.first_user_id
        RETURNING id
        """,
        (user_id, other_user_id, user_id, other_user_id),
    )
    return str(cursor.fetchone()["id"])


def main() -> None:
    settings = get_settings()
    seed_match_ids: list[str] = []

    with psycopg.connect(settings.database_url, row_factory=dict_row) as connection:
        with connection.cursor() as cursor:
            mirko_id = upsert_user(cursor, MIRKO)
            cursor.execute(
                """
                INSERT INTO discovery_settings
                    (user_id, age_from, age_to, location, latitude, longitude, radius_km)
                VALUES (%s, 18, 99, %s, %s, %s, 50)
                ON CONFLICT (user_id) DO UPDATE
                SET age_from = 18,
                    age_to = 99,
                    location = EXCLUDED.location,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude,
                    radius_km = 50,
                    updated_at = now()
                """,
                (mirko_id, MIRKO.location, MIRKO.latitude, MIRKO.longitude),
            )

            for profile in CONNECTIONS:
                other_user_id = upsert_user(cursor, profile)
                seed_match_ids.append(create_match(cursor, mirko_id, other_user_id))

            cursor.execute(
                "DELETE FROM match_views WHERE user_id = %s AND match_id = ANY(%s)",
                (mirko_id, seed_match_ids),
            )

        connection.commit()

    print(
        f"Seeded {len(CONNECTIONS)} new connections for mirko. "
        "Login: mirko / heslo123"
    )


if __name__ == "__main__":
    main()
