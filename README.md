# freelancer-service-manager-bot
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

Este projeto consiste em 1 de 3 módulos de um sistema para agendamentos de trabalhos oferecidos por prestadores de serviço autônomos.

Este módulo é responsável por gerenciar o fluxo conversacional, interagindo
com os clientes para realizar agendamentos e outras operações, de modo que, o mesmo faz
uso do [Módulo de Negócio](https://github.com/zzdiniz/freelancer-service-manager-api) para executar as atividades necessárias. Sendo que, uma dessas
atividades, é a recuperação da chave de acesso obtida na etapa de cadastro do bot. Com essa
chave, é possível utilizar a API do Telegram para receber e responder às mensagens enviadas
pelos clientes através do aplicativo.
Existem dois métodos principais para realizar integração com a API do Telegram: polling
e webhook.
- **Polling**: neste método, o bot faz requisições periódicas ao servidor do Telegram para
verificar se há novas mensagens ou eventos. Apesar de ser simples de configurar e não
necessitar a exposição em um servidor público, o polling pode gerar atrasos na resposta
e aumentar o consumo de recursos, devido às requisições frequentes.
- **Webhook**: no método de webhook, o Telegram envia as atualizações diretamente ao bot
por meio de um endpoint público configurado, permitindo o recebimento das mensagens
apenas quando de fato são enviadas. Este método elimina a necessidade de requisições
contínuas, mas exige que o servidor esteja acessível publicamente.

Dado que no projeto cada prestador de serviço possui um bot específico associado e pode
receber mensagens simultaneamente de diferentes clientes, a opção de polling tornaria a operação custosa em termos de recursos e desempenho. Assim, optou-se pela implementação via webhook, onde, para cada bot criado, foi configurado um webhook específico com o identificador único do prestador de serviço. Desta forma, o bot é instanciado de maneira dinâmica a cada nova requisição.
## Tecnologias Utilizadas
- NodeJS
- Typescript
- Express
- MySql
