# Termegs.cloud

Termékkezelő rendszer a Termegs számára.

## Funkciók

- Termékek kezelése (létrehozás, módosítás, törlés)
- Magyar és cseh nyelvű terméknevek kezelése
- Képfeltöltés és kezelés
- Különböző kiszerelések kezelése (kapszula, folyadék)

## Technológiák

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Adatbázis: MongoDB Atlas
- Hosting: Netlify (frontend), Render (backend)

## Telepítés

1. Klónozd le a repository-t:
```bash
git clone [repository URL]
```

2. Telepítsd a függőségeket:
```bash
cd backend
npm install
```

3. Állítsd be a környezeti változókat:
- Hozz létre egy `.env` fájlt a backend mappában
- Add meg a szükséges környezeti változókat (lásd: `.env.example`)

4. Indítsd el a szervert:
```bash
npm start
```

## Környezeti változók

- `MONGODB_URI`: MongoDB Atlas connection string
- `PORT`: A szerver portja (alapértelmezett: 3000)

## Fejlesztői dokumentáció

### API Végpontok

- `GET /products`: Összes termék lekérése
- `POST /products`: Új termék létrehozása
- `GET /products/:id`: Egy termék lekérése
- `PUT /products/:id`: Termék módosítása
- `DELETE /products/:id`: Termék törlése 