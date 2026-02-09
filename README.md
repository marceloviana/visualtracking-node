<center>
<H1> WEBSOCKET-SERVICE </H1>
</center>

![See here archtecture diagram](./diagram/websocket-Flow.drawio.svg)

## Descrição

API de mensagens instantâneas via protocolo Socket.

## Principais Pacotes

- **Node.js** v20.11
- **Express** v4.19
- Biblioteca e socket: [socket.io](http://socket.io) v4.7
- **Redis** v4.6
- **AWS-SDK** v3.6

## Salas de Comunicação

O serviço de WebSocket possui salas de comunicação. As salas determinam quando um usuário pode se comunicar com outro. No geral, **apenas usuários de uma mesma sala podem comunicar-se entre si**. Também é possível que um determinado usuário envie uma única mensagem para **todos os participantes de uma sala**. Chamamos isso de mensagem de **broadcast**.

### Configuração do Nome das Salas

Atualmente, os nomes das salas estão definidos no Secrets Manager e podem ser modificados conforme necessário:

```plaintext
ROOMS=ARCHITECTURE,DEVOPS,DEVELOPMENT,GERAL
```

### Disponibilização das Salas e Ciência das Mesmas

As aplicações que se conectam ao **websocket-service** precisam estar cientes das salas existentes. As salas são disponibilizadas por meio do seguinte endpoint:

#### Get Rooms

```javascript
app.get('/br-websocket/getAllRooms', authAsMiddleware, (req, res) => {
    res.json(process.env.ROOMS.split(","));
});
```

O endpoint é autenticado utilizando a mesma chave simétrica definida no Secrets Manager. O middleware `authAsMiddleware` é acionado para validar o token antes de entregar as salas disponíveis:

```javascript
const authAsMiddleware = (req, res, next) => {
    if (req.headers.authorization === process.env.TOKEN_AUTHENTICATION) {
        next();
        return;
    }
    res.status(401).end();
};
```

## Conexão com WebSocket

Do lado do frontend, a conexão pode ser feita utilizando a biblioteca [socket.io](http://socket.io) contida no servidor de WebSocket:

```html
<script src="${WEBSOCKET_SERVICE}/br-websocket/socketIoLib"></script>
```

### Exemplo de Conexão no Frontend

```javascript
try {
    const socket = io(WEBSOCKET_SERVICE, {
        auth: {
            token: AUTHORIZATION_TOKEN
        },
        transports: ["websocket"]
    });
} catch (e) {
    throw new Error(e.message);
}
```

### Obtendo a Lista das Salas

```javascript
axios.get(`${WEBSOCKET_SERVICE}/br-websocket/getAllRooms`, {
    headers: { "authorization": AUTHORIZATION_TOKEN },
    withCredentials: false
}).then(response => {
    for (const room of response.data) {
        socket.on(room, (msg) => {
            console.log(room, msg);
        });
    }
});
```

O código acima recebe a lista de todas as salas disponíveis no servidor de WebSocket e realiza o ingresso em cada uma delas.

### Disparando uma Mensagem

É possível utilizar o seguinte código para disparar uma mensagem do frontend para um cliente conectado. No exemplo, estamos comunicando com um usuário da sala **GERAL**:

```javascript
socket.emit('GERAL', {
    room: 'GERAL',
    socketId: 'sY1hl3uP3R1XKJFSAAAF',
    broadcast: false,
    message: 'Esta é uma mensagem enviada pelo websocket'
});
```

## Modelagem

Embora este serviço utilize apenas um banco chave-valor (Redis), foi desenhada uma modelagem para simplificar a comunicação entre os membros conectados ao serviço. A comunicação entre clientes é realizada por meio do **socket.id** do usuário. Para facilitar o gerenciamento, o modelo de dados no Redis vincula o e-mail do usuário conectado ao **socket.id**.

#### Architect and developer: [Marcelo Almeida](https://www.linkedin.com/in/marcelovianaalmeida/)

V.2.0.2