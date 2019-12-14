<?php
	include_once 'php_inc/db-worker.php';

	$config = json_decode(file_get_contents('php_inc/config.json'), true);

	$result = [
		// 0 - пустые запросы, 1 - успех, 2 - ошибка в скриптах, 3 - ошибка сервера
		'code' => 0, 'msg' => 'Пустой запрос'
	];

	header('Access-Control-Allow-Origin: *');
	header('Content-Type: application/json');

	include_once 'php_inc/db-init.php';

	$db = new DB_EDITOR($DB);

	if (array_key_exists('get', $_GET)) {
		$db->getAll();
	}

	switch($_POST["action"]) {
		case 'get':
			$db->getAll(); break;

		case 'add':
			$db->add($_POST["first_name"], $_POST["last_name"], $_POST["middle_name"], $_POST["birth_date"], $_POST["wealth"]); break;

		case 'edit':
			$db->edit($_POST["bill_number"], $_POST["edited_params"]); break;

		case 'rm':
			$db->rm($_POST["bill_number"]); break;
	}

	$DB->close();

	echo json_encode($result, JSON_UNESCAPED_UNICODE);
