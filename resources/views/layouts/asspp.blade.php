<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="copyright" content="MACode ID, https://macodeid.com/">
  <title>DIIT - Health Medical Center</title>
  <link rel="shortcut icon" href="./img/diitlogo.png" type="image/x-icon">
  <link rel="stylesheet" href="css/maicons.css">
  <link rel="stylesheet" href="css/bootstrap.css">
  <link rel="stylesheet" href="vendor/owl-carousel/css/owl.carousel.css">
  <link rel="stylesheet" href="vendor/animate/animate.css">
  <link rel="stylesheet" href="css/theme.css">
</head>
<body>

  <!-- Back to top button -->
  <div class="back-to-top"></div>

  <header>
    <div class="topbar">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 text-sm">
            <div class="site-info">
              <a href="#"><span class="mai-call text-primary"></span> 01815780053</a>
              <span class="divider">|</span>
              <a href="#"><span class="mai-mail text-primary"></span> muhammad.rukon242@gmail.com</a>
            </div>
          </div>
          <div class="col-sm-4 text-right text-sm">
            <div class="social-mini-button">
              <a href="#"><span class="mai-logo-facebook-f"></span></a>
              <a href="#"><span class="mai-logo-twitter"></span></a>
              <a href="#"><span class="mai-logo-dribbble"></span></a>
              <a href="#"><span class="mai-logo-instagram"></span></a>
            </div>
          </div>
        </div> <!-- .row -->
      </div> <!-- .container -->
    </div> <!-- .topbar -->

    <nav class="navbar navbar-expand-lg navbar-light shadow-sm">
      <div class="container">
        <a class="navbar-brand" href="{{ url('/') }}"> <img style="width: 15%;" src="./img/diitlogo.png" alt="">-Health</a>
        <div class="collapse navbar-collapse" id="navbarSupport">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item active">
              <a class="nav-link" href="{{ url('/') }}">Home</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="{{ url('/about') }}">About Us</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="{{ url('/doctors') }}">Doctors</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="{{ url('/contact') }}">Contact</a>
            </li>
            @guest
              @if (Route::has('login'))
              <!-- <li class="nav-item">
              <a class="btn btn-primary ml-lg-3" href="#appointment">Make Appointment</a>
            </li> -->
                <li class="nav-item ">
                  <a class="btn btn-primary" href="{{ route('login') }}">{{ __('Login') }}</a>
                </li>
              @endif
              @if (Route::has('register'))
                <li class="nav-item">
                  <a class="btn btn-primary ml-lg-3" href="{{ route('register') }}">{{ __('Register') }}</a>
                </li>
              @endif
            @else
              <li class="nav-item dropdown">
                <a id="navbarDropdown" class="btn btn-primary dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                  {{ Auth::user()->name }}
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                  </a>
                  <a class="dropdown-item" href="{{ route('logout') }}"
                     onclick="event.preventDefault();
                               document.getElementById('logout-form').submit();">
                    {{ __('Logout') }}
                  </a>
                  <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                    @csrf
                  </form>
                </div>
              </li>
            @endguest
          </ul>
        </div> <!-- .navbar-collapse -->
      </div> <!-- .container -->
    </nav>
  </header>

  <div id="app">
    <main class="py-4">
      @yield('content')
    </main>
  </div>
    
  <footer class="page-footer">
    <div class="container">
      <div class="row px-md-3">
        <div class="col-sm-6 col-lg-4 py-3">
          <h5>Company</h5>
          <ul class="footer-menu">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Career</a></li>
            <li><a href="#">Editorial Team</a></li>
            <li><a href="#">Protection</a></li>
          </ul>
        </div>
        <div class="col-sm-6 col-lg-4 py-3">
          <h5 class="">Social Media</h5>
          <div class="footer-sosmed mt-3">
            <a href="#" target="_blank"><span class="mai-logo-facebook-f"></span></a>
            <a href="#" target="_blank"><span class="mai-logo-twitter"></span></a>
            <a href="#" target="_blank"><span class="mai-logo-google-plus-g"></span></a>
            <a href="#" target="_blank"><span class="mai-logo-instagram"></span></a>
            <a href="#" target="_blank"><span class="mai-logo-linkedin"></span></a>
          </div>
        </div>
        <div class="col-sm-6 col-lg-4 py-3">
          <h5>Contact</h5>
          <p class="footer-link mt-2">Daffodil Plaza, 4/2 Sobhanbag (6th & 7th Floor) Mirpur Road, Dhanmondi, Dhaka-1207</p>
          <a href="#" class="footer-link">Humayun - 01789896378</a>
          <a href="#" class="footer-link">Rukon - 01815780053</a>
          <a href="#" class="footer-link">muhammad.rukon242@gmail.com</a>
        </div>
      </div>
      <hr>
      <p id="copyright">Copyright &copy; 2024 <a href="https://www.youtube.com/watch?v=8F0-9wygJog" target="_blank">Commitment Issues</a>. All right reserved</p>
    </div>
  </footer>

  <script src="js/jquery-3.5.1.min.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="vendor/owl-carousel/js/owl.carousel.min.js"></script>
  <script src="vendor/wow/wow.min.js"></script>
  <script src="js/theme.js"></script>
</body>
</html>
