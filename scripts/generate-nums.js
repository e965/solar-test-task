'use strict'

let array1 = []
let array2 = []

for (let i = 0; i < 100; i++) {
	let newValue = Math.floor(Math.random() * Math.floor(5685))

	array1[i] = (i % 2 !== 0 || i % 4 === 0) ? (newValue - 23) * 2 : newValue

	if (array1[i] >= 2450 && array1[i] < 4031) {
		array2.push(array1[i])
	}
}

console.log(JSON.stringify(array1))
console.log(JSON.stringify(array2))
