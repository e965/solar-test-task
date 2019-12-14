<?php
	class DB_EDITOR {
		public function __construct($DB) {
			$this->DB = $DB;
		}

		private function prepareString($string) {
			return addslashes(trim(preg_replace('/\s+/', ' ', $string)));
		}

		private function result($code, $msg, $data = null) {
			if (array_key_exists('result', $GLOBALS)) {
				$GLOBALS['result'] = [
					'code' => $code, 'msg' => $msg
				];

				if ($data) {
					$GLOBALS['result']['data'] = $data;
				}
			}
		}

		public function getAll() {
			$query = $this->DB->prepare("SELECT first_name, last_name, middle_name, birth_date, bill_number, wealth FROM workers");

			$query->execute();

			$queryResult = $query->get_result();

			if ($queryResult->num_rows > 0) {
				$data = [];

				while ($row = $queryResult->fetch_assoc()) {
					array_push($data, $row);
				}

				$this->result(1, 'Список работников получен', $data);
			} else {
				$this->result(0, 'Список работников пуст');
			}

			$query->close();
		}

		public function add($first_name, $last_name, $middle_name, $birth_date, $wealth) {
			$first_name = $this->prepareString($first_name);
			$last_name = $this->prepareString($last_name);
			$middle_name = $this->prepareString($middle_name);
			$birth_date = $this->prepareString($birth_date);
			$wealth = intval($wealth);

			if (
				$first_name === '' ||
				$last_name === '' ||
				$middle_name === '' ||
				$birth_date === '' ||
				$wealth === ''
			) {
				$this->result(2, 'Ошибка добавления работника: отправлены пустые данные');
				return;
			}

			$worker = [
				'first_name' => $first_name, 'last_name' => $last_name, 'middle_name' => $middle_name,
				'birth_date' => $birth_date, 'wealth' => $wealth
			];

			$query = $this->DB->prepare("INSERT INTO workers (
				first_name,
				last_name,
				middle_name,
				birth_date,
				wealth
			) VALUES (?, ?, ?, ?, ?)");

			$query->bind_param("ssssi",
				$worker['first_name'],
				$worker['last_name'],
				$worker['middle_name'],
				$worker['birth_date'],
				$worker['wealth']
			);

			$queryState = $query->execute()
				? $this->result(1, 'Работник "' . $worker['last_name'] . ' ' . $worker['title'] . '" добавлен', [ 'bill_number' => $this->DB->insert_id ])
				: $this->result(2, 'Ошибка добавления работника: ' . $this->DB->error);

			$query->close();
		}

		public function edit($bill_number, $editedParams) {
			$bill_number = intval($bill_number);
			$editedParams = json_decode($editedParams);

			$query = $this->DB->prepare("SELECT first_name, last_name, middle_name, birth_date, wealth FROM workers WHERE bill_number = ?");

			$query->bind_param("i", $bill_number);

			$query->execute();

			$query->bind_result($first_name, $last_name, $middle_name, $birth_date, $wealth);
			$query->fetch();

			$query->close();

			if ($user === '') {
				$this->result(2, 'Работника с номером счёта ' . $bill_number . ' не существует');
				return;
			}

			$workerInfo = [
				'first_name' => $first_name,
				'last_name' => $last_name,
				'middle_name' => $middle_name,
				'birth_date' => $birth_date,
				'wealth' => $wealth
			];

			/*
			 * Доступ к значениям у $editedParams: $editedParams->$key
			 * Доступ к значениям у $workerInfo: $workerInfo[$key]
			 */

			foreach ($editedParams as $key => $value) {
				if (array_key_exists($key, $workerInfo)) {
					$value = $key !== 'wealth'
						? $this->prepareString($value)
						: intval($value);

					$workerInfo[$key] = $value;
				} else {
					unset($editedParams->$key);
				}
			}

			$isChanged = !empty($editedParams);

			if ($isChanged) {
				$query = $this->DB->prepare("UPDATE workers SET first_name = ?, last_name = ?, middle_name = ?, birth_date = ?, wealth = ? WHERE bill_number = ?");

				$query->bind_param("ssssii",
					$workerInfo['first_name'],
					$workerInfo['last_name'],
					$workerInfo['middle_name'],
					$workerInfo['birth_date'],
					$workerInfo['wealth'],
					$bill_number
				);

				$queryState = $query->execute()
					? $this->result(1, 'Данные работника с номером счёта "' . $bill_number . '" успешно обновлены')
					: $this->result(2, 'Ошибка обновления данных работника: ' . $this->DB->error);

				$query->close();
			} else {
				$this->result(0, 'Изменений в данных работника нет');
			}
		}

		public function rm($bill_number) {
			$bill_number = intval($bill_number);

			$query = $this->DB->prepare("DELETE FROM workers WHERE bill_number = ?");

			$query->bind_param("i", $bill_number);

			$queryState = $query->execute()
				? $this->result(1, 'Работник с номером счёта "' . $bill_number . '" удалена')
				: $this->result(2, 'Ошибка удаления работника: ' . $this->DB->error);

			$query->close();
		}
	}
