<?php

class AutoLoader {

  private static $map = array(
  );

  public static function load($class) {
    $file = strtr('./classes/@file.class', array(
      '@file' => (self::$map[$class] ? self::$map[$class] : $class),
    ));
    if (is_file($file)) {
      require_once($file);
    }
  }

}

spl_autoload_register(array('AutoLoader', 'load'));

?>