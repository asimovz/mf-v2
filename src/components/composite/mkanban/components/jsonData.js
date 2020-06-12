
/*
done: 界面鼠标拖动,排序算法,异步加载卡片和列
todo: 


group: "name",  // 分组的名字，同样的name可以互相拖动到对应列表排序
sort: true,  // 默认为true，设置是否可以排序。
delay: 0, // 可以进行拖动的延迟时间
disabled: false, // 是否可以拖动排序
animation: 150,  //动画时间
handle: ".my-handle",  // 为列表中对象设置手柄，按住对象的拖动手柄才可以进行拖动
draggable: ".item",  // 列表中哪些对象可以进行拖拽
ghostClass: "sortable-ghost",  // 被拖动元素离开原来位置时原来位置的样式
dragClass: "sortable-drag",  // 拖动是被操作的对象的样式


project
{
	id:"",         // 项目ID
	name:"",       // 项目名称
	desc:"",       // 项目介绍
}

column
{
	id:"",          // 任务列ID
	creatorID:"",   // 创建人ID
	projectId:"",   // 项目ID
	name:"",        // 任务列标题
	totalCount:0,   // 任务总数量
	progress:40,    // 总进度
	position:5      // 位置
}


task 

{
	id:'',           // 任务ID
	creatorID:'',    // 创建人ID
	projectId:'',    // 项目ID
	tasklistId:'',   // 任务列ID
	content:'',      // 内容
	note:'',         // 备注
	status:'',       // 状态 
	priority:'',     // 优先级
	created:'',      // 创建时间
	updated:'',      // 更新时间
	dueDate:'',      // 截止时间
	likesCount:'',   // 点赞
	position:,       // 位置
	subtasks:{},     // 子任务
	subtaskCount:{}, // 子任务数量
	executors:[{      // 负责人

	}]

}


*/


export const project = {
	1001:[
		{
			id:10011,
			creatorID:11111,
			projectId:1001,
			name:"简单了解1",
			totalCount:4,
			progress:40,
			position:1
		},
		{
			id:10012,
			creatorID:11111,
			projectId:1001,
			name:"快速入门2",
			totalCount:4,
			progress:40,
			position:2
		},
		{
			id:10013,
			creatorID:11111,
			projectId:1001,
			name:"开始协作3",
			totalCount:4,
			progress:40,
			position:3
		},
		{
			id:10014,
			creatorID:11111,
			projectId:1001,
			name:"更多帮助4",
			totalCount:4,
			progress:40,
			position:4
		},
		{
			id:10015,
			creatorID:11111,
			projectId:1001,
			name:"软件采购5",
			totalCount:4,
			progress:40,
			position:5
		},
		{
			id:10016,
			creatorID:11111,
			projectId:1001,
			name:"图纸设计6",
			totalCount:4,
			progress:40,
			position:6
		},
		{
			id:10017,
			creatorID:11111,
			projectId:1001,
			name:"评审打样7",
			totalCount:4,
			progress:40,
			position:7
		},
		{
			id:10018,
			creatorID:11111,
			projectId:1001,
			name:"协议签订8",
			totalCount:4,
			progress:40,
			position:8
		},
		{
			id:10019,
			creatorID:11111,
			projectId:1001,
			name:"制造安装9",
			totalCount:4,
			progress:40,
			position:9
		},
		{
			id:10020,
			creatorID:11111,
			projectId:1001,
			name:"售后服务10",
			totalCount:4,
			progress:40,
			position:10
		}
	]
}

export const column = {
	10011:[
		{
			"id":897198231,
			"projectId":1001,
			"taskListId":10011,
			"content":"创建一个项目", 
			"position":1,
			"priority": 1,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"张学友",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		},
		{
			"id":897198232,
			"projectId":1001,
			"taskListId":10011,
			"content":"任务列表是可以拖动排序", 
			"position":2,
			"priority": 0,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"刘德华",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		},
		{
			"id":897198233,
			"projectId":1001,
			"taskListId":10011,
			"content":"任务可以拖动改变顺序或者列表", 
			"position":3,
			"priority": 2,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"黎明",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		}
	],
	10012:[
		{
			"id":897198234,
			"projectId":1001,
			"taskListId":10012,
			"content":"点击这条任务，查看任务详细信息", 
			"position":1,
			"priority": 0,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"郭富城",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		},
		{
			"id":897198235,
			"projectId":1001,
			"taskListId":10012,
			"content":"试试把我拖动到另外一个任务列表中", 
			"position":2,
			"priority": 2,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"陈奕迅",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		}
	],
	10013:[
		{
			"id":897198236,
			"projectId":1001,
			"taskListId":10013,
			"content":"联系我们", 
			"position":1,
			"priority": 0,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"林子祥",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		},
		{
			"id":897198237,
			"projectId":1001,
			"taskListId":10013,
			"content":"添加成员", 
			"position":2,
			"priority": 1,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"张学友",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		}
	],
	10014:[
		{
			"id":897198238,
			"projectId":1001,
			"taskListId":10014,
			"content":"创建一个项目", 
			"position":1,
			"priority": 0,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"李连杰",
				"avatar":"default.png",
				"background":"#22d7bb"
			},

		},
		{
			"id":897198239,
			"projectId":1001,
			"taskListId":10014,
			"content":"添加成员", 
			"position":2,
			"priority": 0,
			"executor":{
				"uid":"e6710243a4124831ada48a1ac178fb77",
				"name":"张学友",
				"avatar":"default.png",
				"background":"#22d7bb"
			},
		}
	]
}

export const taskArr = {
	"id":897198239,
	"projectId":1001,
	"taskListId":10014,
	"content":"前端性能优化：细说JavaScript的加载与执行",
	"desc":'酷暑刚过，马上就到十月黄金周了，为了响应党的号召，回馈老用户，吸引新用户，特决定与某旅行公司合作旅行线路',
	"dueDate":'1529552432',
	"position":2,
	"priority": 0,
	"executor":[{
		"id":111111111111,
		"uid":"e6710243a4124831ada48a1ac178fb77",
		"name":"张学友",
		"avatar":"default.png",
		"background":"#22d7bb"
	}],
	"members":[
		{
			"uid":"e6710243a4124831ada48a1ac178fb77",
			"name":"张学友",
			"avatar":"default.png",
			"background":"#22d7bb"
		}
	],
	"tags":[
		{
			id:50001,
			color:'#22d7bb',
			name: '测试一'
		}
	],
	subtasks: [
		{
			"id":300001,
			"parentId":200010,
			"projectId":1001,
			"taskListId":10014,
			"content":'Js 的事件循环(Event Loop)机制以及实例讲解',
			"dueDate":'',
			"executor":[],
			"complete":false
		},
		{
			"id":300002,
			"parentId":200010,
			"projectId":1001,
			"taskListId":10014,
			"content":'前端性能优化：细说JavaScript的加载与执行',
			"dueDate":'',
			"executor":[],
			"complete":false
		},
		{
			"id":300003,
			"parentId":200010,
			"projectId":1001,
			"taskListId":10014,
			"content":'深入 TypeScript 的类型系统',
			"dueDate":'',
			"executor":[],
			"complete":false
		}

	],
	comments:[
		{
	        "id":"400000001",
	        "content":"在《这！就是街舞》播出之前，我们可能都是街舞小白。",
	        "createTime":1529552432,

	        "creator":{
	            "uid":"e6710243a4124831ada48a1ac178fb77",
	            "name":"张学友",
	            "avatar":"default.png",
	            "background":"#22d7bb"
	        },
	        "reply":[
	        	{
	                "id":"400000002",
	                "content":"asdf<br/>asdf<br/>asdf",
	                "createTime":1529552432,
	                "creator":{
	                    "uid":"e6710243a4124831ada48a1ac178fb77",
	                    "name":"刘德华",
	                    "avatar":"default.png",
	                    "background":"#aec0fb"
	                },
	                "mention":{
	                    "uid":"e6710243a4124831ada48a1ac178fb77",
	                    "name":"张学友",
	                }
	            }

	        ]
	    },
    	{
            "id":"400000002",
            "content":"asdf<br/>asdf<br/>asdf",
            "createTime":1529552432,
            "creator":{
                "uid":"e6710243a4124831ada48a1ac178fb77",
                "name":"刘德华",
                "avatar":"default.png",
                "background":"#aec0fb"
            },
            "reply":[]
        }
	]
}

export const memberAjax = [
	{
		id:111111,
		uid:10001,
		name:'张学友',
		avatar:''
	},
	{
		id:111111,
		uid:10002,
		name:'刘德华',
		avatar:''
	},
	{
		id:111111,
		uid:10003,
		name:'郭富城',
		avatar:''
	},
	{
		id:111111,
		uid:10004,
		name:'黎明',
		avatar:''
	}
]

export const tagAjaxData = [
	{
		id:50001,
		color:'#22d7bb',
		name: '测试一'
	},
	{
		id:50002,
		color:'#ADCE74',
		name: '文明'
	},
	{
		id:50003,
		color:'#AEC0FB',
		name: '富强'
	},
	{
		id:50004,
		color:'#87B8FB',
		name: '民主'
	}
]
