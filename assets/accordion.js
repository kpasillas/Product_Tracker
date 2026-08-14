// Only one card open at a time.
// ponytail: stands in for <details name="deals">, which Dash's html.Details
// does not expose as a prop. Delete this once it does.
document.addEventListener("toggle", (event) => {
    const card = event.target;
    if (!card.open || !card.classList.contains("card")) return;
    card.parentElement.querySelectorAll("details.card[open]").forEach((other) => {
        if (other !== card) other.open = false;
    });
}, true); // toggle does not bubble
