# Estrutura de pastas

> ## **Visão geral**

- `semana-js-expert-spotify/`: diretório raiz

  - `server/`: servidor

    - `service/`: regra de negócio ou processamento

    - `controller/`: "ligação" entre camada de apresentação e de regra de negócio

    - `routes/`: camada de apresentação

    - `server.js`: método de criação do servidor (não o instancia)

    - `index.js`: instanciação do servidor (expõe a porta para ser acessado no navegador), relacionado à infraestrutura

    - `config/`: dados sensíveis / dados estáticos

> ## **Decisões**

### **Separação entre criação e instanciação do servidor**

A separação entre arquivos distintos a criação (`server.js`) e a instanciação (`index.js`) do servidor foi feito por causa da necessidade de desacoplamento entre eles ao realizar os **testes end-to-end**, uma vez que isso facilitaria a criação desse tipo de teste.