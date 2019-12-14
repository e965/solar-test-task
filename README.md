### Тестовое задание для вакансии [Стажер-программист](https://perm.hh.ru/vacancy/34874664) в Solar Studio

#### !!! ТЕСТОВОЕ В ПРОЦЕССЕ ВЫПОЛНЕНИЯ !!!

Задачи, которые было необходимо выполнить, указаны в `TASKS.md`.

Я позволил себе интерпретировать задание немного по-своему, поэтому никаких json-файлов не генерируется. Будем работать сразу с данными. Скрипт для их генерации представлен в `generate-nums.js`.

Для выполнения задания использовались следующие сгенерированные данные:

* array-1: `[10646,1848,1833,3472,8200,32,4658,670,2736,1860,5339,10384,6538,1998,2190,6820,3802,6842,93,5280,10078,44,449,5280,402,1214,3065,6454,3108,4404,4834,7650,5682,3548,4508,11158,10202,6846,3349,2806,9298,8270,3417,4628,1424,3418,4775,11156,4834,7014,4564,8812,9376,3774,3103,2394,10248,5462,839,3418,3580,8122,481,9424,5484,6082,2731,11024,1470,5454,2956,7126,9078,2478,3808,4264,4396,9558,338,2282,7168,9374,506,10684,622,4994,3873,10388,1824,1856,4610,10204,6028,2654,1610,8316,11204,1924,3111,4476]`
* array-2: `[3472,2736,3802,3065,3108,3548,3349,2806,3417,3418,3774,3103,3418,3580,2731,2956,2478,3808,3873,2654,3111]`

Сделано с помощью [UIkit](https://getuikit.com).

Чтобы поднять приложение у себя, необходимо:

* Установить, Apache, PHP, MySQL-сервер и браузер
* Загрузить директорию `dist/` на сервер
* Создать базу данных и ввести данные от неё в `php_inc/config.json`
* Сгенерировать данные пользователей и скопировать их в `users.htpasswd` (как пример, туда уже занесён пользователь с логином и паролем `test`)
* Прописать абсолютный путь к `users.htpasswd` в `.htaccess` (опционально, наверно)
* В браузере зайти на страницу приложения и наслаждаться