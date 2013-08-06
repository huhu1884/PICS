<?php

class AutoLoader {

  private static $map = array(
    'PhpThumbFactory' => 'ThumbLib',
  );

  public static function load($class) {
    if (isset(self::$map[$class])) {
      $class = self::$map[$class];
    }
    $file = strtr(dirname(__FILE__) . '\classes\@file.class', array(
      '@file' => $class,
    ));
    if (is_file($file)) {
      require_once($file);
    }
  }

}

spl_autoload_register(array('AutoLoader', 'load'));

?>
