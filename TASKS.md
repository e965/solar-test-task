# Тестовое задание на должность «Стажер-программист»

При выполнении тестового задание необходимо знание php, ооп, sql, css, html, js.

1) Создать нумерованный массив из 100 случайных элементов (числа от 0 до 5685). Полученный массив записать в файл в json формате (array-1.json). Из каждого значения созданного массива, ключи которого не четные или делятся на 4 без остатка, вычесть 23 и умножить на 2 Элементы массива значение которых >=2450 и < 4031 Записать в файл array-2.json.

2) Создать базу данных MySQL для хранения информации о лицевых счетах пользователей со следующими данными: Имя, Фамилия, Отчество, Дата рождения, Номер счета, Сумма на счете. Написать класс для работы с таблицей.

3) Имея данные из файла array-1.json (для всех полей) и array-2.json (для поля «Сумма на счете») заполнить сущность созданной БД по следующему правилу:

* Имя: «Василий» + ключ массива
* Фамилия: «Пупкин» + ключ массива + 6
* Отчество: «Александрович» + значение массива
* Дата рождения: Текущая дата - 21 год - количество дней равное ключу массива
* Номер счета: ID записи
* Сумма на счете: значение из массива (array-1.json) + значение элемента с ключом 4 из массива (array-2.json)

4) Вывести сущность с постраничной навигацией по 8 записей на странице.

5) Реализовать механизм добавления новых записей в таблицу в ajax режиме.
