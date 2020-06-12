
let $S = require('assets/js/script.js')
const jsArr = [
	"/static/js/gantt/jqueryui.min.js",
	"/static/js/gantt/libs/jquery/jquery.livequery.1.1.1.min.js",
	"/static/js/gantt/libs/jquery/jquery.timers.js",
	"/static/js/gantt/libs/utilities.js",
	"/static/js/gantt/libs/forms.js",
	"/static/js/gantt/libs/date.js",
	"/static/js/gantt/libs/dialogs.js",
	"/static/js/gantt/libs/layout.js",
	"/static/js/gantt/libs/i18nJs.js",
	"/static/js/gantt/libs/jquery/dateField/jquery.dateField.js",
	"/static/js/gantt/libs/jquery/JST/jquery.JST.js",
	"/static/js/gantt/libs/jquery/svg/jquery.svg.min.js",
	"/static/js/gantt/libs/jquery/svg/jquery.svgdom.1.8.js",
	"/static/js/gantt/ganttUtilities.js",
	"/static/js/gantt/ganttDrawerSVG.js",
	"/static/js/gantt/ganttTask.js",
	// "/static/js/gantt/ganttZoom.js",
	"/static/js/gantt/ganttGridEditor.js",
	"/static/js/gantt/ganttMaster.js",
	"/static/js/gantt/ganttFun.js",
]
$S(jsArr,'gantt')
export default $S