<!DOCTYPE html>
<html lang="ro">

<head>
	<title>noName | Privacy Policy</title>
	<?php require('head-main.php'); ?>
	<link rel="stylesheet" href="css/custom-terms.css" />

	<meta property="og:image:url" content="https://noName.ro/public/images/OgImage.png" />
	<meta name="image:url" content="https://noName.ro/public/images/OgImage.png">
	<meta name="description"
		content="Cauți meditații la informatică? Sau consideri că ești bine pregătit pentru a preda informatică?">
	<meta property="og:description"
		content="Cauți meditații la informatică? Sau consideri că ești bine pregătit pentru a preda informatică?">
	<meta property="og:image:url" content="https://noName.ro/public/images/OgImage.png" />
	<meta name="image:url" content="https://noName.ro/public/images/OgImage.png">
	<meta name="title" content="noName - Meditații Informatică Online">
	<meta property="og:title" content="noName - Meditații Informatică Online">
	<link rel="canonical" href="https://noName.ro" />
</head>

<body class="body">
	<div class="page-wrapper rtl">

		<!-- Preloader -->
		<div class="preloader"></div>

		<!-- Main Header-->
		<header class="main-header">
			<!--Header-Upper-->
			<div class="header-upper">
				<div class="auto-container menu-container">
					<div class="clearfix">
						<div class="pull-left logo-box">
							<div class="logo mt-2">
								<a href="index.php"><img src="images/logo.webp" alt="logo"></a>
							</div>
						</div>

						<div class="nav-outer clearfix">
							<!-- Main Menu -->
							<nav class="main-menu navbar-expand-md">
								<div class="navbar-header">
									<button class="navbar-toggler" type="button" data-toggle="collapse"
										data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
										aria-expanded="false" aria-label="Toggle navigation">
										<span class="icon-bar"></span>
										<span class="icon-bar"></span>
										<span class="icon-bar"></span>
									</button>
								</div>
								<div class="navbar-collapse collapse scroll-nav clearfix" id="navbarSupportedContent">
									<ul class="navigation clearfix">
										<li><a href="index.php" data-i18n="home">Home</a></li>
										<li><a href="about.php" data-i18n="about">About Us</a></li>
										<li><a href="#" data-i18n="blog">Blog</a></li>
										<?php include('includes/nav/nav-main.php'); ?>
										<?php include('includes/nav/nav-icons.php'); ?>
									</ul>
								</div>
							</nav>
						</div>

					</div>
				</div>
			</div>
			<!--End Header Upper-->
		</header>
		<!--End Main Header -->

		<section class="banner-section" id="home-banner">
			<div class="auto-container main-banner">
				<div class="sec-title">
					<h2><b data-i18n="privacyPolicy">Privacy Policy</b></h2>
				</div>
				<div id="loading" class="text-center">
					<div class="spinner-border" role="status">
						<span class="sr-only"></span>
					</div>
					<i> Loading...</i>
				</div>
				<div id="markdown"></div>
			</div>
		</section>

		<!-- Card Section -->
		<section class="work-section card-section">
			<div class="auto-container">
				<div class="row clearfix">
					<div class="custom-card d-flex align-items-center justify-content-between">
						<div>
							<img src="images/bulb.png" loading="lazy" alt="bulb" />
						</div>
						<div class="d-flex p-4">
							<p data-i18n="over1500Students">
								The only platform that gathers over 1500 students and teachers
								meditating in computer science
							</p>
						</div>
						<div>
							<?php include('includes/card/card-main.php'); ?>
						</div>
					</div>
				</div>
			</div>
		</section>
		<!-- End Card Section -->

		<?php include('includes/footer/footer-main.php'); ?>

	</div>
	<!--End pagewrapper-->

	<?php require('scripts.php'); ?>
	<script src="https://cdn.jsdelivr.net/remarkable/1.7.1/remarkable.min.js"></script>
	<script src="js/privacy.js"></script>
	<?php include('includes/modal/modal-main.php'); ?>
</body>

</html>