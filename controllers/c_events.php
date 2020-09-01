<?php
session_start();
require_once '../models/m_events.php';

if (isset($_POST['option'])) {
  $obj = new model_events;

  switch ($_POST['option']) {
    case 'Consult all':
      $_POST['username'] = $_SESSION['data_user']['username'];
      $result = $obj->toConsultAllEvents($_POST);
      echo json_encode($result);
    break;

    case 'Register':
      $_POST['username'] = $_SESSION['data_user']['username'];

      $result = $obj->toRegisterEvent($_POST);
      if ($result) {
        echo 'success';
      } else {
        echo 'error';
      }
    break;

    case 'Consult':
      $_POST['username'] = $_SESSION['data_user']['username'];
      $result = $obj->toConsultEvents($_POST);
      echo json_encode($result);
    break;

    case 'Modify':
      $_POST['username'] = $_SESSION['data_user']['username'];

      $result = $obj->toModifyEvent($_POST);
      if ($result) {
        echo 'success';
      } else {
        echo 'error';
      }
    break;

    case 'Move':
      $result = $obj->toMoveEvent($_POST);
      if ($result) {
        echo 'success';
      } else {
        echo 'error';
      }
    break;

    case 'Delete':
      $result = $obj->toDeleteEvent($_POST);
      if ($result) {
        echo 'success';
      } else {
        echo 'error';
      }
    break;

    default:
      echo 'Error request';
    break;
  }

  $obj->toClose();
} else {
  echo 'Intento de acceso fallido';
}