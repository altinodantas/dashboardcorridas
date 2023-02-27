const TYPE = 'prod';
let CLIENT_ID = '';

if (TYPE == 'test')
    CLIENT_ID = "192707284225-74pk61g5bnkkh5biec579v5gasel67us.apps.googleusercontent.com"; // local
else
    CLIENT_ID = "192707284225-tsjg3e79vl6papuv6okjla6ntapc7hsa.apps.googleusercontent.com"; // github


const API_KEY = 'AIzaSyB2Mf_OmGx2FoJH4wRAJkLr05BJ9r7IhvY';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = ['https://sheets.googleapis.com/$discovery/rest?version=v4', 'https://people.googleapis.com/$discovery/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'profile https://www.googleapis.com/auth/spreadsheets';

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
        discoveryDocs: DISCOVERY_DOC,
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
        await getProfile();

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
 * Get data from the running log spreadsheet:
 * https://docs.google.com/spreadsheets/d/1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY/edit
 * 
 */
async function getRunningData(data_range) {

    $("#loading").show()
    let response;

    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY',
            range: data_range,
        });


    } catch (err) {
        create_alert(`<strong>OPS!</strong> Erro ao tentar acessar: ${data_range}`, "danger");
        console.error(err.message)
        return;
    }
    const range = response.result;
    if (!range || !range.values || range.values.length == 0) {
        document.getElementById('content').innerText = 'No values found.';
        create_alert(`<strong>OPS!</strong> Sem registros no intervalo: ${data_range}`, "danger");
        return;
    }

    values = range.values.slice()

    if (data_range.split("!")[0] == 'Carol') {
        create_chart(values, 12, 'Check');
        $("#monitoramento span").html("Carol");
    } else {
        create_chart(values, 25, 'Velocidade');
        $("#monitoramento span").html("Altino");
    }

    treinos_por_local(values)
    treinos_por_distancias(values)
    treinos_por_tipo(values)

    create_summary(values)
    create_list(values)

    console.log(values)

    $("#loading").hide()

}

async function getProfile() {

    let profile;

    try {

        profile = await gapi.client.people.people.get({
            'resourceName': 'people/me',
            'personFields': 'names,emailAddresses,photos'
        });


    } catch (err) {
        document.getElementById('content').innerText = err.message;
        return;
    }

    if (profile.result.names[0].displayName == "Altino Dantas") {
        await getRunningData('Altino!A2:J').then(() => {
            $("#user_altino").show();
            $("#user_carol").show();

            $("#user_icon img").attr("src", profile.result.photos[0].url);
            $("#user_name").html(profile.result.names[0].displayName);
        })
    } else {
        await getRunningData('Carol!A2:J').then(() => {
            $("#user_altino").show();
            $("#user_carol").show();

            $("#user_icon img").attr("src", profile.result.photos[0].url);
            $("#user_name").html(profile.result.names[0].displayName);
        })
    }

}

async function addActivity() {

    let spreadsheet_range;

    if ($("#user_name").html() == "Altino Dantas")
        spreadsheet_range = 'Altino!A2:J'
    else
        spreadsheet_range = 'Carol!A2:J'

    let date = $('#inputDate').val();
    let distance = $('#inputDistancia').val();
    let minutes = $('#inputMinutos').val();
    let secondes = $('#inputSegundos').val();
    let elevation = $('#inputElevacao').val()
    let time = $('#inputHorario').val();
    let type = $('#inputTipo').val();
    let place = $('#inputLocal').val();

    if (!date || !distance || !minutes || !secondes || !elevation || !time || !type || !place) {
        create_alert(`<strong>OPS!</strong> Preencha todos os campos da atividade.`, "warning");
        return
    }

    var params = {
        spreadsheetId: '1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY',
        range: spreadsheet_range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
    };

    var valueRangeBody = {
        "values": [
            [
                date,
                parseFloat(distance),
                parseInt(minutes),
                parseInt(secondes),
                parseInt(elevation),
                time,
                getPace(distance, minutes, secondes).pace,
                getPace(distance, minutes, secondes).pace_f,
                type,
                place
            ]
        ]
    };

    let request;

    try {

        request = await gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then((res) => {
            document.getElementById("add_activity").reset();
            if (res.result)
                create_alert(`<strong>${res.result.updates.updatedRange}</strong> Dados foram adicionados na planinha com sucesso`, "success");
        });
        await getRunningData(spreadsheet_range);

    } catch (err) {
        create_alert(`Dados não foram adicionados na planilha.`, "danger");
        return;
    }

}

async function clearActivity(line_number) {

    // console.log(spreadsheet_range_to_clear + " " + spreadsheet_range)
    var spreadsheet_range;
    var spreadsheet_range_to_clear;

    // Captura o usuário logado e o usuários cujos dados estão sendo exibidos
    var user_of_data = $("#monitoramento span").html();
    var user_name = $("#user_name").html().split(" ")[0]

    console.log(user_of_data + " " + user_name)

    // Evita que um usuário dele dados de outro usuário
    if (user_of_data != user_name) {
        create_alert(`<strong>OPS!</strong> Você não tem permissão para apagar dados de ${user_of_data}`, "danger");
        return
    }

    spreadsheet_range = `${user_of_data}!A2:J`;
    spreadsheet_range_to_clear = `${user_of_data}!A${line_number}:J${line_number}`;


    var params = {
        spreadsheetId: '1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY',
        range: spreadsheet_range_to_clear,
    };

    var clearValuesRequestBody = {};

    let request;

    try {

        request = await gapi.client.sheets.spreadsheets.values.clear(params, clearValuesRequestBody).then((res) => {

            if (res.result)
                create_alert(`<strong>${res.result.clearedRange}</strong> Dados removidos com sucesso`, "warning");
        });
        await getRunningData(spreadsheet_range);

    } catch (err) {
        create_alert(`Erro ao tentar remover dados.`, "danger");
        return;
    }

}


/**
 * Get pace given **distance**, **minutes** and **secondes**:
 * 
 */
function getPace(distance, minutes, secondes) {
    let pace = ((parseInt(minutes) * 60) + parseInt(secondes)) / parseInt(distance);
    let pace_f = `${parseInt(pace / 60)}:${Math.ceil(pace % 60)}`;
    return {
        "pace": pace,
        "pace_f": pace_f
    };
}

var values

if (TYPE == 'dev') {

    fetch('./assets/mock_data.json')
        .then((response) => response.json())
        .then((json) => {
            console.log(json)

            values = json.carol.values

            $("#user_altino").show()
            $("#user_name").html("Carol")

            create_chart(values, 12, 'Check')
            treinos_por_local(values)
            treinos_por_distancias(values)
            treinos_por_tipo(values)

            create_summary(values)
            create_list(values)

            console.log(get_general_info(values).melhor_treino)


        });

    $("#authorize_button").hide()

    // $("#user_carol").show()
    // $("#user_altino").hide()

}

$(document).ready(function () {

    $("#procurar_atividade").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#tabela_lista tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $("#reset_button").on("click", function () {
        $("#procurar_atividade").val("");
        var value = "";
        $("#tabela_lista tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $('input[type=radio][name=btnradio]').change(function () {
        if ($(this).attr('id') == 'pace_radio') {
            $('#check_plot').html("");
            create_chart_pace(values)
        } else {
            if ($("#monitoramento span").html() == "Altino")
                create_chart(values, 25, 'Velocidade')
            else
                create_chart(values, 12, 'Check')
        }
    });

    $('a.close-link').on('click', function () {
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
    $('.resumo_distancia').html(info.ultimo_treino.distancia + "<span>km</span>")
    $('.resumo_horario').html(info.ultimo_treino.hora)

}

function create_list(dados) {

    var reverse_values = dados.slice().reverse();

    $("tbody").html("");

    reverse_values.forEach((element, index) => {

        var spreadsheet_line = reverse_values.length - index + 1

        var tipo = ``
        var tipo_lowcase = element[8].toLowerCase()

        if (element[8] == "Check")
            tipo = `<i class="bi bi-check-circle-fill green"></i> ${element[8]}`
        else
            tipo = `<i class="bi bi-circle-fill ${tipo_lowcase}"></i> ${element[8]}`

        var html = `<tr class="pt-3">
                      <td class="pt-3">${convert_date(element[0])}</td>
                      <td class="pt-3">${element[1]} km</td>
                      <td class="pt-3">${element[2]}min ${element[3]}seg</td>
                      <td class="pt-3">${element[7]}/km</td>
                      <td class="pt-3">${tipo}</td>
                      <td class="pt-3">${element[9]}</td>
                      <td class="pt-3">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#confirmClearModal" data-bs-whatever="${spreadsheet_line}">
                            <i class="bi bi-trash3-fill"></i> 
                        </a>
                      </td>
                    </tr>`
        $("tbody").append(html);

    })
}

function get_general_info(dados) {

    var total_atividades = dados.length
    var distancia = 0
    var elevacao = 0
    var segundos = 0
    var horas = 0
    var minutos = 0
    var seg = 0

    var melhor_treino = {
        "data": dados[0][0],
        "local": dados[0][9],
        "pace": dados[0][7],
        "pace_seg": dados[0][6],
        "distancia": dados[0][1],
        "hora": dados[0][5]
    }
    var ultimo_treino = {
        "data": dados[total_atividades - 1][0],
        "local": dados[total_atividades - 1][9],
        "pace": dados[total_atividades - 1][7],
        "distancia": dados[total_atividades - 1][1],
        "hora": dados[total_atividades - 1][5]
    }

    dados.forEach(element => {
        distancia += parseFloat(element[1])
        elevacao += parseInt(element[4])
        segundos += (parseInt(element[2]) * 60) + parseInt(element[3])

        // look for the best pace

        if(parseFloat(element[6]) < parseFloat(melhor_treino.pace_seg)){
            melhor_treino.data  = element[0];
            melhor_treino.local = element[9];
            melhor_treino.pace  = element[7];
            melhor_treino.pace_seg = element[6];
            melhor_treino.distancia = element[1];
            melhor_treino.hora  = element[5];
        }
    })

    horas = parseInt(segundos / 3600)
    minutos = parseInt((segundos % 3600) / 60)
    seg = segundos % 60

    return {
        "total_atividades": total_atividades,
        "distancia": distancia.toFixed(2),
        "elevacao": elevacao,
        "ultimo_treino": ultimo_treino,
        "melhor_treino": melhor_treino,
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
            type: 'linear',
            automargin: true,
            title: {
                text: 'Pace médio (seg)',
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

function treinos_por_distancias(dados) {

    let tipos_treino = {}

    dados.forEach(element => {

        let tipo_treino = element[8];

        if (tipo_treino in tipos_treino) {

            tipos_treino[tipo_treino].kms.push(parseInt(element[1]).toString() + "km");
            tipos_treino[tipo_treino].paces.push(parseFloat(element[6]));
            tipos_treino[tipo_treino].paces_f.push(element[7] + "/km");

        } else {
            let kms = [parseInt(element[1]).toString() + "km"];
            let pace = [parseFloat(element[6])];
            let pace_f = [element[7] + "/km"];
            tipos_treino[tipo_treino] = {
                "kms": kms,
                "paces": pace,
                "paces_f": pace_f
            };
        }

    })

    let colous = ['#fb851e', '#6639e9', '#6dae8d', '#0098d8', '#c81d7e', '#000']

    let datum = []

    Object.keys(tipos_treino).forEach((element, i) => {

        datum.push({
            x: tipos_treino[element].kms,
            y: tipos_treino[element].paces,
            mode: 'markers',
            type: 'scatter',
            name: element,
            marker: {
                size: 12,
                color: colous[i]
            },
            hovertemplate: ' %{text}<extra></extra>',
            text: tipos_treino[element].paces_f,
        })

    })

    var layout = {
        yaxis: {
            automargin: true,
            fixedrange: true
        },
        xaxis: {
            automargin: true,
            fixedrange: true
        },
        legend: {
            orientation: 'h',
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

    Plotly.newPlot("locais_plot_bubble", datum, layout, {
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

    for (var i = 0; i < result.length; i++) {
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
        if (tipo_corrida in dict) {
            dict[tipo_corrida] += parseFloat(element[1])
            ritmo_por_tipo[tipo_corrida] += parseFloat(element[6])
            quantidade_ativiades[tipo_corrida] += 1
        } else {
            dict[tipo_corrida] = parseFloat(element[1])
            ritmo_por_tipo[tipo_corrida] = parseFloat(element[6])
            quantidade_ativiades[tipo_corrida] = 1
        }
    })

    var distacia = Object.values(dict);
    var tipos = Object.keys(dict);
    var quantidade_ativiades_values = Object.values(quantidade_ativiades);
    var ritmo_por_tipo_value = Object.values(ritmo_por_tipo)

    var avg_distancias = []
    var avg_ritmo_por_tipo_value = []

    for (var i = 0; i < distacia.length; i++) {
        avg_distancias.push(distacia[i] / quantidade_ativiades_values[i]);
        var pace = ritmo_por_tipo_value[i] / quantidade_ativiades_values[i]
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

function create_alert(text, color) {

    let html = `<div class="alert alert-${color} alert-dismissible fade show" role="alert">
                    ${text}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`

    $(".mensagens").html(html)

}

const confirmClearModal = document.getElementById('confirmClearModal')
confirmClearModal.addEventListener('show.bs.modal', event => {

    const button = event.relatedTarget

    const recipient = button.getAttribute('data-bs-whatever')

    const modalTitle = confirmClearModal.querySelector('.modal-title')
    const modalBodyInput = confirmClearModal.querySelector('.modal-body input')
    const modalSubmitButton = confirmClearModal.querySelector('#apagar')

    modalSubmitButton.setAttribute("onclick", `clearActivity(${recipient})`)

    modalTitle.textContent = `Excluir atividade da linha ${recipient}`
})

confirmClearModal.addEventListener('hidden.bs.modal', event => {
    $("html, body").animate({
        scrollTop: 0
    }, "fast");
})

const elem = document.querySelector('#inputDate');
const datepicker = new Datepicker(elem, {
    buttonClass: 'btn',
    language: 'pt-BR',
    autohide: true,
});