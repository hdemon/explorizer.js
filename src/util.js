(function(exp) {

var util;
util = (function(core) {
    var ua = navigator.userAgent;
    
    function delayTrigger (event, startX, startY, threshold, removeTrigDelayer, callback) {
        // calculate torelance range.
        var outOfRange = (
            Math.sqrt(
                Math.pow((event.pageX - startX), 2) +
                Math.pow((event.pageY - startY), 2) 
           ) > threshold
       );

        if (outOfRange) {
            removeTrigDelayer();
            callback();
        }
    }

    return {
        browser : {
            "chrome"    : (ua.indexOf("Chrome") !== -1),
            "firefox"   : (ua.indexOf("Firefox")!== -1),
            "ie"        : (ua.indexOf("MSIE")   !== -1),
            "opera"     : (ua.indexOf("Opera")  !== -1),
            "safari"    : (ua.indexOf("safari") !== -1)
        },
                
        preventSelect : function() {
            return (
                this.browser.ie || this.browser.firefox
                    ? "onmousemove=\"window.getSelection().removeAllRanges();\"" 
                    : ""
           )
        },
        
        createDiv : function($target, name_, formId) {
            $target
                .append(
                    "<div " +
                        "class=\""+
                            core.pref + name_ + " " +
                            core.pref + core.lb.form + "_" + formId +
                        "\" " +
                        this.preventSelect() +
                    ">" +
                    "</div>"   );
            
            return $("." + core.pref + core.lb.form + "_" + formId)
                    .filter("." + core.pref + name_)
        },

        parser : function ($target) {
            var formId  = $target.attr("class").match(/form_[0-9999]{1,}/)[0].slice(5)-0,
               // part    = $target.attr("class").match(/elem_[0-9999]/)[0].slice(5),
                _elemId = $target.attr("class").match(/elem_[0-9999]{1,}/);
            var elemId  = (_elemId !== null ? _elemId[0].slice(5)-0 : false);
                    
            return {
                "formId" : formId,
  //              "part"   : part,
                "elemId" : elemId
            }
        },
            
        setTrigDelayer : function (startX, startY, torelance, callback) {
            this.mouseMove_delayer = function (event) {
                delayTrigger(
                    event,
                    startX, startY,
                    torelance,
                    this.removeTrigDelayer,
                    callback
               );
            };
            $(window).bind("mousemove", this.mouseMove_delayer.bind(this));
        },

        removeTrigDelayer : function (event) {
            $(window).unbind("mousemove");
        }
    }
}(exp.core));

exp.util = util;
})(exp);
