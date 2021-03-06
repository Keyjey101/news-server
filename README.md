# Новостной сервер #

## Запуск сервера ##
```sh
node app.js
```
После чего сервер запустится на порте, указанном в .env файле (по умолчанию порт 5000).

## База данных ##
В качестве базы данных используется облачный MongoDB, параметры для подключения к которой находятся в .env (добавлен в гитигнор) файле.

## Клиентская часть ##
Клиентская часть представляет собой простые HTML страницы с добавлением EJS для динамического рендеринга.

## Маршрутизация ##
Все маршруты на сервер начинаются с "api". При попытке доступа неавторизованного пользователя к маршруту, требующему авторизации, сервер вернет ошибку в формате JSON.
### Общедоступные маршруты ###
##### Новости #####
* /api/news - возвращает массив объектов всех новостей (при отсутствии данных в базе - возвращает массив из одного объекта плейсхолдера). На клиенте рендерится список новостей.
##### Взаимодествие с пользователем #####
* /api/user/login - вход пользователя, POST запрос - в теле email & password. При выполнении проверок - редирект на список новостей, в противном случае - сообщение об ошибке в формате JSON.
* /api/user/registration - регистрация нового пользователя. При выполнении проверок (валидный email и password не короче шести символов) - редирект на список новостей, в противном случае - сообщение об ошибке в формате JSON. 

### Авторизированные маршруты ###
##### Новости #####
* /api/news/:id - возвращает объект одной новости с уникальным/указанным id. На клиенте рендерится новость. В зависмости от того, является ли текущий пользователь автором данной новости, рендерится две кнопки для редактирования и удаления новости.
* /api/news/create - позволяет пользователям создавать новость, записывается информация о создавшем новость пользователе, заголовке и контенте новости.
* /api/news/edit/:id - дает автору новости возможность ее изменения
(пояснение, в принципе можно было бы сделать изменение не создавая дополнительный /edit, но раз должна быть отдельная страница, то пускай будет так)

##### Взаимодействие с пользователем #####
* api/user/logout - выход пользователя (удаление куков)



## Функционал ##
Попадая на сервер клиент редиректится на список новостей, читает заголовки. Регистрируется, кликает на интересующую новость и читает ее. Потом понимает, что потреблять контент не так круто, как создавать и пишет новости сам. Отправляет ссылку друзьям и, вуаля, миллионы авторов новостей обитают в ноосфере на локалхост:5000.