// Use your live backend URL on Render
const API_BASE = "https://full-arch-financing.onrender.com/api";

async function createPlan() {
    const downPercentInput = Number(document.getElementById("downPercent").value);

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        totalFee: Number(document.getElementById("totalFee").value),
        termMonths: Number(document.getElementById("termMonths").value),
        // backend expects a decimal (0.2 for 20%), so convert here
        downPercent: downPercentInput / 100
    };

    try {
        const res = await fetch(`${API_BASE}/create-plan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || "Failed to create plan");
        }

        console.log(result);

        // Display results
        document.getElementById("dp").innerText = result.downPaymentAmount.toFixed(2);
        document.getElementById("remaining").innerText = result.remaining.toFixed(2);
        document.getElementById("monthly").innerText = result.monthly.toFixed(2);

        document.getElementById("paymentLink").href = result.paymentLinkUrl;
        document.getElementById("paymentLink").innerText = result.paymentLinkUrl;

        document.getElementById("results").classList.remove("hidden");
        document.getElementById("autopayCard").classList.remove("hidden");

        // Fill autopay fields automatically
        document.getElementById("customerId").value = result.customerId;
        document.getElementById("remainingInput").value = result.remaining;
        document.getElementById("termInput").value = data.termMonths;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

async function createAutopay() {
    const data = {
        customerId: document.getElementById("customerId").value,
        remaining: Number(document.getElementById("remainingInput").value),
        termMonths: Number(document.getElementById("termInput").value)
    };

    try {
        const res = await fetch(`${API_BASE}/create-invoice-schedule`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.error || "Failed to create subscription");
        }

        console.log(result);

        document.getElementById("autopayResult").innerText =
            "Subscription Created: " + result.subscriptionId;
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}


