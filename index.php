<?php
session_start();
session_destroy();
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Iniciar sesión | CalendarApp</title>
    <meta charset="UTF-8"><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="images/app/icon.png" type="image/png">
    <link rel="stylesheet" href="styles/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="styles/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="styles/generales.css">
  </head>

  <body>
    <div class="container-fluid h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div class="login-container bg-white text-secondary rounded shadow-sm p-3">
            <div class="text-center">
              <div class="mb-2 my-1">
                <img src="images/app/icon.png" alt="Calendar icon">
              </div>

              <h2>CalendarApp</h2>
              <h4>Iniciar sesión</h4>
            </div>
            
            <form name="form_login" id="form-login" class="form-row">
              <div class="form-group col-sm-12 mb-2">
                <label for="username">Usuario:</label>
                <input type="text" name="username" id="username" class="form-control form-control-sm" aria-describedby="username" autocomplete="off">
              </div>

              <div class="form-group col-sm-12">
                <label for="password">Contraseña:</label>
                <input type="password" name=password id="password" class="form-control form-control-sm" aria-describedby="password" autocomplete="password">
              </div>

              <div class="button-container col-sm-12">
                <button type="button" id="login-button" class="btn btn-sm btn-block btn-own">
                  <span class="mx-1">Iniciar</span>
                  <i class="fas fa-sign-in-alt"></i>
                </button>
              </div>
            </form>

            <div id="message-container"></div>
          </div>
        </div>
      </div>
    </div>

    <script src="javascript/jquery/jquery-3.5.1.min.js"></script>
    <script src="javascript/popper/popper.min.js"></script>
    <script src="javascript/bootstrap/bootstrap.min.js"></script>
    <script src="javascript/app/tool.js"></script>
    <script src="javascript/app/login.js"></script>
  </body>
</html>