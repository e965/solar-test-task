<?php
	mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
	try {
		$DB = new mysqli(
			"127.0.0.1",
			$config['db']['user'],
			$config['db']['pass'],
			$config['db']['name']
		);
		$DB->set_charset("utf8mb4");
	} catch(Exception $e) {
		error_log($e->getMessage());
		exit(json_encode([
			'code' => 2, 'msg' => 'Ошибка подключения к базе данных'
		], JSON_UNESCAPED_UNICODE));
	}
	$createTableQuery = "CREATE TABLE IF NOT EXISTS workers(
		first_name TINYTEXT NOT NULL,
		last_name TINYTEXT NOT NULL,
		middle_name TINYTEXT NOT NULL,
		birth_date DATE NOT NULL,
		bill_number INT NOT NULL AUTO_INCREMENT,
		wealth BIGINT NOT NULL,
		PRIMARY KEY (bill_number)
	) ENGINE=InnoDB DEFAULT CHARACTER SET=utf8mb4";
	$DB->query($createTableQuery);
