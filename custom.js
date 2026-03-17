/* ================================================================
   JELLYFIN CUSTOM JAVASCRIPT
   Fonctionnalités : Horloge, Accueil, Webhook Discord Sécurisé, Smart Focus
   ================================================================ */

// Récupère l'URL secrète définie localement dans le plugin JavaScript Injector de ton serveur
const WEBHOOK_URL = window.DISCORD_WEBHOOK_URL;

// --- 1. HORLOGE ET MESSAGE D'ACCUEIL ---
function injectHeaderElements() {
    let headerRight = document.querySelector('.headerRight');
    let headerLeft = document.querySelector('.headerLeft');

    // Ajout de l'horloge (en haut à droite)
    if (headerRight && !document.querySelector('.custom-clock')) {
        let clock = document.createElement('div');
        clock.className = 'custom-clock headerButton';
        clock.style.cssText = 'display: flex; align-items: center; font-weight: 600; font-size: 1.1rem; margin-right: 15px; color: white; text-shadow: 0 0 5px rgba(0,0,0,0.5);';
        headerRight.prepend(clock);

        setInterval(() => {
            clock.innerHTML = new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
        }, 1000);
    }

    // Ajout du message personnalisé (en haut à gauche)
    if (headerLeft && !document.querySelector('.custom-greeting')) {
        let greeting = document.createElement('div');
        greeting.className = 'custom-greeting';
        greeting.style.cssText = 'font-weight: 500; margin-left: 20px; font-size: 1.1rem; color: #e5e5e5; display: none;';
        headerLeft.appendChild(greeting);

        let updateGreeting = () => {
            let hour = new Date().getHours();
            let text = "Bon visionnage, Mikaël";
            if (hour >= 5 && hour < 12) text = "Bonjour, Mikaël";
            else if (hour >= 12 && hour < 18) text = "Bon après-midi, Mikaël";
            else if (hour >= 18 && hour < 23) text = "Bonne soirée, Mikaël";
            else text = "Bonne nuit, Mikaël";
            greeting.innerText = text;
        };
        
        updateGreeting();
        setInterval(updateGreeting, 60000); // Met à jour toutes les minutes

        // Afficher uniquement sur grand écran pour ne pas casser l'interface mobile
        if(window.innerWidth > 768) {
            greeting.style.display = 'block';
        }
    }
}

// --- 2. BOUTON SIGNALER UN PROBLÈME (DISCORD) ---
function injectReportButton() {
    // On cherche le bouton "Lecture" au lieu du conteneur parent
    let playBtn = document.querySelector('.btnPlay');
    
    // Si on trouve le bouton Lecture et qu'on n'a pas encore ajouté le nôtre
    if (playBtn && playBtn.parentElement && !document.querySelector('.btn-report-discord')) {
        let detailButtonsContainer = playBtn.parentElement; // On s'accroche au même niveau que le bouton Play

        let reportBtn = document.createElement('button');
        reportBtn.className = 'btn-report-discord raised detailButton emby-button';
        reportBtn.innerHTML = '<i class="material-icons" style="margin-right: 5px;">report_problem</i> Signaler';
        
        // Style du bouton
        reportBtn.style.cssText = 'background: #e50914 !important; color: white !important; border-radius: 4px !important; padding: 10px 15px !important; font-weight: bold !important; display: flex !important; align-items: center !important; margin-left: 15px !important; border: none !important; cursor: pointer !important; transition: transform 0.2s !important;';
        
        reportBtn.onmouseover = () => reportBtn.style.transform = 'scale(1.05)';
        reportBtn.onmouseout = () => reportBtn.style.transform = 'scale(1)';

        reportBtn.onclick = () => {
            // Sécurité : Vérifie si le Webhook a bien été configuré en local
            if (!WEBHOOK_URL) {
                alert("La fonction de signalement n'est pas configurée sur ce serveur.");
                return;
            }

            let mediaTitle = document.querySelector('.itemName')?.innerText || document.title;
            
            if (confirm('Signaler un problème avec "' + mediaTitle + '" sur le serveur Discord ?')) {
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `⚠️ **Nouveau Signalement**\nMikaël, un problème technique a été remonté depuis Jellyfin concernant : **${mediaTitle}**`
                    })
                }).then(response => {
                    if(response.ok) alert('Le signalement a bien été envoyé sur Discord !');
                    else alert('Erreur lors de l\'envoi (vérifie l\'URL du Webhook).');
                }).catch(err => {
                    alert('Erreur lors de la connexion à Discord.');
                    console.error(err);
                });
            }
        };
        
        // On l'ajoute à la fin de la rangée de boutons (après les favoris, etc.)
        detailButtonsContainer.appendChild(reportBtn);
    }
}

// --- 3. SMART FOCUS (Rafraîchissement intelligent) ---
let lastHiddenTime = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
      lastHiddenTime = Date.now();
  } else {
      // Si on revient sur l'onglet après plus de 5 minutes (300000 millisecondes)
      if (Date.now() - lastHiddenTime > 300000) {
          console.log("Retour après absence prolongée : Actualisation des médias.");
          window.location.reload(); 
      }
  }
});

// --- LANCEUR AUTOMATIQUE (Observer) ---
// Détecte les changements de page dans Jellyfin pour réinjecter les éléments si besoin
const observer = new MutationObserver(() => {
    injectHeaderElements();
    injectReportButton();
});
observer.observe(document.body, { childList: true, subtree: true });
