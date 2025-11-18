// Correct backend URL (NO /api at the end)
const API_BASE = "https://full-arch-financing.onrender.com";

// ----------------------------
// CREATE PLAN + DOWN PAYMENT
// ----------------------------
async function createPlan() {
  const downPercentInput = Number(document.getElementById("downPercent").value);

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    totalFee: Number(document.getElementById("totalFee").value),
    termMonths: Number(document.getElementById("termMonths").value),
    downPercent: downPercentInput / 100, // convert from 20 → 0.20
  };

  try {
    const res = await fetch(`${API_BASE}/create-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Server returned error:", result);
      throw new Error(result.error || "Failed to create plan");
    }

    // Fill calculated values
    document.getElementById("dp").innerText =
      result.downPaymentAmount.toFixed(2);
    document.getElementById("remaining").innerText =
      result.remaining.toFixed(2);
    document.getElementById("monthly").innerText =
      result.monthly.toFixed(2);

    // Put payment link
    document.getElementById("paymentLink").href = result.paymentLinkUrl;
    document.getElementById("paymentLink").innerText = result.paymentLinkUrl;

    // Reveal UI sections
    document.getElementById("results").classList.remove("hidden");
    document.getElementById("autopayCard").classList.remove("hidden");

    // Pre-fill autopay inputs
    document.getElementById("customerId").value = result.customerId;
    document.getElementById("remainingInput").value = result.remaining;
    document.getElementById("termInput").value = data.termMonths;
  } catch (err) {
    console.error("Error creating plan:", err);
    alert(err.message);
  }
}

// ----------------------------
// CREATE MONTHLY AUTOPAY
// ----------------------------
async function createAutopay() {
  const data = {
    customerId: document.getElementById("customerId").value,
    remaining: Number(document.getElementById("remainingInput").value),
    termMonths: Number(document.getElementById("termInput").value),
  };

  try {
    const res = await fetch(`${API_BASE}/create-invoice-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Server returned error:", result);
      throw new Error(result.error || "Failed to create subscription");
    }

    document.getElementById("autopayResult").innerText =
      "Subscription Created: " + result.subscriptionId;
  } catch (err) {
    console.error("Error creating autopay:", err);
    alert(err.message);
  }
}

// ----------------------------
// WIRE UP THE FORMS
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const planForm = document.getElementById("planForm");
  const autopayForm = document.getElementById("autopayForm");

  if (planForm) {
    planForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createPlan();
    });
  }

  if (autopayForm) {
    autopayForm.addEventListener("submit", (e) => {
      e.preventDefault();
      createAutopay();
    });
  }
});
