<!DOCTYPE html>
    <html lang="en">

    
<!-- Mirrored from coderthemes.com/hyper_2/saas/ by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 03 Mar 2022 04:04:51 GMT -->
<head>
        <meta charset="utf-8" />
        <title>Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
        <meta content="Coderthemes" name="author" />
        <!-- App favicon -->
        <link rel="shortcut icon" href="../img/favicon.ico">

        <!-- third party css -->
        <link href="../css/vendor/jquery-jvectormap-1.2.2.css" rel="stylesheet" type="text/css" />
        <!-- third party css end -->

        <!-- App css -->
        <link href="../css/icons.min.css" rel="stylesheet" type="text/css" />
        <link href="../css/app.min.css" rel="stylesheet" type="text/css" id="light-style" />
        <link href="../css/app-dark.min.css" rel="stylesheet" type="text/css" id="dark-style" />

    </head>

    <body class="loading" data-layout-config='{"leftSideBarTheme":"dark","layoutBoxed":false, "leftSidebarCondensed":false, "leftSidebarScrollable":false,"darkMode":false, "showRightSidebarOnStart": true}'>
        <!-- Begin page -->
        <div class="wrapper">
            <!-- ========== Left Sidebar Start ========== -->
             @include('admin.layouts.leftside-menu');

            <!-- Left Sidebar End -->

            <!-- ============================================================== -->
            <!-- Start Page Content here -->
            <!-- ============================================================== -->

            <div class="content-page">
                <div class="content">
                    <!-- Topbar Start -->
                    @include('admin.layouts.topbar');
                    <!-- end Topbar -->
                    
                    <!-- Start Content-->
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box">
                                    <div class="page-title-right">
                                        <form class="d-flex">
                                            <div class="input-group">
                                                <input type="text" class="form-control form-control-light" id="dash-daterange">
                                                <span class="input-group-text bg-primary border-primary text-white">
                                                    <i class="mdi mdi-calendar-range font-13"></i>
                                                </span>
                                            </div>
                                            <a href="javascript: void(0);" class="btn btn-primary ms-2">
                                                <i class="mdi mdi-autorenew"></i>
                                            </a>
                                            <a href="javascript: void(0);" class="btn btn-primary ms-1">
                                                <i class="mdi mdi-filter-variant"></i>
                                            </a>
                                        </form>
                                    </div>
                                    <h4 class="page-title">Dashboard Admin</h4>
                                </div>
                            </div>
                        </div>
                        <!-- end page title -->

                        <div class="row">
                            <div class="col-xl-5 col-lg-6">

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="card widget-flat">
                                            <div class="card-body">
                                                <div class="float-end">
                                                    <i class="mdi mdi-account-multiple widget-icon"></i>
                                                </div>
                                                <h5 class="text-muted fw-normal mt-0" title="Number of Patient">Patient</h5>
                                                <h3 class="mt-3 mb-3">36,254</h3>
                                                <p class="mb-0 text-muted">
                                                    <span class="text-success me-2"><i class="mdi mdi-arrow-up-bold"></i> 5.27%</span>
                                                    <span class="text-nowrap">Since last month</span>  
                                                </p>
                                            </div> <!-- end card-body-->
                                        </div> <!-- end card-->
                                    </div> <!-- end col-->

                                    <div class="col-sm-6">
                                        <div class="card widget-flat">
                                            <div class="card-body">
                                                <div class="float-end">
                                                    <i class="mdi mdi-cart-plus widget-icon"></i>
                                                </div>
                                                <h5 class="text-muted fw-normal mt-0" title="Number of Appoinments">Appoinments</h5>
                                                <h3 class="mt-3 mb-3">5,543</h3>
                                                <p class="mb-0 text-muted">
                                                    <span class="text-danger me-2"><i class="mdi mdi-arrow-down-bold"></i> 1.08%</span>
                                                    <span class="text-nowrap">Since last month</span>
                                                </p>
                                            </div> <!-- end card-body-->
                                        </div> <!-- end card-->
                                    </div> <!-- end col-->
                                </div> <!-- end row -->

                                <div class="row">
                                    <div class="col-sm-6">
                                        <div class="card widget-flat">
                                            <div class="card-body">
                                                <div class="float-end">
                                                    <i class="mdi mdi-currency-usd widget-icon"></i>
                                                </div>
                                                <h5 class="text-muted fw-normal mt-0" title="Doctors">Doctors</h5>
                                                <h3 class="mt-3 mb-3">654</h3>
                                                <p class="mb-0 text-muted">
                                                    <span class="text-danger me-2"><i class="mdi mdi-arrow-down-bold"></i> 7.00%</span>
                                                    <span class="text-nowrap">Since last month</span>
                                                </p>
                                            </div> <!-- end card-body-->
                                        </div> <!-- end card-->
                                    </div> <!-- end col-->

                                    <div class="col-sm-6">
                                        <div class="card widget-flat">
                                            <div class="card-body">
                                                <div class="float-end">
                                                    <i class="mdi mdi-pulse widget-icon"></i>
                                                </div>
                                                <h5 class="text-muted fw-normal mt-0" title="Growth">Test Done</h5>
                                                <h3 class="mt-3 mb-3">+ 70.56%</h3>
                                                <p class="mb-0 text-muted">
                                                    <span class="text-success me-2"><i class="mdi mdi-arrow-up-bold"></i> 4.87%</span>
                                                    <span class="text-nowrap">Since last month</span>
                                                </p>
                                            </div> <!-- end card-body-->
                                        </div> <!-- end card-->
                                    </div> <!-- end col-->
                                </div> <!-- end row -->

                            </div> <!-- end col -->

                            <div class="col-xl-7 col-lg-6">
                                <div class="card card-h-100">
                                    <div class="card-body">
                                        <div class="dropdown float-end">
                                            <a href="#" class="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <h4 class="header-title mb-3">Projections Vs Actuals</h4>

                                        <div dir="ltr">
                                            <div id="high-performing-product" class="apex-charts" data-colors="#727cf5,#e3eaef"></div>
                                        </div>
                                            
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->

                            </div> <!-- end col -->
                        </div>
                        <!-- end row -->

                        <div class="row">
                            <div class="col-lg-8">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-end">
                                            <a href="#" class="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <h4 class="header-title mb-3">Revenue</h4>

                                        <div class="chart-content-bg">
                                            <div class="row text-center">
                                                <div class="col-sm-6">
                                                    <p class="text-muted mb-0 mt-3">Current Week</p>
                                                    <h2 class="fw-normal mb-3">
                                                        <small class="mdi mdi-checkbox-blank-circle text-primary align-middle me-1"></small>
                                                        <span>$58,254</span>
                                                    </h2>
                                                </div>
                                                <div class="col-sm-6">
                                                    <p class="text-muted mb-0 mt-3">Previous Week</p>
                                                    <h2 class="fw-normal mb-3">
                                                        <small class="mdi mdi-checkbox-blank-circle text-success align-middle me-1"></small>
                                                        <span>$69,524</span>
                                                    </h2>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="dash-item-overlay d-none d-md-block" dir="ltr">
                                            <h5>Today's Earning: $2,562.30</h5>
                                            <p class="text-muted font-13 mb-3 mt-2">Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.
                                                Etiam rhoncus...</p>
                                            <a href="javascript: void(0);" class="btn btn-outline-primary">View Statements
                                                <i class="mdi mdi-arrow-right ms-2"></i>
                                            </a>
                                        </div>
                                        <div dir="ltr">
                                            <div id="revenue-chart" class="apex-charts mt-3" data-colors="#727cf5,#0acf97"></div>
                                        </div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-lg-4">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-end">
                                            <a href="#" class="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <h4 class="header-title">Doctors By Location</h4>
                                        <div class="mb-4 mt-4">
                                            <div id="world-map-markers" style="height: 224px"></div>
                                        </div>

                                        <h5 class="mb-1 mt-0 fw-normal">New York</h5>
                                        <div class="progress-w-percent">
                                            <span class="progress-value fw-bold">72k </span>
                                            <div class="progress progress-sm">
                                                <div class="progress-bar" role="progressbar" style="width: 72%;" aria-valuenow="72" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <h5 class="mb-1 mt-0 fw-normal">San Francisco</h5>
                                        <div class="progress-w-percent">
                                            <span class="progress-value fw-bold">39k </span>
                                            <div class="progress progress-sm">
                                                <div class="progress-bar" role="progressbar" style="width: 39%;" aria-valuenow="39" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <h5 class="mb-1 mt-0 fw-normal">Sydney</h5>
                                        <div class="progress-w-percent">
                                            <span class="progress-value fw-bold">25k </span>
                                            <div class="progress progress-sm">
                                                <div class="progress-bar" role="progressbar" style="width: 39%;" aria-valuenow="39" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>

                                        <h5 class="mb-1 mt-0 fw-normal">Singapore</h5>
                                        <div class="progress-w-percent mb-0">
                                            <span class="progress-value fw-bold">61k </span>
                                            <div class="progress progress-sm">
                                                <div class="progress-bar" role="progressbar" style="width: 61%;" aria-valuenow="61" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->
                        </div>
                        <!-- end row -->


                        <div class="row">
                            <div class="col-xl-6 col-lg-12 order-lg-2 order-xl-1">
                                <div class="card">
                                    <div class="card-body">
                                        <a href="#" class="btn btn-sm btn-link float-end">Export
                                            <i class="mdi mdi-download ms-1"></i>
                                        </a>
                                        <h4 class="header-title mt-2 mb-3">Top Appointment Category</h4>

                                        <div class="table-responsive">
                                            <table class="table table-centered table-nowrap table-hover mb-0">
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">General Medicine</h5>
                                                            <span class="text-muted font-13">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">1425</h5>
                                                            <span class="text-muted font-13">Count</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">25</h5>
                                                            <span class="text-muted font-13">Surgery</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">$6,518.18</h5>
                                                            <span class="text-muted font-13">Amount</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">General Medicine</h5>
                                                            <span class="text-muted font-13">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">1425</h5>
                                                            <span class="text-muted font-13">Count</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">25</h5>
                                                            <span class="text-muted font-13">Surgery</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">$6,518.18</h5>
                                                            <span class="text-muted font-13">Amount</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">General Medicine</h5>
                                                            <span class="text-muted font-13">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">1425</h5>
                                                            <span class="text-muted font-13">Count</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">25</h5>
                                                            <span class="text-muted font-13">Surgery</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">$6,518.18</h5>
                                                            <span class="text-muted font-13">Amount</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">General Medicine</h5>
                                                            <span class="text-muted font-13">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">1425</h5>
                                                            <span class="text-muted font-13">Count</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">25</h5>
                                                            <span class="text-muted font-13">Surgery</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">$6,518.18</h5>
                                                            <span class="text-muted font-13">Amount</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">General Medicine</h5>
                                                            <span class="text-muted font-13">07 April 2024</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">1425</h5>
                                                            <span class="text-muted font-13">Count</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">25</h5>
                                                            <span class="text-muted font-13">Surgery</span>
                                                        </td>
                                                        <td>
                                                            <h5 class="font-14 my-1 fw-normal">$6,518.18</h5>
                                                            <span class="text-muted font-13">Amount</span>
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div> <!-- end table-responsive-->
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xl-3 col-lg-6 order-lg-1">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-end">
                                            <a href="#" class="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <h4 class="header-title">Total Appointments</h4>

                                        <div id="average-sales" class="apex-charts mb-4 mt-4"
                                            data-colors="#727cf5,#0acf97,#fa5c7c,#ffbc00"></div>
                                       

                                        <div class="chart-widget-list">
                                            <p>
                                                <i class="mdi mdi-square text-primary"></i> General
                                                <span class="float-end">300</span>
                                            </p>
                                            <p>
                                                <i class="mdi mdi-square text-danger"></i> Dental
                                                <span class="float-end">135</span>
                                            </p>
                                            <p>
                                                <i class="mdi mdi-square text-success"></i> Cardiology
                                                <span class="float-end">48</span>
                                            </p>
                                            <p class="mb-0">
                                                <i class="mdi mdi-square text-warning"></i> Medicine
                                                <span class="float-end">154</span>
                                            </p>
                                        </div>
                                    </div> <!-- end card-body-->
                                </div> <!-- end card-->
                            </div> <!-- end col-->

                            <div class="col-xl-3 col-lg-6 order-lg-1">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="dropdown float-end">
                                            <a href="#" class="dropdown-toggle arrow-none card-drop" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="mdi mdi-dots-vertical"></i>
                                            </a>
                                            <div class="dropdown-menu dropdown-menu-end">
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Sales Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Export Report</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Profit</a>
                                                <!-- item-->
                                                <a href="javascript:void(0);" class="dropdown-item">Action</a>
                                            </div>
                                        </div>
                                        <!-- <h4 class="header-title mb-2">Recent Activity</h4> -->

                                        <!-- <div data-simplebar style="max-height: 419px;"> 
                                            <div class="timeline-alt pb-0">
                                                <div class="timeline-item">
                                                    <i class="mdi mdi-upload bg-info-lighten text-info timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-info fw-bold mb-1 d-block">You sold an item</a>
                                                        <small>Paul Burgess just purchased “Hyper - Admin Dashboard”!</small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">5 minutes ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-airplane bg-primary-lighten text-primary timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-primary fw-bold mb-1 d-block">Product on the Bootstrap Market</a>
                                                        <small>Dave Gamache added
                                                            <span class="fw-bold">Admin Dashboard</span>
                                                        </small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">30 minutes ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-microphone bg-info-lighten text-info timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-info fw-bold mb-1 d-block">Robert Delaney</a>
                                                        <small>Send you message
                                                            <span class="fw-bold">"Are you there?"</span>
                                                        </small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">2 hours ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-upload bg-primary-lighten text-primary timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-primary fw-bold mb-1 d-block">Audrey Tobey</a>
                                                        <small>Uploaded a photo
                                                            <span class="fw-bold">"Error.jpg"</span>
                                                        </small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">14 hours ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-upload bg-info-lighten text-info timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-info fw-bold mb-1 d-block">You sold an item</a>
                                                        <small>Paul Burgess just purchased “Hyper - Admin Dashboard”!</small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">16 hours ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-airplane bg-primary-lighten text-primary timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-primary fw-bold mb-1 d-block">Product on the Bootstrap Market</a>
                                                        <small>Dave Gamache added
                                                            <span class="fw-bold">Admin Dashboard</span>
                                                        </small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">22 hours ago</small>
                                                        </p>
                                                    </div>
                                                </div>

                                                <div class="timeline-item">
                                                    <i class="mdi mdi-microphone bg-info-lighten text-info timeline-icon"></i>
                                                    <div class="timeline-item-info">
                                                        <a href="#" class="text-info fw-bold mb-1 d-block">Robert Delaney</a>
                                                        <small>Send you message
                                                            <span class="fw-bold">"Are you there?"</span>
                                                        </small>
                                                        <p class="mb-0 pb-2">
                                                            <small class="text-muted">2 days ago</small>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> -->
                                            <!-- end timeline -->
                                        </div> <!-- end slimscroll -->
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card-->
                            </div>
                            <!-- end col -->

                        </div>
                        <!-- end row -->

                    </div>
                    <!-- container -->

                </div>
                <!-- content -->

                <!-- Footer Start -->
                @include('admin.layouts.footer');
                <!-- end Footer -->

            </div>

            <!-- ============================================================== -->
            <!-- End Page content -->
            <!-- ============================================================== -->


        </div>
        <!-- END wrapper -->

        <!-- Right Sidebar -->
        @include('admin.layouts.rightsidebar');
        <div class="rightbar-overlay"></div>
        <!-- /End-bar -->

        <!-- bundle -->
        <script src="../js/vendor.min.js"></script>
        <script src="../js/app.min.js"></script>

        <!-- third party js -->
        <script src="../js/vendor/apexcharts.min.js"></script>
        <script src="../js/vendor/jquery-jvectormap-1.2.2.min.js"></script>
        <script src="../js/vendor/jquery-jvectormap-world-mill-en.js"></script>
        <!-- third party js ends -->

        <!-- demo app -->
        <script src="../js/pages/demo.dashboard.js"></script>
        <!-- end demo js-->
    </body>

<!-- Mirrored from coderthemes.com/hyper_2/saas/ by HTTrack Website Copier/3.x [XR&CO'2014], Thu, 03 Mar 2022 04:05:37 GMT -->
</html>