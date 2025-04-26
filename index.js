require('dotenv').config();
const { Builder, Browser, By } = require('selenium-webdriver');
const { parse } = require('date-fns');
const { CronJob } = require('cron');
const nodemailer = require('nodemailer');

const data_de_comparacao = '26/04/2025';

const url = `https://oab.fgv.br/NovoSec.aspx?key=SWeK97bH3Oc=&codSec=5141`;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

new CronJob(
    // '0 */15 * * * *', // cronTime: a cada 15 minutos
    // '0 */5 * * * *', // cronTime: a cada 5 minutos
    '1 * * * * *', // a cada 1 minuto
    async function () {
        console.log('HORA DA EXECUÇÃO:', new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
        await consultaFVG();
    },
    null, // onComplete
    true, // INICIA DE IMEDIATO
    'America/Sao_Paulo' // fuso horário oficial do Brasil (Brasília)
).start();

async function consultaFVG() {

    let driver = await new Builder().forBrowser(Browser.FIREFOX).build();

    try {

        await driver.get(url)

        const table = await driver.findElement(By.id("ContentPlaceHolder1_gvArquivos"));

        const table_text = await table.getText();

        const datas_extraidas = table_text.split("\n").map(item => {
            return item.split(" ")[0]
        });

        const parseData = datas_extraidas.map(item => parse(item, 'dd/MM/yyyy', new Date()));

        const foi_publicado = parseData.some((dataISO) => {
            const dataLocal = new Date(dataISO).toLocaleDateString("pt-BR");
            return dataLocal === data_de_comparacao;
        });

        if (foi_publicado) {
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
        await driver.quit();
    }

}