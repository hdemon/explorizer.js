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
        browser    : {
            "chrome"    : (ua.indexOf("Chrome")     !== -1),
            "firefox"    : (ua.indexOf("Firefox")    !== -1),
            "ie"        : (ua.indexOf("MSIE")        !== -1),
            "opera"        : (ua.indexOf("Opera")    !== -1),
            "safari"    : (ua.indexOf("safari")    !== -1)
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
                            core.pref +  name_ +
                        "\" " +
                        "id=\""+
                            core.pref + formId +"_"+ name_ +
                        "\" " +
                        this.preventSelect() +
                    ">" +
                    "</div>"   );
            return    $("#" + core.pref + formId +"_"+ name_);
        },

        parser : function ($target) {
            var str     = $target.attr("id").split("_"),
                formId  = str[1]-0,
                part    = str[2],
                elemId  = str[3]-0;

            return {
                "formId" : formId,
                "part"   : part,
                "elemId" : (typeof elemId !== "undefined") ? elemId : false
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
