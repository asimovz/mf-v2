/*
 Copyright (c) 2012-2018 Open Lab
 Written by Roberto Bicchierai and Silvia Chelazzi http://roberto.open-lab.com
 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
function GridEditor(master) {
    this.master = master; // is the a GantEditor instance
    var editorTabel = $.JST.createFromTemplate({}, "TASKSEDITHEAD");
    if (!master.permissions.canSeeDep) editorTabel.find(".requireCanSeeDep").hide();
    this.gridified = $.gridify(editorTabel);
    this.element = this.gridified.find(".gdfTable").eq(1);
    this.minAllowedDate = new Date(new Date().getTime() - 3600000 * 24 * 365 * 20).format();
    this.maxAllowedDate = new Date(new Date().getTime() + 3600000 * 24 * 365 * 30).format();
}
GridEditor.prototype.fillEmptyLines = function() {
    //console.debug("fillEmptyLines")
    var factory = new TaskFactory();
    var master = this.master;
    //console.debug("GridEditor.fillEmptyLines");
    var rowsToAdd = master.minRowsInEditor - this.element.find(".taskEditRow").length;
    var empty = this.element.find(".emptyRow").length;
    rowsToAdd = Math.max(rowsToAdd, empty > 5 ? 0 : 5 - empty);
    //fill with empty lines
    for (var i = 0; i < rowsToAdd; i++) {
        var emptyRow = $.JST.createFromTemplate({}, "TASKEMPTYROW");
        if (!master.permissions.canSeeDep) emptyRow.find(".requireCanSeeDep").hide();
        //click on empty row create a task and fill above 取消鼠标点击空行新建TASK
        // emptyRow.click(function (ev) {
        //   //console.debug("emptyRow.click")
        //   var emptyRow = $(this);
        //   //add on the first empty row only
        //   if (!master.permissions.canAdd || emptyRow.prevAll(".emptyRow").length > 0)
        //     return;
        //   master.beginTransaction();
        //   var lastTask;
        //   var start = new Date().getTime();
        //   var level = 0;
        //   if (master.tasks[0]) {
        //     start = master.tasks[0].start;
        //     level = master.tasks[0].level + 1;
        //   }
        //   var levelArr = master.tasks.filter(function(item){
        //     return item.level==1
        //   })
        //   //树编号 / 顺序号
        //   var code = level + "." + (levelArr.length+1)
        //   var seque = master.tasks.length + 1 
        //   //fill all empty previouses
        //   var cnt=0;
        //   emptyRow.prevAll(".emptyRow").addBack().each(function () {
        //     cnt++;
        //     var ch = factory.build("tmp_fk" + new Date().getTime()+"_"+cnt, "", code, level, start, Date.workingPeriodResolution);
        //     ch['isFirst'] = true //是否是新建 by asimovz
        //     var task = master.addTask(ch);
        //     lastTask = ch;
        //   });
        //   master.endTransaction();
        //   if (lastTask.rowElement) {
        //     lastTask.rowElement.find("[name=name]").focus();//focus to "name" input
        //   }
        // });
        this.element.append(emptyRow);
    }
};
GridEditor.prototype.addTask = function(task, row, hideIfParentCollapsed) {
    //console.debug("GridEditor.addTask",task,row);
    //var prof = new Profiler("ganttGridEditor.addTask");
    //remove extisting row
    this.element.find("#tid_" + task.id).remove();
    var taskRow = $.JST.createFromTemplate(task, "TASKROW");
    if (!this.master.permissions.canSeeDep) taskRow.find(".requireCanSeeDep").hide();
    if (!this.master.permissions.canSeePopEdit) taskRow.find(".edit .teamworkIcon").hide();
    //save row element on task
    task.rowElement = taskRow;
    this.bindRowEvents(task, taskRow);
    if (typeof(row) != "number") {
        var emptyRow = this.element.find(".emptyRow:first"); //tries to fill an empty row
        if (emptyRow.length > 0) emptyRow.replaceWith(taskRow);
        else this.element.append(taskRow);
    } else {
        var tr = this.element.find("tr.taskEditRow").eq(row);
        if (tr.length > 0) {
            tr.before(taskRow);
        } else {
            this.element.append(taskRow);
        }
    }
    //[expand]
    if (hideIfParentCollapsed) {
        if (task.collapsed) taskRow.addClass('collapsed');
        var collapsedDescendant = this.master.getCollapsedDescendant();
        if (collapsedDescendant.indexOf(task) >= 0) taskRow.hide();
    }
    //prof.stop();
    return taskRow;
};
GridEditor.prototype.refreshExpandStatus = function(task) {
    //console.debug("refreshExpandStatus",task);
    if (!task) return;
    if (task.isParent()) {
        task.rowElement.addClass("isParent");
    } else {
        task.rowElement.removeClass("isParent");
    }
    var par = task.getParent();
    if (par && !par.rowElement.is("isParent")) {
        par.rowElement.addClass("isParent");
    }
};
//更新行数据
GridEditor.prototype.refreshTaskRow = function(task) {
    //console.debug("refreshTaskRow")
    //var profiler = new Profiler("editorRefreshTaskRow");
    var canWrite = this.master.permissions.canWrite || task.canWrite;
    var row = task.rowElement;
    row.find(".taskRowIndex").html(task.getRow() + 1);
    row.find(".indentCell").css("padding-left", task.level * 10 + 18);
    // row.find("[name=name]").val(task.name);
    // row.find("[name=code]").val(task.code);
    // row.find("[name=depends]").val(task.depends);
    // row.find("[name=duration]").val(durationToString(task.duration)).prop("readonly",!canWrite || task.isParent() && task.master.shrinkParent);
    // row.find("[name=progress]").val(task.progress).prop("readonly",!canWrite || task.progressByWorklog==true);
    row.find(".taskName").html(task.name);
    row.find(".taskCode").html(task.code);
    row.find(".taskDuration").html(durationToString(task.duration)).prop("readonly", !canWrite || task.isParent() && task.master.shrinkParent)
    row.find("[name=duration]").val(durationToString(task.duration)).prop("readonly", !canWrite || task.isParent() && task.master.shrinkParent);
    row.find(".progress").html(task.progress).prop("readonly", !canWrite || task.progressByWorklog == true)
    row.find("[name=depends]").val(task.depends);
    row.find("[status]").attr("status", task.status);
    row.find("[name=startIsMilestone]").prop("checked", task.startIsMilestone);
    row.find("[name=endIsMilestone]").prop("checked", task.endIsMilestone);

    row.find("[name=start]").val(new Date(task.start).format('yyyy-MM-dd')).updateOldValue().prop("readonly", !canWrite || task.depends || !(task.canWrite || this.master.permissions.canWrite)); // called on dates only because for other field is called on focus event
    row.find("[name=end]").val(new Date(task.end).format('yyyy-MM-dd')).prop("readonly", !canWrite || task.isParent() && task.master.shrinkParent).updateOldValue();  

    if(!task.isAllot) { //任务未分配时间的话，相关字段界面不显示
      row.find("[name=start]").val("")
      row.find("[name=end]").val("")  
      row.find("[name=duration]").val("")  
      row.find(".taskDuration").html("")  
      row.find(".progress").html("")  
    }


    row.find(".taskAssigs").html(task.getAssigsString());
    //manage collapsed
    if (task.collapsed) row.addClass("collapsed");
    else row.removeClass("collapsed");
    //Enhancing the function to perform own operations
    this.master.element.trigger('gantt.task.afterupdate.event', task);
    //profiler.stop();
};
GridEditor.prototype.redraw = function() {
    //console.debug("GridEditor.prototype.redraw")
    //var prof = new Profiler("gantt.GridEditor.redraw");
    for (var i = 0; i < this.master.tasks.length; i++) {
        this.refreshTaskRow(this.master.tasks[i]);
    }
    // check if new empty rows are needed
    if (this.master.fillWithEmptyLines) this.fillEmptyLines();
    //prof.stop()
};
GridEditor.prototype.reset = function() {
    this.element.find("[taskid]").remove();
};
GridEditor.prototype.bindRowEvents = function(task, taskRow) {
    var self = this;
    //console.debug("bindRowEvents",this,this.master,this.master.permissions.canWrite, task.canWrite);
    taskRow.dblclick(function(ev) { //open editor only if no text has been selected
        if (ev.target.tagName != "INPUT") self.openFullEditor(task, $(ev.target).closest(".taskAssigs").size() > 0)
    });
    //bind row selection
    taskRow.click(function(event) {
        console.log("===============行点击==========")
        var row = $(this);
        //console.debug("taskRow.click",row.attr("taskid"),event.target)
        //var isSel = row.hasClass("rowSelected");
        row.closest("table").find(".rowSelected").removeClass("rowSelected");
        row.addClass("rowSelected");
        //set current task
        self.master.currentTask = self.master.getTask(row.attr("taskId"));
        //move highlighter
        self.master.gantt.synchHighlight();
        //if offscreen scroll to element
        var top = row.position().top;
        if (top > self.element.parent().height()) {
            row.offsetParent().scrollTop(top - self.element.parent().height() + 100);
        } else if (top <= 40) {
            row.offsetParent().scrollTop(row.offsetParent().scrollTop() - 40 + top);
        }
    });
    if (this.master.permissions.canWrite || task.canWrite) {
        self.bindRowInputEvents(task, taskRow);
    } else { //cannot write: disable input
        taskRow.find("input").prop("readonly", true);
        taskRow.find("input:checkbox,select").prop("disabled", true);
    }
    if (!this.master.permissions.canSeeDep) taskRow.find("[name=depends]").attr("readonly", true);
    self.bindRowExpandEvents(task, taskRow);
    if (this.master.permissions.canSeePopEdit) {
        taskRow.find(".edit").click(function() {
            self.openFullEditor(task, false)
        });
        taskRow.find(".delete").click(function() {
            self.deleteOneTask(task)
        });
        // taskRow.dblclick(function (ev) { //open editor only if no text has been selected
        //   if (window.getSelection().toString().trim()=="")
        //     self.openFullEditor(task, $(ev.target).closest(".taskAssigs").size()>0)
        //   });
    }
    //prof.stop();
};
//绑定展开折叠事件
GridEditor.prototype.bindRowExpandEvents = function(task, taskRow) {
    var self = this;
    //expand collapse
    taskRow.find(".exp-controller").click(function() {
        var el = $(this);
        var taskId = el.closest("[taskid]").attr("taskid");
        var task = self.master.getTask(taskId);
        if (task.collapsed) {
            self.master.expand(task, false);
        } else {
            self.master.collapse(task, false);
        }
    });
};

GridEditor.prototype.dropDownInput = function(inputObj,isMilestone,value,isMulti,callback) {
    var self = this
    var valueText = []
    var currentTaskID = self.master.currentTask.id
    var pos = $(inputObj).offset()
    $("#dropDownInputDiv").remove()
    var ul,li = ""
    var tasksArr = self.master.tasks.map(function(item,index){
        var itemIndex = index + 1 + ''
        var selectText = ""
        var dataValue
        if (item.level>0 && item.id != currentTaskID && item.isMilestone == isMilestone) {
            if (isMilestone) {
                if (value.indexOf(item.name) >= 0) {
                   selectText = " class='selected' "
                } 
                dataValue = item.id
            } else {
                if (value.indexOf(itemIndex) >= 0) {
                    selectText = " class='selected' "
                }
                dataValue = index + 1
            }
            li += "<li data='" + dataValue + "' " + selectText + " style='padding-left:" + (item.level-1) * 20 + "px'>" + item.name + "</li>"
        }
    })
    ul = "<ul>"+li+"</ul><button class='dropDownSelectButton'>确定</button>"
    var selectDiv = $("<div id='dropDownInputDiv'></div>")
    selectDiv.html(ul)
    $(inputObj).parent().append(selectDiv)
    //禁止gantt的默认事件
    selectDiv.on('mousewheel dblclick', function(event) {
        event.stopPropagation();
    });
    selectDiv.on('click', 'li', function(event) {
        event.stopPropagation();
        var li = $(this),newV
        var v = li.attr("data")
        var vText = li.html()
        if (!isMulti) {
            value = []
            valueText = []
            $(this).siblings("li").removeClass('selected')
        }
        $(this).toggleClass('selected')
        if (li.hasClass('selected')) {
            value.push(v)
            valueText.push(vText)
        } else {
            value.splice(value.indexOf(v), 1)
            valueText.splice(valueText.indexOf(vText), 1)
        }
        if (value[0] == "") value.splice(0, 1)
        if (valueText[0] == "") valueText.splice(0, 1)

    });

    //点击确认
    selectDiv.on('click', '.dropDownSelectButton', function(event) {
        if (isMilestone) {
            $(inputObj).val(valueText.sort().join(","))
        } else {
            $(inputObj).val(value.sort().join(","))
        }
        callback(value)
        selectDiv.remove()
    })


    //取消弹框
    $('body').click(function(event) {
        if (!(event.target.className == "depends" || event.target.className == "milestoneID")) {
            selectDiv.remove()
        }
    });
}

//绑定行点击编辑事件
GridEditor.prototype.bindRowInputEvents = function(task, taskRow) {
    var self = this;

    // 关联里程碑
    taskRow.find(".milestoneID").click(function(event) {
        if (!task.isTask) return
        var value = this.value.split(",")
        self.dropDownInput(this,true,value,false,function(value){
            var currentSelectTask = self.master.currentTask
            currentSelectTask.milestoneID = value.join(",")
            self.master.co_setEditTaskData(currentSelectTask)
            self.master.co_sendServerData()
        })
    })

    //前置任务点击选择
    taskRow.find(".depends").click(function(event) {
        if (!task.isTask) return
        var depends = this
        var dependValue = this.value.split(",")

        self.dropDownInput(this,false,dependValue,true,function(value){
            self.master.beginTransaction();
            var currentSelectTask = self.master.currentTask
            currentSelectTask.depends = value.join(",");
            // update links
            var linkOK = self.master.updateLinks(currentSelectTask);

            if (linkOK) {
                //synchronize status from superiors states
                var sups = currentSelectTask.getSuperiors();
                var oneFailed = false;
                var oneUndefined = false;
                var oneActive = false;
                var oneSuspended = false;
                var oneWaiting = false;
                for (var i = 0; i < sups.length; i++) {
                    oneFailed = oneFailed || sups[i].from.status == "STATUS_FAILED";
                    oneUndefined = oneUndefined || sups[i].from.status == "STATUS_UNDEFINED";
                    oneActive = oneActive || sups[i].from.status == "STATUS_ACTIVE";
                    oneSuspended = oneSuspended || sups[i].from.status == "STATUS_SUSPENDED";
                    oneWaiting = oneWaiting || sups[i].from.status == "STATUS_WAITING";
                }
                if (oneFailed) {
                    currentSelectTask.changeStatus("STATUS_FAILED")
                } else if (oneUndefined) {
                    currentSelectTask.changeStatus("STATUS_UNDEFINED")
                } else if (oneActive) {
                    //currentSelectTask.changeStatus("STATUS_SUSPENDED")
                    currentSelectTask.changeStatus("STATUS_WAITING")
                } else if (oneSuspended) {
                    currentSelectTask.changeStatus("STATUS_SUSPENDED")
                } else if (oneWaiting) {
                    currentSelectTask.changeStatus("STATUS_WAITING")
                } else {
                    currentSelectTask.changeStatus("STATUS_ACTIVE")
                }
                linkOK = self.master.changeTaskDeps(currentSelectTask); //dates recomputation from dependencies
            }
            self.master.endTransaction();
            //添加修改任务数据，发送后台 by asimovz
            if (linkOK) {
                self.master.co_setEditTaskData(currentSelectTask)
                self.master.co_sendServerData()
            }
        })

    })
    //bind dateField on dates
    taskRow.find(".date").each(function() {
        var el = $(this);
        el.click(function() {
            var inp = $(this);
            inp.dateField({
                inputField: el,
                dateFormat:'yyyy-MM-dd',
                minDate: self.minAllowedDate,
                maxDate: self.maxAllowedDate,
                callback: function(d) {
                    $(this).blur();
                }
            });
        });
        el.blur(function(date) {
            var inp = $(this);
            if (inp.isValueChanged()) {
                if (!Date.isValid(inp.val())) {
                    alert(GanttMaster.messages["INVALID_DATE_FORMAT"]);
                    inp.val(inp.getOldValue());
                } else {
                    var row = inp.closest("tr");
                    var taskId = row.attr("taskId");
                    var task = self.master.getTask(taskId);
                    var leavingField = inp.prop("name");
                    var dates = resynchDates(inp, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
                    //console.debug("resynchDates",new Date(dates.start), new Date(dates.end),dates.duration)
                    //update task from editor
                    self.master.beginTransaction();
                    self.master.changeTaskDates(task, dates.start, dates.end);
                    self.master.endTransaction();
                    console.log("==== 改变时间后 发送数据到服务器 =======")
                    self.master.co_sendServerData()
                    inp.updateOldValue(); //in order to avoid multiple call if nothing changed
                }
            }
        });
    });
    //milestones checkbox
    taskRow.find(":checkbox").click(function() {
        var el = $(this);
        var row = el.closest("tr");
        var taskId = row.attr("taskId");
        var task = self.master.getTask(taskId);
        //update task from editor
        var field = el.prop("name");
        if (field == "startIsMilestone" || field == "endIsMilestone") {
            self.master.beginTransaction();
            //milestones
            task[field] = el.prop("checked");
            resynchDates(el, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
            self.master.endTransaction();
        }
    });
    //binding on blur for task update (date exluded as click on calendar blur and then focus, so will always return false, its called refreshing the task row)
    taskRow.find("input:text:not(.date)").focus(function() {
        if (!task.isTask) this.blur()
        $(this).updateOldValue();
    }).blur(function(event) {

        var el = $(this);
        var row = el.closest("tr");
        var taskId = row.attr("taskId");
        var task = self.master.getTask(taskId);
        if (!task.isTask) return
        //update task from editor
        var field = el.prop("name");
        if (el.isValueChanged()) {
            self.master.beginTransaction();
            if (field == "depends") {
                // var oldDeps = task.depends;
                // task.depends = el.val();
                // console.log(el.val())
                // // update links
                // var linkOK = self.master.updateLinks(task);
                // if (linkOK) {
                //     //synchronize status from superiors states
                //     var sups = task.getSuperiors();
                //     var oneFailed = false;
                //     var oneUndefined = false;
                //     var oneActive = false;
                //     var oneSuspended = false;
                //     var oneWaiting = false;
                //     for (var i = 0; i < sups.length; i++) {
                //         oneFailed = oneFailed || sups[i].from.status == "STATUS_FAILED";
                //         oneUndefined = oneUndefined || sups[i].from.status == "STATUS_UNDEFINED";
                //         oneActive = oneActive || sups[i].from.status == "STATUS_ACTIVE";
                //         oneSuspended = oneSuspended || sups[i].from.status == "STATUS_SUSPENDED";
                //         oneWaiting = oneWaiting || sups[i].from.status == "STATUS_WAITING";
                //     }
                //     if (oneFailed) {
                //         task.changeStatus("STATUS_FAILED")
                //     } else if (oneUndefined) {
                //         task.changeStatus("STATUS_UNDEFINED")
                //     } else if (oneActive) {
                //         //task.changeStatus("STATUS_SUSPENDED")
                //         task.changeStatus("STATUS_WAITING")
                //     } else if (oneSuspended) {
                //         task.changeStatus("STATUS_SUSPENDED")
                //     } else if (oneWaiting) {
                //         task.changeStatus("STATUS_WAITING")
                //     } else {
                //         task.changeStatus("STATUS_ACTIVE")
                //     }
                //     linkOK = self.master.changeTaskDeps(task); //dates recomputation from dependencies
                // }
            } else if (field == "duration") {
                var dates = resynchDates(el, row.find("[name=start]"), row.find("[name=startIsMilestone]"), row.find("[name=duration]"), row.find("[name=end]"), row.find("[name=endIsMilestone]"));
                self.master.changeTaskDates(task, dates.start, dates.end);
            } else if (field == "name" && el.val() == "") { // remove unfilled task
                self.master.deleteCurrentTask(taskId);
            } else if (field == "progress") {
                task[field] = parseFloat(el.val()) || 0;
                el.val(task[field]);
            } else {
                task[field] = el.val();
            }
            self.master.endTransaction();
            //添加修改任务数据，发送后台 by asimovz
            if (linkOK) {
                if (task.isFirst) {
                    console.log("========添加新任务 后台数据成功=========", task)
                    task.isFirst = false
                } else {
                    console.log("========修改任务 后台数据成功=========", field, el.val(), task)
                }
                self.master.co_setEditTaskData(task)
                self.master.co_sendServerData()
            }
        } else if (field == "name" && el.val() == "") { // remove unfilled task even if not changed
            if (task.getRow() != 0) {
                self.master.deleteCurrentTask(taskId);
            } else {
                el.oneTime(1, "foc", function() {
                    $(this).focus()
                }); //
                event.preventDefault();
                //return false;
            }
        }
    });
    //cursor key movement
    taskRow.find("input").keydown(function(event) {
        var theCell = $(this);
        var theTd = theCell.parent();
        var theRow = theTd.parent();
        var col = theTd.prevAll("td").length;
        var ret = true;
        if (!event.ctrlKey) {
            switch (event.keyCode) {
                case 13:
                    if (theCell.is(":text")) theCell.blur();
                    break;
                case 37: //left arrow
                    if (!theCell.is(":text") || (!this.selectionEnd || this.selectionEnd == 0)) theTd.prev().find("input").focus();
                    break;
                case 39: //right arrow
                    if (!theCell.is(":text") || (!this.selectionEnd || this.selectionEnd == this.value.length)) theTd.next().find("input").focus();
                    break;
                case 38: //up arrow
                    //var prevRow = theRow.prev();
                    var prevRow = theRow.prevAll(":visible:first");
                    var td = prevRow.find("td").eq(col);
                    var inp = td.find("input");
                    if (inp.length > 0) inp.focus();
                    break;
                case 40: //down arrow
                    //var nextRow = theRow.next();
                    var nextRow = theRow.nextAll(":visible:first");
                    var td = nextRow.find("td").eq(col);
                    var inp = td.find("input");
                    if (inp.length > 0) inp.focus();
                    else nextRow.click(); //create a new row
                    break;
                case 36: //home
                    break;
                case 35: //end
                    break;
                case 9: //tab
                case 13: //enter
                    break;
            }
        }
        return ret;
    }).focus(function() {
        $(this).closest("tr").click();
    });
    //change status 改变task状态
    taskRow.find(".taskStatus").click(function() {
        var el = $(this);
        var tr = el.closest("[taskid]");
        var taskId = tr.attr("taskid");
        var task = self.master.getTask(taskId);
        var changer = $.JST.createFromTemplate({}, "CHANGE_STATUS");
        changer.find("[status=" + task.status + "]").addClass("selected");
        changer.find(".taskStatus").click(function(e) {
            e.stopPropagation();
            var newStatus = $(this).attr("status");
            if(self.master.checkTaskStatus(task.status,newStatus)){ //检测状态转换是否符合规则
                changer.remove();
                self.master.beginTransaction();
                task.changeStatus(newStatus);
                self.master.endTransaction();
                el.attr("status", task.status);
                //改变状态,提交服务器
                self.master.co_sendServerData()
            }
        });
        el.oneTime(3000, "hideChanger", function() {
            changer.remove();
        });
        el.after(changer);
    });
};
GridEditor.prototype.setArrOption = function(ids,arr) {
    for (var i = 0; i < arr.length; i++) {
        ids.append("<option value='"+arr[i].value+"'>"+arr[i].label+"</option>")
    }
}

GridEditor.prototype.openFullEditor = function(task, editOnlyAssig) {

    var self = this;
    if (!self.master.permissions.canSeePopEdit) return;
    if (task.taskType == "WetProject") return
    task.rootID = task.rootID == null ? self.master.tasks[0].id : task.rootID

    var taskRow = task.rowElement;
    //task editor in popup
    var taskId = taskRow.attr("taskId");
    //make task editor
    var taskEditor = $.JST.createFromTemplate(task, "TASK_EDITOR");
    //hide task data if editing assig only
    if (editOnlyAssig) {
        taskEditor.find(".taskData").hide();
        taskEditor.find(".assigsTableWrapper").height(455);
        taskEditor.prepend("<h1>\"" + task.name + "\"</h1>");
    }


    //got to extended editor
    if (task.isNew() || !self.master.permissions.canSeeFullEdit) {
        taskEditor.find("#taskFullEditor").remove();
    } else {
        taskEditor.bind("openFullEditor.gantt", function() {
            window.location.href = contextPath + "/applications/teamwork/task/taskEditor.jsp?CM=ED&OBJID=" + task.id;
        });
    }
    var title
    if (task.isCreate) {
        title = "新建"
    }else{
        title = (task.isTask ? "任务：": "里程碑：") + task.name
    }
    if (task.isCreate) {
        taskEditor.find("#coType").removeAttr('disabled');
    }else{
        taskEditor.find("#coType").attr("disabled","disabled");
    }

    this.setArrOption(taskEditor.find("#workTypeEnumId"),this.master.workTypes)
    this.setArrOption(taskEditor.find("#bizFormAssoc"),this.master.formCfg)
    

    taskEditor.find("#taskEditName").html(title);
    taskEditor.find("#name").val(task.name);
    taskEditor.find("#description").val(task.description);
    taskEditor.find("#code").val(task.code);
    taskEditor.find("#progress").val(task.progress ? parseFloat(task.progress) : 0).prop("readonly", task.progressByWorklog == true);
    taskEditor.find("#progressByWorklog").prop("checked", task.progressByWorklog);
    taskEditor.find("#status").val(task.status);
    taskEditor.find("#type").val(task.typeId);
    taskEditor.find("#workTypeEnumId").val(task.workTypeEnumId);
    taskEditor.find("#bizFormAssoc").val(task.bizFormAssoc);
    taskEditor.find("#type_txt").val(task.type);
    taskEditor.find("#relevance").val(task.relevance);


    //cvc_redraw(taskEditor.find(".cvcComponent"));
    //里程碑选择CheckBox 取消
    // if (task.startIsMilestone) taskEditor.find("#startIsMilestone").prop("checked", true);
    // if (task.endIsMilestone) taskEditor.find("#endIsMilestone").prop("checked", true);

    if(task.isAllot) { //任务时间是否配置
        taskEditor.find("#duration").val(durationToString(task.duration));
        var startDate = taskEditor.find("#start");
        startDate.val(new Date(task.start).format());
        //start is readonly in case of deps
        if (task.depends || !(this.master.permissions.canWrite || task.canWrite)) {
            startDate.attr("readonly", "true");
        } else {
            startDate.removeAttr("readonly");
        }
        taskEditor.find("#end").val(new Date(task.end).format());
    } 



    //make assignments table
    var assigsTable = taskEditor.find("#assigsTable");
    assigsTable.find("[assId]").remove();
    // loop on assignments
    for (var i = 0; i < task.assigs.length; i++) {
        var assig = task.assigs[i];
        var assigRow = $.JST.createFromTemplate({
            task: task,
            assig: assig
        }, "ASSIGNMENT_ROW");
        assigsTable.append(assigRow);
    }

    taskEditor.find(":input").updateOldValue();
    if (!(self.master.permissions.canWrite || task.canWrite)) {
        taskEditor.find("input,textarea").prop("readOnly", true);
        taskEditor.find("input:checkbox,select").prop("disabled", true);
        taskEditor.find("#saveButton").remove();
        taskEditor.find(".button").addClass("disabled");
    } else {
        //bind dateField on dates, duration
        taskEditor.find("#start,#end,#duration").click(function() {
            var input = $(this);
            if (input.is("[entrytype=DATE]")) {
                input.dateField({
                    inputField: input,
                    minDate: self.minAllowedDate,
                    maxDate: self.maxAllowedDate,
                    callback: function(d) {
                        $(this).blur();
                    }
                });
            }
        }).blur(function() {
            var inp = $(this);
            if (inp.validateField()) {
                resynchDates(inp, taskEditor.find("[name=start]"), taskEditor.find("[name=startIsMilestone]"), taskEditor.find("[name=duration]"), taskEditor.find("[name=end]"), taskEditor.find("[name=endIsMilestone]"));
                //workload computation
                if (typeof(workloadDatesChanged) == "function") workloadDatesChanged();
            }
        });
        // taskEditor.find("#startIsMilestone,#endIsMilestone").click(function() {
        //     var inp = $(this);
        //     resynchDates(inp, taskEditor.find("[name=start]"), taskEditor.find("[name=startIsMilestone]"), taskEditor.find("[name=duration]"), taskEditor.find("[name=end]"), taskEditor.find("[name=endIsMilestone]"));
        // });
        //bind add assignment
        var cnt = 0;
        taskEditor.find("#addAssig").click(function() {
            cnt++;
            var assigsTable = taskEditor.find("#assigsTable");
            var assigRow = $.JST.createFromTemplate({
                task: task,
                assig: {
                    id: "tmp_" + new Date().getTime() + "_" + cnt
                }
            }, "ASSIGNMENT_ROW");
            assigsTable.append(assigRow);
            $("#bwinPopupd").scrollTop(10000);
        });

        //任务信息保存
        taskEditor.bind("saveFullEditor.gantt", function() {
            //console.debug("saveFullEditor");

            var task = self.master.getTask(taskId); // get task again because in case of rollback old task is lost
            
            self.master.beginTransaction();
            task.name = taskEditor.find("#name").val();
            task.description = taskEditor.find("#description").val();
            task.code = taskEditor.find("#code").val();
            task.workTypeEnumId = taskEditor.find("#workTypeEnumId").val();
            task.bizFormAssoc = taskEditor.find("#bizFormAssoc").val();
            task.progress = parseFloat(taskEditor.find("#progress").val());
            //task.duration = parseInt(taskEditor.find("#duration").val()); //bicch rimosso perchè devono essere ricalcolata dalla start end, altrimenti sbaglia

            task.type = taskEditor.find("#type_txt").val();
            task.typeId = taskEditor.find("#type").val();
            task.relevance = taskEditor.find("#relevance").val();
            task.progressByWorklog = taskEditor.find("#progressByWorklog").is(":checked");

            if (task.isCreate) {
                task.taskType = taskEditor.find("#coType").val();
                if (task.name == "") {
                    alert("请填写名称")
                    return
                }
                if (task.taskType == "") {
                    alert("请选择类型")
                    return
                }
                var isMilestone = task.taskType == "WetMilestone"
                task.startIsMilestone = isMilestone
                task.endIsMilestone = isMilestone
                task.isMilestone = isMilestone
                task.isTask = !isMilestone
                var taskTypeName = isMilestone ? '里程碑' : '任务'
                $("#tid_" + task.id).find(".taskTypeName").html(taskTypeName) 
            }

            //set assignments
            var cnt = 0;
            taskEditor.find("tr[assId]").each(function() {
                var trAss = $(this);
                var assId = trAss.attr("assId");
                var resId = trAss.find("[name=resourceId]").val();
                var resName = trAss.find("[name=resourceId_txt]").val(); // from smartcombo text input part
                var roleId = trAss.find("[name=roleId]").val();
                var effort = millisFromString(trAss.find("[name=effort]").val(), true);
                //check if the selected resource exists in ganttMaster.resources
                var res = self.master.getOrCreateResource(resId, resName);
                //if resource is not found nor created
                if (!res) return;
                //check if an existing assig has been deleted and re-created with the same values
                var found = false;
                for (var i = 0; i < task.assigs.length; i++) {
                    var ass = task.assigs[i];
                    if (assId == ass.id) {
                        ass.effort = effort;
                        ass.roleId = roleId;
                        ass.resourceId = res.id;
                        ass.touched = true;
                        found = true;
                        break;
                    } else if (roleId == ass.roleId && res.id == ass.resourceId) {
                        ass.effort = effort;
                        ass.touched = true;
                        found = true;
                        break;
                    }
                }
                if (!found && resId && roleId) { //insert
                    cnt++;
                    var ass = task.createAssignment("tmp_" + new Date().getTime() + "_" + cnt, resId, roleId, effort);
                    ass.touched = true;
                }
            });
            //remove untouched assigs
            task.assigs = task.assigs.filter(function(ass) {
                var ret = ass.touched;
                delete ass.touched;
                return ret;
            });
            // //change dates
            task.setPeriod(Date.parseString(taskEditor.find("#start").val()).getTime(), Date.parseString(taskEditor.find("#end").val()).getTime() + (3600000 * 22));
            // //change status

            if(task.isCreate) {
                task.changeStatus(taskEditor.find("#status").val());
            }else{
                if(self.master.checkTaskStatus(task.status,taskEditor.find("#status").val())){
                    task.changeStatus(taskEditor.find("#status").val());
                } else {
                    return
                }
            }


            if (self.master.endTransaction()) {
                taskEditor.find(":input").updateOldValue();
                closeBlackPopup();
            }

            //新增或者修改之后，把所有相关改变的任务存入editedTaskData
            self.master.co_setEditTaskData(task)
            self.master.co_sendServerData()     
            task.isCreate = null

            // if (task.isCreate) {
            //     task.isCreate = null //保存之后取消task的新建属性
            // }else{
            //    //新增或者修改之后，把所有相关改变的任务存入editedTaskData
            //    self.master.co_setEditTaskData(task)
            //    self.master.co_sendServerData()         
            // }

        });
    }
    taskEditor.attr("alertonchange", "true");
    var ndo = createModalPopup(800, 450).append(taskEditor); //.append("<div style='height:800px; background-color:red;'></div>")
    //workload computation
    if (typeof(workloadDatesChanged) == "function") workloadDatesChanged();
};