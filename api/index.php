<?php

require_once('../autoload.php');

argsInit();
doAction();

/**
 * Init url arguments: q.
 */
function argsInit() {
  global $args;
  $args = explode('/', $_GET['q']);
  for ($i = 0; $i < count($args); $i++) {
    if (empty($args[$i])) {
      unset($args[$i]);
    }
  }
}

/**
 * Get the 'q' argument by index.
 */
function arg($index) {
  global $args;
  return $args[$index];
}

/**
 * Get the params without controller & action.
 */
function getParams() {
  global $args;
  $params = array_slice($args, 2);
  return $params;
}

/**
 * Action reflect.
 */
function doAction() {
  require_once('../config.php');
  $defaultController = 'indexController';
  $defaultAction = 'indexAction';
  $controller = ( is_null(arg(0)) || is_null($controllers[arg(0)]) ) ? $defaultController : $controllers[arg(0)] . 'Controller';
  $action = ( is_null(arg(1)) ) ? $defaultAction : arg(1) . 'Action';
  require_once('../controllers/APIController.class');
  require_once('../controllers/' . $controller . '.class');
  $reflector = new ReflectionClass($controller);
  $method = $reflector->getMethod($action);
  $method->invoke( $reflector->newInstance(), getParams() );
}

?>
