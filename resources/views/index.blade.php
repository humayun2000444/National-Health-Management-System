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

  @include('layouts.nav-top');

  <div class="page-hero bg-image overlay-dark" style="background-image: url(img/bg_image_1.jpg);">
    <div class="hero-section">
      <div class="container text-center wow zoomIn">
        <span class="subhead">Let's make your life happier</span>
        <h1 class="display-4">Healthy Living</h1>
        <a href="#appointment" class="btn btn-primary">Make Appointment</a>
      </div>
    </div>
  </div>

  <div class="bg-light">
    <div class="page-section py-3 mt-md-n5 custom-index">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-4 py-3 py-md-0">
            <div class="card-service wow fadeInUp">
              <div class="circle-shape bg-secondary text-white">
                <span class="mai-chatbubbles-outline"></span>
              </div>
              <p><span>Chat</span> with a doctors</p>
            </div>
          </div>
          <div class="col-md-4 py-3 py-md-0">
            <div class="card-service wow fadeInUp">
              <div class="circle-shape bg-primary text-white">
                <span class="mai-shield-checkmark"></span>
              </div>
              <p><span>One</span>-Health Protection</p>
            </div>
          </div>
          <div class="col-md-4 py-3 py-md-0">
            <div class="card-service wow fadeInUp">
              <div class="circle-shape bg-accent text-white">
                <span class="mai-basket"></span>
              </div>
              <p><span>One</span>-Health Pharmacy</p>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- .page-section -->

    <div class="page-section pb-0">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6 py-3 wow fadeInUp">
            <h1>Welcome to DIIT Health <br> Center</h1>
            <p class="text-grey mb-4">At DIIT Health Center, we are committed to providing top-notch medical care and support to the DIIT community and beyond. Our dedicated team of healthcare professionals is here to offer comprehensive services designed to meet your health and wellness needs.</p>
            <a href="about.html" class="btn btn-primary">Learn More</a>
          </div>
          <div class="col-lg-6 wow fadeInRight" data-wow-delay="400ms">
            <div class="img-place custom-img-1">
              <img src="img/bg-doctor.png" alt="">
            </div>
          </div>
        </div>
      </div>
    </div> <!-- .bg-light -->
  </div> <!-- .bg-light -->

  <div class="page-section">
    <div class="container">
      <h1 class="text-center mb-5 wow fadeInUp">Our Doctors</h1>
      <div class="owl-carousel wow fadeInUp" id="doctorSlideshow">
        <div class="item">
          <div class="card-doctor">
            <div class="header">
              <img src="img/doctors/doctor_1.jpg" alt="">
              <div class="meta">
                <a href="#"><span class="mai-call"></span></a>
                <a href="#"><span class="mai-logo-whatsapp"></span></a>
              </div>
            </div>
            <div class="body">
              <p class="text-xl mb-0">Dr. Stein Albert</p>
              <span class="text-sm text-grey">Cardiology</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="card-doctor">
            <div class="header">
              <img src="img/doctors/doctor_2.jpg" alt="">
              <div class="meta">
                <a href="#"><span class="mai-call"></span></a>
                <a href="#"><span class="mai-logo-whatsapp"></span></a>
              </div>
            </div>
            <div class="body">
              <p class="text-xl mb-0">Dr. Alexa Melvin</p>
              <span class="text-sm text-grey">Dental</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="card-doctor">
            <div class="header">
              <img src="img/doctors/doctor_3.jpg" alt="">
              <div class="meta">
                <a href="#"><span class="mai-call"></span></a>
                <a href="#"><span class="mai-logo-whatsapp"></span></a>
              </div>
            </div>
            <div class="body">
              <p class="text-xl mb-0">Dr. Rebecca Steffany</p>
              <span class="text-sm text-grey">General Health</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="card-doctor">
            <div class="header">
              <img src="img/doctors/doctor_4.jpg" alt="">
              <div class="meta">
                <a href="#"><span class="mai-call"></span></a>
                <a href="#"><span class="mai-logo-whatsapp"></span></a>
              </div>
            </div>
            <div class="body">
              <p class="text-xl mb-0">Dr. Mikel Analyn</p>
              <span class="text-sm text-grey">Dermatology</span>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="card-doctor">
            <div class="header">
              <img src="img/doctors/doctor_5.jpg" alt="">
              <div class="meta">
                <a href="#"><span class="mai-call"></span></a>
                <a href="#"><span class="mai-logo-whatsapp"></span></a>
              </div>
            </div>
            <div class="body">
              <p class="text-xl mb-0">Dr. Heidi Albert</p>
              <span class="text-sm text-grey">Neurology</span>
            </div>
          </div>
        </div>
      </div>
    </div> <!-- .container -->
  </div> <!-- .page-section -->

  <div id = "appointment" class="page-section bg-light">
    <div class="container">
      <h1 class="text-center wow fadeInUp">Make an Appointment</h1>

      @if(session('success'))
        <div class="alert alert-success">
          {{ session('success') }}
        </div>
        <input type="hidden" id="appointmentSuccess" value="1">
      @endif

      @guest
        <div class="alert alert-warning text-center">
          Please <a href="{{ route('login') }}">login</a> or <a href="{{ route('register') }}">register</a> to make an appointment.
        </div>
      @else
        <form class="main-form" action="{{ route('appointments.store') }}" method="POST">
          @csrf
          <div class="row mt-5 ">
            <div class="col-12 col-sm-6 py-2 wow fadeInLeft">
              <input type="text" class="form-control" name="name" placeholder="Full name" required>
            </div>
            <div class="col-12 col-sm-6 py-2 wow fadeInRight">
              <input type="text" class="form-control" name="email" placeholder="Email address.." required>
            </div>
            <div class="col-12 col-sm-6 py-2 wow fadeInLeft" data-wow-delay="300ms">
              <input type="date" class="form-control" name="date" required>
            </div>
            <div class="col-12 col-sm-6 py-2 wow fadeInRight" data-wow-delay="300ms">
              <select name="department" id="department" class="custom-select" required>
                <option value="general">General Health</option>
                <option value="cardiology">Cardiology</option>
                <option value="dental">Dental</option>
                <option value="neurology">Neurology</option>
                <option value="orthopaedics">Orthopaedics</option>
              </select>
            </div>
            <div class="col-12 py-2 wow fadeInUp" data-wow-delay="300ms">
              <input type="text" class="form-control" name="number" placeholder="Number.." required>
            </div>
            <div class="col-12 py-2 wow fadeInUp" data-wow-delay="300ms">
              <textarea name="message" id="message" class="form-control" rows="6" placeholder="Enter message.."></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-primary mt-3 wow zoomIn">Submit Request</button>
        </form>
      @endguest
    </div> <!-- .container -->
  </div> <!-- .page-section -->

  <div class="page-section banner-home bg-image" style="background-image: url(img/banner-pattern.svg);">
    <div class="container py-5 py-lg-0">
      <div class="row align-items-center">
        <div class="col-lg-4 wow zoomIn">
          <div class="img-banner d-none d-lg-block">
            <img src="img/mobile_app.png" alt="">
          </div>
        </div>
        <div class="col-lg-8 wow fadeInRight">
          <h1 class="mb-4">Get easy access of all features using One Health Application</h1>
          <a href="#"><img src="img/google_play.svg" alt=""></a>
          <a href="#" class="ml-2"><img src="img/app_store.svg" alt=""></a>
        </div>
      </div>
    </div>
  </div> <!-- .banner-home -->

 @include('layouts/footer');

  <script src="js/jquery-3.5.1.min.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="vendor/owl-carousel/js/owl.carousel.min.js"></script>
  <script src="vendor/wow/wow.min.js"></script>
  <script src="js/theme.js"></script>
    <script>
    // Check if the appointment form was successfully submitted
    if (document.getElementById('appointmentSuccess')) {
      alert('Thanks for submitting your appointment');
    }
  </script>
  
</body>
</html>
