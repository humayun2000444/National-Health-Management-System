  <header>
    <div class="topbar">
      <div class="container">
        <div class="row">
          <div class="col-sm-8 text-sm">
            <div class="site-info">
              <a href="#"><span class="mai-call text-primary"></span> 000 000 0000</a>
              <span class="divider">|</span>
              <a href="#"><span class="mai-mail text-primary"></span> diithealth@diit.edu.bd</a>
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
                  <a class="dropdown-item" href="{{ route('home') }}">Profile</a>
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