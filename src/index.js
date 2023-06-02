const axios = require("axios");
const getCarregamentoInicial = require("./puppeteer");
const fs = require("fs");
const path = require("path");

const converteData = (DataDDMMYY) => {
  const dataSplit = DataDDMMYY.split("/");
  const novaData = new Date(
    parseInt(dataSplit[2], 10),
    parseInt(dataSplit[1], 10) - 1,
    parseInt(dataSplit[0], 10)
  );
  return novaData;
};

const fetchData = async (tokenPortal) => {
  const config = {
    method: "get",
    url: "https://formosodoaraguaia.megasofttransparencia.com.br/api/receitas-e-despesas/empenho/paginado",
    params: {
      codigoDoOrgao: "",
      codigoDaUnidade: "",
      codigoDaFuncao: "",
      codigoDaSubFuncao: "",
      codigoDoPrograma: "",
      codigoDoElemento: "",
      codigoDaModalidade: "",
      covid19: "",
      fonteDoEmpenho: "",
      faseDoEmpenho: "4",
      etapaDaDespesa: "4",
      pagina: "1",
      tamanhoDaPagina: "12000",
    },
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en-US,en;q=0.9",
      authorization: `Bearer ${tokenPortal}`,
      "cliente-integrado": "megasoft-portal-da-transparencia",
      pragma: "no-cache",
    },
    withCredentials: true,
  };

  return await axios(config).then(function (response) {
    const data = response.data;
    return data;
  });
};

const filtrar = (registros, dataInicialString) => {
  const dataInicial = converteData(dataInicialString);
  const registrosFiltrados = registros.filter((registro) => {
    return converteData(registro.data) >= dataInicial;
  });

  return registrosFiltrados;
};

const Main = async () => {
  let tokenPortal = "";

  await getCarregamentoInicial((data) => {
    tokenPortal = data.tokenPortal;
  });

  const data = await fetchData(tokenPortal);

  const registrosFiltrados = filtrar(data.registros, "01/01/2019");

  const json = JSON.stringify(registrosFiltrados, null, 2);

  const filePath = path.join(__dirname, "..", "data", "dados.json");
  console.log(filePath);
  fs.writeFileSync(filePath, json, "utf8");
};

Main();
