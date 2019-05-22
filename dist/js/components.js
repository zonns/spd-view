//  ------------------------------------------自定义筛选
function PersonFilter() {
}

PersonFilter.prototype.init = function (params) {
    this.valueGetter = params.valueGetter;
    this.filterText = null;
    this.params = params;
    this.setupGui();
};

// not called by ag-Grid, just for us to help setup
PersonFilter.prototype.setupGui = function () {
    this.gui = document.createElement('div');
    this.gui.innerHTML =
        '<div style="padding: 4px;">' +
        '<div style="font-weight: bold;">请输入查询内容</div>' +
        '<div class="ag-input-text-wrapper"><input style="margin: 4px 0px 4px 0px;" type="text" id="filterText" placeholder="请输入搜索内容"/></div>' +
        '</div>';

    var that = this;
    this.onFilterChanged = function () {
        that.extractFilterText();
        that.params.filterChangedCallback();
    };

    this.eFilterText = this.gui.querySelector('#filterText');
    this.eFilterText.addEventListener("input", this.onFilterChanged);
};

PersonFilter.prototype.extractFilterText = function () {
    this.filterText = this.eFilterText.value;
};

PersonFilter.prototype.getGui = function () {
    return this.gui;
};

PersonFilter.prototype.doesFilterPass = function (params) {
    // make sure each word passes separately, ie search for firstname, lastname
    var passed = true;
    var valueGetter = this.valueGetter;
    this.filterText.toLowerCase().split(" ").forEach(function (filterWord) {
        var value = valueGetter(params);
        if (value.toString().toLowerCase().indexOf(filterWord) < 0) {
            passed = false;
        }
    });

    return passed;
};

PersonFilter.prototype.isFilterActive = function () {
    var isActive = this.filterText !== null && this.filterText !== undefined && this.filterText !== '';
    return isActive;
};

PersonFilter.prototype.getModelAsString = function (model) {
    return model ? model : '';
};

PersonFilter.prototype.getModel = function () {
    return this.eFilterText.value;
};

// lazy, the example doesn't use setModel()
PersonFilter.prototype.setModel = function (model) {
    this.eFilterText.value = model;
    this.extractFilterText();
};

PersonFilter.prototype.destroy = function () {
    this.eFilterText.removeEventListener("input", this.onFilterChanged);
};

//  --------------------------- 搜索框
function PersonFloatingFilterComponent() {
}

PersonFloatingFilterComponent.prototype.init = function (params) {
    this.params = params;
    var eGui = this.eGui = document.createElement('div');
    eGui.className = 'ag-input-text-wrapper';
    var input = this.input = document.createElement('input');
    input.className = 'ag-floating-filter-input';
    eGui.appendChild(input);
    this.changeEventListener = function () {
        params.onFloatingFilterChanged(input.value);
    };
    input.addEventListener('input', this.changeEventListener);
};

PersonFloatingFilterComponent.prototype.getGui = function () {
    return this.eGui;
};

PersonFloatingFilterComponent.prototype.onParentModelChanged = function (model) {
    // add in child, one for each flat
    this.input.value = model != null ? model : '';
};

PersonFloatingFilterComponent.prototype.destroy = function () {
    this.input.removeEventListener('input', this.changeEventListener);
};

//  ------------------------------------------- 表格内操作
// function TableToolCheck(){

// }
// TableToolCheck.prototype.init = function(params) {
//     this.params = params;
//     this.eGui = document.createElement('button')
//     this.eGui.innerText = '编辑'
//     this.eGui.className = 'btn-font'
//     this.eventListener = function(){
//         console.log(params)
//     }
//     this.eGui.addEventListener('click',this.eventListener)
// }
// TableToolCheck.prototype.getGui = function(){
//     return this.eGui
// }



// form添加
function addForm(obj, callback) {
    const $form = $('<form class="layui-form add-forms" lay-filter="forms" action=""></form>')
    if (obj.hasOwnProperty("textInput")) {
        for (const key in obj.textInput) {
            if (obj.textInput.hasOwnProperty(key)) {
                const element = obj.textInput[key];
                const type = element.required ? "lay-verify='required|" + element.requiredType + "'" : "lay-verify='" + element.requiredType + "'"
                const textHtml = `<div class="layui-inline">
                    <label class="layui-form-label">${element.textName}</label>
                    <div class="layui-input-inline">
                        <input type="${element.inputType}" name="${element.fieldName}"  ${element.required ? "required" : ""} ${type} placeholder="请输入您的${element.textName}信息"
                            autocomplete="off" class="layui-input">
                    </div>
                </div>`
                $form.append(textHtml)
            }
        }
    }

    if (obj.hasOwnProperty("radioInput")) {
        for (const key in obj.radioInput) {
            if (obj.radioInput.hasOwnProperty(key)) {
                const element = obj.radioInput[key];
                var radio = ""
                const type = element.required ? "lay-verify='required|" + element.requiredType + "'" : "lay-verify='" + element.requiredType + "'"
                element.data.forEach(value => {
                    radio += '<input type="radio" name="' + element.fieldName + '" '+type+' value="' + value + '" checked title="' + value + '">'
                });
                const radioHtml = `<div class="layui-inline">
                    <label class="layui-form-label">${element.textName}</label>
                    <div class="layui-input-inline">
                        ${radio}
                    </div>
                </div>`
                $form.append(radioHtml)
            }
        }
    }

    if (obj.hasOwnProperty("checkInput")) {
        for (const key in obj.checkInput) {
            if (obj.checkInput.hasOwnProperty(key)) {
                const element = obj.checkInput[key];
                var input = ""
                const type = element.required ? "lay-verify='" + element.requiredType + "'" : "lay-verify='" + element.requiredType + "'"
                element.data.forEach(value => {
                    input += '<input type="checkbox" name="' + element.fieldName + '" title="' + value + '" value="'+value+'" lay-skin="primary">'
                });
                const checkHtml = `<div class="layui-inline">
                    <label class="layui-form-label">${element.textName}</label>
                    <div class="layui-input-inline">
                        <div ${type}>${input}</div>
                    </div>
                </div>`
                $form.append(checkHtml)
            }
        }
    }

    if (obj.hasOwnProperty("fileInput")) {
        for (const key in obj.fileInput) {
            if (obj.fileInput.hasOwnProperty(key)) {
                const element = obj.fileInput[key];
                const uploadHtml = `
                <div class="layui-upload">
                    <button type="button" class="layui-btn btn-upload" id="btUpload">上传图片</button>
                    <div class="layui-upload-list">
                        <input type="hidden" id="imgUrl" name="${element.fieldName}">
                        <img class="layui-upload-img upload-img" id="upImage">
                        <p id="upText"></p>
                    </div>
                </div> `
                $form.append(uploadHtml)
            }
        }
    }

    if (obj.hasOwnProperty("title")) {
        $(".addFormTitle").text(obj.title)
    }

    var button = `<div class="layui-inline">
            <div class="layui-input-inline">
                <button class="btn new-btn-form-normal btn-blackb" lay-submit="" lay-filter="formDemo">提交</button>
                <button type="reset" class="btn new-btn-form-normal layui-btn-primary">重置</button>
            </div>
        </div>`
    $form.append(button)
    new Promise((resolve, reject) => {
        $(obj.id).html($form)
        const flag = true
        resolve(flag)
    }).then(data => {
        const layuiObj = layui.use(["form", "upload"], function () {
            const form = layui.form;
            const upload = layui.upload;
            const uploadInst = upload.render({
                elem: '#btUpload',
                url: obj.imgUrl,
                // field: "img",
                before: function (obj) {
                    //预读本地文件示例，不支持ie8
                    obj.preview(function (index, file, result) {
                        $('#upImage').attr('src', result); //图片链接（base64）
                    });
                },
                done: function (res) {
                    //如果上传失败
                    if (res.code > 0) {
                        layer.msg('上传失败');
                    }
                    $("#imgUrl").val(res.data.img)
                    //上传成功
                },
                error: function () {
                    //演示失败状态，并实现重传
                    var demoText = $('#upText');
                    demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs btn-reload">重试</a>');
                    demoText.find('.demo-reload').on('click', function () {
                        uploadInst.upload();
                    });
                }
            });

            form.render(null, 'forms')
            // 自定义校验
            form.verify({
                "email": function (value, item) {
                    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                    if (value.length > 0 && !reg.test(value)) {
                        return '邮箱格式不正确'
                    }
                },
                "telephone": function (value, item) {
                    var phonereg = /^[1][3,4,5,7,8][0-9]{9}$/;
                    if (!phonereg.test(value) && value.length > 0) {
                        return '手机格式不正确';
                    }
                },
                "mustradio": function(value,item) {

                },
                "mustcheck": function(value,item) {
                    var va = $(item).find("input[type='checkbox']:checked").val();
                    if (typeof (va) == "undefined") {
                        return "请选择角色";
                    }
                }
            })

            $("button[type='reset']").click(function(){
                const elms = $(".add-forms input[name]");
                const obj = {};
                $("input[type='hidden']").val("")
                $("#upImage").attr("src","")
                $.each(elms, function (i, item) {
                    var name = $(item).attr("name");
                    obj[name] = "";
                });
            })
            // 表单提交
            form.on('submit(formDemo)', function (data) {
                var checkVal = [];
                var name = "";
                for (const key in obj.checkInput) {
                    if (obj.checkInput.hasOwnProperty(key)) {
                        const element = obj.checkInput[0];
                        name = element.fieldName
                        console.log($("input:checkbox[name='"+name+"']:checked"))
                        $("input:checkbox[name='"+name+"']:checked").each(function(i){
                            checkVal[i] = $(this).val()
                        });
                        console.log(checkVal)
                    }
                }
                data.field[name] = checkVal.join(",")
                delete data.field['file']
                console.log(data.field)
                $.ajax({
                    url: obj.formUrl,
                    data: data.field,
                    type: "post",
                    success: function(result) {

                    },
                    error: function(result) {

                    }
                })
                
                return false;
            });

            return layui
        })
        // 传出layui值
        return layuiObj

    }).then(data => {
        if (callback != undefined) {
            callback(data)
        }
    })
}