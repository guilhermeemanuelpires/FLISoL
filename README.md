# Projeto FGV - Monitoramento de Publicações - Evento FLISol

Este projeto realiza a automação da verificação de publicações no site da FGV e envia um e-mail caso uma nova publicação seja encontrada em uma data específica.

## Pré-requisitos

- [Node.js](https://nodejs.org/) instalado na sua máquina (versão 16 ou superior recomendada).
- [Firefox](https://www.mozilla.org/firefox/) instalado (o projeto usa Selenium com Firefox ou o navegador da sua preferência; consulte a documentação do Selenium).
- Conta de e-mail no Gmail para envio de notificações.
- Instalar o [Geckodriver](https://github.com/mozilla/geckodriver/releases) compatível com a versão do seu Firefox.

> **Importante**: Você precisa criar um arquivo `.env` na raiz do projeto com as credenciais do Gmail.

---

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone <link-do-repositorio>
cd FLISol
```

Instale as dependências:

```bash
npm install
```

---

## Configuração do Ambiente

Antes de rodar o projeto, copie o arquivo `.env_exemplo` e renomeie para `.env`:

```bash
cp .env_exemplo .env
```

Depois, edite o arquivo `.env` preenchendo com suas credenciais pessoais.

---

## Como Iniciar

Para iniciar o monitoramento automático (com execução agendada a cada minuto):

```bash
npm run dev
```
ou
```bash
npm start
```

O script irá:
- Acessar o site da FGV.
- Verificar as publicações.
- Enviar um e-mail caso encontre uma publicação com a data configurada.

---

## Sobre os Arquivos

- `index.js` - Script principal que agenda checagens automáticas via `cron`.
- `etapa_01.js` - Primeira versão: apenas consulta o site e imprime no console.
- `etapa_02.js` - Segunda versão: adiciona envio de e-mail ao detectar publicação.
- `etapa_03.js` - Terceira versão: integra o envio automático programado (cron).

> O projeto usa as bibliotecas:
> - `dotenv`
> - `selenium-webdriver`
> - `cron`
> - `nodemailer`
> - `date-fns`

---

## Observações

- O navegador Firefox abrirá e fechará automaticamente em cada verificação.
- Se desejar alterar a data de comparação, modifique a variável `data_de_comparacao` no arquivo `index.js`.
- O destinatário do e-mail está fixo como `senaimaistech@gmail.com` no código.