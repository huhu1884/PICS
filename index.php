<?php
require_once('config.php');
require_once('smarty/libs/Smarty.class.php');
require_once('autoload.php');
$smarty = new Smarty();
$smarty->setTemplateDir('smarty/templates/');
$smarty->setCompileDir('smarty/templates_c/');
$smarty->setConfigDir('smarty/configs/');
$smarty->setCacheDir('smarty/cache/');
$smarty->caching = true;
$smarty->cache_lifetime = 120;
$smarty->assign('host', $host);
$smarty->assign('page_title', 'PICS');

doAction($smarty, $controllers);

function doAction($params, $controllersMap) {
  $request = new Input();
  $q = $request->get('q');
  $args = array('front', 'index');
  if ($q) {
    $args = explode('/', $q);
    if (count($args) < 2) {
      $args[1] = 'index';
    }
  }
  $controller = $controllersMap[$args[0]] . 'Controller';
  $action = $args[1] . 'Action';
  $controllerFile = "controllers/$controller.class";
  if (!file_exists($controllerFile)) {
    $controller = 'NotFoundController';
    $controllerFile = 'controllers/NotFoundController.class';
    $action = 'indexAction';
  }
  else {
    require_once('controllers/CoreController.class');
    require_once($controllerFile);
    $reflector = new ReflectionClass($controller);
    $method = $reflector->getMethod($action);
    $method->invoke($reflector->newInstance($params));
  }
}

?>