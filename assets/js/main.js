
(function() {

    /* ====================
    Preloader
    ======================= */
	window.onload = function () {
		window.setTimeout(fadeout, 300);
	}

	function fadeout() {
		document.querySelector('.preloader').style.opacity = '0';
		document.querySelector('.preloader').style.display = 'none';
	}

    // =========== sticky menu 
    window.onscroll = function () {
        var header_navbar = document.querySelector(".hero-section-wrapper-5 .header");
        var sticky = header_navbar.offsetTop;

        if (window.pageYOffset > sticky) {
            header_navbar.classList.add("sticky");
        } else {
            header_navbar.classList.remove("sticky");
        }

        // show or hide the back-top-top button
        var backToTo = document.querySelector(".scroll-top");
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            backToTo.style.display = "flex";
        } else {
            backToTo.style.display = "none";
        }
    };

      // header-6  toggler-icon
      let navbarToggler6 = document.querySelector(".header-6 .navbar-toggler");
      var navbarCollapse6 = document.querySelector(".header-6 .navbar-collapse");

      document.querySelectorAll(".header-6 .page-scroll").forEach(e =>
          e.addEventListener("click", () => {
              navbarToggler6.classList.remove("active");
              navbarCollapse6.classList.remove('show')
          })
      );
      navbarToggler6.addEventListener('click', function() {
          navbarToggler6.classList.toggle("active");
      })


    // section menu active
	function onScroll(event) {
		var sections = document.querySelectorAll('.page-scroll');
		var scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

		for (var i = 0; i < sections.length; i++) {
			var currLink = sections[i];
			var val = currLink.getAttribute('href');
			var refElement = document.querySelector(val);
			var scrollTopMinus = scrollPos + 73;
			if (refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
				document.querySelector('.page-scroll').classList.remove('active');
				currLink.classList.add('active');
			} else {
				currLink.classList.remove('active');
			}
		}
	};

    window.document.addEventListener('scroll', onScroll);
    

    // ===== pricing-style-4 slider
    // tns({
    //     container: '.pricing-active',
    //     autoplay: false,
    //     mouseDrag: true,
    //     gutter: 0,
    //     nav: false,
    //     controls: true,
    //     controlsText: [
    //       '<i class="lni lni-chevron-left prev"></i>',
    //       '<i class="lni lni-chevron-right prev"></i>',
    //     ],
    //     responsive: {
    //       0: {
    //         items: 1,
    //       },
    //       768: {
    //         items: 2,
    //       },
    //       992: {
    //         items: 1.2,
    //       },
    //       1200: {
    //         items: 2,
    //       }
    //     }
    //   });

async function loadPricing() {
  const pricingWrapper = document.querySelector(".pricing-active");

  try {
    const res = await fetch("https://gamosjunz.pythonanywhere.com/get_subscript_plans"); // <-- ton endpoint
    const data = await res.json();

    const plans = data.plans; // ✅ extraction des plans
    console.log(plans);

    pricingWrapper.innerHTML = "";

    // Si aucun plan
    if (!plans || plans.length === 0) {
      pricingWrapper.innerHTML = `<p>Aucun plan disponible pour le moment.</p>`;
      return;
    }

    plans.forEach(plan => {
      const featuresList = Array.isArray(plan.features)
        ? plan.features.map(f => `<li>${f}</li>`).join("")
        : "";

      const pricingCard = `
        <div class="single-pricing-wrapper">
          <div class="single-pricing">
            <h6>${plan.planName || "Plan"}</h6>
            <h4>${plan.status || ""}</h4>
            <h3>0€</h3>
            <ul>${featuresList}</ul>
            <a href="${plan.planId || "#"}" class="button radius-30">Get Started</a>
          </div>
        </div>
      `;

      pricingWrapper.insertAdjacentHTML("beforeend", pricingCard);
    });

  } catch (error) {
    console.error("Erreur API :", error);
    pricingWrapper.innerHTML = `<p>Impossible de charger les tarifs.</p>`;
  }
}

// document.addEventListener("DOMContentLoaded", loadPricing);

// ✅ Ouvrir le modal seulement sur les boutons .open-modal
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("open-modal")) {
    e.preventDefault();
    
    const planId = e.target.dataset.plan || "pjgxC7CxBFKTO5Mxpxrt";
    document.getElementById("selectedPlan").value = planId;

    document.getElementById("pricingModal").style.display = "flex";
  }
});

// ✅ Fermer modal en cliquant sur la croix
function attachCloseEvent() {
  document.querySelector("#pricingModal .close-modal").addEventListener("click", () => {
    document.getElementById("pricingModal").style.display = "none";
  });
}
attachCloseEvent();

// ✅ Fermer modal en cliquant à l'extérieur
window.addEventListener("click", (e) => {
  if (e.target.id === "pricingModal") {
    document.getElementById("pricingModal").style.display = "none";
  }
});


// ✅ Soumission du formulaire
document.getElementById("pricingForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const submitBtn = this.querySelector("button[type=submit]");
  submitBtn.disabled = true;
  submitBtn.textContent = "Envoi...";

  const formData = new FormData(this);

  const payload = {
    companyName: formData.get("company_name"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    sector: formData.get("sector"),
    planId: formData.get("plan_id")
  };

  try {
    const response = await fetch("https://gamosjunz.pythonanywhere.com/create_company", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log(result);

    if (response.ok && result.status === "success") {

      const modal = document.getElementById("pricingModal");
      const modalContent = modal.querySelector(".pricing-modal-content");

      modalContent.innerHTML = `
        <span class="close-modal">&times;</span>
        <h3>🎉 Inscription réussie !</h3>
        <p>Votre entreprise a bien été enregistrée ✅</p>

        <h4>Code de validation :</h4>
        <div style="font-size:22px; font-weight:bold; margin:10px 0;">
          ${result.validate_code}
        </div>

        <button id="validateBtn" class="button radius-30" style="margin-top:15px;">
          Continuer
        </button>
      `;

      // ✅ Attache les nouveaux événements après innerHTML
      modalContent.querySelector(".close-modal").addEventListener("click", () => {
        modal.style.display = "none";
      });

      modalContent.querySelector("#validateBtn").addEventListener("click", () => {
        window.location.href = "/validate.html?companyId=" + result.companyId;
      });

    } else {
      alert("⚠️ " + (result.message || "Erreur serveur"));
    }

  } catch (err) {
    console.error("Erreur API :", err);
    alert("❌ Impossible de se connecter au serveur");
  }

  submitBtn.disabled = false;
  submitBtn.textContent = "Envoyer";
});



	// WOW active
    new WOW().init();

})();