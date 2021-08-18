(async () => {
  let response = await axios.get("https://api.covid19api.com/summary");
  loadSummary(response.data);
})();

function loadSummary(json) {
  loadKPI(json);
  loadPieChart(json);
  loadBarChart(json);
}
function formatDate(dateJson){
  let data = new Date(dateJson);                 
  return `${data.getDate()}-${data.getMonth() + 1}-${data.getFullYear()} ${data.getHours()}hs`
}

function loadKPI(json) {
  document.getElementById("confirmed").innerText =
    json.Global.TotalConfirmed.toLocaleString("PT");
  document.getElementById("death").innerText =
    json.Global.TotalDeaths.toLocaleString("PT");
  //Api não esta retornando o total de recuperados  
  //document.getElementById("recovered").innerText = json.Global.TotalRecovered.toLocaleString("PT");
  //@ estimativa
  document.getElementById("recovered").innerText = (json.Global.TotalConfirmed - json.Global.TotalDeaths).toLocaleString("PT");
  document.getElementById(
    "date"
  ).innerText = `Data de atualização ${formatDate(json.Date)}`;
}

function loadBarChart(json) {
  let countriesDeathsSorted = _.orderBy(
    json.Countries,
    ["TotalDeaths", "Country"],
    ["desc", "asc"]
  );

  let countriesDeathsFiltered = _.slice(countriesDeathsSorted, 0, 10);

  let countriesMapped = _.map(countriesDeathsFiltered, "Country");
  let totalDeathsMapped = _.map(countriesDeathsFiltered, "TotalDeaths");

  let bar = new Chart(document.getElementById("barras"), {
    type: "bar",
    data: {
      labels: countriesMapped,
      datasets: [
        {
          label: "Total de Mortes",
          data: totalDeathsMapped,
          backgroundColor: "rgba(255, 51, 51)",
        },
      ],
    },
    options: {
      reponsive: true,
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: "Top 10 número de mortes por país",
          font: {
            size: 20,
          },
        },
      },
    },
  });
}
function loadPieChart(json) {
  let data = [
    json.Global.NewConfirmed,
    json.Global.NewDeaths,
    json.Global.NewRecovered,
  ];

  let pizza = new Chart(document.getElementById("pizza"), {
    type: "pie",
    data: {
      labels: ["Confirmados", "Mortes", "Recuperados"],
      datasets: [
        {
          data: data,
          backgroundColor: [
            "rgb(255, 128, 0)",
            "rgb(204,0,0)",
            "rgb(0, 153, 0)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
        title: {
          display: true,
          text: "Distribuicao de novos casos",
          font: {
            size: 20,
          },
        },
      },
    },
  });
}
