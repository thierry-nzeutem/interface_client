# Guide de déploiement Hostinger - Prévéris

## 📋 Prérequis
- Compte Hostinger avec hébergement web
- Accès au panneau de contrôle Hostinger
- Application buildée (dossier `dist/`)

## 🔧 Étapes de déploiement

### 1. Build de l'application
```bash
npm run build
```
Cela génère le dossier `dist/` avec tous les fichiers optimisés.

### 2. Accès au panneau Hostinger
1. Connectez-vous à votre compte Hostinger
2. Allez dans **Hébergement** → **Gérer**
3. Ouvrez le **Gestionnaire de fichiers**

### 3. Upload des fichiers
1. Naviguez vers le dossier `public_html/` (ou le dossier racine de votre domaine)
2. **Supprimez** tous les fichiers existants (si c'est un nouveau site)
3. **Uploadez** tout le contenu du dossier `dist/` :
   - Sélectionnez tous les fichiers dans `dist/`
   - Glissez-déposez dans `public_html/`
   - Ou utilisez l'option "Upload" du gestionnaire

### 4. Configuration Apache (.htaccess)
Assurez-vous que le fichier `.htaccess` est présent dans `public_html/` avec ce contenu :
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

### 5. Vérification SSL
1. Dans le panneau Hostinger, allez dans **SSL**
2. Activez le **SSL gratuit** si ce n'est pas déjà fait
3. Forcez la redirection HTTPS

## 🌐 Structure finale sur le serveur
```
public_html/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── vite.svg
```

## ✅ Test de déploiement
1. Visitez votre domaine
2. Testez la navigation (les routes doivent fonctionner)
3. Vérifiez que les assets se chargent correctement
4. Testez sur mobile et desktop

## 🔧 Dépannage courant

### Problème : Page 404 sur les routes
**Solution** : Vérifiez que le fichier `.htaccess` est présent et correct

### Problème : Assets ne se chargent pas
**Solution** : Vérifiez que tous les fichiers du dossier `dist/assets/` sont uploadés

### Problème : Site lent
**Solution** : Activez la compression Gzip dans le panneau Hostinger

## 📱 Optimisations post-déploiement
1. **Compression** : Activez Gzip dans Hostinger
2. **Cache** : Configurez le cache des assets
3. **CDN** : Utilisez Cloudflare (gratuit) pour améliorer les performances
4. **Monitoring** : Configurez Google Analytics si nécessaire

## 🚀 Mise à jour de l'application
Pour les futures mises à jour :
1. `npm run build` localement
2. Remplacez le contenu de `public_html/` par le nouveau contenu de `dist/`
3. Videz le cache du navigateur pour tester

## 📞 Support
En cas de problème :
- Support Hostinger : Chat en ligne 24/7
- Documentation Hostinger : Base de connaissances complète