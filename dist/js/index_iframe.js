function search_menu() {
    //要搜索的值
    var text = $('input[name=q]').val();

    var $ul = $('.sidebar-menu');
    $ul.find("a.nav-link").each(function () {
        var $a = $(this).css("border", "");

        //判断是否含有要搜索的字符串
        if ($a.children("span.menu-text").text().indexOf(text) >= 0) {

            //如果a标签的父级是隐藏的就展开
            $ul = $a.parents("ul");

            if ($ul.is(":hidden")) {
                $a.parents("ul").prev().click();
            }

            //点击该菜单
            $a.click().css("border", "1px solid");

        }
    });
}

$(function () {

    App.setbasePath("./");
    App.setGlobalImgPath("dist/img/");

    addTabs({
        id: '100',
        title: '首页',
        close: false,
        url: 'pages/home.html',
        urlType: "relative"
    });

    App.fixIframeCotent();

    var menu = [
        {
            "name": "系统管理",
            "pid": 0,
            "id": 1,
            "module": "system_manage"
        },
        {
            "name": "用户管理",
            "pid": 1,
            "id": 2,
            "module": "admin_user"
        },
        {
            "name": "角色管理",
            "pid": 1,
            "id": 3,
            "module": "admin_group"
        },
        {
            "name": "菜单管理",
            "pid": 1,
            "id": 4,
            "module": "admin_menu"
        },
        {
            "name": "系统设置",
            "pid": 1,
            "id": 5,
            "module": "sysconfig"
        },
        {
            "name": "文件管理",
            "pid": 1,
            "id": 6,
            "module": "admin_file"
        },
        {
            "name": "文件列表",
            "pid": 6,
            "id": 7,
            "module": "file_list"
        },
        {
            "name": "回收站文件",
            "pid": 6,
            "id": 8,
            "module": "recycle"
        }

    ]

    var attr = {
        id: "id",
        pid: "pid",
        text: "name",
        rootId: 0,
        icon: "fa fa-circle-o",
        targetType: "iframe-tab"
    }
    
    $('.sidebar-menu').sidebarMenu({ data: toTreeData(menu,attr) });

    function toTreeData(data, attributes) {
        let resData = data;
        let tree = [];
        for (let i = 0; i < resData.length; i++) {
            if (resData[i].pid === attributes.rootId) {
                let obj = {
                    id: resData[i][attributes.id],
                    text: resData[i][attributes.text],
                    children: [],
                    icon: "fa fa-home",
                    targetType: "iframe-tab",
                    module: resData[i].module,
                    url: App.getbasePath() + "pages/" + resData[i].module + "/index.html"
                };
                tree.push(obj);
                resData.splice(i, 1);
                i--;
            }
        }
        run(tree);
        function run(chiArr) {
            if (resData.length !== 0) {
                for (let i = 0; i < chiArr.length; i++) {
                    for (let j = 0; j < resData.length; j++) {
                        if (chiArr[i].id === resData[j][attributes.pid]) {
                            let obj = {
                                id: resData[j][attributes.id],
                                text: resData[j][attributes.text],
                                children: [],
                                icon: "fa fa-circle-o",
                                targetType: "iframe-tab",
                                module: chiArr[i].module,
                                url: App.getbasePath() + "pages/" + chiArr[i].module + "/"+ resData[j].module +".html"
                            };
                            chiArr[i].children.push(obj);
                            // resData.splice(j, 1);
                            // j--;
                        }
                    }
                    run(chiArr[i].children);
                }
            }
        }
        return tree;
    }
    
});