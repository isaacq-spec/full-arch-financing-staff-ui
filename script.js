const API_BASE = "http://localhost:3000/api";

async function createPlan() {
    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        totalFee: Number(document.getElementById("totalFee").value),
        termMonths: Number(document.getElementById("termMonths").value),
        downPercent: Number(document.getElementById("downPercent").value)
    };

    const res = await fetch(`${API_BASE}/create-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);

    // Display results
    document.getElementById("dp").innerText = result.downPaymentAmount;
    document.getElementById("remaining").innerText = result.remaining;
    document.getElementById("monthly").innerText = result.monthly;

    document.getElementById("paymentLink").href = result.paymentLinkUrl;

    document.getElementById("results").classList.remove("hidden");
    document.getElementById("autopayCard").classList.remove("hidden");

    // Fill autopay fields automatically
    document.getElementById("customerId").value = result.customerId;
    document.getElementById("remainingInput").value = result.remaining;
    document.getElementById("termInput").value = data.termMonths;
}

async function createAutopay() {
    const data = {
        customerId: document.getElementById("customerId").value,
        remaining: Number(document.getElementById("remainingInput").value),
        termMonths: Number(document.getElementById("termInput").value)
    };

    const res = await fetch(`${API_BASE}/create-invoice-schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    console.log(result);

    document.getElementById("autopayResult").innerText =
        "Subscription Created: " + result.subscriptionId;
}
