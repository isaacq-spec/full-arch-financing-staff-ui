// Backend API
const API_BASE = "https://full-arch-financing.onrender.com/api";

// ----------------------------
// UTILITIES: Toast + Loading
// ----------------------------
function toast(msg, type = "success") {
  const el = document.getElementById("toast");
  el.innerText = msg;
  el.style.background = type === "error" ? "#c0392b" : "#27ae60";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}

function showLoading() {
  document.getElementById("loading").classList.remove("hidden");
}
function hideLoading() {
  document.getElementById("loading").classList.add("hidden");
}

// ----------------------------
// CREATE PLAN + DOWN PAYMENT
// ----------------------------
async function createPlan() {
  showLoading();

  const downPercentInput = Number(document.getElementById("downPercent").value);

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    totalFee: Number(document.getElementById("totalFee").value),
    termMonths: Number(document.getElementById("termMonths").value),
    downPercent: downPercentInput / 100,
  };

  try {
    const res = await fetch(`${API_BASE}/create-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    hideLoading();

    if (!res.ok) {
      toast(result.error || "Failed to create plan", "error");
      return;
    }

    document.getElementById("dp").innerText = result.downPaymentAmount.toFixed(2);
    document.getElementById("remaining").innerText = result.remaining.toFixed(2);
    document.getElementById("monthly").innerText = result.monthly.toFixed(2);

    document.getElementById("paymentLink").href = result.paymentLinkUrl;
    document.getElementById("paymentLink").innerText = result.paymentLinkUrl;

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("autopayCard").classList.remove("hidden");

    // Plan summary card
    document.getElementById("summaryContent").innerHTML = `
      <p><b>Patient:</b> ${data.name} (${data.email})</p>
      <p><b>Total Fee:</b> $${data.totalFee}</p>
      <p><b>Down Payment:</b> $${result.downPaymentAmount}</p>
      <p><b>Remaining:</b> $${result.remaining}</p>
      <p><b>Monthly:</b> $${result.monthly}</p>
      <p><b>Customer ID:</b> ${result.customerId}</p>
      <p><b>Payment Link:</b> <a href="${result.paymentLinkUrl}" target="_blank">Pay Down Payment</a></p>
    `;
    document.getElementById("summaryCard").classList.remove("hidden");

    // Autopay pre-fill
    document.getElementById("customerId").value = result.customerId;
    document.getElementById("remainingInput").value = result.remaining;
    document.getElementById("termInput").value = data.termMonths;

    toast("Plan created successfully");
  } catch (err) {
    hideLoading();
    toast("Error creating plan", "error");
  }
}

// ----------------------------
// CREATE MONTHLY AUTOPAY
// ----------------------------
async function createAutopay() {
  showLoading();

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
    hideLoading();

    if (!res.ok) {
      toast(result.error || "Failed to create autopay", "error");
      return;
    }

    document.getElementById("autopayResult").innerText =
      "Subscription Created: " + result.subscriptionId;

    toast("Autopay subscription created");
  } catch (err) {
    hideLoading();
    toast("Error creating autopay", "error");
  }
}

// ----------------------------
// FORM WIRING
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("planForm").addEventListener("submit", (e) => {
    e.preventDefault();
    createPlan();
  });

  document.getElementById("autopayForm").addEventListener("submit", (e) => {
    e.preventDefault();
    createAutopay();
  });
});

