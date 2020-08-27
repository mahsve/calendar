<?php
session_start();
require_once '../models/m_login.php';

if (isset($_POST['option'])) {
  $obj = new model_login;

  switch ($_POST['option']) {
    case 'Login':
      $consult = $obj->toLogin($_POST);
      
      if ($consult) {
        if (password_verify($_POST['password'], $consult['password'])) {
          $_SESSION['log_active'] = true;
          $_SESSION['data_user'] = $consult;

          echo 'inicio de sesión exitoso';
        } else {
          echo 'usuario/contraseña incorrecta';
        }
      } else {
        echo 'usuario/contraseña incorrecta';
      }
    break;

    case 'Logout':
      session_destroy();
      echo 'sesión finalizada';
    break;
    
    default:
      echo 'Error al procesar acción';
    break;
  }
} else {
  echo 'Intento de acceso fallido';
}