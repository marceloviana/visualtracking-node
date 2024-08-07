<center>
<H1> IaC Terraform for POC-WEBSOCKET with Nodejs application distribution in cluster ECS </H1>
</center>

![See here archtecture diagram](./diagram/websocket-Flow.drawio.svg)

### Descrition
Instant Messaging API by Socket Protocol. This application is sub-service from Notification-Center.

### Setup for development

1. Intall and configure the AWS and Terraform CLI.

2. Create a IAM user with programmatic access to AWS for Terraform to use.


### Prepare environment

- Add the correct environments inside a file named:
```
   # environment name (development, staging or production)
    /tfvars/development.tfvars
 ```

- Create of Workspace to environments:
```
    # environment name (development, staging or production)
    terraform workspace new development
```

### Start Terraform
 ```
    terraform init
```

### Destroy to AWS

- Destroy:
 ```
    terraform workspace select development && terraform destroy -var-file=env/development.tfvars -target=module.NAME1 -target=module.NAME2... 
 ```

### Plan

- See the plan:
 ```
    terraform workspace select development && terraform plan -var-file=env/development.tfvars
 ```

### Deploy to AWS
- Apply the infrastructure:

```
    terraform workspace select development && terraform apply -var-file=env/development.tfvars -parallelism=3
```


<center>
<H2> POC application for Websocket multiples Rooms </H2>
</center>

![See here archtecture diagram](./diagram/websocket-DER.drawio.svg)

### Principal packages:
- Software utilizado: Nodejs v20.11
- library and socket version: socket.io v4.7


PATH: 
` ./microservices/backend/`


#### Structure directory

```
.
├── index.js
├── .env
├── package.json
└── src
    ├── authenticate.js
    ├── engineBackend.js
    └── redis.js

```

### Endpoint

Get Rooms:

`http://localhost:9000/getAllRomms`

* Nota:
    - It must be authenticated!
    - It must contain Authorization in the header.


Socket connection (wss protocol):

`http://localhost:9000` to `ws://localhost:9000`

* Nota:
    - It must be authenticated!
    - It must contain Authorization in the header.


### Client side - payload to send
```
socket.emit(<ROOM>, {
            room: string,
            socketId: string,
            broadcast: boolean,
            message: string
        });

```

### Server side - payload to received
```
{
    room: string,
    socketId: string,
    broadcast: boolean,
    message: string
}

```


#### Architect and developer: [Marcelo Viana](https://www.linkedin.com/in/marcelovianaalmeida/)