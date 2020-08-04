(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var a= {
        exec:function(editor){
            var imageModel = document.querySelector("#materiaVideoModel");
            materiaVideoModel.style.display = "block";
        }
    },
    //Section 2 : 创建自定义按钮、绑定方法
    b='getVideoButton';
    CKEDITOR.plugins.add(b,{
        init:function(editor){
            editor.addCommand(b,a);
            editor.ui.addButton('getVideoButton',{
                label:'添加视频',
                icon: this.path + 'video.png',
                command:b
            });
        }
    });
})();