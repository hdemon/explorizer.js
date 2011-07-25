(function(exp){

var selector;
selector = (function(core, util){
    var slctBoxId = "slctBox",
        timer = {},
        param = {},
        _preVal,
        $box,
        $preselect = [],
        autoScroll,
        scrollWeight,
        // 
        prevShift,
        prevClicked,
        startId,
        noSelect,
        // event handle
        ehandle_drag;

    function byDrag (
        event,
        startX, startY,
        wrapLeft, wrapTop, wrapHeight,
        xt, yt,
        $iw, $elem, formId
   ) {
        var scrX    = $iw.scrollLeft(),
            scrY    = $iw.scrollTop(),

            xn  = event.pageX - wrapLeft,
            yn  = event.pageY - wrapTop,
            xns = xn + scrX,
            yns = yn + scrY,
            t;

        // calculate and limit range.
        if      (xns > xt)   xns = xt
        else if (xns < 0)    xns = 0  
        if      (yns > yt)   yns = yt
        else if (yns < 0)    yns = 0 

        if (startX > xns) { t = xns; xns = startX; startX = t; }
        if (startY > yns) { t = yns; yns = startY; startY = t; }

        // scroll function for the browser who don't have auto-scroll func. ex ie, opera

        if (core.autoScroll) {
            if      (yn < 0)
                scrollCt( $iw, yn * core.scrollWeight);
            else if (yn > wrapHeight)
                scrollCt( $iw, (yn - wrapHeight) * core.scrollWeight);
            else
                stopScrollCt(); 
        }
        // draw a box that shows selecting range.
        $box
            .css({
                "left"  : startX,
                "top"   : startY,
                "width" : xns-startX,
                "height": yns-startY });

        // determinate whether or not elements are in range
        for (var i = 0, l = $elem.length; i < l; i++) {
            var $e = core.get$elem(formId, i), 
                pos = $e.position();

            var left    = pos.left  + parseInt( $e.css( "margin-left")),
                right   = pos.left  + parseInt( $e.css( "margin-left"))   + $e.width(),
                top     = pos.top   + parseInt( $e.css( "margin-top"))    + scrY,
                bottom  = pos.top   + parseInt( $e.css( "margin-top"))    + scrY + $e.height();

            // in range?
            var outRange = (left > xns || right < startX || top > yns || bottom < startY);
            if (!outRange)
                core.preselectElem(formId, i);
            else if (!event.ctrlKey && !event.shiftKey)
                core.unselectElem(formId, i);
        }
    }

    function scrollCt ($iw, val) {
        if (timer === null || val !== _preVal) {
            clearInterval(timer);
            timer = setInterval(function() {//
                $iw.scrollTop( $iw.scrollTop() + val); 
            }, 1);
            _preVal = val;
        }
    }

    function stopScrollCt() {
        clearInterval(timer);
        timer = null;
    }
    
    function removeBox() {
        if ($box) $box.remove();
    }
    
    return {                
        setParam : function(args) {
            args = args || {};
            autoScroll = args .autoScroll || (util.browser.ie || util.browser.opera);
            scrollWeight = (typeof args .scrollWeight === "undefined") ? 1 : args. scrollWeight;
            return this;
        },

        onElem : function(ctrlKey, shiftKey, formId, clickedId, cb) {                
            var p1, p2, i,
                isSelect = core.isSelect( formId, clickedId);
                                
            if (shiftKey) {
                // shiftを押しながら選択した場合、
                // もしリセット後初めて押したのなら、その1つ前の選択を基点にする。   // 2回目以降であれば、基点は変えない。
                if (!prevShift) startId = prevClicked;
                               
                if (startId > clickedId) {
                    p1 = clickedId,
                    p2 = startId;
                } else {
                    p1 = startId,
                    p2 = clickedId;
                }
                if (!ctrlKey) core.unselectAllElem();
                for (var i = p1, counter = 0; i <= p2; ++i) core.preselectElem( formId, i);
                
                core.cb( cb, "selectWithShift", [ formId, clickedId ]);
            } else if (ctrlKey) {
                if (isSelect) { 
                    core.unselectElem( formId, clickedId);
                    core.cb( cb, "unselectByCtrl", [ formId, clickedId ]);
                } else {
                    core.preselectElem( formId, clickedId);
                    core.cb( cb, "preselectByCtrl", [ formId, clickedId ]);
                 }
            } else if (!ctrlKey) {
                if (isSelect) { 
                    core.cb( cb, "downOnSelected", [ formId, clickedId ]);
                   } else {
                    core.unselectAllElem();
                    core.preselectElem( formId, clickedId);
                    core.cb( cb, "preselect", [ formId, clickedId ]);
                }
            }
            prevClicked = clickedId;
            prevShift = shiftKey;
        },

        onBack : function (x, y, formId) {                
            var $ow     = core.get$ow( formId),
                $iw     = core.get$iw( formId),
                $ct     = core.get$ct( formId),
                $elem   = core.get$elem( formId);
            
            noSelect = true;
            
            // The following logic prevent the status changes into "byDrag" that is caused immediately, 
            // so as to keep the status "mouseDownonNonElement" in case of selecting no elements eventually.
            util.setTrigDelayer( x, y, 1, function() {
                var wrapPos     = $ow.position(),
                    wrapHeight  = $ow.outerHeight(),
                    wrapScrLeft = $iw.scrollLeft(),
                    wrapScrTop  = $iw.scrollTop(),
                    fieldWidth  = $ct.width(),
                    fieldHeight = $ct.height(),

                    wrapLeft    = wrapPos.left,
                    wrapTop     = wrapPos.top,
                    startX      = x - wrapLeft + wrapScrLeft,
                    startY      = y - wrapTop + wrapScrTop,
                    wrapBottom  = wrapTop + wrapHeight,
                    xt          = fieldWidth  -2,
                    yt          = fieldHeight -2;

                noSelect = false;
            
                $box = util.createDiv(
                    $ct,
                    slctBoxId,
                    formId,
                    util.preventSelect()
               );

                // bind new mousemove event.
                ehandle_drag = function (event) {
                    byDrag(
                        event,
                        startX, startY,
                        wrapLeft, wrapTop, wrapHeight,
                        xt, yt,
                        $iw, $elem, formId
                   );
                };

                $(window)
                    .bind( "mousemove", ehandle_drag);
            });
        },

        mouseUp : function() {                
            stopScrollCt();
            removeBox();
            if (noSelect) core.unselectAllElem();
            noSelect = false;
            return this;
        }
    }
}(exp.core, exp.util));

exp.selector = selector;
})(exp);
