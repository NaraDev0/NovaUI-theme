# 🎬 Nova UI - Jellyfin Premium Theme

Une refonte visuelle complète pour Jellyfin, pensée pour offrir une expérience premium proche des plateformes de streaming modernes (Netflix, Apple TV). Ce thème est construit sur les bases solides d'[Ultrachromic](https://github.com/CTalvio/Ultrachromic), avec de nombreuses optimisations sur-mesure et des fonctionnalités intelligentes exclusives.

## ✨ Fonctionnalités CSS

* 🪟 **Design Glassmorphism :** Barre de navigation et menus semi-transparents avec effet de flou.
* 💫 **Animations Fluides :** * Zoom et halo lumineux (Glow effect) au survol des affiches.
  * Effet *Ken Burns* (zoom lent) en arrière-plan de la page de connexion.
* 🧼 **Interface Épurée :**
  * Typographie moderne et lisible (`Poppins`).
  * Sous-titres repensés (disparition du fond noir, ajout d'une ombre portée douce).
  * Masquage des éléments superflus (boutons Cast et Aide) pour un look "Clean UI".
* 📱 **100% Responsive :** Navigation optimisée et fluide sur PC, tablette et mobile.

## 🧠 Fonctionnalités Intelligentes (JavaScript)

Nova UI propose également un script additionnel pour booster votre serveur automatisé :
* 🕰️ **Expérience Smart TV :** Affichage d'une horloge en temps réel et d'un message d'accueil dynamique selon l'heure de la journée.
* 🚨 **Signalement Discord :** Bouton intégré aux fiches de films/séries pour signaler un problème technique directement sur un Webhook Discord.
* ⚡ **Smart Focus :** Actualisation douce et automatique de la page lors du retour sur l'onglet après une absence prolongée (idéal avec Radarr/Sonarr).

## 🔌 Compatibilité Addons

Ce thème intègre des correctifs natifs pour s'adapter parfaitement aux meilleurs plugins de la communauté :
* **JellyFlare :** Repositionnement de la bannière sous le header.
* **Intro Skipper :** Bouton flottant type Netflix, stylisé et animé.
* **Media Bar :** Harmonisation des bordures avec le design global.
* **Home Screen Sections :** Intégration fluide dans la page d'accueil.

## 📸 Aperçu

![Accueil](https://media.discordapp.net/attachments/1453117739760877641/1483453599899193374/image.png?ex=69baa553&is=69b953d3&hm=73d744705092281acc74af348ee22fa8825ae5ba6c245fc6c937ee5ed0b9be1c&=&format=webp&quality=lossless&width=2230&height=1088)
![Page de Connexion](https://media.discordapp.net/attachments/1453117739760877641/1483454905317593199/connexion.png?ex=69baa68a&is=69b9550a&hm=4e9d8b13f905f7dd3ff353be99ad31c0afb497ba3aef4de468a79c01e2289c8a&=&format=webp&quality=lossless&width=2230&height=1088)

## 🚀 Installation rapide

### 1. Installer le Design (CSS)
La méthode la plus simple est d'importer le fichier CSS directement depuis votre serveur Jellyfin.
1. Allez dans **Tableau de bord** > **Général**
2. Descendez jusqu'à la section **CSS personnalisé (Custom CSS)**
3. Copiez et collez la ligne suivante : 

```
@import url('[https://cdn.jsdelivr.net/gh/NaraDev0/NovaUI-theme@main/style.css](https://cdn.jsdelivr.net/gh/NaraDev0/NovaUI-theme@main/style.css)');
```
4. Cliquez sur **Sauvegarder** et videz le cache de votre navigateur (`Ctrl + F5` ou `Cmd + Shift + R`).

### 2. Installer les Fonctionnalités Intelligentes (JavaScript - Optionnel)
Nécessite le plugin [**JavaScript Injector**](https://github.com/n00bcodr/Jellyfin-JavaScript-Injector) installé sur votre serveur Jellyfin.
1. Allez dans **Tableau de bord** > **Plugins** > **JavaScript Injector**
2. Ajoutez un nouveau script, configurez-le sur **Global** (toutes les pages).
3. Copiez et collez le code suivant *(N'oubliez pas d'ajouter l'URL de votre Webhook si vous souhaitez utiliser le bouton de signalement)* :

```
// Remplacez l'URL par votre propre Webhook Discord (laissez vide si vous ne l'utilisez pas)
window.DISCORD_WEBHOOK_URL = '[https://discord.com/api/webhooks/VOTRE_ID/VOTRE_TOKEN](https://discord.com/api/webhooks/VOTRE_ID/VOTRE_TOKEN)';

let script = document.createElement('script');
script.src = '[https://cdn.jsdelivr.net/gh/NaraDev0/NovaUI-theme@main/custom.js](https://cdn.jsdelivr.net/gh/NaraDev0/NovaUI-theme@main/custom.js)';
document.head.appendChild(script);
```
4. Cliquez sur **Sauvegarder** et actualisez la page.

## 🤝 Crédits

* Architecture de base issue de l'excellent thème [Ultrachromic](https://github.com/CTalvio/Ultrachromic) par CTalvio.
* Modifications, UI Premium et intégration des scripts par [NaraDev0](https://github.com/NaraDev0).
