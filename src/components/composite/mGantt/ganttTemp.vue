<template>
  <div id="gantEditorTemplates" style="display:none;">
    <textarea class="__template__" type="GANTBUTTONS1">
      <div class="ganttButtonBar noprint">
        <div class="buttons">
          <button onclick="$('#workSpace').trigger('addNewTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert above"><span class="teamworkIcon">e</span> 新增</button>
          <span class="ganttButtonSeparator requireCanWrite requireCanAdd"></span>
          <button onclick="$('#workSpace').trigger('saveToServer.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert above"><span class="teamworkIcon">c</span> 保存</button>
          <span class="ganttButtonSeparator requireCanWrite requireCanAdd"></span>
          <button onclick="$('#workSpace').trigger('deleteFocused.gantt');return false;" class="button textual icon  requireCanWrite" title="Elimina"><span class="teamworkIcon">&cent;</span> 删除</button>
          <span class="ganttButtonSeparator requireCanWrite requireCanAdd"></span>
<!--           <button onclick="$('#workSpace').trigger('addAboveCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert above"><span class="teamworkIcon">l</span></button>
          <button onclick="$('#workSpace').trigger('addBelowCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanAdd" title="insert below"><span class="teamworkIcon">X</span></button>
          <span class="ganttButtonSeparator requireCanWrite requireCanInOutdent"></span> -->
          <button onclick="$('#workSpace').trigger('outdentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="un-indent task"><span class="teamworkIcon">.</span> 升级</button>
          <button onclick="$('#workSpace').trigger('indentCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanInOutdent" title="indent task"><span class="teamworkIcon">:</span> 降级</button>
          <span class="ganttButtonSeparator requireCanWrite requireCanMoveUpDown"></span>
          <button onclick="$('#workSpace').trigger('moveUpCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move up"><span class="teamworkIcon">k</span> 上移</button>
          <button onclick="$('#workSpace').trigger('moveDownCurrentTask.gantt');return false;" class="button textual icon requireCanWrite requireCanMoveUpDown" title="move down"><span class="teamworkIcon">j</span> 下移</button>
          <span class="ganttButtonSeparator"></span>
          <button onclick="$('#workSpace').trigger('expandAll.gantt');return false;" class="button textual icon " title="EXPAND_ALL"><span class="teamworkIcon">6</span> 展开</button>
          <button onclick="$('#workSpace').trigger('collapseAll.gantt'); return false;" class="button textual icon " title="COLLAPSE_ALL"><span class="teamworkIcon">5</span> 收缩</button>
          <span class="ganttButtonSeparator"></span>
          <button onclick="$('#workSpace').trigger('zoomMinus.gantt'); return false;" class="button textual icon " title="zoom out"><span class="teamworkIcon">)</span> 缩小</button>
          <button onclick="$('#workSpace').trigger('zoomPlus.gantt');return false;" class="button textual icon " title="zoom in"><span class="teamworkIcon">(</span> 放大</button>
          <span class="ganttButtonSeparator"></span>

          <button onclick="ge.gantt.showCriticalPath=!ge.gantt.showCriticalPath; ge.redraw();return false;" class="button textual icon requireCanSeeCriticalPath" title="CRITICAL_PATH"><span class="teamworkIcon">&pound;</span></button>
          <button onclick="ge.splitter.resize(.1);return false;" class="button textual icon"><span class="teamworkIcon">F</span></button>
          <button onclick="ge.splitter.resize(50);return false;" class="button textual icon"><span class="teamworkIcon">O</span></button>
          <button onclick="ge.splitter.resize(100);return false;" class="button textual icon"><span class="teamworkIcon">R</span></button>
          <span class="ganttButtonSeparator"></span>
          <button onclick="editResources();" class="button textual icon " title="编辑资源"><span class="teamworkIcon">M</span> 资源</button>

        </div>
      </div>
    </textarea>
    <textarea class="__template__" type="TASKSEDITHEAD">
      <table class="gdfTable" cellspacing="0" cellpadding="0">
        <thead>
          <tr style="height:50px">
            <th class="gdfColHeader" style="width:45px; ">序号</th>
            <th class="gdfColHeader" style="width:35px; ">操作</th>
            <th class="gdfColHeader" style="width:25px;"></th>
            <th class="gdfColHeader gdfResizable" style="width:300px;">任务名称</th>
            <th class="gdfColHeader gdfResizable" style="width:80px;">开始时间</th>
            <th class="gdfColHeader gdfResizable" style="width:80px;">结束时间</th>
            <th class="gdfColHeader gdfResizable" style="width:50px;">工期</th>
            <th class="gdfColHeader gdfResizable" style="width:40px;">进度</th>
            <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:70px;">前置任务</th>
            <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:80px;">类型</th>
            <th class="gdfColHeader gdfResizable requireCanSeeDep" style="width:80px;">关联里程碑</th>
            <th class="gdfColHeader gdfResizable" style="width:400px; text-align: left; padding-left: 10px;">关联人</th>
          </tr>
        </thead>
      </table>
    </textarea>
    <textarea class="__template__" type="TASKROW">
      <tr id="tid_(#=obj.id#)" taskId="(#=obj.id#)" class="taskEditRow (#=obj.isParent()?'isParent':''#) (#=obj.collapsed?'collapsed':''#)" level="(#=level#)">
        <td class="gdfCell" style="text-align:center"><span class="taskRowIndex">(#=obj.getRow()+1#)</span></td>
        <td class="gdfCell"  style="cursor:pointer;text-align:center">
          <span class="teamworkIcon edit" style="font-size:12px;">e</span>
        </td>

        <td class="gdfCell noClip" align="center">
          <div class="taskStatus cvcColorSquare" status="(#=obj.status#)"></div>
        </td>

        <td class="gdfCell indentCell" style="padding-left:(#=obj.level*10+18#)px;">
          <div class="exp-controller" align="center"></div>
          <span class="taskName">(#=obj.name#)</span>
        </td>

        <td class="gdfCell">
          <input type="text" name="start" value="" class="date" style="text-align:center">
        </td>

        <td class="gdfCell">
          <input type="text" name="end" value="" class="date" style="text-align:center">
        </td>
        <td class="gdfCell" style="text-align:center">
          <span class="taskDuration">(#=obj.duration#)</span>
          <input type="hidden" name="duration" value="(#=obj.duration#)">
        </td>
        <td class="gdfCell" style="text-align:center">
          <span class="progress">(#=obj.progress?obj.progress:''#)</span>
        </td>
        <td class="gdfCell requireCanSeeDep dropDownbox" >
          <input type="text" class="depends" name="depends" autocomplete="off" value="(#=obj.depends#)" (#=obj.hasExternalDep? "readonly": ""#) style="display:(#=obj.isTask? "": "none"#)">
        </td>
        <td class="gdfCell"  style="text-align:center">
          <input type="checkbox" name="startIsMilestone" style="display:none">
          <input type="checkbox" name="endIsMilestone" style="display:none">
          <span class="taskTypeName">(#=obj.setTaskType()#)</span>
          
        </td>
        <td class="gdfCell dropDownbox"><input type="text" class="milestoneID" name="milestoneID" autocomplete="off" value="(#=obj.milestoneName#)" style="display:(#=obj.isTask? "": "none"#)"></td>
        <td class="gdfCell taskAssigs ">(#=obj.getAssigsString()#)</td>
      </tr>
    </textarea>
    <textarea class="__template__" type="TASKEMPTYROW">
      <tr class="taskEditRow emptyRow">
        <td class="gdfCell" align="center"></td>
        <td class="gdfCell noClip" align="center"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell"></td>
        <td class="gdfCell requireCanSeeDep"></td>
        <td class="gdfCell"></td>
      </tr>
    </textarea>
    <textarea class="__template__" type="TASKBAR">
      <div class="taskBox taskBoxDiv" taskId="(#=obj.id#)">
        <div class="layout (#=obj.hasExternalDep?'extDep':''#)">
          <div class="taskStatus" status="(#=obj.status#)"></div>
          <div class="taskProgress" style="width:(#=obj.progress>100?100:obj.progress#)%; background-color:(#=obj.progress>100?'red':'rgb(153,255,51);'#);"></div>
          <div class="milestone (#=obj.startIsMilestone?'active':''#)"></div>
          <div class="taskLabel"></div>
          <div class="milestone end (#=obj.endIsMilestone?'active':''#)"></div>
        </div>
      </div>
    </textarea>
    <textarea class="__template__" type="CHANGE_STATUS">
      <div class="taskStatusBox">
        <div class="taskStatus cvcColorSquare" status="STATUS_ACTIVE" title="进行中"></div>
        <div class="taskStatus cvcColorSquare" status="STATUS_DONE" title="完成"></div>
        <div class="taskStatus cvcColorSquare" status="STATUS_FAILED" title="撤销/失败"></div>
        <div class="taskStatus cvcColorSquare" status="STATUS_SUSPENDED" title="暂停"></div>
        <div class="taskStatus cvcColorSquare" status="STATUS_WAITING" title="Waiting" style="display: none;"></div>
        <div class="taskStatus cvcColorSquare" status="STATUS_UNDEFINED" title="已确认"></div>
      </div>
    </textarea>
    <textarea class="__template__" type="TASK_EDITOR">
      <div class="ganttTaskEditor">
        <h2 class="taskData" id="taskEditName"></h2>
        <table cellspacing="1" cellpadding="5" width="100%" class="taskData table" border="0">
          <tr>
            <td colspan="3" valign="top">
              <label for="name" class="required">名称</label>
              <br>
              <input type="text" name="name" id="name" class="formElements" autocomplete='off' maxlength=255 style='width:100%' value="" required="true" oldvalue="1">
            </td>
          </tr>
          <tr class="dateRow">
            <td nowrap="">
              <div style="position:relative">
                <label for="start">开始时间</label>&nbsp;&nbsp;&nbsp;&nbsp;
                <input style="visibility:hidden" type="checkbox" id="startIsMilestone" name="startIsMilestone" value="yes"> &nbsp;
                <br>
                <input type="text" name="start" id="start" size="14" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
                <span title="calendar" id="starts_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span> </div>
            </td>
            <td nowrap="">
              <label for="end">结束时间</label>&nbsp;&nbsp;&nbsp;&nbsp;
              <input style="visibility:hidden" type="checkbox" id="endIsMilestone" name="endIsMilestone" value="yes"> &nbsp;
              <br>
              <input type="text" name="end" id="end" size="14" class="formElements dateField validated date" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DATE">
              <span title="calendar" id="ends_inputDate" class="teamworkIcon openCalendar" onclick="$(this).dateField({inputField:$(this).prevAll(':input:first'),isSearchField:false});">m</span>
            </td>
            <td nowrap="">
              <label for="duration" class=" ">工期</label>
              <br>
              <input type="text" name="duration" id="duration" size="7" class="formElements validated durationdays" title="Duration is in working days." autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="DURATIONDAYS">&nbsp;
            </td>
          </tr>
          <tr>
            <td>
              <label for="status" class=" ">状态</label>
              <br>
              <select id="status" name="status" class="taskStatus" status="(#=obj.status#)" onchange="$(this).attr('STATUS',$(this).val());">
                <option value="STATUS_UNDEFINED" class="taskStatus" status="STATUS_UNDEFINED">已确认</option>
                <option value="STATUS_ACTIVE" class="taskStatus" status="STATUS_ACTIVE">进行中</option>
                <option value="STATUS_SUSPENDED" class="taskStatus" status="STATUS_SUSPENDED">暂停</option>
                <!-- <option value="STATUS_WAITING" class="taskStatus" status="STATUS_WAITING">等待</option> -->
                <option value="STATUS_DONE" class="taskStatus" status="STATUS_DONE">完成</option>
                <option value="STATUS_FAILED" class="taskStatus" status="STATUS_FAILED">撤销/失败</option>
              </select>
            </td>
            <td>
              <label for="type">任务类型</label>
              <br>
              <select id="coType" name="type" class="taskStatus">
                <option value="WetTask" class="" status="WetTask">任务</option>
                <option value="WetMilestone" class="" status="WetMilestone">里程碑</option>
              </select>
            </td>
            <td valign="top" nowrap>
              <label>进度</label>
              <br>
              <input type="text" name="progress" id="progress" size="7" class="formElements validated percentile" autocomplete="off" maxlength="255" value="" oldvalue="1" entrytype="PERCENTILE">
            </td>
          </tr>
          <tr>
            <td>
              <label for="workTypeEnumId" class=" ">业务工作类型</label>
              <br>
              <select id="workTypeEnumId" name="workTypeEnumId" class="taskStatus" status="(#=obj.workType#)">
                <option value="">无</option>
              </select>
            </td>
            <td colspan="2">
              <label for="bizFormAssoc">关联单据</label>
              <br>
              <select id="bizFormAssoc" name="bizFormAssoc" class="taskStatus2">
                <option value="">无</option>
              </select>
            </td>
          </tr>
          </tr>
          <tr>
            <td colspan="4">
              <label for="description">备注</label>
              <br>
              &lt;textarea rows="3" cols="30" id="description" name="description" class="formElements" style="width:100%"&gt;&lt;/textarea&gt;
            </td>
          </tr>
        </table>
        <h4>关联人</h4>
        <table cellspacing="1" cellpadding="0" width="100%" id="assigsTable">
          <tr>
            <th style="width:100px;font-size:15px;">姓名</th>
            <th style="width:70px;font-size:15px;">角色</th>
            <th style="width:30px;" class="textCenter" id="addAssig">
              <span class="teamworkIcon btn" style="cursor: pointer">+</span>
            </th>
          </tr>
        </table>
        <div style="text-align: right; padding-top: 20px">
          <span id="saveButton" class="button first" onClick="$(this).trigger('saveFullEditor.gantt');">保存</span>
        </div>
      </div>
    </textarea>
    <textarea class="__template__" type="ASSIGNMENT_ROW">
      <tr taskId="(#=obj.task.id#)" assId="(#=obj.assig.id#)" class="assigEditRow">
        <td>
          <select name="resourceId" class="formElements" (#=obj.assig.id.indexOf( "tmp_")==0? "": "disabled"#)></select>
        </td>
        <td>
          <select type="select" name="roleId" class="formElements"></select>
        </td>
        <td align="center"><span class="teamworkIcon delAssig del" style="cursor: pointer">d</span></td>
      </tr>
    </textarea>
    <textarea class="__template__" type="RESOURCE_EDITOR">
      <div class="resourceEditor" style="padding: 5px;">
        <h2>Project team</h2>
        <table cellspacing="1" cellpadding="0" width="100%" id="resourcesTable">
          <tr>
            <th style="width:100px;">name</th>
            <th style="width:30px;" id="addResource"><span class="teamworkIcon" style="cursor: pointer">+</span></th>
          </tr>
        </table>
        <div style="text-align: right; padding-top: 20px">
          <button id="resSaveButton" class="button big">保存</button>
        </div>
      </div>
    </textarea>
    <textarea class="__template__" type="RESOURCE_ROW">
      <tr resId="(#=obj.id#)" class="resRow">
        <td>
          <input type="text" name="name" value="(#=obj.name#)" style="width:100%;" class="formElements">
        </td>
        <td align="center"><span class="teamworkIcon delRes del" style="cursor: pointer">d</span></td>
      </tr>
    </textarea>
  </div>
</template>
<script>
export default {
  name: 'gantt-temp'
}

</script>
