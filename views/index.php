<?php
session_start();
if (isset($_SESSION['log_active'])) {
  $anoActual = date('Y');
  $meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Inicio | CalendarApp</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" href="../images/app/icon.png" type="image/png">
    <link rel="stylesheet" href="../styles/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="../styles/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="../styles/general-styles.css">
  </head>
  
  <body>
    <header class="d-flex justify-content-between align-items-center bg-white" style="min-height: 50px;">
      <a class="d-flex align-items-center text-secondary h4 font-weight-normal text-decoration-none py-2 px-3 m-0" href="../views/">
        <img src="../images/app/icon.png" width="30" height="30" class="d-inline-block align-top mr-2" alt="Icon of the app">
        CalendarApp
      </a>

      <button type="button" id="button-logout" class="btn btn-sm btn-danger mx-3" style="min-width: 80px;">
        <i class="fas fa-sign-out-alt"></i>
        <span class="mx-1">Salir</span>
      </button>
    </header>

    <div class="main-container" style="min-height: calc(100% - 50px - 30px); height: auto !important;">
      <div class="container-fluid h-100 py-2">
        <div class="form-row h-100">
          <div class="col-lg-3 py-2">
            <div id="calendar-controls" class="bg-white rounded h-100 p-3">
              <div id="sh-description" class="text-center mb-2">
                <div id="description-labels" style="display: ; cursor: pointer;">
                  <div class="d-flex justify-content-between">
                    <p  class="h5 text-secondary">
                      <span id="label-month">-</span>
                      <span>-</span>
                      <span id="label-year">-</span>
                    </p>

                    <button id="go-today" class="btn btn-sm btn-own ml-2">
                      <i class="fas fa-calendar-day"></i>
                      <span class="ml-1">Hoy</span>
                    </button>
                  </div>
                </div>

                <div id="description-inputs" class="w-100" style="display: none;">
                  <div class="d-flex mx-auto">
                    <select id="selected-month" class="month form-control form-control-sm mr-1">
                      <?php for ($var = 0; $var < count($meses); $var++) { ?>
                        <option value="<?php echo $var; ?>"><?php echo $meses[$var]; ?></option>
                      <?php } ?>
                    </select>
                    -
                    <select id="selected-year" class="year form-control form-control-sm ml-1" style="width: 72px;">
                      <?php for ($var = $anoActual + 2; $var >= 2018; $var--) { ?>
                        <option value="<?php echo $var; ?>"><?php echo $var; ?></option>
                      <?php } ?>
                    </select>

                    <button id="accept-changes-move" class="btn btn-sm btn-own ml-1">
                      <i class="fas fa-check" style="width: 16px;"></i>
                    </button>
                    <button id="cancel-changes-move" class="btn btn-sm btn-danger ml-1">
                      <i class="fas fa-times" style="width: 16px;"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button type="button" id="last-month" class="btn btn-sm btn-own">
                  <i class="fas fa-angle-left px-2"></i>
                </button>
                
                <button type="button" id="next-month" class="btn btn-sm btn-own">
                  <i class="fas fa-angle-right px-2"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="col-lg-9 py-2">
            <div id="calendar-app" class="bg-white rounded p-3">
              <table id="calendar-table" class="calendar-table w-100 text-secondary">
                <thead class="text-center">
                  <tr>
                    <th>Domingo</th>
                    <th>Lunes</th>
                    <th>Martes</th>
                    <th>Miercoles</th>
                    <th>Jueves</th>
                    <th>Viernes</th>
                    <th>Sabado</th>
                  </tr>
                </thead>

                <tbody>
                  <?php for ($var = 0; $var < 5; $var++) { ?>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  <?php } ?>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="new" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>

    <footer class="d-flex justify-content-center align-items-center bg-own text-white" style="min-height: 30px;">
      <p class="font-weight-light m-0">CalendarApp - Agosto de 2020</p>
    </footer>

    <script src="../javascript/jquery/jquery-3.5.1.min.js"></script>
    <script src="../javascript/popper/popper.min.js"></script>
    <script src="../javascript/bootstrap/bootstrap.min.js"></script>
    <script src="../javascript/app/tool.js"></script>
    <script src="../javascript/app/logout.js"></script>
    
    <script> let sqlQueryMain = ''; </script>
    <script src="../javascript/app/calendar.js"></script>
  </body>
</html>
<?php
} else {
  header('Location: ../');
}
?>