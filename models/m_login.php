<?php
require_once 'connect.php';

class model_login extends connect {
  public $connection;

  public function model_login() {
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

  public function toLogin($data) {
    $results  = false;
    $sentence = "SELECT *
      FROM users
      WHERE username='".$data['username']."'
    ";

    $consult = mysqli_query($this->connection, $sentence);
    if ($rows = mysqli_fetch_assoc($consult)) {
      $results = $rows;
    }

    return $results;
  }
}