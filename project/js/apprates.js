var AppRates = (function () {
    function RateViewModel() {
        var self = this;
        self.pair = "";
        self.buy = "";
        self.sell = "";
    }

    function RateApiService() {
        var self = this;

        // retrieves all Rates from the API
        self.getAll = function () {
            return new Promise(function (resolve, reject) {
                var request = new XMLHttpRequest();
                request.open('GET', 'https://www.zebapi.com/pro/v1/market');

                request.onload = function () {
                    console.log('response from zeb..', request.response)
                    // success
                    if (request.status === 200) {
                        console.log('response from zeb..', request.response)
                        // resolve the promise with the parsed response text (assumes JSON)
                        resolve(JSON.parse(request.response));
                    } else {
                        // error retrieving file
                        reject(Error(request.statusText));
                    }
                };

                request.onerror = function () {
                    // network errors
                    reject(Error("Network Error"));
                };

                request.send();
            });
        };
    }

    function RateAdapter() {
        var self = this;

        self.toRateViewModel = function (data) {
            if (data) {
                var vm = new RateViewModel();
                vm.pair = data.pair;
                vm.buy = 'Buy: '+data.buy;
                vm.sell = 'Sell: '+data.sell;
                return vm;
            }
            return null;
        };

        self.toRateViewModels = function (data) {
            if (data && data.length > 0) {
                return data.map(function (item) {
                    return self.toRateViewModel(item);
                });
            }
            return [];
        };
    }

    function RateController(rateApiService, rateAdapter) {
        var self = this;

        self.getAll = function () {
            // retrieve all the Rates from the API
            return rateApiService.getAll().then(function (response) {
                return rateAdapter.toRateViewModels(response);
            });
        };
    }


    // initialize the services and adapters
    var rateApiService = new RateApiService();
    var rateAdapter = new RateAdapter();

    // initialize the controller
    var rateController = new RateController(rateApiService, rateAdapter);

    return {
        loadData: function (quoteCurrency) {
            // retrieve all routes
            document.querySelector(".rates-list").classList.add('loading')
            rateController.getAll().then(function (response) {
                // bind the Rates to the UI
                if (quoteCurrency == 'BTC') {
                    response = response.filter(function(item) { return item.pair == 'ETH-BTC'});
                } else {
                    response = response.filter(function(item) { return item.pair.split('-')[1] == quoteCurrency});
                }
                Page.vm.rates(response);
                document.querySelector(".rates-list").classList.remove('loading')
            });
        }
    }

})();
