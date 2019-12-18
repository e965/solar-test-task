'use strict'

document.addEventListener('DOMContentLoaded', () => {
	const reqURL = 'request.php'

	const table = document.querySelector('.workers table')

	table.dataset.currentPage = 1

	const modalActions = document.querySelector('.modal__workers-actions')

	const modalActionsForm = modalActions.querySelector('form')

	const alertBox = document.querySelector('.alert-box')

	let newAlert = ({ text, type = 'success' }) => {
		let alert = document.createElement('div')

		Array.from([
			`uk-alert-${type}`,
			'uk-animation-slide-bottom',
			'uk-padding-small',
			'uk-margin-small',
		]).forEach(item => alert.classList.add(item))

		alert.setAttribute('uk-alert', '')

		let alertText = document.createElement('p')

		alertText.classList.add('uk-text-center')

		alertText.innerText = text

		alert.appendChild(alertText)

		UIkit.alert(alert)

		setTimeout(() => {
			UIkit.alert(alert).close()
		}, 7000)

		alertBox.appendChild(alert)
	}

	let formatBirthDate = date => {
		return new Date(date).toLocaleDateString(
			[], { year: 'numeric', month: 'long', day: 'numeric' }
		)
	}

	let clearNode = _node => {
		while (_node.firstChild) {
			_node.removeChild(_node.firstChild)
		}
	}

	let params = ['first_name', 'last_name', 'middle_name', 'birth_date', 'bill_number', 'wealth']

	let addTableRow = ({ worker, tableNode }) => {
		let tableRow = document.createElement('tr')

		tableRow.dataset.id = worker.bill_number

		let tableDataFName = document.createElement('td')
		tableDataFName.innerText = worker.first_name
		tableRow.appendChild(tableDataFName)

		let tableDataLName = document.createElement('td')
		tableDataLName.innerText = worker.last_name
		tableRow.appendChild(tableDataLName)

		let tableDataMName = document.createElement('td')
		tableDataMName.innerText = worker.middle_name
		tableRow.appendChild(tableDataMName)

		let tableDataBDate = document.createElement('td')
		tableDataBDate.innerText = formatBirthDate(worker.birth_date)
		tableRow.appendChild(tableDataBDate)

		let tableDataBillNum = document.createElement('td')
		tableDataBillNum.innerText = worker.bill_number
		tableRow.appendChild(tableDataBillNum)

		let tableDataWealth = document.createElement('td')
		tableDataWealth.innerText = worker.wealth
		tableRow.appendChild(tableDataWealth)

		let tableDataButtons = document.createElement('td')

		let editBtn = document.createElement('button')

		Array.from(params)
			.forEach(s => editBtn.dataset[s] = worker[s])

		editBtn.classList.add('edit-worker-btn')
		editBtn.classList.add('uk-icon-link')

		editBtn.setAttribute('uk-icon', 'file-edit')
		editBtn.setAttribute('title', 'Обновить данные')

		editBtn.onclick = () => {
			modalActionsForm.dataset.action = 'edit'

			modalActions.querySelector('.uk-modal-title').innerText = 'Обновить данные'
			modalActions.querySelector('.submit-btn').innerText = 'Обновить'

			Array.from(params)
				.forEach(param => modalActionsForm[param].value = editBtn.dataset[param])

			UIkit.modal(modalActions).show()
		}

		tableDataButtons.appendChild(editBtn)

		let deleteBtn = document.createElement('button')

		deleteBtn.dataset.bill_number = worker.bill_number

		deleteBtn.classList.add('delete-worker-btn')
		deleteBtn.classList.add('uk-icon-link')
		deleteBtn.classList.add('uk-margin-small-left')

		deleteBtn.setAttribute('uk-icon', 'trash')
		deleteBtn.setAttribute('title', 'Удалить работника')

		deleteBtn.onclick = () => {
			UIkit.modal.confirm(`Вы действительно хотите удалить данного работника?`, {
				labels: {
					ok: 'Да, удалить',
					cancel: 'Отмена'
				}
			}).then(() => {
				deleteWorker({ bill_number: deleteBtn.dataset.bill_number })
			})
		}

		tableDataButtons.appendChild(deleteBtn)

		tableRow.appendChild(tableDataButtons)

		tableNode.appendChild(tableRow)
	}

	let drawWorkers = ({ workers, currentPage = table.dataset.currentPage }) => {
		window['__workers'] = workers;

		[...table.getElementsByTagName('tbody')].forEach(tbody => {
			tbody.remove()
		})

		let paginationNode = document.querySelector('.pagination ul')
		clearNode(paginationNode)

		let workersNum = workers.length
		let magicNum = 8

		let minNum = 0
		let currNum = 0

		let pagesCount = Math.trunc(workersNum / magicNum)

		if (workersNum % magicNum !== 0) {
			++pagesCount
		}

		paginationNode.hidden = (pagesCount === 1)

		let offset = magicNum

		for (let i = 1; i <= pagesCount; i++) {
			let newTableBody = document.createElement('tbody')

			newTableBody.classList.add('uk-animation-slide-top-small')

			newTableBody.hidden = !(i === 1)
			newTableBody.dataset.page = i

			table.appendChild(newTableBody)

			let pageSelectorItem = document.createElement('li')

			let pageSelectorBtn = document.createElement('button')

			pageSelectorBtn.innerText = i
			pageSelectorBtn.dataset.page = i

			if (i === 1) {
				pageSelectorItem.classList.add('uk-active')
			}

			pageSelectorBtn.onclick = e => {
				[...table.getElementsByTagName('tbody')].forEach(tbody => {
					tbody.hidden = !(tbody.dataset.page === e.target.dataset.page)
				});

				table.dataset.currentPage = e.target.dataset.page;

				[...paginationNode.getElementsByTagName('li')].forEach(li => {
					li.classList.toggle('uk-active', (li === e.target.parentNode))
				})
			}

			pageSelectorItem.appendChild(pageSelectorBtn)

			paginationNode.appendChild(pageSelectorItem)

			if (i === pagesCount) {
				offset = workersNum
			}

			for (currNum = minNum; currNum <= offset; currNum++) {
				if (currNum === offset) { break }

				addTableRow({
					worker: workers[currNum],
					tableNode: table.querySelector(`tbody[data-page="${i}"]`)
				})
			}

			if (currNum === offset) {
				minNum = currNum
				offset += magicNum
			}
		}

		if (currentPage > 2) {
			if (pagesCount >= currentPage) {
				[...paginationNode.getElementsByTagName('button')].forEach(button => {
					if (button.dataset.page == currentPage) {
						button.click()
					}
				})
			} else if (pagesCount < currentPage) {
				[...paginationNode.getElementsByTagName('button')].forEach(button => {
					if (button.dataset.page == pagesCount) {
						button.click()
					}
				})
			}
		}
	}

	let addWorker = ({ first_name, last_name, middle_name, birth_date, wealth }) => {
		let formData = new FormData()

		let newWorker = {
			first_name: first_name,
			last_name: last_name,
			middle_name: middle_name,
			birth_date: birth_date,
			wealth: wealth
		}

		Array.from([
			['action', 'add'],
			['first_name', newWorker.first_name],
			['last_name', newWorker.last_name],
			['middle_name', newWorker.middle_name],
			['birth_date', newWorker.birth_date],
			['wealth', newWorker.wealth],
		]).forEach(item => formData.append(item[0], item[1]))

		fetch(reqURL, {
			method: 'POST',
			cache: 'no-store',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.code === 1) {
					newWorker.bill_number = data.data.bill_number

					let workers = window['__workers']
					workers.push(newWorker)

					drawWorkers({ workers: workers })

					UIkit.modal(modalActions).hide()

					newAlert({ text: data.msg })
				} else if (data.code === 0) {
					newAlert({ text: data.msg, type: 'warning' })
				} else if (data.code === 2) {
					newAlert({ text: data.msg, type: 'danger' })
				}
			})
	}

	window['addWorker'] = addWorker

	let editWorker = ({ first_name, last_name, middle_name, birth_date, bill_number, wealth }) => {
		let formData = new FormData()

		let editedWorker = {
			first_name: first_name,
			last_name: last_name,
			middle_name: middle_name,
			birth_date: birth_date,
			bill_number: bill_number,
			wealth: wealth
		}

		Array.from([
			['action', 'edit'],
			['bill_number', editedWorker.bill_number],
			['edited_params', JSON.stringify(editedWorker)],
		]).forEach(item => formData.append(item[0], item[1]))

		fetch(reqURL, {
			method: 'POST',
			cache: 'no-store',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.code === 1) {
					let workerRow = table.querySelector(`tr[data-id='${editedWorker.bill_number}']`)

					let editBtn = workerRow.querySelector('.edit-worker-btn')

					params.forEach((param, i) => {
						workerRow.querySelector(`td:nth-child(${i+1})`).innerText = param !== 'birth_date' ? editedWorker[param] : formatBirthDate(editedWorker[param])
						editBtn.dataset[param] = editedWorker[param]
					})

					UIkit.modal(modalActions).hide()

					newAlert({ text: data.msg })
				} else if (data.code === 0) {
					newAlert({ text: data.msg, type: 'warning' })
				} else if (data.code === 2) {
					newAlert({ text: data.msg, type: 'danger' })
				}
			})
	}

	let deleteWorker = ({ bill_number }) => {
		let formData = new FormData()

		Array.from([
			['action', 'rm'],
			['bill_number', bill_number],
		]).forEach(item => formData.append(item[0], item[1]))

		fetch(reqURL, {
			method: 'POST',
			cache: 'no-store',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.code === 1) {
					let workers = window['__workers']

					// подсмотрел здесь https://stackoverflow.com/a/38699714

					let index = workers.findIndex(worker => worker.bill_number == bill_number)

					workers = [
						...workers.slice(0, index),
						...workers.slice(index + 1)
					]

					drawWorkers({ workers: workers })

					newAlert({ text: data.msg })
				} else if (data.code === 0) {
					newAlert({ text: data.msg, type: 'warning' })
				} else if (data.code === 2) {
					newAlert({ text: data.msg, type: 'danger' })
				}
			})
	}

	let addWorkerBtn = document.querySelector('.add-worker-btn')

	addWorkerBtn.onclick = () => {
		modalActionsForm.dataset.action = 'add'

		modalActions.querySelector('.uk-modal-title').innerText = 'Добавить работника'
		modalActions.querySelector('.submit-btn').innerText = 'Добавить'
	}

	modalActionsForm.addEventListener('submit', e => {
		e.preventDefault()

		let form = e.target

		let data = {
			first_name: form['first_name'].value,
			last_name: form['last_name'].value,
			middle_name: form['middle_name'].value,
			birth_date: form['birth_date'].value,
			wealth: form['wealth'].value ? form['wealth'].value : 0
		}

		if (form['bill_number'].value !== '') {
			data['bill_number'] = form['bill_number'].value
		}

		switch (form.dataset.action) {
			case 'add':
				addWorker(data); break

			case 'edit':
				editWorker(data); break
		}
	})

	fetch(reqURL + '?get', { cache: 'no-store' })
		.then(request => request.json())
		.then(data => {
			if (data.code === 1) {
				drawWorkers({ workers: data.data })
			}
		})

	modalActions.addEventListener('hidden', () => {
		modalActionsForm.reset()
	})
})
