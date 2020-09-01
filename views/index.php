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

    <div class="main-container" style="height: calc(100% - 50px - 30px); /*  */">
      <div class="container-fluid h-100 py-2" style="min-height: auto;">
        <div class="form-row h-100">
          <div class="col-lg-3 py-2">
            <div id="calendar-controls" class="bg-white rounded h-100 p-3">
              <div id="sh-description" class="text-center mb-2">
                <div id="description-labels" style="display: ; cursor: pointer;">
                  <div class="d-flex justify-content-between align-items-center">
                    <p  class="h5 text-secondary m-0">
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
                <div>
                  <button type="button" id="last-year" class="btn btn-sm btn-own">
                    <i class="fas fa-angle-double-left px-2"></i>
                  </button>

                  <button type="button" id="last-month" class="btn btn-sm btn-own">
                    <i class="fas fa-angle-left px-2"></i>
                  </button>
                </div>
                
                <div>
                  <button type="button" id="next-month" class="btn btn-sm btn-own">
                    <i class="fas fa-angle-right px-2"></i>
                  </button>

                  <button type="button" id="next-year" class="btn btn-sm btn-own">
                    <i class="fas fa-angle-double-right px-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-9 py-2">
            <div id="calendar-app" class="bg-white rounded h-100 p-3">
              <table id="calendar-table" class="calendar-table w-100 h-100 text-secondary">
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
                  <tr>
                    <td colspan="7"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="event-list-modal" class="modal fade" tabindex="-1" aria-labelledby="show-selected-day" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header py-2 px-3">
            <h5 class="modal-title w-100 text-center text-secondary" id="show-selected-day"></h5>

            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="text-secondary border-bottom py-2 px-3">
            <button id="new-event" class="btn btn-sm btn-block btn-own">
              <i class="fas fa-plus"></i>
              <span class="ml-1">Añadir</span>
            </button>
          </div>

          <div class="modal-body rounded-bottom bg-light text-secondary overflow-auto py-2 px-3" style="min-height: 120px; max-height: 400px;"></div>
        </div>
      </div>
    </div>

    <div id="show-event-modal" class="modal fade" tabindex="-1" aria-labelledby="description-event-manager" aria-hidden="true">
      <div class="position-fixed w-100 h-100" data-dismiss="modal" style="background: rgba(0,0,0,0.3);"></div>

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header py-2 px-3">
            <h5 class="modal-title w-100 text-center text-secondary" id="description-event-manager"></h5>

            <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="outline: none;">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div class="modal-body text-secondary py-2 px-3">
            <form class="form-row" id="event-form">
              <div class="form-group col-sm-12 mb-2">
                <label for="event-title" class="small">Título <span class="text-danger">*</span></label>
                <input type="text" id="event-title" name="event_title" class="form-control form-control-sm input-form" autocomplete="off">
              </div>

              <div class="form-group col-sm-4 mb-2">
                <label for="event-start-hour" class="small">Hora inicio</label>
                <input type="text" id="event-start-hour" name="event_start_hour" class="form-control form-control-sm input-form" autocomplete="off" placeholder="01:00" maxlength="5">
              </div>

              <div class="form-group col-sm-4 mb-2">
                <label for="event-end-hour" class="small">Hora fin</label>
                <input type="text" id="event-end-hour" name="event_end_hour" class="form-control form-control-sm input-form" autocomplete="off" placeholder="02:00" maxlength="5">
              </div>

              <div class="form-group col-sm-4 mb-2">
                <label for="event-type" class="small">Tipo de evento</label>
                <select id="event-type" name="event_type" class="custom-select custom-select-sm input-form">
                  <option value="">Seleccionar</option>
                  <option value="1">Cita</option>
                  <option value="3">Reunión</option>
                  <option value="2">Evento</option>
                  <option value="3">Cumpleaños</option>
                </select>
              </div>

              <div class="form-group col-sm-12 mb-2">
                <label for="event-address" class="small">Dirección</label>
                <input type="text" id="event-address" name="event_address" class="form-control form-control-sm input-form" autocomplete="off">
              </div>

              <div class="form-group col-sm-12 mb-2">
                <label for="event-description" class="small">Descripción</label>
                <textarea type="text" id="event-description" name="event_description" class="form-control form-control-sm input-form" style="resize: none; height: 60px;"></textarea>
              </div>
            </form>
          </div>

          <div class="modal-footer justify-content-between py-2 px-3">
            <button class="btn btn-sm btn-own" id="save-event">
              <i class="fas fa-save"></i>
              <span class="ml-1">Guardar</span>
            </button>

            <button class="btn btn-sm btn-light" data-dismiss="modal">
              <i class="fas fa-times"></i>
              <span class="ml-1">Cancelar</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <footer class="d-flex justify-content-center align-items-center bg-own text-white" style="min-height: 30px;">
      <p class="font-weight-light m-0">CalendarApp - <a href="https://twitter.com/mahsve" class="text-white" target="_blank">Miguel Herrera</a> | Agosto de 2020</p>
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