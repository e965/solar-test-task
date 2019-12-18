'use strict'

// Скрипт необходимо скопировать в консоль браузера на странице проекта

let array1 = []

let array2 = []

let workers = []

let formatBirthDate = i => {
	return new Date(
		new Date().getFullYear() - 21,
		new Date().getMonth(),
		new Date().getDate() + i
	 ).toISOString().split('T')[0]
}

for (let i = 0; i < array1.length; i++) {
	workers[i] = {
		first_name: 'Василий ' + i,
		last_name: 'Пупкин ' + i + 6,
		middle_name: 'Александрович ' + array1[i],
		birth_date: formatBirthDate(i),
		bill_number: i,
		wealth: array1[i] + array2[4]
	}
}

workers.forEach((worker, i, arr) => {
	let formData = new FormData()

	Array.from([
		['action', 'add'],
		['first_name', worker.first_name],
		['last_name', worker.last_name],
		['middle_name', worker.middle_name],
		['birth_date', worker.birth_date],
		['wealth', worker.wealth],
	]).forEach(item => formData.append(item[0], item[1]))

	fetch('request.php', {
		method: 'POST',
		cache: 'no-store',
		body: formData
	})
	.catch(e => {
		console.log('Возникла какая-то ошибка!')
	})
	.finally(() => {
		if (i === arr.length - 1) {
			console.log('Данные успешно загружены. Обновите страницу.')
		}
	})
})

// А ещё можно так:
// workers.forEach(worker => {
// 	addWorker(worker)
// })
