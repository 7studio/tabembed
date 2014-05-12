;(function (window, document) {

    "use strict"

    function TabEmbed (element, options) {
        var tabembed = this

        this.animation = false
        this.hashchange = false

        this.root = null
        this.elements = []
        this.length = 0
        this.selectedIndex = -1
        this.selectedElements = []

        this._initRootObject(element)
        this._initElementsArray()
        this._initSelectedElementsArray()
        this._initOptions(options)

        this.length = this.elements.length
        this.selectedIndex = this.selectedElements[0].index

        if (this.animation) {
            this.elements.forEach(function (element) {
                element.tabpanel.addEventListener("animationstart", function (event) { tabembed._handleAnimationEvents(event) })
                element.tabpanel.addEventListener("animationend", function (event) { tabembed._handleAnimationEvents(event) })
            })
        }

        if (this.hashchange) {
            window.addEventListener("load", function (event) { tabembed._handleHashEvents(event) })
            window.addEventListener("hashchange", function (event) { tabembed._handleHashEvents(event) })
        }
    }

    TabEmbed.prototype._initRootObject = function (element) {
        if ("string" == typeof element) {
            this.root = document.querySelector(element)
        }
        else {
            this.root = element
        }

        if (!this.root || !("nodeName" in this.root) || !this.root.classList.contains("TabEmbed")) {
            throw new Error("TabEmbed first argument should be a valid CSS selector or an Element object.")
        }
    }

    TabEmbed.prototype._initElementsArray = function () {
        var tabembed = this
          , index = 0

        Array.prototype.forEach.call(
            this.root.querySelectorAll(".TabEmbed-tab")
          , function (tab) {
                var name = tab.getAttribute("data-controls")
                  , selected = tab.hasAttribute("data-selected")
                  , tabpanel = document.getElementById(name)

              //if (tabpanel && ("nodeName" in tabpanel) && (tabembed.root === tabpanel.parentNode)) {
                if (tabpanel && ("nodeName" in tabpanel)) {
                    tabembed.elements[index] = {
                        "index": index
                      , "defaultSelected": selected
                      , "disabled": false
                      , "selected": selected
                      , "name": name
                      , "tab": tab
                      , "tabpanel": tabpanel
                    }

                    index++
                }
            }
        )

        if (!this.elements.length) {
            throw new Error("…")
        }
    }

    TabEmbed.prototype._initSelectedElementsArray = function () {
        this.selectedElements = this.elements.filter(function (value) { return value.selected })

        if (this.selectedElements.length > -1) {
            this.selectedElements.sort(function (a, b) { return a.index > b.index ? 1 : -1 })
        }

        if (!this.selectedElements.length) {
            throw new Error("…")
        }
    }

    TabEmbed.prototype._initOptions = function (options) {
        var options = options || {}
          , style = window.getComputedStyle(this.root, "::before").content

        style = style.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, "")

        if ("null" !== style) {
            try {
                options = JSON.parse(style)
            }
            catch (e) {
                throw new Error("…");
            }
        }

        if (("AnimationEvent" in window) && ("object" === typeof options.animation)) {
            this.animation = options.animation
            this.animation.playState = "paused"
        }

        if (options.hasOwnProperty("hashchange")) {
            this.hashchange = ("onhashchange" in window) && ("history" in window) && !!options.hashchange
        }
    }

    TabEmbed.prototype._handleAnimationEvents = function (event) {
        if (this.animation.name.indexOf(event.animationName) !== -1) {
            switch (event.type) {
                case "animationstart":
                    this.animation.playState = "running"
                break;

                case "animationend":
                    var tabpanel = event.srcElement || event.target

                    if ("out" === tabpanel.getAttribute("data-animation")) {
                        this.animation._element.tabpanel.setAttribute("data-animation", "in")
                        this._change(this.animation._element)

                        delete this.animation._element
                    }

                    tabpanel.removeAttribute("data-animation")
                    this.animation.playState = "paused"
                break;
            }
        }
    }

    TabEmbed.prototype._handleHashEvents = function (event) {
        var name = window.location.hash.slice(1)
          , element = this.namedElement(name)

        if (null !== element) {
            this.select(element)
        }
    }

    TabEmbed.prototype._change = function(element) {
        this.selectedElements[0].tab.removeAttribute("data-selected")
        this.selectedElements[0].tabpanel.setAttribute("data-hidden", "")

        this.elements[this.selectedIndex].selected = false

        element.tab.setAttribute("data-selected", "")
        element.tabpanel.removeAttribute("data-hidden")

        this.selectedElements = [element]
        this.selectedIndex = this.elements.indexOf(this.selectedElements[0])
        this.elements[this.selectedIndex].selected = true

        if (this.hashchange) {
            history.pushState(null, "", ("#" + this.selectedElements[0].name))
        }
    }

    TabEmbed.prototype.element = function(index) {
        return this.elements[index] || null
    }

    TabEmbed.prototype.namedElement = function(name) {
        var index = 0

        for (;index < this.length; index++) {
            if (name === this.elements[index].name) {
                return this.elements[index]
            }
        }

        return null
    }

    TabEmbed.prototype.select = function(element) {
        if (!~this.elements.indexOf(element) || (this.selectedElements[0] === element)) {
            return
        }

        if (this.animation && ("running" === this.animation.playState)) {
            return
        }

        if (this.animation) {
            this.animation._element = element
            this.selectedElements[0].tabpanel.setAttribute("data-animation", "out")
        }
        else {
            this._change(element)
        }
    }

    window.TabEmbed = TabEmbed

}(window, document))
