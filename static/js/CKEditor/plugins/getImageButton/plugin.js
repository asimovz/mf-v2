(function(){
    //Section 1 : 按下自定义按钮时执行的代码
    var a= {
        exec:function(editor){
            var imageModel = document.querySelector("#materiaImageModel");
            materiaImageModel.style.display = "block";
        }
    },
    //Section 2 : 创建自定义按钮、绑定方法
    b='getImageButton';
    CKEDITOR.plugins.add(b,{
        init:function(editor){
            editor.addCommand(b,a);
            editor.ui.addButton('getImageButton',{
                label:'添加图片',
                icon: this.path + 'images.png',
                command:b
            });
        }
    });
})();