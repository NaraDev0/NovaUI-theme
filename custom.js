/* ================================================================
   JELLYFIN CUSTOM JAVASCRIPT
   Fonctionnalités : Horloge, Accueil Dynamique, Webhook Discord, Smart Focus
   ================================================================ */

// Récupère l'URL secrète définie localement dans Jellyfin
const WEBHOOK_URL = window.DISCORD_WEBHOOK_URL;
let currentUserName = ""; // Stocke le nom de l'utilisateur pour ne pas spammer le serveur

// --- 1. HORLOGE ET MESSAGE D'ACCUEIL ---
function injectHeaderElements() {
    let headerRight = document.querySelector('.headerRight');
    let headerLeft = document.querySelector('.headerLeft');

    // Ajout de l'horloge
    if (headerRight && !document.querySelector('.custom-clock')) {
        let clock = document.createElement('div');
        clock.className = 'custom-clock headerButton';
        clock.style.cssText = 'display: flex; align-items: center; font-weight: 600; font-size: 1.1rem; margin-right: 15px; color: white; text-shadow: 0 0 5px rgba(0,0,0,0.5);';
        headerRight.prepend(clock);

        setInterval(() => {
            clock.innerHTML = new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'});
        }, 1000);
    }

    // Ajout du message personnalisé
    if (headerLeft && !document.querySelector('.custom-greeting')) {
        let greeting = document.createElement('div');
        greeting.className = 'custom-greeting';
        greeting.style.cssText = 'font-weight: 500; margin-left: 20px; font-size: 1.1rem; color: #e5e5e5; display: none;';
        headerLeft.appendChild(greeting);

        let updateGreeting = () => {
            let hour = new Date().getHours();
            let text = "Bon visionnage";
            if (hour >= 5 && hour < 12) text = "Bonjour";
            else if (hour >= 12 && hour < 18) text = "Bon après-midi";
            else if (hour >= 18 && hour < 23) text = "Bonne soirée";
            else text = "Bonne nuit";

            // Récupération dynamique du nom du profil connecté
            if (currentUserName) {
                greeting.innerText = text + ", " + currentUserName;
            } else if (window.ApiClient && typeof window.ApiClient.getCurrentUser === 'function') {
                window.ApiClient.getCurrentUser().then(user => {
                    if (user && user.Name) {
                        currentUserName = user.Name;
                        greeting.innerText = text + ", " + currentUserName;
                    } else {
                        greeting.innerText = text;
                    }
                }).catch(() => { greeting.innerText = text; });
            } else {
                greeting.innerText = text;
            }
        };
        
        updateGreeting();
        setInterval(updateGreeting, 60000); // Met à jour l'heure toutes les minutes

        // Afficher uniquement sur grand écran
        if(window.innerWidth > 768) {
            greeting.style.display = 'block';
        }
    }
}

// --- 2. BOUTON SIGNALER UN PROBLÈME (DISCORD) ---
function injectReportButton() {
    let playBtn = document.querySelector('.btnPlay');
    
    // Si on trouve le bouton Lecture et qu'on n'a pas encore ajouté le nôtre
    if (playBtn && playBtn.parentElement && !document.querySelector('.btn-report-discord')) {
        let detailButtonsContainer = playBtn.parentElement;

        let reportBtn = document.createElement('button');
        reportBtn.className = 'btn-report-discord raised detailButton emby-button';
        reportBtn.innerHTML = '<i class="material-icons" style="margin-right: 5px;">report_problem</i> Signaler';
        
        reportBtn.style.cssText = 'background: #e50914 !important; color: white !important; border-radius: 4px !important; padding: 10px 15px !important; font-weight: bold !important; display: flex !important; align-items: center !important; margin-left: 15px !important; border: none !important; cursor: pointer !important; transition: transform 0.2s !important;';
        
        reportBtn.onmouseover = () => reportBtn.style.transform = 'scale(1.05)';
        reportBtn.onmouseout = () => reportBtn.style.transform = 'scale(1)';

        reportBtn.onclick = () => {
            if (!WEBHOOK_URL) {
                alert("La fonction de signalement n'est pas configurée sur ce serveur.");
                return;
            }

            let mediaTitle = document.querySelector('.itemName')?.innerText || document.title;
            let reporterName = currentUserName ? currentUserName : "Un utilisateur"; // Le nom de celui qui clique
            
            if (confirm('Signaler un problème avec "' + mediaTitle + '" sur le serveur Discord ?')) {
                fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `⚠️ **Nouveau Signalement**\n**${reporterName}** a remonté un problème technique depuis Jellyfin concernant : **${mediaTitle}**`
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
        
        detailButtonsContainer.appendChild(reportBtn);
    }
}

// --- 3. SMART FOCUS (Rafraîchissement intelligent) ---
let lastHiddenTime = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
      lastHiddenTime = Date.now();
  } else {
      if (Date.now() - lastHiddenTime > 300000) {
          console.log("Retour après absence prolongée : Actualisation des médias.");
          window.location.reload(); 
      }
  }
});

// --- LANCEUR AUTOMATIQUE (Observer) ---
const observer = new MutationObserver(() => {
    injectHeaderElements();
    injectReportButton();
});
observer.observe(document.body, { childList: true, subtree: true });
