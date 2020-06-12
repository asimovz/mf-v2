<template>
    <div id="top">
        <nav class="navbar navbar-inverse">
            <div class="container-fluid">
                <header class="navbar-header">
                    <button type="button" data-toggle="collapse" data-target=".navbar-ex1-collapse" class="navbar-toggle"><span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span></button> <a href="/vapps" class="navbar-brand"><img src="http://localhost:8081/images/MoquiLogoSmall.png" alt="Home"></a></header>
                <div id="navbar-buttons" class="collapse navbar-collapse navbar-ex1-collapse">
                    <ul id="dynamic-menus" class="nav navbar-nav">
                        <li class="dropdown"><a href="#" data-toggle="dropdown" class="dropdown-toggle">Applications <i class="glyphicon glyphicon-chevron-right"></i></a>
                            <ul class="dropdown-menu">
                                <li class=""><a href="/vapps/biz-process"><i class="glyphicon glyphicon-flash" style="padding-right: 8px;"></i>
                                            BizProcess</a></li>
                                <li class=""><a href="/vapps/example/Example/FindExample"><i class="glyphicon glyphicon-flash" style="padding-right: 8px;"></i>
                                            Example</a></li>
                                <li class=""><a href="/vapps/hm/dashboard"><i class="glyphicon glyphicon-check" style="padding-right: 8px;"></i>
                                            HiveMind PM</a></li>
                                <li class=""><a href="/vapps/hmadmin/dashboard"><i class="glyphicon glyphicon-tasks" style="padding-right: 8px;"></i>
                                            HiveMind Admin</a></li>
                                <li class=""><a href="/vapps/PopcAdmin/dashboard"><i class="glyphicon glyphicon-shopping-cart" style="padding-right: 8px;"></i>
                                            POPC ERP</a></li>
                                <li class=""><a href="/vapps/ubpl/en"><i class="glyphicon glyphicon-link" style="padding-right: 8px;"></i>
                                            Mantle - UBPL</a></li>
                                <li class=""><a href="/vapps/my/User/Notifications"><i class="glyphicon glyphicon-user" style="padding-right: 8px;"></i>
                                            My Account</a></li>
                                <li class=""><a href="/vapps/system/dashboard"><i class="glyphicon glyphicon-hdd" style="padding-right: 8px;"></i>
                                            System</a></li>
                                <li class=""><a href="/vapps/tools/dashboard"><i class="glyphicon glyphicon-wrench" style="padding-right: 8px;"></i>
                                            Tools</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <!---->
                        </li>
                    </ul> <a href="/vapps/AppList" class="navbar-text">App List</a> <a href="http://localhost:8081/Login/logout" data-toggle="tooltip" data-original-title="Logout John Doe" data-placement="bottom" class="btn btn-danger btn-sm navbar-btn navbar-right"><i class="glyphicon glyphicon-off"></i></a>
                    <div id="history-menu" class="nav navbar-right dropdown"><a id="history-menu-link" href="#" data-toggle="dropdown" title="" class="dropdown-toggle btn btn-default btn-sm navbar-btn" data-original-title="History"><i class="glyphicon glyphicon-list"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="/vapps/AppList"><i class="glyphicon glyphicon-link" style="padding-right: 8px;"></i>
                            Applications - App List</a></li>
                        </ul>
                    </div>
                    <div id="notify-history-menu" class="nav navbar-right dropdown"><a id="notify-history-menu-link" href="#" data-toggle="dropdown" title="" class="dropdown-toggle btn btn-default btn-sm navbar-btn" data-original-title="Notifications"><i class="glyphicon glyphicon-exclamation-sign"></i></a>
                        <ul class="dropdown-menu"></ul>
                    </div>
                    <!----><a href="#" data-toggle="tooltip" data-original-title="Switch Dark/Light" data-placement="bottom" class="btn btn-default btn-sm navbar-btn navbar-right"><i class="glyphicon glyphicon-adjust"></i></a>
                    <div class="btn-group navbar-right my-account-nav"><a href="/vapps/my/User/Notifications" data-toggle="tooltip" data-container="body" data-original-title="Notifications" data-placement="bottom" class="btn btn-default btn-sm navbar-btn"><i class="glyphicon glyphicon-info-sign"></i> <span class="label label-info">0</span></a><a href="/vapps/my/User/Messages/FindMessage?statusId=CeReceived&amp;toCurrentUser=true" data-toggle="tooltip" data-container="body" data-original-title="Messages" data-placement="bottom" class="btn btn-default btn-sm navbar-btn"><i class="glyphicon glyphicon-envelope"></i> <span class="label label-warning">4</span></a><a href="/vapps/my/User/Calendar/MyCalendar" data-toggle="tooltip" data-container="body" data-original-title="Events This Week" data-placement="bottom" class="btn btn-default btn-sm navbar-btn"><i class="glyphicon glyphicon-calendar"></i> <span class="label label-primary">0</span></a><a href="/vapps/my/User/Task/MyTasks" data-toggle="tooltip" data-container="body" data-original-title="Open Tasks" data-placement="bottom" class="btn btn-default btn-sm navbar-btn"><i class="glyphicon glyphicon-check"></i> <span class="label label-success">2</span></a></div>
                    <div id="active-org-menu" class="nav navbar-right dropdown"><a id="active-org-menu-link" href="#" data-toggle="dropdown" title="" class="dropdown-toggle btn btn-default btn-sm navbar-btn" data-original-title="Organization"><i class="glyphicon glyphicon-globe"></i> </a>
                        <ul class="dropdown-menu">
                            <!---->
                            <li><a>ZISER: Ziziwork Services</a></li>
                            <li><a>ZIRET: Ziziwork Retail &amp; Wholesale</a></li>
                        </ul>
                    </div>
                    <div class="navbar-right hidden" style="padding: 8px;">
                        <div class="spinner small"></div>
                    </div>
                </div>
            </div>
        </nav>

    </div>
</template>

<script>
  export default {
    name: 'header-nav',
    beforeCreate: function() {
      // 启动加载进度条
      this.$Loading.start();
    },
    mounted: function() {
      // DOM 更新完成，结束进度条
      this.$Loading.finish();
    }
  }
</script>

<style>

</style>


