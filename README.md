[![Build status](https://ci.appveyor.com/api/projects/status/qndryf0f3x64qaj4/branch/main?svg=true)](https://ci.appveyor.com/project/marinaustinovich/ahj-homeworks-rxjs-posts-with-comments-front/branch/main)

deployment: https://marinaustinovich.github.io/ahj-homeworks-rxjs_Posts-with-comments-front/

## Posts with comments

### Легенда

Вы работаете в компании, занимающейся созданием социальной платформы. Ваша команда занимается блоком, связанным с лентой последних постов. Вам нужно грузить список последних постов и список последних комментариев к каждому посту.

По-хорошему, нужно, чтобы с сервера приходили посты сразу со списком последних комментариев. Но пока разработчики серверной части сказали, что всё будет отдельно, а именно:
* получение списка последних постов,
* получение последних комментариев к конкретному посту по id.

### Описание

#### Серверная часть

Разработайте демо REST-сервер со следующими endpoint-ами:
* GET /posts/latest — список последних постов (не более 10) в формате:
```json
{
  "status": "ok",
  "data": [
    {
      "id": "<id>",
      "author_id": "<author_id>",
      "title": "<title>",
      "author": "<author>",
      "avatar": "<avatar>",
      "image": "<url>",
      "created": "<timestamp>"
    },
    ...
  ]
}
```
* GET /posts/\<post_id\>/comments/latest — список последних комментариев к посту (не более 3) в формате:
```json
{
  "status": "ok",
  "data": [
    {
      "id": "<id>",
      "post_id": "<post_id>",
      "author_id": "<author_id>",
      "author": "<author>",
      "avatar": "<avatar>",
      "content": "<content>",
      "created": "<timestamp>"
    },
    ...
  ]
}
```

Для генерации данных можете использовать данные с [JSONPlaceholder](https://jsonplaceholder.typicode.com) или библиотеку [faker](https://www.npmjs.com/package/faker).

#### Клиентская часть

С использованием библиотеки RxJS организуйте получение данных о постах и загрузки для каждого поста комментариев так, чтобы в `subscribe` получать уже посты с комментариями. Используйте для этого соответствующие операторы.

Общий вид одного поста:

![](./pic/posts.png)

Функциональность кнопки Load More реализовывать не нужно.

