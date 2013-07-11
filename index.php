<?php
require_once('config.php');
require_once('smarty/libs/Smarty.class.php');
$smarty = new Smarty();
$smarty->setTemplateDir('smarty/templates/');
$smarty->setCompileDir('smarty/templates_c/');
$smarty->setConfigDir('smarty/configs/');
$smarty->setCacheDir('smarty/cache/');
$smarty->caching = true;
$smarty->cache_lifetime = 120;

$smarty->assign('host', $host);
$smarty->assign('page_title', 'PICS');

require_once('autoload.php');
$request = new Input();
$q = $request->get('q');
$args = array('front', 'index');
if ($q) {
	$args = explode('/', $q);
	if (count($args) < 2) {
		$args[1] = 'index';
	}
}
$controller = $args[0];
$action = $args[1];

require_once('controllers/CoreController.class');
require_once('controllers/' . $controllers[$controller] . 'Controller.class');
$reflector = new ReflectionClass($controllers[$controller] . 'Controller');
$method = $reflector->getMethod($action . 'Action');
$method->invoke($reflector->newInstance($smarty));


//$smarty->display('index.tpl');
?>