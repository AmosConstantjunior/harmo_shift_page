document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[action=""]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                sujet: document.getElementById('subject').value.trim(),
                messages: document.getElementById('message').value.trim()
            };
            
            // Validation côté client
            if (!formData.name || !formData.email || !formData.sujet || !formData.messages) {
                showMessage('Veuillez remplir tous les champs obligatoires', 'error');
                return;
            }
            
            if (!isValidEmail(formData.email)) {
                showMessage('Veuillez entrer une adresse email valide', 'error');
                return;
            }
            
            // Afficher un indicateur de chargement
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="lni lni-spinner-solid spinning"></i> Envoi en cours...';
            submitButton.disabled = true;
            
            try {
                // Envoyer les données au serveur
                const response = await fetch('https://gamosjunz.pythonanywhere.com/send_contact_message', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const result = await response.json();
                
                if (response.ok && result.status === 'completed') {
                    // Afficher le message de succès à la place du formulaire
                    showSuccessMessage(contactForm);
                } else {
                    // Afficher l'erreur
                    showMessage(result.error || 'Une erreur est survenue', 'error');
                    submitButton.innerHTML = originalButtonText;
                    submitButton.disabled = false;
                }
                
            } catch (error) {
                showMessage('Erreur de connexion au serveur', 'error');
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Fonction pour afficher des messages temporaires
    function showMessage(message, type) {
        // Supprimer les anciens messages
        const oldMessages = document.querySelectorAll('.form-message');
        oldMessages.forEach(msg => msg.remove());
        
        // Créer le nouveau message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}-message`;
        messageDiv.innerHTML = `
            <div class="alert alert-${type}">
                <i class="lni lni-${type === 'error' ? 'warning' : 'checkmark-circle'}"></i>
                ${message}
            </div>
        `;
        
        // Insérer après le formulaire ou dans le formulaire
        const form = document.querySelector('form[action=""]');
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
        
        // Supprimer après 5 secondes pour les messages d'erreur
        if (type === 'error') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }
    
    // Fonction pour remplacer le formulaire par un message de succès
   function showSuccessMessage(formElement) {
    const formContainer = formElement.parentNode;
    const originalFormHTML = formElement.outerHTML;
    
    // Créer le message de succès
    const successHTML = `
        <div class="success-message-container text-center">
            <div class="success-icon">
                <i class="lni lni-checkmark-circle" style="font-size: 60px; color: #28a745;"></i>
            </div>
            <h3 class="mt-4" style="color: #28a745;">Message envoyé avec succès !</h3>
            <p class="mb-4">Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.</p>
            <div class="d-flex justify-content-center gap-3 mt-4">
                <button id="send-new-message" class="button">
                    <i class="lni lni-plus"></i> Nouveau message
                </button>
                <button id="close-message" class="button" style="background: #6c757d;">
                    <i class="lni lni-close"></i> Fermer
                </button>
            </div>
        </div>
    `;
    
    // Remplacer le formulaire par le message de succès
    formContainer.innerHTML = successHTML;
    
    // Bouton "Nouveau message" - réaffiche le formulaire
    document.getElementById('send-new-message').addEventListener('click', function() {
        formContainer.innerHTML = originalFormHTML;
        // Réattacher les événements
        setTimeout(() => {
            const newForm = formContainer.querySelector('form[action=""]');
            if (newForm) {
                newForm.addEventListener('submit', arguments.callee);
            }
        }, 100);
    });
    
    // Bouton "Fermer" - supprime le message
    document.getElementById('close-message').addEventListener('click', function() {
        formContainer.innerHTML = originalFormHTML;
        // Réattacher les événements
        setTimeout(() => {
            const newForm = formContainer.querySelector('form[action=""]');
            if (newForm) {
                newForm.addEventListener('submit', arguments.callee);
            }
        }, 100);
    });
}
});

// Ajouter du CSS pour l'animation de chargement
const style = document.createElement('style');
style.textContent = `
    .spinning {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .form-message {
        margin: 20px 0;
        animation: fadeIn 0.3s ease-in;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .error-message .alert {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
        padding: 12px 20px;
        border-radius: 5px;
    }
    .success-message-container {
        padding: 40px 20px;
        background: #f8fff9;
        border: 2px dashed #28a745;
        border-radius: 10px;
        animation: fadeIn 0.5s ease-in;
    }
`;
document.head.appendChild(style);
