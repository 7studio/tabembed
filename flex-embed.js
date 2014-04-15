;(function (window, document) {

    "use strict";

    function TabEmbed (element, options) {
        var self = this;

        this.animation = false;

        this.root = null;
        this.elements = [];
        this.length = 0;
        this.selectedIndex = -1;
        this.selectedElement = null;

        this.queueElement = null;

        this.initRootObject(element);
        this.initElementsArray();
        this.initOptions(options);

        this.length = this.elements.length;

        this.selectedElement = this.__get__selectedElement();
        this.selectedIndex = this.selectedElement.index;

        this.elements.forEach(function (element) {
	        element.tab.addEventListener('click', function (event) {
	            event.preventDefault();

	            var name = this.getAttribute("data-controls")
	              , element = self.namedElement(name);

	            self.select(element);
	        });

            if (self.animation) {
                element.tabpanel.addEventListener(self.animation.event.start, function (event) { self.handleAnimationEvents(event) });
                element.tabpanel.addEventListener(self.animation.event.end, function (event) { self.handleAnimationEvents(event) });
            }
	    });
    }

    TabEmbed.prototype.initRootObject = function (element) {
        if (typeof element === "string") {
            this.root = document.querySelector(element);
        }
        else {
            this.root = element;
        }

        if (!this.root || !("nodeName" in this.root) || !this.root.classList.contains("TabEmbed")) {
            throw new Error("TabEmbed first argument should be a valid CSS selector or an Element object.");
        }
    }

    TabEmbed.prototype.initElementsArray = function () {
        var self = this
          , index = 0;

        Array.prototype.forEach.call(
            self.root.querySelectorAll(".TabEmbed-tab")
          , function (tab) {
                var name = tab.getAttribute("data-controls")
                  , selected = tab.hasAttribute("data-selected")
                  , tabpanel = document.getElementById(name);

                if (tabpanel && ("nodeName" in tabpanel) && (self.root == tabpanel.parentNode)) {
                    self.elements[index] = {
                        "index": index
                      , "defaultSelected": selected
                      , "disabled": false
                      , "selected": selected
                      , "name": name
                      , "tab": tab
                      , "tabpanel": tabpanel
                    };

                    index++;
                }
            }
        );

        if (!self.elements.length) {
          throw new Error("…");
        }
    }

    TabEmbed.prototype.initOptions = function (options) {
        options = options || {};

        if (window.getComputedStyle) {
            var style = window.getComputedStyle(this.root, "::before").content;
                style = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, "");

            try {
                options = JSON.parse(style);
            }
            catch (e) {
                throw new Error("…");
            }
        }

        var animationEvent = "AnimationEvent" in window ? 0 : "WebKitAnimationEvent" in window ? 1 : -1;

        if ((animationEvent !== -1) && (typeof options.animation === "object")) {
            this.animation = options.animation;
            this.animation.playState = "paused";
            this.animation.event = [{start: "animationstart", end: "animationend"},{start: "webkitAnimationStart", end: "webkitAnimationEnd"}][animationEvent];
        }
    }

    TabEmbed.prototype.element = function(index) {
        return this.elements[index] || null;
    }

    TabEmbed.prototype.namedElement = function(name) {
        var index = 0;

        for (;index < this.length; index++) {
            if (name === this.elements[index].name) {
                return this.elements[index];
            }
        }

        return null;
    }

    TabEmbed.prototype.select = function(element) {
        if (!~this.elements.indexOf(element) || (element == this.selectedElement)) {
            return;
        }

        if (this.animation && (this.animation.playState == "running")) {
            return;
        }

        if (this.animation) {
            this.queueElement = element;
            this.selectedElement.tabpanel.setAttribute('data-animation', "out");
        }
        else {
            this.change(element);
        }
    }

    TabEmbed.prototype.handleAnimationEvents = function (event) {
        if (this.animation.name.indexOf(event.animationName) != -1) {
            switch (event.type) {
                case "webkitAnimationStart":
                case "animationstart":
                    this.animation.playState = "running";
                break;

                case "webkitAnimationEnd":
                case "animationend":
                    var tabpanel = event.srcElement || event.target;

                    if (tabpanel.getAttribute('data-animation') == "out") {
                        this.queueElement.tabpanel.setAttribute('data-animation', "in");
                        this.change(this.queueElement);
                        this.queueElement = null;
                    }

                    tabpanel.removeAttribute("data-animation");
                    this.animation.playState = "paused";
                break;
            }
        }
    }

    TabEmbed.prototype.change = function(element) {
        var nextElement = element
          , nextIndex = this.elements.indexOf(element);

        this.selectedElement.tab.removeAttribute("data-selected");
        this.selectedElement.tabpanel.setAttribute("data-hidden", "");

        this.elements[this.selectedIndex].selected = false;

        nextElement.tab.setAttribute("data-selected", "");
        nextElement.tabpanel.removeAttribute("data-hidden");

        this.selectedElement = nextElement;
        this.selectedIndex = nextIndex;
        this.elements[nextIndex].selected = true;
    }

    TabEmbed.prototype.__get__selectedElement = function() {
    	var index = 0;

        for (;index < this.length; index++) {
            if (this.elements[index].selected) {
                return this.elements[index];
            }
        }

    	return null;
    }

    function CSSAnimations() {
        var styleTest = document.createElement("div").style
          , prefixes = "webkit o MS".split(" ")
          , index = -1
          , length = prefixes.length;

        if (typeof styleTest.animationName == "string") {
            return true;
        }

        while(++index < length) {
            if(typeof styleTest[prefixes[index] + 'AnimationName'] == "string") {
                return true;
            }
        }

        return false;
    }

    window.TabEmbed = TabEmbed;

}(window, document));
