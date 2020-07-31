function newProject () {
  clearGantt();
}

function clearGantt () {
  ge.reset();
}

function getFile () {
  $("#gimBaPrj").val(JSON.stringify(ge.saveProject()));
  $("#gimmeBack").submit();
  $("#gimBaPrj").val("");

  /*  var uriContent = "data:text/html;charset=utf-8," + encodeURIComponent(JSON.stringify(prj));
   neww=window.open(uriContent,"dl");*/
}

function createNewResource (el) {
  
  var row = el.closest("tr[taskid]");
  var name = row.find("[name=resourceId_txt]").val();
  var url = contextPath + "/applications/teamwork/resource/resourceNew.jsp?CM=ADD&name=" + encodeURI(name);

  openBlackPopup(url, 700, 320, function(response) {
    //fillare lo smart combo
    if (response && response.resId && response.resName) {
      //fillare lo smart combo e chiudere l'editor
      row.find("[name=resourceId]").val(response.resId);
      row.find("[name=resourceId_txt]").val(response.resName).focus().blur();
    }

  });
}

function editResources () {

  //make resource editor
  var resourceEditor = $.JST.createFromTemplate({}, "RESOURCE_EDITOR");
  var resTbl = resourceEditor.find("#resourcesTable");

  for (var i = 0; i < ge.resources.length; i++) {
    var res = ge.resources[i];
    resTbl.append($.JST.createFromTemplate(res, "RESOURCE_ROW"))
  }


  //bind add resource
  resourceEditor.find("#addResource").click(function() {
    resTbl.append($.JST.createFromTemplate({ id: "new", name: "resource" }, "RESOURCE_ROW"))
  });

  //bind save eventH
  resourceEditor.find("#resSaveButton").click(function() {
    var newRes = [];
    //find for deleted res
    for (var i = 0; i < ge.resources.length; i++) {
      var res = ge.resources[i];
      var row = resourceEditor.find("[resId=" + res.id + "]");
      if (row.length > 0) {
        //if still there save it
        var name = row.find("input[name]").val();
        if (name && name != "")
          res.name = name;
        newRes.push(res);
      } else {
        //remove assignments
        for (var j = 0; j < ge.tasks.length; j++) {
          var task = ge.tasks[j];
          var newAss = [];
          for (var k = 0; k < task.assigs.length; k++) {
            var ass = task.assigs[k];
            if (ass.resourceId != res.id)
              newAss.push(ass);
          }
          task.assigs = newAss;
        }
      }
    }

    //loop on new rows
    var cnt = 0
    resourceEditor.find("[resId=new]").each(function() {
      cnt++;
      var row = $(this);
      var name = row.find("input[name]").val();
      if (name && name != "")
        newRes.push(new Resource("tmp_" + new Date().getTime() + "_" + cnt, name));
    });

    ge.resources = newRes;

    closeBlackPopup();
    ge.redraw();
  });
  var ndo = createModalPopup(400, 500).append(resourceEditor);
}


function loadI18n () {
  GanttMaster.messages = {
    "CANNOT_WRITE": "No permission to change the following task:",
    "CHANGE_OUT_OF_SCOPE": "Project update not possible as you lack rights for updating a parent project.",
    "START_IS_MILESTONE": "Start date is a milestone.",
    "END_IS_MILESTONE": "End date is a milestone.",
    "TASK_HAS_CONSTRAINTS": "Task has constraints.",
    "GANTT_ERROR_DEPENDS_ON_OPEN_TASK": "Error: there is a dependency on an open task.",
    "GANTT_ERROR_DESCENDANT_OF_CLOSED_TASK": "Error: due to a descendant of a closed task.",
    "TASK_HAS_EXTERNAL_DEPS": "This task has external dependencies.",
    "GANNT_ERROR_LOADING_DATA_TASK_REMOVED": "GANNT_ERROR_LOADING_DATA_TASK_REMOVED",
    "CIRCULAR_REFERENCE": "Circular reference.",
    "CANNOT_DEPENDS_ON_ANCESTORS": "Cannot depend on ancestors.",
    "INVALID_DATE_FORMAT": "The data inserted are invalid for the field format.",
    "GANTT_ERROR_LOADING_DATA_TASK_REMOVED": "An error has occurred while loading the data. A task has been trashed.",
    "CANNOT_CLOSE_TASK_IF_OPEN_ISSUE": "Cannot close a task with open issues",
    "TASK_MOVE_INCONSISTENT_LEVEL": "You cannot exchange tasks of different depth.",
    "CANNOT_MOVE_TASK": "CANNOT_MOVE_TASK",
    "PLEASE_SAVE_PROJECT": "PLEASE_SAVE_PROJECT",
    "GANTT_SEMESTER": "Semester",
    "GANTT_SEMESTER_SHORT": "s.",
    "GANTT_QUARTER": "季度",
    "GANTT_QUARTER_SHORT": "q.",
    "GANTT_WEEK": "Week",
    "GANTT_WEEK_SHORT": "w."
  };
}
