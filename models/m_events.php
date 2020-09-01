<?php
require_once 'connect.php';

class model_events extends connect {
  public $connection;

  public function model_events() {
    $this->connect();
    $this->toConnect();
  }

  public function toConnect() {
    $data = $this->getData();
    $this->connection = mysqli_connect($data['host'], $data['username'], $data['password'], $data['database']);
    if (mysqli_connect_error()) {
      die("Conexión fallida: ".mysqli_connect_error());
    }
  }

  public function toClose() {
    mysqli_close($this->connection);
  }

  public function toConsultAllEvents($data) {
    $results  = false;
    $query = "SELECT *
      FROM events
      WHERE `date` BETWEEN '".htmlspecialchars($data['start_day'])."' AND '".htmlspecialchars($data['end_day'])."'
    ";

    $consult = mysqli_query($this->connection, $query);
    while ($rows = mysqli_fetch_assoc($consult)) {
      $results[] = $rows;
    }

    return $results;
  }

  public function toRegisterEvent($data) {
    $results  = false;
    $query = "INSERT INTO events (
      `title`,
      `description`,
      `address`,
      `date`,
      `start_hour`,
      `end_hour`,
      `type`,
      `username`
    ) VALUES (
      '".htmlspecialchars($data['event_title'])."',
      '".htmlspecialchars($data['event_description'])."',
      '".htmlspecialchars($data['event_address'])."',
      '".htmlspecialchars($data['event_date'])."',
      '".htmlspecialchars($data['event_start_hour'])."',
      '".htmlspecialchars($data['event_end_hour'])."',
      '".htmlspecialchars($data['event_type'])."',
      '".htmlspecialchars($data['username'])."'
    )";

    mysqli_query($this->connection, $query);
    if (mysqli_affected_rows($this->connection) > 0) $results = true;
    return $results;
  }

  public function toConsultEvents($data) {
    $results  = false;
    $query = "SELECT *
      FROM events
      WHERE `date`='".htmlspecialchars($data['event_date'])."'
      AND `username`='".htmlspecialchars($data['username'])."'
    ";

    $consult = mysqli_query($this->connection, $query);
    while ($rows = mysqli_fetch_assoc($consult)) {
      $results[] = $rows;
    }

    return $results;
  }

  public function toModifyEvent($data) {
    $results  = false;
    $query = "UPDATE events SET
      `title`='".htmlspecialchars($data['event_title'])."',
      `description`='".htmlspecialchars($data['event_description'])."',
      `address`='".htmlspecialchars($data['event_address'])."',
      `date`='".htmlspecialchars($data['event_date'])."',
      `start_hour`='".htmlspecialchars($data['event_start_hour'])."',
      `end_hour`='".htmlspecialchars($data['event_end_hour'])."',
      `type`='".htmlspecialchars($data['event_type'])."',
      `username`='".htmlspecialchars($data['username'])."'
      WHERE `iddates`='".htmlspecialchars($data['id_event'])."'
    ";

    if (mysqli_query($this->connection, $query)) $results = true;
    return $results;
  }

  public function toMoveEvent($data) {
    $results  = false;
    $query = "UPDATE events SET `date`='".htmlspecialchars($data['event_date'])."' WHERE `iddates`='".htmlspecialchars($data['id_event'])."'";

    mysqli_query($this->connection, $query);
    if (mysqli_affected_rows($this->connection) > 0) $results = true;
    return $results;
  }

  public function toDeleteEvent($data) {
    $results  = false;
    $query = "DELETE FROM events WHERE `iddates`='".htmlspecialchars($data['id_event'])."'";

    mysqli_query($this->connection, $query);
    if (mysqli_affected_rows($this->connection) > 0) $results = true;
    return $results;
  }
}