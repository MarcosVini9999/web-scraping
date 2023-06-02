const puppeteer = require("puppeteer");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = async (callback) => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  page.on("response", async (response) => {
    const request = response.request();
    if (request.url().includes("/api/configuracao/carregamento-inicial")) {
      const text = await response.text();

      callback(JSON.parse(text));
    }
  });

  await page.goto(
    "https://formosodoaraguaia.megasofttransparencia.com.br/receitas-e-despesas/empenho?faseDoEmpenho=4&etapaDaDespesa=4"
  );

  await delay(3000);

  await browser.close();
};
