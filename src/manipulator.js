(function(exp){

var manipulator;
manipulator = (function(core, util){
    var $cursor,           
        active      = false, 
        baseFormId,
        elemNum,
        mode;
    
    function dragElement_(event) {
        setCurStatus_(event.ctrlKey);
        displayCursor_(event.pageX, event.pageY);
    }

    function setCurStatus_(ctrlKey) {
        var newClass =
            ctrlKey 
                ? (core.lb.cursor_copy)
                : (core.lb.cursor_move);

        if ($cursor != null){
            $cursor
                .removeClass(core.lb.cursor_copy)
                .removeClass(core.lb.cursor_move)
                .addClass(newClass);
        }

        mode = (ctrlKey) ? "copy" : "move"; 
    }

    function displayCursor_(x, y) {
        $cursor
            .css({
                "top"    : y,
                "left"    : x
            })
            .children()
            .text(elemNum);
    }

    function createCursor_() {
        $("body")
            .append(
                "<div " +
                    "id=\""+
                        core.pref + core.lb.cursor +
                    "\" " +
                    "class=\""+
                        core.lb.cursor_move +
                    "\"" +
                    util.preventSelect() +
                ">" +
                    "<div " +
                        "id=\""+
                            core.pref + core.lb.cursor_text +
                        "\"" +
                        util.preventSelect() +
                    ">" +
                    "</div>" +
                "</div>"
           );    
            
        return $("#" + core.pref + core.lb.cursor);
    }

    function copyElements_($elem, formId) {
        core.get$ct(formId)
            .append($elem.clone());
    }

    function moveElements_($elem, formId) {
        copyElements_($elem, formId);
        $elem.remove();
    }

    return {
        manipulate : function (event, formId) {
            baseFormId = formId;
            elemNum =
                core.get$elem()
                    .filter("." + core.lb.selected +",." + core.lb.preselect)
                    .size();

            util.setTrigDelayer(event.pageX, event.pageY, 18, callback);
            
            function callback() {
                $cursor= createCursor_();
                $(window)
                    .bind("mousemove", dragElement_);
                active = true;
            }
        },

        mouseUp : function (targetFormId, callback) {
            var $elem = $("." + core.lb.selected);

            if (active) {
                if (mode === "copy") copyElements_($elem, targetFormId);
                else if (mode === "move") moveElements_($elem, targetFormId);
                
                callback(baseFormId);
            }

            targetFormId = null;
            active = false;

            this.removeCursor();
        },
        
        isActive : function() {
            return active;
        },
        
        setCurStatus : function (ctrlKey) {
            setCurStatus_(ctrlKey);
        },
        
        removeCursor : function () {
            if (typeof $cursor !== "undefined") $cursor.remove();
        }
    }    
}(exp.core, exp.util, exp.core.mod));

exp.manipulator = manipulator;
})(exp);
