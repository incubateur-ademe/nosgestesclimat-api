# nosgestesclimat-api

API pour modèle Publicodes de Nos Gestes Climat.

## API

Schéma général de l'API :

```
https://data.nosgestesclimat.fr/<version>/<langue>/<region>
```

Avec :

- `version` - la version du modèle à utiliser, (`latest` pour la
  dernière version)
- `langue` - la langue à utiliser (`fr` ou `en`)
- `region` - la région à utiliser (`FR`, `CA`, `BE`, `CH`, etc...)
- `/versions` : retourne l'ensemble des versions du modèle
- `/versions/{version}` :retourne les langues et régions supportées par la
  version `{version}`
- `<version>/personas` : retourne l'ensemble des personas du modèle
- `<version>/<langue>/<region>/rules/` - retourne l'ensemble des règles du modèle
- `<version>/<langue>/<region>/optim-rules/` - retourne l'ensemble des règles optimisées du modèle
- `<version>/<langue>/<region>/rules/<rule>` - retourne la règle `{rule}` du modèle

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

## Déploiement

Le déploiement est fait automatiquement par
[Scalingo](https://scalingo.com/) à chaque push sur la branche `main`.
