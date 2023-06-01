<?php
    function head($ua = null){
        !is_null($ua) ? $ua->sessionValidate() : null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/resources/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap" rel="stylesheet">
<style>
    body {
        color: #555;
        background-color: #ccc;
    }
</style>
<title>Blog X</title>
</head>
<body>
    <div id="app" class="container-fluid p-0">
        <header class="row m-0 bd-dark bg-gradient" data-bs-theme="dark">
            <div class="col-9">
                <a style="text-decoration: none; color: black;" href="/resources/views/home.php">
                    <h1 class="ml-3 mt-2">BLOG X</h1>
                </a>
            </div>
            <div class="col-3 mt-2">
                <form class="d-flex" role="search">
                    <input class="form-control me-2" id="buscar-palabra" type="search" placeholder="Buscar" aria-label="Search">
                    <button class="btn btn-outline-success" onclick="app.buscarPalabra()" type="button"><i class="bi bi-search"></i></button>
                </form>
            </div>
        </header>
        <nav class="navbar navbar-expand-lg bg-body-tertiary bd-dark bg-gradient mb-3" data-bs-theme="dark">
            <div class="container-fluid">
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" aria-current="page" href="/resources/views/home.php">Inicio</a>
                    </li>
                    <?php if(!is_null($ua) && $ua->sv && $ua->tipo == 2){ ?>
                    <li class="nav-item">
                        <button class="nav-link btn btn-link" 
                                type="button" aria-current="page"
                                onclick="app.view('newpost')"
                        >Nueva publicación</button>
                    </li>
                    <li class="nav-item">
                        <button class="nav-link btn btn-link" 
                                type="button" aria-current="page"
                                onclick="app.view('myposts')"
                        >Mis publicaciones</button>
                    </li>
                    <?php } ?>
                </ul>
                 <ul   class="navbar-nav ml-auto mb-2 d-flex">

                    <?php if(is_null($ua) || !$ua->sv){ ?>

                    <li class="nav-item">
                        <button type="button" class="nav-link btn btn-link" 
                            onclick="app.view('inisession')" >
                            Inicar sesión
                        </button>
                    </li>

                    <?php } else { ?>
                    
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <?=$ua->name?>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Action</a></li>
                            <li><a class="dropdown-item" href="#">Another action</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><button type="button" class="dropdown-item btn btn-link"
                                    onclick="app.view('endsession')">
                                    Cerrar sesión
                                </button></li>
                        </ul>
                    </li>
                    <?php } ?>

                </ul>
                </div>
            </div>
        </nav>
  <?php
}
function scripts($script=""){
    ?>
    </div>
<script src="/resources/js/jquery.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
<script src="/resources/js/bootstrap.js"></script>
<script src="/resources/js/bootstrap.bundle.min.js"></script>
<script src="/resources/js/popper.js"></script>
<script src="/resources/js/app.js"></script>
<?php
    if($script != ''){
        echo '<script src="/resources/js/' . $script . '.js"></script>';
    }
}
    function foot(){
?>

</body>
</html>
<?php }