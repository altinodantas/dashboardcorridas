/* exported gapiLoaded */
/* exported gisLoaded */
/* exported handleAuthClick */
/* exported handleSignoutClick */

// TODO(developer): Set to client ID and API key from the Developer Console
const CLIENT_ID = '192707284225-tsjg3e79vl6papuv6okjla6ntapc7hsa.apps.googleusercontent.com';
const API_KEY = 'AIzaSyB2Mf_OmGx2FoJH4wRAJkLr05BJ9r7IhvY';

// Discovery doc URL for APIs used by the quickstart
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';

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
        document.getElementById('authorize_button').style.visibility = 'visible';
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
        document.getElementById('signout_button').style.visibility = 'visible';
        document.getElementById('authorize_button').innerText = 'Refresh';
        await listMajors();
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
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 
 * 1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY
 */
async function listMajors() {
    let response;
    try {
        // Fetch first 10 files
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1ZNGbcnNVWKgk0Q2Fi-WzOq4eBF97uUl2uMWPECaiNaY',
            range: 'Carol!A2:J',
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

    let check_train = []

    check_train = range.values.filter(element => element[8] == 'Check')

    // Ploting charts
    creat_chart(check_train)
    treinos_por_local([])
}


function creat_chart(result) {
    let x_ = []
    let y_ = []
    let minutes = []
    let sec = []

    result.forEach(element => {
        y_.push(parseFloat(element[6]))
        x_.push(element[0])
        minutes.push(parseInt(element[2]) + parseInt(element[3]) / 60)
        sec.push(parseInt(element[3]))
    })

    var trenos = {
        x: x_,
        y: minutes,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {
            size: 10
        },
        line: {
            width: 3,
            shape: 'spline'
        },
        name: 'treinos',
        hovertemplate: 'tempo: %{y:.0f}m%{text}s<extra></extra>',
        text: sec
    };

    var meta = {
        x: x_,
        y: [12, 12, 12, 12],
        type: 'scatter',
        mode: 'lines',
        name: 'meta',
        hovertemplate: 'tempo: %{y:.0f}m<extra></extra>',
    };

    var data = [trenos, meta];

    var layout = {
        title: 'Evolução do treino de Check',
        showlegend: true,
        yaxis: {
            autorange: false,
            range: [11, 15],
            type: 'linear',
            title: {
                text: 'tempo'
            }
        },

    };

    Plotly.newPlot('check_plot', data, layout, {
        displayModeBar: false
    });

}

function treinos_por_local(dados) {

    var xArray = [4, 14, 2, 1, 6];
    var yArray = ["Alphaville SC", "Av. Arena Sol", "Parque Joaçaba", "Parque MVJ", "Perto de casa"];

    var data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation: "h"
    }];

    var layout = {
        title: "Treinos por local"
    };

    Plotly.newPlot("locais_plot", data, layout);
}