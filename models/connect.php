<?php
class connect {
  private $data = [];

  protected function connect () {
    $this->data['host']     = 'localhost';
    $this->data['username'] = 'root';
    $this->data['password'] = '';
    $this->data['database'] = 'db_calendar';
  }

  protected function getData () {
    return $this->data;
  }
}