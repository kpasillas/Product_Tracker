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

// Desktop selection highlight. The server marks the first row on every list
// render; this moves the mark on click so it lands before the pane callback
// returns. Below 900px the class has no styling and does nothing.
document.addEventListener("click", (event) => {
    const card = event.target.closest("details.card");
    if (!card) return;
    card.parentElement.querySelectorAll("details.card.selected").forEach((other) => {
        other.classList.remove("selected");
    });
    card.classList.add("selected");
});

// The detail pane sticks below the sticky header, whose height depends on how
// the ink bar wraps — so it is measured, not assumed. Body exists before Dash
// renders; .hdr-block does not, and body resizes when it appears.
new ResizeObserver(() => {
    const header = document.querySelector(".hdr-block");
    if (header) {
        document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
    }
}).observe(document.body);

// Arrow keys walk the list (handoff, accessibility). Each summary is already
// focusable and Enter/Space selects; this just saves tabbing past every row.
document.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const here = event.target.closest("summary.card-top");
    if (!here) return;
    const all = [...here.closest(".list").querySelectorAll("summary.card-top")];
    const next = all[all.indexOf(here) + (event.key === "ArrowDown" ? 1 : -1)];
    if (next) {
        next.focus();
        event.preventDefault();
    }
});
