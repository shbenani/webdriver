function WebDriverServer() {
    this.wrappedJSObject = this;
    this.serverSocket = Components.classes["@mozilla.org/network/server-socket;1"].createInstance(Components.interfaces.nsIServerSocket);
    this.nextId = 0;
}

WebDriverServer.prototype.newDriver = function(window) {
    window.fxdriver = new FirefoxDriver(this, this.getNextId());
    // Yuck. But it allows us to refer to it later.
    window.fxdriver.window = window;
    return window.fxdriver;
};

WebDriverServer.prototype.getNextId = function() {
    this.nextId++;
    return this.nextId;
}

WebDriverServer.prototype.onSocketAccepted = function(socket, transport) {
    try {
        var socketListener = new SocketListener(this, transport);
    } catch(e) {
        dump(e);
    }
}

WebDriverServer.prototype.startListening = function(port) {
    if (!port) {
        var prefs = Utils.getService("@mozilla.org/preferences-service;1", "nsIPrefBranch");

        port = prefs.prefHasUserValue("webdriver_firefox_port") ?
                  prefs.getIntPref("webdriver_firefox_port") : 7055; 
    }

    if (!this.isListening) {
        this.serverSocket.init(port, true, -1);
        this.serverSocket.asyncListen(this);
        this.isListening = true;
    }
}

WebDriverServer.prototype.onStopListening = function(socket, status)
{
};


WebDriverServer.prototype.close = function()
{
};

WebDriverServer.prototype.QueryInterface = function(aIID) {
    if (!aIID.equals(nsISupports))
        throw Components.results.NS_ERROR_NO_INTERFACE;
    return this;
};

WebDriverServer.prototype.createInstance = function(ignore1, ignore2, ignore3) {
    var port = WebDriverServer.readPort();
    this.startListening(port);
}
