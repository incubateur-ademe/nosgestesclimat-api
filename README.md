# nosgestesclimat-api

API pour modèle Publicodes de Nos Gestes Climat.

## API

Schéma général de l'API :

```
https://nosgestesclimat-api.osc-fr1.scalingo.io/<version>/<langue>/<region>
```

Avec :

- `version` - la version du modèle à utiliser, (`latest` pour la
  dernière version)
- `langue` - la langue à utiliser (`fr` ou `en`)
- `region` - la région à utiliser (`FR`, `CA`, `BE`, `CH`, etc...)
- `/versions` : retourne l'ensemble des versions du modèle
- `/<version>` :retourne les langues et régions supportées par la
  version `<version>`
- `<version>/<langue>/personas` : retourne l'ensemble des personas du modèle
- `<version>/<langue>/<region>/rules/` - retourne l'ensemble des règles du modèle
- `<version>/<langue>/<region>/optim-rules/` - retourne l'ensemble des règles optimisées du modèle
- `<version>/<langue>/<region>/rules/<rule>` - retourne la règle `{rule}` du modèle

## Déploiement

Le déploiement est fait automatiquement par
[Scalingo](https://dashboard.scalingo.com/apps/osc-fr1/nosgestesclimat-api) à
chaque push sur la branche `main`.

> [!IMPORTANT]
> La mise à jours des version se fait via les GitHub Actions du dépôt
> [`nosgestesclimat`](https://github.com/incubateur-ademe/nosgestesclimat). En
> particulier, à chaque :
> - **nouvelle release de
>   [`nosgestesclimat`](https://github.com/incubateur-ademe/nosgestesclimat)**,
>   une nouvelle branche est créée dans ce dépôt avec le nouveau dossier
>   `data/<version>`. Il ne restera plus qu'à la merge dans `main` pour quelle
>   soit automatiquement déployée sur
>   [Scalingo](https://dashboard.scalingo.com/apps/osc-fr1/nosgestesclimat-api).
> - **push dans dans la branche `preprod` du dépôt
> [`nosgestesclimat`](https://github.com/incubateur-ademe/nosgestesclimat)**,
> la version `nightly` est automatiquement mise à jours dans `main` est
> déployée en prod.

## Développement

`npm` est utilisé comme gestionnaire de paquets avec
[`bun`](https://koajs.com/) comme runtime JS et
[`koa`](https://koajs.com/) comme framework web.

```bash
# Installation des dépendances
npm i

# Lancement du serveur de développement
npm run dev # ou bun dev

# Lancement du serveur de production
npm start # ou bun start
```

