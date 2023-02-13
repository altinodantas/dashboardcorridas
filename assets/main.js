const TYPE = 'prod';
let CLIENT_ID = '';

if (TYPE == 'test')
    CLIENT_ID = "192707284225-74pk61g5bnkkh5biec579v5gasel67us.apps.googleusercontent.com"; // local
else 
    CLIENT_ID = "192707284225-tsjg3e79vl6papuv6okjla6ntapc7hsa.apps.googleusercontent.com"; // github


const API_KEY = 'AIzaSyB2Mf_OmGx2FoJH4wRAJkLr05BJ9r7IhvY';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('li_authorize_button').style.visibility = 'hidden';
document.getElementById('li_signout_button').style.visibility = 'hidden';

/**
 * Callback after api.js is loaded.
 */
function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

/**
 * Callback after the API client is loaded. Loads the
 * discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

/**
 * Callback after Google Identity Services are loaded.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', // defined later
    });
    gisInited = true;
    maybeEnableButtons();
}

/**
 * Enables user interaction after all libraries are loaded.
 */
function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('li_authorize_button').style.visibility = 'visible';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }
        document.getElementById('li_signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await getRunningData('Carol!A2:J');
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({
            prompt: 'consent'
        });
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({
            prompt: ''
        });
    }
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('li_signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 
 * 1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY
 */
async function getRunningData(data_range) {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY',
            range: data_range,
        });
    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content').innerText = 'No values found.';
        return;
    }

    values = range.values.slice()

    create_chart(values, 12, 'Check')
    treinos_por_local(values)
    treinos_por_tipo_bubble(values)
    treinos_por_tipo(values)

    create_summary(values)
    create_list(values)

    console.log(values)

}

var values

if (TYPE == 'dev'){

    fetch('./assets/mock_data.json')
    .then((response) => response.json())
    .then((json) => {
        console.log(json)

        values = json.carol.values
        
        create_chart(values, 12, 'Check')
        treinos_por_local(values)
        treinos_por_tipo_bubble(values)
        treinos_por_tipo(values)
        
        create_summary(values)
        create_list(values)

    });

    $("#authorize_button").hide()
    $("#link_carol").hide()
    $("#link_altino").hide()

}

$(document).ready(function () {
    
    $("#procurar_atividade").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#tabela_lista tbody tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

    $("#reset_button").on("click", function() {
        $("#procurar_atividade").val("");
        var value = "";
        $("#tabela_lista tbody tr").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('input[type=radio][name=btnradio]').change(function () {
        if ($(this).attr('id') == 'pace_radio') {
            $('#check_plot').html("");
            create_chart_pace(values)
        } else {
            create_chart(values, 12, 'Check')
        }
    });

    $('a.close-link').on('click', function(){
        $('.navbar-collapse').collapse('hide');
    });
})

function create_summary(dados) {

    var info = get_general_info(dados)
    var time = `${info.horas}h:${info.minutos}min`
    
    $('#resumo_qtd_atividades').html(info.total_atividades)
    $('#resumo_km').html(info.distancia + "<span> km</span>")
    $('#resumo_tempo_total').html(time)
    $('#resumo_elevacao').html(info.elevacao + "<span> metros</span>")
    $('#resumo_data').html(convert_date(info.ultimo_treino.data))
    $('.resumo_local').html(info.ultimo_treino.local)
    $('.resumo_pace').html(info.ultimo_treino.pace + "<span>/km</span>")

}

function create_list(dados) {

    var reverse_values = dados.slice().reverse();

    $("tbody").html("");

    reverse_values.forEach(element => {

        var tipo = ``

        if (element[8] == "Check")
            tipo = `<i class="bi bi-check-circle-fill" id="orange"></i> ${element[8]}`
        else
            tipo = `<i class="bi bi-circle-fill" id="viollet"></i> ${element[8]}`

        var html = `<tr class="pt-3">
                      <td class="pt-3">${convert_date(element[0])}</td>
                      <td class="pt-3">${element[1]} km</td>
                      <td class="pt-3">${element[2]}min ${element[3]}seg</td>
                      <td class="pt-3">${element[7]}/km</td>
                      <td class="pt-3">${tipo}</td>
                      <td class="pt-3">${element[9]}</td>
                    </tr>`
        $("tbody").append(html);

    })
}

function get_general_info(dados) {

    var total_atividades = dados.length
    var distancia = 0
    var elevacao = 0
    var ultimo_treino_data = dados[total_atividades - 1][0]
    var ultimo_treino_local = dados[total_atividades - 1][9]
    var ultimo_treino_pace = dados[total_atividades - 1][7]
    var segundos = 0
    var horas = 0
    var minutos = 0
    var seg = 0

    dados.forEach(element => {
        distancia += parseFloat(element[1])
        elevacao += parseInt(element[4])
        segundos += (parseInt(element[2]) * 60) + parseInt(element[3])
    })

    horas = parseInt(segundos / 3600)
    minutos = parseInt((segundos % 3600) / 60)
    seg = segundos % 60

    return {
        "total_atividades": total_atividades,
        "distancia": distancia,
        "elevacao": elevacao,
        "ultimo_treino": {
            "data": ultimo_treino_data,
            "local": ultimo_treino_local,
            "pace": ultimo_treino_pace
        },
        "segundos": segundos,
        "horas": horas,
        "minutos": minutos,
        "seg": seg
    }
}

function convert_date(date) {

    var string_date = date.split("/");
    var mes = '';
    var dia = parseInt(string_date[0]);
    var ano = string_date[2];

    switch (string_date[1]) {
        case '01':
            mes = 'jan';
            break;
        case '02':
            mes = 'fev';
            break;
        case '03':
            mes = 'mar'
            break;
        case '04':
            mes = 'abr';
            break;
        case '05':
            mes = 'mai';
            break;
        case '06':
            mes = 'jun';
            break;
        case '07':
            mes = 'jul';
            break;
        case '08':
            mes = 'ago';
            break;
        case '09':
            mes = 'set'
            break;
        case '10':
            mes = 'out';
            break;
        case '11':
            mes = 'nov';
            break;
        case '12':
            mes = 'dez'


    }

    return `${dia} ${mes} ${ano}`
}

function create_chart_pace(dados) {

    var result = dados.slice(-30)

    let dias = []
    let pace = []
    let minutes = []
    let texto = []
    let avg_values = []
    let sum_paces = 0

    result.forEach(element => {
        pace.push(parseFloat(element[6]));
        dias.push(element[0]);
        // minutes.push(parseInt(element[2]) + parseInt(element[3]) / 60);
        texto.push(`${convert_date(element[0])}<br><b>Tempo total:</b> ${element[2]}min${element[3]}seg<br>
<b>Pace:</b> ${element[7]}/km<br>
<b>Distância: </b>${element[1]} km`);
        sum_paces += parseFloat(element[6]);
    })

    var avg = sum_paces / dias.length

    var pace_f = `${parseInt(avg / 60)}:${parseInt(avg % 60)}`

    for (var i = 0; i < pace.length; i++) {
        avg_values.push(avg)
    }


    var desempenho = '';
    var desempenho_cor = '';


    var treinos = {
        x: dias,
        y: pace,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            size: 8
        },
        line: {
            width: 3,
            shape: 'spline',
            color: 'rgb(108, 54, 241)'
        },
        name: 'Pace',
        hovertemplate: '%{text}<extra></extra>',
        text: texto
    };

    var media = {
        x: dias,
        y: avg_values,
        type: 'scatter',
        mode: 'lines',
        line: {
            width: 3,
            shape: 'spline',
            color: '#ee8636',
            dash: 'dot'
        },
        name: 'média',
        hovertemplate: `Pace: ${pace_f}/km<extra></extra>`,
    };

    var data = [media, treinos];

    var layout = {

        yaxis: {
            autorange: true,
            // range: [11, 16],
            type: 'linear',
            automargin: true,
            title: {text:'Pace médio (seg)',
            standoff: 20
            },
            fixedrange: true,
        },
        xaxis: {
            automargin: true,
            showgrid: false,
            tickcolor: '#000',
            fixedrange: true
        },

        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0.35,
            y: 1.1
        },
        margin: {
            l: 70,
            r: 50,
            b: 50,
            t: 50,
            pad: 10
        },
        title: false,

    };

    Plotly.newPlot('check_plot', data, layout, {
        displayModeBar: false
    });

}

function create_chart(dados, meta_value, tipo_treino) {

    var result = dados.filter(element => element[8] == tipo_treino)

    let x_ = []
    let y_ = []
    let minutes = []
    let sec = []
    let avg_values_meta = []

    result.forEach(element => {
        y_.push(parseFloat(element[6]))
        x_.push(element[0])
        minutes.push(parseInt(element[2]) + parseInt(element[3]) / 60)
        sec.push(element[2] + "min" + element[3] + "seg")
    })

    for (var i = 0; i < result.length; i++){
        avg_values_meta.push(meta_value)
    }

    var desempenho = '';
    var desempenho_cor = '';
    var diff = parseInt((minutes[minutes.length - 2] - minutes[minutes.length - 1]) * 60)

    if (diff > 0) {
        desempenho = `<b>progresso</b><br>${diff}seg`;
        desempenho_cor = '#6dae8d'
    } else {

        if (diff < 0) {
            desempenho = `<b>regresso</b><br>${Math.abs(diff)}seg`;
            desempenho_cor = '#ff0000'
        } else {
            desempenho = `<b>sem variação</b>`;
            desempenho_cor = '#6639e9'
        }

    }


    var treinos = {
        x: x_,
        y: minutes,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            size: 10
        },
        line: {
            width: 3,
            shape: 'spline',
            color: 'rgb(108, 54, 241)'
        },
        name: 'Checkpoints',
        hovertemplate: 'tempo: %{text}<extra></extra>',
        text: sec
    };

    var meta = {
        x: x_,
        y: avg_values_meta,
        type: 'scatter',
        mode: 'lines',
        line: {
            width: 3,
            shape: 'spline'
        },
        name: 'meta',
        hovertemplate: 'tempo: %{y:.0f}min<extra></extra>',
    };

    var data = [treinos, meta];

    var layout = {

        yaxis: {
            autorange: true,
            // range: [11, 16],
            type: 'linear',
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            showgrid: false,
            tickcolor: '#000',
            fixedrange: true
        },

        showlegend: true,
        legend: {
            orientation: 'h',
            x: 0.35,
            y: 1.1
        },
        margin: {
            l: 70,
            r: 50,
            b: 50,
            t: 50,
            pad: 10
        },
        title: false,
        annotations: [{
            x: treinos.x[treinos.x.length - 1],
            y: treinos.y[treinos.x.length - 1] + 0.5,
            xref: 'x',
            yref: 'y',
            text: desempenho,
            showarrow: false,
            arrowhead: 1,
            ax: 0,
            ay: -40,
            font: {
                family: 'Nunito, sans-serif',
                size: 14,
                color: desempenho_cor
            }
        }]

    };

    Plotly.newPlot('check_plot', data, layout, {
        displayModeBar: false
    });

}

function treinos_por_local(dados) {

    var dict = {};

    dados.forEach(element => {
        var local = element[9]
        if (local in dict)
            dict[local] += 1
        else
            dict[local] = 1
    })

    var quantidade_ativiades = Object.values(dict);
    var locais = Object.keys(dict);

    var data = [{
        values: quantidade_ativiades,
        labels: locais,
        type: "pie",
        hole: .4,
    }];

    var layout = {
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
        colorway: ['#6c36f1'],
        legend: {
            orientation: 'h',
            x: 0.1
        },
        margin: {
            l: 10,
            r: 10,
            b: 30,
            t: 30,
            pad: 10
        },
        title: false,
        height: 380
    };

    Plotly.newPlot("locais_plot", data, layout, {
        displayModeBar: false
    });
}

function treinos_por_tipo(dados) {

    var dict = {};
    var quantidade_ativiades = {}
    var ritmo_por_tipo = {}

    dados.forEach(element => {
        var tipo_corrida = element[8]
        if (tipo_corrida in dict){
            dict[tipo_corrida] += parseFloat(element[1])
            ritmo_por_tipo[tipo_corrida] += parseFloat(element[6])
            quantidade_ativiades[tipo_corrida] += 1
        }
        else{
            dict[tipo_corrida] = parseFloat(element[1])
            ritmo_por_tipo[tipo_corrida] = parseFloat(element[6])
            quantidade_ativiades[tipo_corrida] = 1
        }
    })

    var distacia = Object.values(dict);
    var tipos = Object.keys(dict);
    var quantidade_ativiades_values =  Object.values(quantidade_ativiades);
    var ritmo_por_tipo_value = Object.values(ritmo_por_tipo)

    var avg_distancias = []
    var avg_ritmo_por_tipo_value = []

    for (var i = 0;i < distacia.length; i++){
        avg_distancias.push(distacia[i]/quantidade_ativiades_values[i]);
        var pace = ritmo_por_tipo_value[i]/quantidade_ativiades_values[i]
        avg_ritmo_por_tipo_value.push(`${parseInt(pace / 60)}:${parseInt(pace % 60)}/km`);
    }

    // var pace_f = `${parseInt(avg / 60)}:${parseInt(avg % 60)}`
    
    var data = [{
        x: tipos,
        y: avg_distancias,
        type: "bar",
        hovertemplate: '<b>%{x}</b><br>Distância: <b>%{y:.2f}</b>km<br>Pace: <b>%{text}</b><extra></extra>',
        text: avg_ritmo_por_tipo_value
    }];

    var layout = {
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
        colorway: ['#603ce1'],
        legend: {
            orientation: 'h',
            x: 0.1
        },
        margin: {
            l: 10,
            r: 10,
            b: 30,
            t: 30,
            pad: 10
        },
        title: false,
        height: 380
    };

    Plotly.newPlot("tipos_plot", data, layout, {
        displayModeBar: false
    });
}

function treinos_por_tipo_bubble(dados) {

    var dict = {};
    var distancia = {}

    dados.forEach(element => {
        var tipo = element[8]
        if (tipo in dict) {
            dict[tipo] += 1
            distancia[tipo] += parseFloat(element[1])
        } else {
            dict[tipo] = 1
            distancia[tipo] = 0
        }
    })


    var quantidade = Object.values(dict);
    var tipos = Object.keys(dict);
    var bubbles = Object.values(distancia);

    var avg_distance = bubbles.map((element, i) => {
        return element / quantidade[i] * 20 // distância média vezes 20 para aumentar o tamanho das bolhas
    })

    var data = [{
        x: tipos,
        y: quantidade,
        mode: 'markers',
        marker: {
            opacity: [0.4, 0.5, 0.6, 0.8, 1],
            size: avg_distance
        }
    }];

    var layout = {

        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
        colorway: ['#6c36f1'],
        margin: {
            l: 40,
            r: 30,
            b: 50,
            t: 40,
            pad: 10
        },
        height: 380
    };

    Plotly.newPlot("locais_plot_bubble", data, layout, {
        displayModeBar: false
    });
}