# Base de donnée init.sql

- Truncate les tables pour repartir d'id = 0
- Création de table si elle n'existe pas
- Ajout de VARCHAR au lieu de texte pour controller la longueur de ce qui rentre
- Ajout de clé NOT NULL pour éviter les entrées vides
- Ajout de clé unique pour éviter les doublons
- Ajout de bigint pour éviter des problème au bout de 2 Milliards de facture
- Ajout d'un smallint pour éviter d'utiliser plus de mémoire que nécessaire
- Ajout de l'ip d'utilisateur ansi que created_at spour tracer 
- Changement de nom de colonne pour éviter les confusions de clé
- Ajout de contrainte pas nécessaire que vu d'implémentation backend mais c'est une bonne pratique attention à ne pas abuser ça peut ralentir les traitements 
- Implémentation RLS seulement un admin connecté en localhost peut modifier les tables relecture de documentation et recherche en ligne
- Chaque utilisateur ne voit et ne modifie que ses tables avec user_id

# Connection à la BDD

- Fichier db.js modifié pour mettre les informations contenu du .env Utiliser un mot de passe très fort à changer toutes les 3 semaines idéalement
- Ne pas utiliser un port connu et ne pas exposer le port
- Changer le fichier .conf pour ajouter plus de sécurité par rapport aux tentatives de connexion échoué

# Protection d'injection sql

- Mise en place de requête préparé
- sanitize inputs avec express-validator vérifier la longueur des chaines, le type, le fait que ça soit non null et surtout escape les caractères spéciaux pour éviter xss, sql attaque.
- Ne pas donner d'indication sur la saisie de crédential pour éviter aux hackers de cibler l'attaque

# Protection CSRF

- Mise en place de token CSRF pour l'envoie de données post

# Protection Cookie

- Pour éviter de se faire voler le cookie utilisateur par un tier mettre le cookie en secure, strict, httponly

# Protection Header

- Pas de fuite de nom de serveur Express
- Mise en place des header cors : Access-Control-Allow-Origin
	http://localhost:3000 pour restreindre tout chargement tier à ce domaine et éviter les requêtes venant d'autre page à ici
- Accepter seulement les requêtes GET et POST
- X-Frame-Options
	SAMEORIGIN ne pas autoriser les iframe ailleurs permet d'éviter des attaques ddos
- Content-Security-Policy
	default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
    permet de charger des fichier provenant seulement de ce site

# Protection bruteforce

- Utilisation de HMAC + sha384 pour signer
- Eviter d'utiliser des url évidents pour les endpoints admin pour éviter de les trouver

# Upload

- Vérification de taille de fichier
- Vérification d'extension
- Ne pas avoir de nom prédictible

Testes (bash ou batch pas de powershell):
```sh
curl -X POST https://localhost:3000/upload/img -H "Authorization: Bearer cookie_token" -F "file=@C:\path_to_file.png" -k
```

# JWT token

- Generation d'un mot de passe fort 256 bit (32 bytes) transformé en base64
```sh
openssl rand -base64 32
```
- Rectification de la fonction verify ajouté un algorithme HS384 pour ne pas falsifier la signature avec None et passer des données admins
- Ajouter un refresh token pour ne pas utiliser l'original qu'on utilise que en interne

# Package Ajouté

- dotenv gestion du .env
- cors pour les politiques cors
- helmet pour gérer le reste des header notamment pour le csp
- bcrypt pour hash de mot de passe 
- express-validator pour sécuriser les entrées envoyées
- nodemon pour recharger le serveur à chaque modification de fichier
- csrf-sync pour la gestion de token csrf
- express-session pour la gestion de session
- cookie-parser pour la gestion de cookie
- axios pour gérer les requêtes
- express-rate-limit pour limiter les requêtes

# Hébergement

- Sécuriser le firewall mettre des règles spécifique pour accepter les ip seulement sur le port 443 
- Mettre en place la redirection https éviter les attaques de type mitm
- N'accepter que les connexion http 2 ou 3 pour éviter le smuggling
- Bloquer des fichiers/dossier qui peuvent contenir des informations sensible par exemple dossier upload

# Testes

Tous les testes sont dans index décommentez la première fonction pour se connecter ensuite commenter le et décommentez les autres api pour afficher

# Note

Passage en https grosse perte de temps sur les csrf à cause des cookies j'ai passé des heures à debugger le problème venait de la session qui n'est pas store.
Pareil pour le rate limiting il faut un stockage pour l'ip et le nombre de tentative.

J'ai réglé le problème de csrf en faisant transiter la session dans la requête

Génerer certificat
```sh
openssl genrsa -out key.pem 2048
openssl req -new -x509 -key selfsigned.pem -out selfsigned.crt -days 365 -nodes 
```