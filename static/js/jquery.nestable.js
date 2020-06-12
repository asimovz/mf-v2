/*!
 * Nestable jQuery Plugin - Copyright (c) 2012 David Bushell - http://dbushell.com/
 * Dual-licensed under the BSD or MIT licenses
 */

;(function($, window, document, undefined)
{
    var hasTouch = 'ontouchstart' in document;
    // if(!window.nestDragArr)  window.nestDragArr = []
    /**
     * Detect CSS pointer-events property
     * events are normally disabled on the dragging element to avoid conflicts
     * https://github.com/ausi/Feature-detection-technique-for-pointer-events/blob/master/modernizr-pointerevents.js
     */
    var hasPointerEvents = (function()
    {
        var el    = document.createElement('div'),
            docEl = document.documentElement;
        if (!('pointerEvents' in el.style)) {
            return false;
        }
        el.style.pointerEvents = 'auto';
        el.style.pointerEvents = 'x';
        docEl.appendChild(el);
        var supports = window.getComputedStyle && window.getComputedStyle(el, '').pointerEvents === 'auto';
        docEl.removeChild(el);
        return !!supports;
    })();


    var defaults = {
            listNodeName    : 'ol',
            itemNodeName    : 'li',
            rootClass       : 'nest-tree-root',
            listClass       : 'nest-tree-group',
            itemClass       : 'nest-tree-item',
            emptyClass      : 'nest-tree-empty',
            placeClass      : 'nest-tree-placeholder',


            dragClass       : 'nest-dragel',
            handleClass     : 'nest-handle',
            noDragClass     : 'nest-nodrag',
            
            collapsedClass  : 'nest-collapsed',
            expandBtnHTML   : '<span data-action="expand" class="nest-collapse">展开</span>',
            collapseBtnHTML : '<span data-action="collapse" class="nest-collapse">收缩</span>',
            deleteBtnHTML : '<span class="nest-delete"></span>',
            group           : 0,
            maxDepth        : 5,
            threshold       : 20,

            deleteClass: 'nest-delete',
            opacityClass: 'nest-opacity',
            moveOutClass: 'nest-move-out',
            contentClass: 'nest-tree-content',
            isClone:false,
            isDelete: false,
            isSort:true,
            isSubLevel:true,
            formId:null,
        };

    function Plugin(element, options)
    {
        this.w  = $(document);
        this.el = $(element);
        this.options = $.extend({}, defaults, options);

        if(this.options.isClone) {
            this.options.isSort = false
        }
        if(this.options.isDelete) {
            this.options.isSort = false
            this.options.isClone = true
        }

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var list = this;
            var opt = list.options
            list.reset();
            list.el.data('nestable-group', this.options.group);
            list.el.data('isSort', this.options.isSort);
            list.el.data('isSubLevel', this.options.isSubLevel);

            list.placeEl = $('<div class="' + list.options.placeClass + '"/>');

            var compareArr = []
            var key = "path"

            $.each(this.el.find(list.options.itemNodeName), function(k, el) {
                list.setParent($(el));
                if(opt.formId) compareArr.push($(el).children("." + opt.contentClass).data(key))
            });

            if (this.el.find(list.options.itemNodeName).length == 0) {
                this.el.append('<div class="' + list.options.emptyClass + '"/>');
            }

            var delParentNode = function(child) {
                var originElParent = child.parents(opt.itemNodeName)
                originElParent.each(function(index, el) {
                    $(el).removeClass(opt.moveOutClass)
                    $(el).removeClass(opt.opacityClass)
                });
            }

            if(opt.formId) {
                var formRootEl = $("#" + opt.formId)
                formRootEl.find(opt.itemNodeName).each(function(index, el) {
                    var itemName = $(el).children("." + opt.contentClass).data(key)
                    var itemIndex = $.inArray(itemName, compareArr)
                    if(itemIndex > -1) {
                        $(el).addClass(opt.opacityClass)
                        $(el).addClass(opt.noDragClass)
                        $(el).addClass(opt.moveOutClass)
                        delParentNode($(el))
                    }
                });
            }


            list.el.on('click', '.nest-collapse', function(e) {
                if (list.dragEl) {
                    return;
                }
                var target = $(e.currentTarget),
                    action = target.data('action'),
                    item   = target.parent(list.options.itemNodeName);
                if (action === 'collapse') {
                    list.collapseItem(item);
                }
                if (action === 'expand') {
                    list.expandItem(item);
                }
            });




            list.el.on('click', '.'+ opt.deleteClass, function(e) {
                var key = "path"
                var btn = $(e.target)
                var parent = btn.closest(opt.itemNodeName)
                // var target = parent.children(".nest-tree-content")[0].dataset.targetIndex
                var delArr = [parent.children("." + opt.contentClass).data(key)]
                var delElArr = [parent]
                var formRootEl = $("#" + opt.formId) || list.el.data("target") 

                parent.find(opt.itemNodeName).each(function(index, el) {
                    delArr.push($(el).children("." + opt.contentClass).data(key))
                    delElArr.push($(el))
                });

                formRootEl.find(opt.itemNodeName).each(function(index, el) {
                    var itemName = $(el).children("." + opt.contentClass).data(key)
                    var itemIndex = $.inArray(itemName, delArr)
                    if(itemIndex > -1) {
                        var toEl = delElArr[itemIndex].children("." + opt.contentClass)
                        var toElParent = toEl.parent()
                        var formEl = $(el).children("." + opt.contentClass)
                        var formElParent = formEl.parent()
                        formEl.replaceWith(toEl);
                        toElParent.remove()
                        formElParent.removeClass(opt.opacityClass)
                        formElParent.removeClass(opt.noDragClass)
                        formElParent.removeClass(opt.moveOutClass)
                        formElParent.find("."+opt.deleteClass).remove()
                        delParentNode(formElParent)
                    }
                });
                list.el.trigger('change');
                this.remove()
                if (!list.el.find(opt.itemNodeName).length) {
                    list.el.find(opt.listNodeName).remove()
                    list.el.append('<div class="' + opt.emptyClass + '"/>');
                }
            });

            var onStartEvent = function(e) {
                var handle = $(e.target);
                if (!handle.hasClass(list.options.handleClass)) {
                    if (handle.closest('.' + list.options.noDragClass).length) {
                        return;
                    }
                    handle = handle.closest('.' + list.options.handleClass);
                }
                if (!handle.length || list.dragEl) {
                    return;
                }
                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }
                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };



            var onStartEvent = function(e)
            {
                var handle = $(e.target);
                var handleParnet = handle.parent()
                if(handleParnet.hasClass(list.options.noDragClass)) {
                    return
                }

                if (!handle.hasClass(list.options.handleClass)) {
                    handle = handle.closest('.' + list.options.handleClass);
                }

                if (!handle.length || list.dragEl) {
                    return;
                }

                list.isTouch = /^touch/.test(e.type);
                if (list.isTouch && e.touches.length !== 1) {
                    return;
                }

                e.preventDefault();
                list.dragStart(e.touches ? e.touches[0] : e);
            };

            var onMoveEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragMove(e.touches ? e.touches[0] : e);
                }
            };

            var onEndEvent = function(e)
            {
                if (list.dragEl) {
                    e.preventDefault();
                    list.dragStop(e.touches ? e.touches[0] : e);
                }
            };

            if (hasTouch) {
                list.el[0].addEventListener('touchstart', onStartEvent, false);
                window.addEventListener('touchmove', onMoveEvent, false);
                window.addEventListener('touchend', onEndEvent, false);
                window.addEventListener('touchcancel', onEndEvent, false);
            }

            list.el.on('mousedown', onStartEvent);
            list.w.on('mousemove', onMoveEvent);
            list.w.on('mouseup', onEndEvent);

        },

        serialize: function()
        {
            var data,
                depth = 0,
                list  = this;
                step  = function(level, depth)
                {
                    var array = [],
                        items = level.children(list.options.itemNodeName);
                    items.each(function()
                    {
                        var li   = $(this),
                            item = $.extend({}, li.children("." + list.options.contentClass)[0].dataset),
                            sub  = li.children(list.options.listNodeName);
                        if (sub.length) {
                            item.children = step(sub, depth + 1);
                        }
                        array.push(item);
                    });
                    return array;
                };
            data = step(list.el.find(list.options.listNodeName).first(), depth);
            return data;
        },

        serialise: function()
        {
            return this.serialize();
            
        },
        autoScroll(pos,rootEl,evt) {
            let scrollEl = rootEl
            let x = pos.nowX, y = pos.nowY,scrollOffsetY
            let sens = 80, speed = 8, dragH = evt.getBoundingClientRect().height

            do {
                if(scrollEl.offsetHeight + 10 < scrollEl.scrollHeight ) {
                    break
                }
            } while (scrollEl = scrollEl.parentNode);
            
            if (scrollEl) {
                rect = scrollEl.getBoundingClientRect();
                if(x > rect.width + rect.x) return
                // vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
                vy = (Math.abs(rect.bottom - dragH - y) <= sens) - (Math.abs(rect.top - y) <= sens);
                scrollOffsetY = vy ? vy * speed : 0;
                if(scrollOffsetY != 0) {
                    scrollEl.scrollTop += scrollOffsetY;
                }
            }
        },
        reset: function()
        {
            this.mouse = {
                offsetX   : 0,
                offsetY   : 0,
                startX    : 0,
                startY    : 0,
                lastX     : 0,
                lastY     : 0,
                nowX      : 0,
                nowY      : 0,
                distX     : 0,
                distY     : 0,
                dirAx     : 0,
                dirX      : 0,
                dirY      : 0,
                lastDirX  : 0,
                lastDirY  : 0,
                distAxX   : 0,
                distAxY   : 0
            };
            this.isTouch    = false;
            this.moving     = false;
            this.dragEl     = null;
            this.dragRootEl = null;
            this.dragDepth  = 0;
            this.hasNewRoot = false;
            this.pointEl    = null;

            this.formId = null
            this.originEl = null
            this.originRootEl = null
        },

        expandItem: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action="expand"]').hide();
            li.children('[data-action="collapse"]').show();
            li.children(this.options.listNodeName).show();
        },

        collapseItem: function(li)
        {
            var lists = li.children(this.options.listNodeName);
            if (lists.length) {
                li.addClass(this.options.collapsedClass);
                li.children('[data-action="collapse"]').hide();
                li.children('[data-action="expand"]').show();
                li.children(this.options.listNodeName).hide();
            }
        },

        expandAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.expandItem($(this));
            });
        },

        collapseAll: function()
        {
            var list = this;
            list.el.find(list.options.itemNodeName).each(function() {
                list.collapseItem($(this));
            });
        },

        setParent: function(li)
        {
            if (li.children(this.options.listNodeName).length) {
                 var obj = li.children("."+this.options.contentClass)
                 obj.before($(this.options.expandBtnHTML));
                 obj.before($(this.options.collapseBtnHTML));
            }
            li.children('[data-action="expand"]').hide();
        },

        unsetParent: function(li)
        {
            li.removeClass(this.options.collapsedClass);
            li.children('[data-action]').remove();
            li.children(this.options.listNodeName).remove();
        },

        dragStart: function(e)
        {
            var mouse    = this.mouse,
                target   = $(e.target),
                dragItem = target.closest(this.options.itemNodeName);

            this.placeEl.css('height', dragItem.height());

            mouse.offsetX = e.offsetX !== undefined ? e.offsetX : e.pageX - target.offset().left;
            mouse.offsetY = e.offsetY !== undefined ? e.offsetY : e.pageY - target.offset().top;
            mouse.startX = mouse.lastX = e.pageX;
            mouse.startY = mouse.lastY = e.pageY;

            this.dragRootEl = this.el;
            this.dragEl = $(document.createElement(this.options.listNodeName)).addClass(this.options.listClass + ' ' + this.options.dragClass);
            this.dragEl.css('width', dragItem.width());


            if(this.options.isClone) {
                var cloneEl = dragItem.clone()
                dragItem.after(cloneEl);
                dragItem.appendTo(this.dragEl); 
                cloneEl.addClass(this.options.opacityClass)
                cloneEl.find(this.options.itemNodeName).addClass(this.options.opacityClass)

                this.originEl = cloneEl
            } else {
                dragItem.after(this.placeEl);
                dragItem[0].parentNode.removeChild(dragItem[0]);
                dragItem.appendTo(this.dragEl);
                this.originEl = dragItem
            }
            this.originRootEl = this.originEl.closest('.' + this.options.rootClass)

            $(document.body).append(this.dragEl);
            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });
            // total depth of dragging item
            var i, depth,
                items = this.dragEl.find(this.options.itemNodeName);
            for (i = 0; i < items.length; i++) {
                depth = $(items[i]).parents(this.options.listNodeName).length;
                if (depth > this.dragDepth) {
                    this.dragDepth = depth;
                }
            }
        },

        dragStop: function(e)
        {
            var opt = this.options
            var el = this.dragEl.children(opt.itemNodeName).first();
            el[0].parentNode.removeChild(el[0]);
            this.placeEl.replaceWith(el);
            this.dragEl.remove();
            this.el.trigger('change');

            if(this.originRootEl[0]) {
               var rootEl = this.originRootEl
            } else {
                var rootEl = el.closest('.' + this.options.rootClass)
            }
            var hasNewRoot = this.dragRootEl.data('nestable-id') !== rootEl.data('nestable-id')

            if (hasNewRoot) {
                
                //禁止原始item移动
                if(opt.isDelete) {
                    this.originEl.addClass(opt.moveOutClass).addClass(opt.noDragClass)
                    this.originEl.find(opt.itemNodeName).addClass(opt.noDragClass).addClass(opt.moveOutClass)
                } else {
                    this.originEl.removeClass(opt.opacityClass).find(opt.itemNodeName).removeClass(opt.opacityClass)
                }

                //拖拽item集合，添加删除按钮
                if(opt.isDelete||opt.isClone) {
                    var hasDelete
                    if(el.hasClass(opt.deleteClass)) {
                        hasDelete = true
                    } else {
                        hasDelete = false
                    }

                    if(!hasDelete) el.children("." + opt.contentClass).prepend(opt.deleteBtnHTML)
                    el.find("li").each(function(index, ele) {
                        if($(ele).hasClass(opt.opacityClass)) {
                            $(ele).remove()
                        } else {
                            if(!hasDelete) $(ele).children("." + opt.contentClass).prepend(opt.deleteBtnHTML)
                        }
                        
                    });
                    
                }
                
                // el.remove()
            } else {
                if(opt.isClone) {
                    this.originEl.after(el);
                    this.originEl.remove()
                }
            }
            this.dragRootEl.trigger('change');
            this.dragRootEl.data("target",this.originRootEl)
            this.reset();
        },

        dragMove: function(e)
        {
            var list, parent, prev, next, depth,
                opt   = this.options,
                mouse = this.mouse;

            this.dragEl.css({
                'left' : e.pageX - mouse.offsetX,
                'top'  : e.pageY - mouse.offsetY
            });

            // mouse position last events
            mouse.lastX = mouse.nowX;
            mouse.lastY = mouse.nowY;
            // mouse position this events
            mouse.nowX  = e.pageX;
            mouse.nowY  = e.pageY;
            // distance mouse moved between events
            mouse.distX = mouse.nowX - mouse.lastX;
            mouse.distY = mouse.nowY - mouse.lastY;
            // direction mouse was moving
            mouse.lastDirX = mouse.dirX;
            mouse.lastDirY = mouse.dirY;
            // direction mouse is now moving (on both axis)
            mouse.dirX = mouse.distX === 0 ? 0 : mouse.distX > 0 ? 1 : -1;
            mouse.dirY = mouse.distY === 0 ? 0 : mouse.distY > 0 ? 1 : -1;
            // axis mouse is now moving on
            var newAx   = Math.abs(mouse.distX) > Math.abs(mouse.distY) ? 1 : 0;

            // do nothing on first move
            if (!mouse.moving) {
                mouse.dirAx  = newAx;
                mouse.moving = true;
                return;
            }

            // calc distance moved on this axis (and direction)
            if (mouse.dirAx !== newAx) {
                mouse.distAxX = 0;
                mouse.distAxY = 0;
            } else {
                mouse.distAxX += Math.abs(mouse.distX);
                if (mouse.dirX !== 0 && mouse.dirX !== mouse.lastDirX) {
                    mouse.distAxX = 0;
                }
                mouse.distAxY += Math.abs(mouse.distY);
                if (mouse.dirY !== 0 && mouse.dirY !== mouse.lastDirY) {
                    mouse.distAxY = 0;
                }
            }
            mouse.dirAx = newAx;

            this.autoScroll(mouse,this.el[0],this.dragEl[0])

            var isEmpty = false;
            // find list item under cursor
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'hidden';
            }
            this.pointEl = $(document.elementFromPoint(e.pageX - document.body.scrollLeft, e.pageY - (window.pageYOffset || document.documentElement.scrollTop)));
            if (!hasPointerEvents) {
                this.dragEl[0].style.visibility = 'visible';
            }
            if (this.pointEl.hasClass(opt.handleClass)) {
                this.pointEl = this.pointEl.parent(opt.itemNodeName);
            } 
            // else {
            //     if(!this.pointEl.hasClass(opt.emptyClass)) {
            //         this.pointEl = this.pointEl.closest(opt.itemNodeName);
            //     }
            // }


            // find parent list of item under cursor
            var pointElRoot = this.pointEl.closest('.' + opt.rootClass),
                isNewRoot   = this.dragRootEl.data('nestable-id') !== pointElRoot.data('nestable-id');



            /**
             * move horizontal
             */
            if (mouse.dirAx && mouse.distAxX >= opt.threshold && pointElRoot.data("isSubLevel")) {
                // reset move distance on x-axis for new phase
                mouse.distAxX = 0;
                prev = this.placeEl.prev(opt.itemNodeName);
                // increase horizontal level if previous sibling exists and is not collapsed
                if (mouse.distX > 0 && prev.length && !prev.hasClass(opt.collapsedClass)) {
                    // cannot increase level when item above is collapsed
                    list = prev.find(opt.listNodeName).last();
                    // check if depth limit has reached
                    depth = this.placeEl.parents(opt.listNodeName).length;
                    if (depth + this.dragDepth <= opt.maxDepth) {
                        // create new sub-level if one doesn't exist
                        if (!list.length) {
                            list = $('<' + opt.listNodeName + '/>').addClass(opt.listClass);
                            list.append(this.placeEl);
                            prev.append(list);
                            this.setParent(prev);
                        } else {
                            // else append to next level up
                            list = prev.children(opt.listNodeName).last();
                            list.append(this.placeEl);
                        }
                    }
                }

                // decrease horizontal level
                if (mouse.distX < 0 && pointElRoot.data("isSubLevel")) {
                    // we can't decrease a level if an item preceeds the current one
                    next = this.placeEl.next(opt.itemNodeName);
                    if (!next.length) {
                        parent = this.placeEl.parent();
                        this.placeEl.closest(opt.itemNodeName).after(this.placeEl);
                        if (!parent.children().length) {
                            this.unsetParent(parent.parent());
                        }
                    }
                }
            }

            if (this.pointEl.hasClass(opt.emptyClass)) {
                isEmpty = true;
            } else if (!this.pointEl.length || !this.pointEl.hasClass(opt.itemClass)) {
                return;
            }

            /**
             * move vertical
             */
            if(pointElRoot.data('isSort')) {

                if (!mouse.dirAx || isNewRoot || isEmpty) {
                    // check if groups match if dragging over new root
     
                    if (isNewRoot && opt.group !== pointElRoot.data('nestable-group')) {
                        return;
                    }
                    // check depth limit
                    depth = this.dragDepth - 1 + this.pointEl.parents(opt.listNodeName).length;
                    if (depth > opt.maxDepth) {
                        return;
                    }
                    var before = e.pageY < (this.pointEl.offset().top + this.pointEl.height() / 2);
                        parent = this.placeEl.parent();
                    // if empty create new list to replace empty placeholder

                    if (isEmpty) {
                        list = $(document.createElement(opt.listNodeName)).addClass(opt.listClass);
                        list.append(this.placeEl);
                        this.pointEl.replaceWith(list);
                    }
                    else if (before) {
                        this.pointEl.before(this.placeEl);
                    }
                    else {
                        this.pointEl.after(this.placeEl);
                    }
                    if (!parent.children().length) {
                        this.unsetParent(parent.parent());
                    }
                    if (!this.dragRootEl.find(opt.itemNodeName).length) {
                        this.dragRootEl.append('<div class="' + opt.emptyClass + '"/>');
                    }
                    // parent root list has changed
                    if (isNewRoot) {
                        this.dragRootEl = pointElRoot;
                        this.hasNewRoot = this.el[0] !== this.dragRootEl[0];
                    }
                }
            }

        }

    };

    $.fn.nestable = function(params)
    {
        var lists  = this,
            retval = this;
        lists.each(function()
        {
            var plugin = $(this).data("nestable");


            if (!plugin) {
                $(this).data("nestable", new Plugin(this, params));
                $(this).data("nestable-id", new Date().getTime()+Math.random()*10);
            } else {
                if (typeof params === 'string' && typeof plugin[params] === 'function') {
                    retval = plugin[params]();
                }
            }
        });

        return retval || lists;
    };

})(window.jQuery || window.Zepto, window, document);
