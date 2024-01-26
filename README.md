# ezapi
 Абстракция над HTTP-клиентом axios

## Установка
```sh
npm i @opsp/ezapi
```

## Использование
Все методы возвращают ``Promise``, который содержит либо ответ, либо ``null``, в случае ошибки.
```js
import ezApi from '@opsp/ezapi'

ezApi.get('/todos/1', {color: 'red'})
    .then((res) => {
      console.log(res)
    })

// -> /todos/1?color=red

// при передаче данных не нужно их дополнительно оборачивать в JSON.stringify(data), это сделано под капотом обработчика.

let data = {foo: 'bar'}

ezApi.post('/todos', data)
    .then((res) => {
      console.log(res)
    })

//  для передачи данных формы

let formData = new FormData();
formData.append('key1', 'value1');
formData.append('key2', 'value2')

ezApi.post('/todos', formData)
    .then((res) => {
      console.log(res)
    })

```

## Настройка 

Первый параметр - конфиг [axios](https://axios-http.com/docs/config_defaults), второй - коллбэк для кастомной обработки ошибки

```js
import { mountApi } from '@opsp/ezapi'

mountApi(
    {
        baseURL: 'https://jsonplaceholder.typicode.com'
    }, 
    (error) => {
        // кастомная обработка ошибки
    }
)

```

Все запросы расширяются через параметр ``options``, в нем можно передать специфичные заголовки, cookies, token и userAgent.

```js
ezApi.get('/todos/1', {}, {
    headers: {
        cookies: 'user=Test; max-age=3600'
        token: 'c84f18a2-c6c7-4850-be15-93f9cbaef3b3',
        userAgent: 'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
    }
})

// -> в заголовках появятся
// 'Cookie': 'user=Test; max-age=3600'
// 'Authorization': `Bearer c84f18a2-c6c7-4850-be15-93f9cbaef3b3`
// ''User-Agent': 'Mozilla/5.0 (Android 14; Mobile; rv:121.0) Gecko/121.0 Firefox/121.0'
```
Еще есть возможность добавить кастомный текст на случай ошибки при запросе, errorMessage будет приходить вторым параметром в функции-обработчике ошибок

```js
ezApi.get('/todos/1', {}, {
    errorMessage: 'Специфичная ошибка с особенным текстом'
})

```

Все остальные данные из ``options`` также будут будут переданы в [конфиг запроса](https://axios-http.com/docs/req_config).

