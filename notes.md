# Semana JS Expert 6.0

> ## **Node Stream**

### **Definição**

https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/

> ## **Multiplexing**

### **Definição**

_Multiplexing_ consiste na combinação de várias fontes de dados (por exemplo um audio com efeitos sonoros) em uma única saída de comunicação (único arquivo `.mp3`)

### **Exemplo**

**Processamento de uma transmissão ao vivo com edição e tratamento de audio**, ou seja, uma transmissão de rádio onde uma conversa é inserido efeitos "sonoros de fundo" (aplausos, risadas, etc).

---

> ## **Configuração do projeto**

### **`package.json`**

1. Propriedade `"type": "module"`:

   > Habilitar o `import` e `export`

   ```json
   {
     "type": "module"
   }
   ```

2. Propriedade `engines`:

   > Essa propriedade é necessário para implantação na nuvem, pois a partir dele o provedor define a versão do Node.js instalado na máquina. Além disso, é recomendando o seu uso em qualquer cenário por facilitar a identificação da versão do Node.js recomendada para rodar o projeto.

   ```json
   {
     "engines": {
       "node": "17"
     }
   }
   ```
