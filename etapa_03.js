
const { Builder, Browser, By } = require('selenium-webdriver');
const { parse } = require('date-fns');
const nodemailer = require('nodemailer');
require('dotenv').config();

const data_de_comparacao = '12/03/2025';

const url = `https://oab.fgv.br/NovoSec.aspx?key=SWeK97bH3Oc=&codSec=5141`;

/*
* Configuração do cron para executar uma ação a cada 1 minuto
*/
new CronJob(
    '1 * * * * *', // a cada 1 minuto
    async function () {
        console.log('HORA DA EXECUÇÃO:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        await consultaFVG();
    },
    null, // onComplete
    true, // Inicio Imediato 
    'America/Sao_Paulo' // fuso horário oficial do Brasil (Brasília)
).start();

/**
 * Configurar SMTP com base no GMAIL
*/
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function consultaFVG() {

    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();

    try {

        /** Abre o navegador e navegue até o link pré definido */
        await driver.get(url)

        /** 
         * Carregamos a tag que foi previamente inspecionada no HTML 
         * e usamos o ID como referência! 
         * 👍 até que isso não mude, onosso código continuará íntegro;
         * */
        const tabela = await driver.findElement(By.id("ContentPlaceHolder1_gvArquivos"));

        /** 
         * Abstrai o texto da tabela das tags referenciada
         * */
        const table_text = await tabela.getText();

        /** 
         * Remove todas as quebras de linha separados por espaço 
         * pois assim garantimos que na formatação atual da página 
         * da primeira posição do split será nossa 
         * data de publicação do documento;
         * */
        const datas_extraidas = table_text.split("\n").map(item => {
            return item.split(" ")[0]
        });

        /** 
         * Realiza o parse das datas para facilitar a filtragem da proxima validação
         * */
        const parseData = datas_extraidas.map(item => parse(item, 'dd/MM/yyyy', new Date()));


        /**
         * Valida se existe a data de publicação do documento e armazena na variável 
         * */
        const foi_publicado = parseData.some((dataISO) => {
            const dataLocal = new Date(dataISO).toLocaleDateString("pt-BR");
            return dataLocal === data_de_comparacao;
        });

        if (foi_publicado) {
            /** 
             * Dispara e-mail
             * */
            await transporter.sendMail({
                from: process.env.EMAIL_USER, // EMAIL QUE ESTÁ ENVIANDO
                to: "senaimaistech@gmail.com", // EMAIL QUE IRA RECEBER
                subject: "O RESULTADO FOI PUBLICADO ✅", // TITULO
                html: `Corre que o resultado da prova do dia ${data_de_comparacao} já foi publicado! Clique aqui para conferir! <a href="${url}">Clique aqui!</a>`
            });
        } else {
            console.log(`NADA AINDA! 🥺 \nULTIMA PUBLICAÇÃO ENCONTRADA: ${table_text.split("\n")[0]}\n`);
        }

    } finally {
        //** Sempre finalizamos fechando o navegador!*/
        await driver.quit();
    }

}

consultaFVG();