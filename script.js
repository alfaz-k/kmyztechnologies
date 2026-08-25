document.addEventListener("DOMContentLoaded", () => {
  // 1. Register Service Worker for PWA
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => {
          console.log("PWA Service Worker registered successfully: ", reg.scope);
        })
        .catch((err) => {
          console.error("PWA Service Worker registration failed: ", err);
        });
    });
  }

  // 2. Elements Selection
  const btnTech = document.getElementById("switch-to-tech");
  const btnCatering = document.getElementById("switch-to-catering");
  const mBtnTech = document.getElementById("mobile-switch-tech");
  const mBtnCatering = document.getElementById("mobile-switch-catering");
  
  const viewTech = document.getElementById("tech-venture");
  const viewCatering = document.getElementById("catering-venture");
  const brandTitle = document.getElementById("nav-brand-title");
  const navLogoIcon = document.getElementById("navLogoIcon");
  const currentYearSpan = document.getElementById("currentYear");
  const dynamicFavicon = document.getElementById("dynamic-favicon");

  // Mobile Drawer Elements
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawerCloseBtn = document.getElementById("drawerCloseBtn");
  const drawerBrand = document.getElementById("drawerBrand");
  const mNavServicesText = document.getElementById("mNavServicesText");
  const mNavFeaturesText = document.getElementById("mNavFeaturesText");

  // PWA Install Prompt & Dynamic Toast Alert Elements
  const pwaInstallBtn = document.getElementById("pwaInstallBtn");
  const drawerPwaInstall = document.getElementById("drawerPwaInstall");
  const pwaToastAlert = document.getElementById("pwaToastAlert");
  const toastInstallBtn = document.getElementById("toastInstallBtn");
  const toastDismissBtn = document.getElementById("toastDismissBtn");
  const pwaToastTitle = document.getElementById("pwaToastTitle");
  let deferredPrompt = null;

  if (!sessionStorage.getItem("pwa_toast_dismissed")) {
    setTimeout(() => {
      if (pwaToastAlert) {
        pwaToastAlert.classList.add("show-toast");
      }
    }, 3500);
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaInstallBtn) pwaInstallBtn.style.display = "flex";
    if (drawerPwaInstall) drawerPwaInstall.style.display = "flex";
    if (pwaToastAlert && !sessionStorage.getItem("pwa_toast_dismissed")) {
      pwaToastAlert.classList.add("show-toast");
    }
  });

  async function triggerPwaInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the PWA install prompt");
        if (pwaToastAlert) pwaToastAlert.classList.remove("show-toast");
      }
      deferredPrompt = null;
    } else {
      alert("To install this app on your phone: Tap your browser's menu (three dots or share icon) and select 'Add to Home Screen' or 'Install App'.");
    }
  }

  if (pwaInstallBtn) pwaInstallBtn.addEventListener("click", triggerPwaInstall);
  if (toastInstallBtn) toastInstallBtn.addEventListener("click", triggerPwaInstall);

  if (toastDismissBtn) {
    toastDismissBtn.addEventListener("click", () => {
      if (pwaToastAlert) pwaToastAlert.classList.remove("show-toast");
      sessionStorage.setItem("pwa_toast_dismissed", "true");
    });
  }

  if (drawerPwaInstall) {
    drawerPwaInstall.addEventListener("click", () => {
      closeDrawer();
      triggerPwaInstall();
    });
  }

  // Search Elements
  const searchTriggerBtn = document.getElementById("searchTriggerBtn");
  const searchOverlay = document.getElementById("searchOverlay");
  const searchCloseBtn = document.getElementById("searchCloseBtn");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const globalSearchInput = document.getElementById("globalSearchInput");
  const searchResultsList = document.getElementById("searchResultsList");
  const filterChips = document.querySelectorAll(".filter-chip");

  // Map Modal Elements
  const mapModalOverlay = document.getElementById("mapModalOverlay");
  const openMapBtnNav = document.getElementById("openMapBtnNav");
  const footerMapBtn = document.getElementById("footerMapBtn");
  const drawerMapTrigger = document.getElementById("drawerMapTrigger");
  const mapModalCloseBtn = document.getElementById("mapModalCloseBtn");

  // Custom Select Modal Elements
  const customSelectOverlay = document.getElementById("customSelectOverlay");
  const customSelectCloseBtn = document.getElementById("customSelectCloseBtn");
  const customSelectList = document.getElementById("customSelectList");
  const customSelectModalTitle = document.getElementById("customSelectModalTitle");
  const customSelectModalSubtitle = document.getElementById("customSelectModalSubtitle");
  const customSelectIcon = document.getElementById("customSelectIcon");

  // Dynamic Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // Favicons
  const favicons = {
    tech: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%231e40af'/><text x='50%' y='68%' font-size='55' font-family='sans-serif' font-weight='900' fill='white' text-anchor='middle'>K</text></svg>",
    catering: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='25' fill='%23dc2626'/><text x='50%' y='68%' font-size='55' font-family='sans-serif' font-weight='900' fill='%23fef08a' text-anchor='middle'>JN</text></svg>"
  };

  // Search Database
  const searchData = [
    { title: "SAP ERP FICO (ECC & S/4 HANA)", type: "tech", category: "ERP Applications", target: "#services-section" },
    { title: "SAP ERP MM (ECC & S/4 HANA)", type: "tech", category: "ERP Applications", target: "#services-section" },
    { title: "SAP ERP SD (ECC & S/4 HANA)", type: "tech", category: "ERP Applications", target: "#services-section" },
    { title: "SAP EWM Module (S/4 HANA)", type: "tech", category: "ERP Applications", target: "#services-section" },
    { title: "Tally ERP 10.0 / Prime", type: "tech", category: "ERP & Accounting", target: "#services-section" },
    { title: "Core Java Development", type: "tech", category: "Software & Programming", target: "#services-section" },
    { title: "\"C\" Language Fundamentals", type: "tech", category: "Software & Programming", target: "#services-section" },
    { title: "C++ Object Oriented Programming", type: "tech", category: "Software & Programming", target: "#services-section" },
    { title: "Python Full Stack Basics", type: "tech", category: "Software & Programming", target: "#services-section" },
    { title: ".NET Framework Development", type: "tech", category: "Software & Programming", target: "#services-section" },
    { title: "Basic Computer Concepts & Office", type: "tech", category: "Basic Course", target: "#services-section" },
    { title: "MS Access Database & Reports", type: "tech", category: "Advance Course", target: "#services-section" },
    { title: "MS Excel Advance Concepts & Macros", type: "tech", category: "Advance Course", target: "#services-section" },
    { title: "Corporate & Campus Training", type: "tech", category: "Services & Consultancy", target: "#features-section" },
    { title: "Free Demo Classes (SAP)", type: "tech", category: "Demo Schedule", target: "#demo-schedule" },
    { title: "Catering Cost & Portion Estimator", type: "catering", category: "Interactive Calculator", target: "#catering-calculator" },
    { title: "Ballari Special Jigri", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Mutton Biryani & Chicken Biryani", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Chicken Mandi", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Mutton Afghani Pulav", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Chicken Fried Rice", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Mutton Nihari & Margh", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Mutton Tahari", type: "catering", category: "Sunday & Wednesday Special", target: "#menu-section" },
    { title: "Chole Bhature", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "Puri and Saag", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "Pav Bhaji & Vada Pav", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "White Sauce Pasta", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "Chicken & Cheese Corn Sandwich", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "Chicken & Aloo Tikki Burger", type: "catering", category: "Monday & Saturday Special", target: "#menu-section" },
    { title: "Bulk Party & Event Catering", type: "catering", category: "Event Booking", target: "#order-form" }
  ];

  let currentFilter = "all";

  // 3. Mobile Drawer Controls
  function openDrawer() {
    mobileDrawer.classList.add("open");
    drawerOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    mobileDrawer.classList.remove("open");
    drawerOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburgerBtn.addEventListener("click", openDrawer);
  drawerCloseBtn.addEventListener("click", closeDrawer);
  drawerOverlay.addEventListener("click", closeDrawer);

  // 4. Dual Business Switcher
  function activateBusiness(business) {
    if (business === "tech") {
      if (btnTech) btnTech.classList.add("active");
      if (btnCatering) btnCatering.classList.remove("active");
      if (mBtnTech) mBtnTech.classList.add("active");
      if (mBtnCatering) mBtnCatering.classList.remove("active");

      viewTech.classList.add("active-view");
      viewCatering.classList.remove("active-view");

      brandTitle.innerHTML = 'KMYZ <span class="highlight" style="color:#1e40af;">Technologies</span>';
      navLogoIcon.innerHTML = '<i class="fa-solid fa-cubes"></i>';
      drawerBrand.innerHTML = '<i class="fa-solid fa-laptop-code"></i> <span>KMYZ Tech</span>';

      mNavServicesText.textContent = "Courses & Modules";
      mNavFeaturesText.textContent = "Highlights & Facilities";

      if (pwaToastTitle) pwaToastTitle.textContent = "Install KMYZ Tech App";

      document.body.setAttribute("data-theme", "tech");
      document.title = "KMYZ Technologies | Software & ERP Training";
      if (dynamicFavicon) dynamicFavicon.href = favicons.tech;
    } else {
      if (btnCatering) btnCatering.classList.add("active");
      if (btnTech) btnTech.classList.remove("active");
      if (mBtnCatering) mBtnCatering.classList.add("active");
      if (mBtnTech) mBtnTech.classList.remove("active");

      viewCatering.classList.add("active-view");
      viewTech.classList.remove("active-view");

      brandTitle.innerHTML = 'JN\'s <span class="highlight" style="color:#dc2626;">Catering Services</span>';
      navLogoIcon.innerHTML = '<i class="fa-solid fa-utensils"></i>';
      drawerBrand.innerHTML = '<i class="fa-solid fa-utensils"></i> <span>JN\'s Catering</span>';

      mNavServicesText.textContent = "Specialty Menus";
      mNavFeaturesText.textContent = "Cost Estimator & Booking";

      if (pwaToastTitle) pwaToastTitle.textContent = "Install JN's Catering App";

      document.body.setAttribute("data-theme", "catering");
      document.title = "JN's Catering Services | Authentic Delicacies";
      if (dynamicFavicon) dynamicFavicon.href = favicons.catering;
    }
  }

  if (btnTech) btnTech.addEventListener("click", () => { activateBusiness("tech"); window.scrollTo({ top: 0, behavior: "smooth" }); });
  if (btnCatering) btnCatering.addEventListener("click", () => { activateBusiness("catering"); window.scrollTo({ top: 0, behavior: "smooth" }); });
  if (mBtnTech) {
    mBtnTech.addEventListener("click", () => {
      activateBusiness("tech");
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  if (mBtnCatering) {
    mBtnCatering.addEventListener("click", () => {
      activateBusiness("catering");
      closeDrawer();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 5. Cross-Venture Smooth Scroll & Hash Navigation
  function handleSmoothScroll(targetHash) {
    if (!targetHash || targetHash === "#" || targetHash === "javascript:void(0)") return;

    const cateringTargets = ["#menu-section", "#order-form", "#catering-hero", "#catering-calculator"];
    const techTargets = ["#services-section", "#features-section", "#demo-schedule", "#enroll-form"];

    if (cateringTargets.includes(targetHash)) {
      activateBusiness("catering");
    } else if (techTargets.includes(targetHash)) {
      activateBusiness("tech");
    }

    setTimeout(() => {
      let targetEl;
      if (targetHash === "#hero") {
        targetEl = document.querySelector(".venture-view.active-view .hero") || document.getElementById("hero");
      } else {
        targetEl = document.querySelector(targetHash);
      }

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  document.querySelectorAll('a[href^="#"], a[data-scroll]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const hash = this.getAttribute("href");
      if (hash && hash.startsWith("#")) {
        e.preventDefault();
        closeDrawer();
        handleSmoothScroll(hash);
      }
    });
  });

  // 6. Global Search Modal
  function openSearch() {
    searchOverlay.classList.add("active");
    globalSearchInput.focus();
    renderSearchResults(globalSearchInput.value.trim());
  }

  function closeSearch() {
    searchOverlay.classList.remove("active");
    globalSearchInput.value = "";
    searchClearBtn.classList.remove("visible");
  }

  searchTriggerBtn.addEventListener("click", openSearch);
  searchCloseBtn.addEventListener("click", closeSearch);

  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) closeSearch();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (searchOverlay.classList.contains("active")) closeSearch();
      if (customSelectOverlay.classList.contains("active")) closeCustomSelectModal();
      if (mapModalOverlay.classList.contains("active")) closeMapModal();
    }
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentFilter = chip.getAttribute("data-filter");
      renderSearchResults(globalSearchInput.value.trim());
    });
  });

  globalSearchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) searchClearBtn.classList.add("visible");
    else searchClearBtn.classList.remove("visible");
    renderSearchResults(query);
  });

  searchClearBtn.addEventListener("click", () => {
    globalSearchInput.value = "";
    searchClearBtn.classList.remove("visible");
    renderSearchResults("");
    globalSearchInput.focus();
  });

  function renderSearchResults(query) {
    let filtered = searchData.filter((item) => {
      const matchesFilter = currentFilter === "all" || item.type === currentFilter;
      const matchesQuery = query === "" || 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });

    if (filtered.length === 0) {
      searchResultsList.innerHTML = `<div class="search-hint">No results found matching "${query}"</div>`;
      return;
    }

    searchResultsList.innerHTML = filtered.map((item) => `
      <div class="search-item" data-type="${item.type}" data-target="${item.target}">
        <div>
          <span class="search-item-title">${item.title}</span>
          <span class="search-item-category">${item.category}</span>
        </div>
        <span class="search-item-badge ${item.type === 'tech' ? 'badge-tech' : 'badge-catering'}">
          ${item.type === 'tech' ? 'Tech' : 'Catering'}
        </span>
      </div>
    `).join("");

    document.querySelectorAll(".search-item").forEach((el) => {
      el.addEventListener("click", () => {
        const type = el.getAttribute("data-type");
        const targetId = el.getAttribute("data-target");

        activateBusiness(type);
        closeSearch();
        handleSmoothScroll(targetId);
      });
    });
  }

  // 7. Custom Selection Modals (Replaces default select popup with Image 2 UI)
  const dropdownDatasets = {
    techCourse: {
      title: "Select Course of Interest",
      subtitle: "Choose your specialization",
      icon: "fa-solid fa-graduation-cap",
      displayTarget: document.getElementById("tech-course-display"),
      hiddenTarget: document.getElementById("tech-course"),
      options: [
        { name: "SAP ERP FICO (ECC & S/4 HANA)", sub: "Finance & Cost Controlling", tag: "SAP ERP" },
        { name: "SAP ERP MM (ECC & S/4 HANA)", sub: "Materials Management", tag: "SAP ERP" },
        { name: "SAP ERP SD (ECC & S/4 HANA)", sub: "Sales & Distribution", tag: "SAP ERP" },
        { name: "SAP EWM Module (S/4 HANA)", sub: "Extended Warehouse Management", tag: "SAP ERP" },
        { name: "Tally ERP 10.0 / Prime", sub: "Accounting & GST Billing", tag: "ERP Prime" },
        { name: "Java Full Stack Development", sub: "Core Java & OOPs Concepts", tag: "Coding" },
        { name: "Python Programming", sub: "Data Structures & Automation", tag: "Coding" },
        { name: "\"C\" & C++ Programming", sub: "Logic & OOPs Fundamentals", tag: "Coding" },
        { name: "MS Access Database & Reports", sub: "Forms, Queries & Database", tag: "Advanced" },
        { name: "MS Excel Advance Concepts", sub: "Formulas, Macros & Charts", tag: "Advanced" },
        { name: "Basic Computer Concepts", sub: "Word, PPT & Office Basics", tag: "Basic" },
        { name: "Corporate / Campus Training", sub: "Custom Institution Packages", tag: "Corporate" }
      ]
    },
    techMode: {
      title: "Select Learning Mode",
      subtitle: "Choose classroom or online live sessions",
      icon: "fa-solid fa-chalkboard-user",
      displayTarget: document.getElementById("tech-mode-display"),
      hiddenTarget: document.getElementById("tech-mode"),
      options: [
        { name: "Offline Classroom (Ballari)", sub: "Hands-on lab training & 1-on-1 mentoring", tag: "Classroom" },
        { name: "Online Live Training", sub: "Interactive remote live sessions", tag: "Online" }
      ]
    },
    catMenu: {
      title: "Select Primary Specialty",
      subtitle: "Authentic Ballari food & bulk orders",
      icon: "fa-solid fa-utensils",
      displayTarget: document.getElementById("cat-menu-display"),
      hiddenTarget: document.getElementById("cat-menu-item"),
      options: [
        { name: "Ballari Special Jigri", sub: "Traditional slow-cooked local delicacy", tag: "Specialty" },
        { name: "Mutton / Chicken Dum Biryani", sub: "Rich authentic Dum preparation", tag: "Signature" },
        { name: "Chicken Mandi / Afghani Pulav", sub: "Arabian styled feast & aromatic rice", tag: "Royal" },
        { name: "Mutton Nihari / Margh / Tahari", sub: "Rich gravies & tender meat preparations", tag: "Authentic" },
        { name: "Snacks, Pasta & Burgers Combo", sub: "Pav Bhaji, Chole Bhature, Burgers", tag: "Snacks" },
        { name: "Bulk Party / Event Catering", sub: "Full customized catering for functions", tag: "Event" }
      ]
    }
  };

  // Pre-set Default Form Values
  if (dropdownDatasets.techMode.displayTarget) {
    dropdownDatasets.techMode.displayTarget.value = "Offline Classroom (Ballari)";
  }

  function openCustomSelectModal(datasetKey) {
    const config = dropdownDatasets[datasetKey];
    if (!config) return;

    customSelectModalTitle.textContent = config.title;
    customSelectModalSubtitle.textContent = config.subtitle;
    customSelectIcon.className = `${config.icon} custom-select-header-icon`;

    const currentValue = config.hiddenTarget.value;

    customSelectList.innerHTML = config.options.map((opt) => `
      <div class="select-option-item ${currentValue === opt.name ? 'selected' : ''}" data-val="${opt.name}">
        <div class="select-option-text">
          <span class="select-option-name">${opt.name}</span>
          <span class="select-option-sub">${opt.sub}</span>
        </div>
        <span class="select-option-badge">${opt.tag}</span>
      </div>
    `).join("");

    customSelectOverlay.classList.add("active");
    document.body.style.overflow = "hidden";

    document.querySelectorAll(".select-option-item").forEach((item) => {
      item.addEventListener("click", () => {
        const val = item.getAttribute("data-val");
        config.displayTarget.value = val;
        config.hiddenTarget.value = val;
        closeCustomSelectModal();
      });
    });
  }

  function closeCustomSelectModal() {
    customSelectOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Bind Triggers
  const techCourseTrigger = document.getElementById("techCourseTrigger");
  const techModeTrigger = document.getElementById("techModeTrigger");
  const catMenuTrigger = document.getElementById("catMenuTrigger");

  if (techCourseTrigger) techCourseTrigger.addEventListener("click", () => openCustomSelectModal("techCourse"));
  if (techModeTrigger) techModeTrigger.addEventListener("click", () => openCustomSelectModal("techMode"));
  if (catMenuTrigger) catMenuTrigger.addEventListener("click", () => openCustomSelectModal("catMenu"));

  if (customSelectCloseBtn) customSelectCloseBtn.addEventListener("click", closeCustomSelectModal);
  customSelectOverlay.addEventListener("click", (e) => {
    if (e.target === customSelectOverlay) closeCustomSelectModal();
  });

  // 8. Google Maps Modal Logic
  function openMapModal() {
    mapModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMapModal() {
    mapModalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (openMapBtnNav) openMapBtnNav.addEventListener("click", openMapModal);
  if (footerMapBtn) footerMapBtn.addEventListener("click", openMapModal);
  if (drawerMapTrigger) {
    drawerMapTrigger.addEventListener("click", () => {
      closeDrawer();
      openMapModal();
    });
  }
  if (mapModalCloseBtn) mapModalCloseBtn.addEventListener("click", closeMapModal);
  mapModalOverlay.addEventListener("click", (e) => {
    if (e.target === mapModalOverlay) closeMapModal();
  });

  // 9. Live Day-of-the-Week Menu Highlighter
  function highlightTodayMenu() {
    const today = new Date().getDay();
    const cardMonSat = document.getElementById("card-mon-sat");
    const cardSunWed = document.getElementById("card-sun-wed");
    const statusText = document.getElementById("todayLiveStatusText");

    const daysName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDayName = daysName[today];

    if (today === 1 || today === 6) {
      if (cardMonSat) cardMonSat.classList.add("is-today-active");
      if (statusText) {
        statusText.innerHTML = `Today is <strong>${currentDayName}</strong>: <span style="color:#dc2626; font-weight:700;">Snacks, Pasta & Burger Specials are cooking today!</span> Order fresh now.`;
      }
    } else if (today === 0 || today === 3) {
      if (cardSunWed) cardSunWed.classList.add("is-today-active");
      if (statusText) {
        statusText.innerHTML = `Today is <strong>${currentDayName}</strong>: <span style="color:#dc2626; font-weight:700;">Ballari Special Jigri & Royal Dum Biryani are cooking today!</span> Order fresh now.`;
      }
    } else {
      if (statusText) {
        statusText.innerHTML = `Today is <strong>${currentDayName}</strong>: Fresh bulk event orders & advance schedule bookings are accepted daily!`;
      }
    }
  }
  highlightTodayMenu();

  // 10. Interactive Catering Event Cost & Portion Estimator Logic
  const guestSlider = document.getElementById("guestSlider");
  const guestCountDisplay = document.getElementById("guestCountDisplay");
  const calcPerPlateRate = document.getElementById("calcPerPlateRate");
  const calcSelectedCount = document.getElementById("calcSelectedCount");
  const calcPortionList = document.getElementById("calcPortionList");
  const calcGrandTotal = document.getElementById("calcGrandTotal");
  const btnExportQuoteToWa = document.getElementById("btnExportQuoteToWa");
  const dishCheckboxes = document.querySelectorAll(".dish-checkbox");

  function recalculateCateringQuote() {
    if (!guestSlider) return;
    const guests = parseInt(guestSlider.value, 10);
    guestCountDisplay.textContent = `${guests} Guests`;

    let perPlateTotal = 0;
    let selectedDishes = [];
    let portionItemsHtml = "";

    dishCheckboxes.forEach((cb) => {
      if (cb.checked) {
        const price = parseInt(cb.getAttribute("data-price"), 10);
        const name = cb.value;
        const portion = cb.getAttribute("data-portion");
        perPlateTotal += price;
        selectedDishes.push({ name, price, portion });

        let bulkEstimate = `${guests} servings`;
        if (portion.includes("350g")) {
          const totalKg = ((guests * 350) / 1000).toFixed(1);
          bulkEstimate = `Approx. ${totalKg} KG cooked`;
        } else if (portion.includes("pcs")) {
          bulkEstimate = `Approx. ${guests * 2} pieces`;
        }

        portionItemsHtml += `<li><strong>${name}:</strong> ${bulkEstimate}</li>`;
      }
    });

    calcPerPlateRate.textContent = `₹${perPlateTotal}`;
    calcSelectedCount.textContent = `${selectedDishes.length} items`;
    calcPortionList.innerHTML = portionItemsHtml || "<li>No dishes selected</li>";

    const grandTotal = perPlateTotal * guests;
    calcGrandTotal.textContent = `₹${grandTotal.toLocaleString("en-IN")}`;
  }

  if (guestSlider) {
    guestSlider.addEventListener("input", recalculateCateringQuote);
    dishCheckboxes.forEach((cb) => {
      cb.addEventListener("change", recalculateCateringQuote);
    });
    recalculateCateringQuote();
  }

  if (btnExportQuoteToWa) {
    btnExportQuoteToWa.addEventListener("click", () => {
      const guests = guestSlider.value;
      const grandTotal = calcGrandTotal.textContent;
      const perPlate = calcPerPlateRate.textContent;
      
      let dishListStr = "";
      dishCheckboxes.forEach((cb) => {
        if (cb.checked) {
          dishListStr += `%0A• ${cb.value} (₹${cb.getAttribute("data-price")})`;
        }
      });

      const message = `Hello JN's Catering Services,%0A%0AI used your website Cost Estimator and would like to book a catering package:%0A- *Headcount:* ${guests} Guests%0A- *Per Plate Rate:* ${perPlate}%0A- *Estimated Total:* ${grandTotal}%0A- *Selected Menu:*${dishListStr}%0A%0APlease confirm availability for my date.`;
      window.open(`https://wa.me/919591509362?text=${message}`, "_blank");
    });
  }

  // 11. Dynamic Captcha Generator
  let generatedTechCaptcha = "";
  let generatedCateringCaptcha = "";

  function generateCaptcha(canvasId, theme = "tech") {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return "";
    const ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = theme === "tech" ? "#f0f9ff" : "#fffbeb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = theme === "tech" ? "rgba(14, 165, 233, 0.4)" : "rgba(220, 38, 38, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < 35; i++) {
      ctx.fillStyle = theme === "tech" ? "rgba(30, 64, 175, 0.3)" : "rgba(245, 158, 11, 0.35)";
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = 15 + i * 20;
      const y = 28 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 24 - 12) * Math.PI / 180;
      
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = "bold 22px 'Space Mono', monospace";
      ctx.fillStyle = theme === "tech" ? "#0f172a" : "#991b1b";
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    return code;
  }

  generatedTechCaptcha = generateCaptcha("techCaptchaCanvas", "tech");
  generatedCateringCaptcha = generateCaptcha("cateringCaptchaCanvas", "catering");

  document.getElementById("refreshTechCaptcha").addEventListener("click", () => {
    generatedTechCaptcha = generateCaptcha("techCaptchaCanvas", "tech");
    document.getElementById("techCaptchaInput").value = "";
    document.getElementById("techCaptchaError").classList.remove("visible");
  });

  document.getElementById("refreshCateringCaptcha").addEventListener("click", () => {
    generatedCateringCaptcha = generateCaptcha("cateringCaptchaCanvas", "catering");
    document.getElementById("cateringCaptchaInput").value = "";
    document.getElementById("cateringCaptchaError").classList.remove("visible");
  });

  // 12. Form Validation & WhatsApp Redirection
  const techForm = document.getElementById("techEnrollForm");
  if (techForm) {
    techForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInput = document.getElementById("techCaptchaInput").value.trim().toUpperCase();
      const errorMsg = document.getElementById("techCaptchaError");
      const captchaField = document.getElementById("techCaptchaInput");
      const courseVal = document.getElementById("tech-course").value;

      if (!courseVal) {
        alert("Please select a Course of Interest.");
        openCustomSelectModal("techCourse");
        return;
      }

      if (userInput !== generatedTechCaptcha) {
        errorMsg.textContent = "Invalid verification code! Please try again.";
        errorMsg.classList.add("visible");
        captchaField.classList.add("shake-animation");
        setTimeout(() => captchaField.classList.remove("shake-animation"), 500);
        generatedTechCaptcha = generateCaptcha("techCaptchaCanvas", "tech");
        captchaField.value = "";
        return;
      }

      errorMsg.classList.remove("visible");
      const name = document.getElementById("tech-name").value;
      const phone = document.getElementById("tech-phone").value;
      const course = document.getElementById("tech-course").value;
      const mode = document.getElementById("tech-mode").value;

      const message = `Hello KMYZ Technologies,%0A%0AI would like to enroll/inquire about a course:%0A- *Name:* ${name}%0A- *Phone:* ${phone}%0A- *Course:* ${course}%0A- *Mode:* ${mode}`;
      window.open(`https://wa.me/919591509362?text=${message}`, "_blank");
      
      techForm.reset();
      document.getElementById("tech-course-display").value = "";
      document.getElementById("tech-course").value = "";
      document.getElementById("tech-mode-display").value = "Offline Classroom (Ballari)";
      document.getElementById("tech-mode").value = "Offline Classroom (Ballari)";
      generatedTechCaptcha = generateCaptcha("techCaptchaCanvas", "tech");
    });
  }

  const cateringForm = document.getElementById("cateringOrderForm");
  if (cateringForm) {
    cateringForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userInput = document.getElementById("cateringCaptchaInput").value.trim().toUpperCase();
      const errorMsg = document.getElementById("cateringCaptchaError");
      const captchaField = document.getElementById("cateringCaptchaInput");
      const menuItemVal = document.getElementById("cat-menu-item").value;

      if (!menuItemVal) {
        alert("Please select a Primary Specialty from the menu.");
        openCustomSelectModal("catMenu");
        return;
      }

      if (userInput !== generatedCateringCaptcha) {
        errorMsg.textContent = "Invalid verification code! Please try again.";
        errorMsg.classList.add("visible");
        captchaField.classList.add("shake-animation");
        setTimeout(() => captchaField.classList.remove("shake-animation"), 500);
        generatedCateringCaptcha = generateCaptcha("cateringCaptchaCanvas", "catering");
        captchaField.value = "";
        return;
      }

      errorMsg.classList.remove("visible");
      const name = document.getElementById("cat-name").value;
      const phone = document.getElementById("cat-phone").value;
      const item = document.getElementById("cat-menu-item").value;
      const date = document.getElementById("cat-date").value;
      const quantity = document.getElementById("cat-quantity").value;

      const message = `Hello JN's Catering Services,%0A%0AI would like to place a food order:%0A- *Name:* ${name}%0A- *Phone:* ${phone}%0A- *Dish/Menu:* ${item}%0A- *Preferred Date:* ${date}%0A- *Packs/Guests:* ${quantity}`;
      window.open(`https://wa.me/919591509362?text=${message}`, "_blank");

      cateringForm.reset();
      document.getElementById("cat-menu-display").value = "";
      document.getElementById("cat-menu-item").value = "";
      generatedCateringCaptcha = generateCaptcha("cateringCaptchaCanvas", "catering");
    });
  }
});
