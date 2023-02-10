var values = [
    [
        "01/12/2022",
        "1.89",
        "17",
        "58",
        "31",
        "18:45",
        "570.37",
        "9:30",
        "Livre",
        "Perto de casa"
    ],
    [
        "07/12/2022",
        "2.79",
        "26",
        "34",
        "14",
        "17:26",
        "571.33",
        "9:31",
        "Livre",
        "Alphaville SC"
    ],
    [
        "12/12/2022",
        "2.7",
        "30",
        "0",
        "35",
        "17:34",
        "666.67",
        "11:7",
        "Livre",
        "Perto de casa"
    ],
    [
        "14/12/2022",
        "3.32",
        "31",
        "13",
        "48",
        "17:10",
        "564.16",
        "9:24",
        "Livre",
        "Perto de casa"
    ],
    [
        "19/12/2022",
        "2.1",
        "16",
        "44",
        "0",
        "7:57",
        "478.10",
        "7:58",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "21/12/2022",
        "2.13",
        "16",
        "6",
        "3",
        "7:10",
        "453.52",
        "7:34",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "23/12/2022",
        "2.1",
        "15",
        "18",
        "3",
        "7:01",
        "437.14",
        "7:17",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "24/12/2022",
        "2.11",
        "15",
        "20",
        "0",
        "19:12",
        "436.02",
        "7:16",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "26/12/2022",
        "2.1",
        "14",
        "45",
        "3",
        "6:58",
        "421.43",
        "7:1",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "28/12/2022",
        "2.1",
        "14",
        "26",
        "3",
        "7:08",
        "412.38",
        "6:52",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "31/12/2022",
        "2.1",
        "14",
        "17",
        "3",
        "9:11",
        "408.10",
        "6:48",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "02/01/2023",
        "2.1",
        "14",
        "11",
        "0",
        "7:21",
        "405.24",
        "6:45",
        "Livre",
        "Av. Arena Sol"
    ],
    [
        "04/01/2023",
        "5.5",
        "42",
        "24",
        "39",
        "6:58",
        "462.55",
        "7:43",
        "Intervalado",
        "Perto de casa"
    ],
    [
        "06/01/2023",
        "5.5",
        "52",
        "2",
        "71",
        "15:48",
        "567.64",
        "9:28",
        "Subida",
        "Alphaville SC"
    ],
    [
        "08/01/2023",
        "2.1",
        "15",
        "52",
        "31",
        "20:14",
        "453.33",
        "7:33",
        "Livre",
        "Parque MVJ"
    ],
    [
        "10/01/2023",
        "2.1",
        "14",
        "12",
        "0",
        "17:51",
        "405.71",
        "6:46",
        "Check",
        "Av. Arena Sol"
    ],
    [
        "12/01/2023",
        "6.6",
        "53",
        "0",
        "11",
        "7:11",
        "481.82",
        "8:2",
        "Intervalado",
        "Av. Arena Sol"
    ],
    [
        "16/01/2023",
        "3.21",
        "29",
        "0",
        "45",
        "7:04",
        "542.06",
        "9:2",
        "Subida",
        "Alphaville SC"
    ],
    [
        "21/01/2023",
        "2.1",
        "14",
        "8",
        "0",
        "9:50",
        "403.81",
        "6:44",
        "Check",
        "Av. Arena Sol"
    ],
    [
        "23/01/2023",
        "5.1",
        "41",
        "52",
        "21",
        "8:18",
        "492.55",
        "8:13",
        "Intervalado",
        "Av. Arena Sol"
    ],
    [
        "25/01/2023",
        "5.2",
        "48",
        "48",
        "71",
        "6:57",
        "563.08",
        "9:23",
        "Subida",
        "Alphaville SC"
    ],
    [
        "27/01/2023",
        "2.1",
        "13",
        "30",
        "0",
        "7:30",
        "385.71",
        "6:26",
        "Check",
        "Av. Arena Sol"
    ],
    [
        "29/01/2023",
        "6.5",
        "55",
        "15",
        "65",
        "9:52",
        "510.00",
        "8:30",
        "Livre",
        "Perto de casa"
    ],
    [
        "31/01/2023",
        "5",
        "43",
        "27",
        "34",
        "9:17",
        "521.40",
        "8:41",
        "Livre",
        "Perto de casa"
    ],
    [
        "02/02/2023",
        "2.1",
        "13",
        "10",
        "0",
        "8:50",
        "376.19",
        "6:16",
        "Check",
        "Av. Arena Sol"
    ],
    [
        "04/02/2023",
        "3.5",
        "27",
        "23",
        "76",
        "19:16",
        "469.43",
        "7:49",
        "Livre",
        "Parque Joaçaba"
    ],
    [
        "06/02/2023",
        "3.1",
        "25",
        "59",
        "66",
        "20:42",
        "502.90",
        "8:23",
        "Intervalado",
        "Parque Joaçaba"
    ]
]


create_chart(values, 12)
treinos_por_local(values)
treinos_por_tipo_bubble(values)

create_summary(values)
create_list(values)




$(document).ready(function () {
    $('input[type=radio][name=btnradio]').change(function () {
        if ($(this).attr('id') == 'pace_radio') {
            $('#check_plot').html("");
            create_chart_pace(values)
        } else {
            create_chart(values, 12)
        }
    });
})

function create_summary(dados) {

    var info = get_general_info(dados)

    var html = `<h1>${info.total_atividades}</h1>
                        <span>Atividades</span>
                        <hr />
                        <p>${info.distancia} <b>km</b></p>
                        <p>${info.elevacao} <b>metros</b></p>
                        <h5><b>${info.horas}:${info.minutos}:${info.seg}</b></h5>
                        `

    $("#info").html(html);
    $('#resumo_data').html(convert_date(info.ultimo_treino.data))
    $('.resumo_local').html(info.ultimo_treino.local)
    $('.resumo_pace').html(info.ultimo_treino.pace + "<span>/km</span>")

}

function create_list(dados) {

    var reverse_values = dados.slice().reverse();

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

    for (i = 0; i < pace.length; i++) {
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
            size: 12
        },
        line: {
            width: 5,
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
            title: 'Pace médio (seg)'
        },
        xaxis: {
            automargin: true,
            showgrid: false,
            tickcolor: '#000'
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

function create_chart(dados, meta_value) {

    var result = dados.filter(element => element[8] == 'Check')

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

    for (i = 0; i < result.length; i++){
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
            width: 4,
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
            width: 4,
            shape: 'spline'
        },
        name: 'meta',
        hovertemplate: 'tempo: %{y:.0f}min<extra></extra>',
    };

    var data = [treinos, meta];

    var layout = {

        yaxis: {
            autorange: false,
            range: [11, 16],
            type: 'linear',
            automargin: true
        },
        xaxis: {
            automargin: true,
            showgrid: false,
            tickcolor: '#000'
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
            automargin: true
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
        title: false
    };

    Plotly.newPlot("locais_plot", data, layout, {
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
            automargin: true
        },
        colorway: ['#6c36f1'],
        margin: {
            l: 40,
            r: 30,
            b: 50,
            t: 40,
            pad: 10
        }
    };

    Plotly.newPlot("locais_plot_bubble", data, layout, {
        displayModeBar: false
    });
}