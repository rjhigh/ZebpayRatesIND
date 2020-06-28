// register the service worker if available
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function(reg) {
        console.log('Successfully registered service worker', reg);
    }).catch(function(err) {
        console.warn('Error whilst registering service worker', err);
    });
}
var defaultCurrency = 'INR';

window.addEventListener('online', function(e) {
    // re-sync data with server
    console.log("You are online");
    Page.hideOfflineWarning();
    AppRates.loadData(defaultCurrency);
}, false);

window.addEventListener('offline', function(e) {
    // queue up events for server
    console.log("You are offline");
    Page.showOfflineWarning(defaultCurrency);
}, false);

// check if the user is connected
if (navigator.onLine) {
    AppRates.loadData(defaultCurrency);
} else {
    // show offline message
    Page.showOfflineWarning();
}

function selectQuote(quoteCurrency) {
    AppRates.loadData(quoteCurrency);
}
// set knockout view model bindings
ko.applyBindings(Page.vm);
