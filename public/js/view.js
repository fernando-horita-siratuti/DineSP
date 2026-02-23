const USERNAMES_KEY = "usernames";
const RESTAURANT_TEXTS_KEY = "restaurantTexts";
const NEIGHBORHOOD_KEY = "neighborhoods"; 
const CUISINE_KEY = "cuisines"; 
const PRICE_KEY = "prices";
const RATING_TEXTS_KEY = "ratings"; 
const DATE_KEY = "dates";
const REVIEW_TEXTS_KEY = "reviewTexts";

function getArraysFromStorage() {
  try {
    const users = JSON.parse(localStorage.getItem(USERNAMES_KEY) || "[]");
    const restaurants = JSON.parse(localStorage.getItem(RESTAURANT_TEXTS_KEY) || "[]");
    const neighborhoods = JSON.parse(localStorage.getItem(NEIGHBORHOOD_KEY) || "[]"); 
    const cuisines = JSON.parse(localStorage.getItem(CUISINE_KEY) || "[]"); 
    const prices = JSON.parse(localStorage.getItem(PRICE_KEY) || "[]");
    const rates = JSON.parse(localStorage.getItem(RATING_TEXTS_KEY) || "[]");
    const dates = JSON.parse(localStorage.getItem(DATE_KEY) || "[]");
    const reviews = JSON.parse(localStorage.getItem(REVIEW_TEXTS_KEY) || "[]");

    return { 
      usernames: users, 
      restaurantTexts: restaurants, 
      neighborhoods: neighborhoods, 
      cuisines: cuisines,
      prices: prices,
      ratings: rates, 
      dates: dates,
      reviewTexts: reviews 
    };
  } catch (err) {
    console.error("Error localStorage:", err);
    return { usernames: [], restaurantTexts: [], neighborhoods: [], cuisines: [], prices: [], ratings: [], dates: [], reviewTexts: [] };
  }
}

function updateUI() {
  const container = document.getElementById("postsContainer");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const targetRestaurant = params.get('restaurantName'); 

  if (!targetRestaurant) {
    container.innerHTML = "";
    return; 
  }

  const { usernames, restaurantTexts, neighborhoods, cuisines, prices, ratings, dates, reviewTexts } = getArraysFromStorage();
  container.innerHTML = "";

  const count = Math.max(usernames.length, restaurantTexts.length);
  let reviewsFound = false;

  function clearText(text) {
    return text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }
  
  for (let i = count - 1; i >= 0; i--) {
    const user = usernames[i] || "Anonymous";
    const rest = restaurantTexts[i] || "Restaurant";
    const neigh = neighborhoods[i] || "Unknown"; 
    const cuis = cuisines[i] || "Unknown"; 
    const price = prices[i] || "Price: N/A";
    const rate = ratings[i] || "Rating: N/A";
    const date = dates[i] || "Date: N/A";
    const review = reviewTexts[i] || "N/A";

    const restClean = clearText(rest);
    const targetClean = clearText(targetRestaurant);

    if (restClean !== targetClean) {
      continue;
    }

    reviewsFound = true;

    const card = document.createElement("div");
    card.className = "card mb-3 shadow-sm"; 
    
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "card-body";
    
    const htmlContent = `
                          <div class="card shadow-sm border-0 mb-4 mx-auto" style="border-radius: 16px; background-color: #ffffff; max-width: 800px;">
                            <div class="card-body p-4">
                              <div class="d-flex justify-content-between align-items-start mb-3 gap-3">
                                  <div class="d-flex align-items-center">
                                      <div class="rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm flex-shrink-0" style="width: 50px; height: 50px; background-color: #bbae87; color: white;">
                                        <i class="bi bi-person-fill fs-3"></i>
                                      </div>
                                      <div class="text-start" style="word-break: break-word;">
                                        <h4 class="card-title fw-bold mb-0" style="color: #382f2f;">${user}</h4>
                                      </div>
                                  </div>
                                  
                                  <div class="rounded shadow-sm d-flex flex-column justify-content-center align-items-center flex-shrink-0" style="background-color: #382f2f; color: #f2ebd9; padding: 10px 16px; margin-top: -10px;">
                                    <span class="fw-bold fs-3" style="line-height: 1;">${rate}</span>
                                    <span class="fw-bold" style="font-size: 0.7rem; letter-spacing: 1px; margin-top: 4px;">RATING</span>
                                  </div>
                              </div>

                              <div class="mb-3 text-start">
                                <h5 class="fw-bold fs-4 mb-2" style="color: #382f2f;">🍽️ ${rest}</h5>
                                <p class="text-muted mb-0 fw-bold" style="font-size: 1.1rem;">
                                  <span class="d-block d-md-inline">📍 ${neigh} &nbsp; | &nbsp; 👨‍🍳 ${cuis}</span>
                                  <span class="d-none d-md-inline"> &nbsp; | &nbsp; </span>
                                  <span class="d-block d-md-inline mt-1 mt-md-0">💵 ${price} &nbsp; | &nbsp; 📅 ${date}</span>
                                </p>
                              </div>

                              <div class="p-3 rounded text-start" style="background-color: #f2ebd9; border-left: 5px solid #bbae87;">
                                <p class="card-text mb-0" style="white-space: pre-wrap; color: #55514b; font-size: 1.05rem; font-style: italic;">"${review}"</p>
                              </div>
                            </div>
                          </div>
                        `;
    
    bodyDiv.innerHTML = htmlContent;
    card.appendChild(bodyDiv);
    container.appendChild(card);
  }

  const titleElement = document.getElementById("reviewsTitle");
  
  if (reviewsFound) {
    if (titleElement) {
      titleElement.style.display = "block";
    }
  } else {
    if (titleElement) {
      titleElement.style.display = "none";
    }
    const targetClean = clearText(targetRestaurant)[0].toUpperCase() + clearText(targetRestaurant).slice(1);
    
    container.innerHTML = `
                            <div class="text-center mt-3 fs-3 fw-bold text-muted">
                              No community reviews yet for "${targetClean}" 
                            </div>
                          `;
  }
}

document.addEventListener("DOMContentLoaded", updateUI);