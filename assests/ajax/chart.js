$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '/maps/markers',
        success: function (data) {
            addMarkers(data);
            chartDisplayFunction('DEHRADUN');
        },
        error: function (err) {
            console.log(err);
        }
    })

    function addMarkers(data) {
        for (i in data) {
            var myIcon = L.icon({
                iconUrl: '/ajax/ship_icon.png',
                iconSize: [10, 10],
                iconAnchor: [22, 94],
                popupAnchor: [-3, -76],
            });
            let marker = L.marker([data[i].mean_latitude, data[i].mean_longitude],{icon: myIcon}).addTo(map);
            marker._icon.mmsi = data[i].mmsi;
            marker.bindTooltip(`${data[i].shipname}`);
            marker._icon.setAttribute("data-mmsi", data[i].mmsi);
        }
        addClickevent();
    }
    function addClickevent() {
        $('.leaflet-marker-icon').on('click', function (e) {
            var el = $(e.srcElement || e.target);
            mmsi = el.attr('data-mmsi');
            chartDisplayFunction(mmsi);
        });
    }
});
    

function chartDisplayFunction(mmsi) {
    $.ajax({
        type: 'GET',
        url: `/maps/chart?mmsi=${mmsi}`,
        success: function (data) {
            // addPieChart(data, mmsi);
            // addRadarChart(data, mmsi);
            addBarChart(data, mmsi);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function addBarChart(data, mmsi) {
    $('#barChart').remove();
    $('#bar-chart-container').append('<canvas id="barChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('barChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 450);
    gradient.addColorStop(0.2, '#051937');
    gradient.addColorStop(0.4, '#004d7a');
    gradient.addColorStop(0.6, '#008793');
    gradient.addColorStop(0.8, '#00bf72');
    gradient.addColorStop(1, '#a8eb12');

    let barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.bar.labels,
            datasets: [{
                label: "Number Of Encounters",
                backgroundColor: gradient,
                data: data.bar.total
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontSize: 20,
                text: `Number Of Encounters Month Wise for ship (${data.bar.ship})`
            },
        }
    });
}

function addRadarChart(data, District) {
    $('#radarChart').remove();
    $('#radar-chart-container').append('<canvas id="radarChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('radarChart').getContext('2d');
    let radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.radar.labels,
            datasets: [{
                label: "2014",
                fill: true,
                backgroundColor: "rgba(179,181,198,0.2)",
                borderColor: "rgba(179,181,198,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(179,181,198,1)",
                data: data.radar.production14Data
            }, {
                label: "2013",
                fill: true,
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                data: data.radar.production13Data
            }]
        },
        options: {
            maintainAspectRatio: false,
            title: {
                display: true,
                fontSize: 20,
                text: `Variation In Production Of Major Crops Over Years(${District})`
            },
        }
    });
}

function addPieChart(data, District) {
    var color = [];
    for (let i = 0; i < data.pie.labels.length; i++) {
        var o = Math.round, r = Math.random, s = 255;
        let temp = 'rgba(' + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + 0.7 + ')';
        color.push(temp);
    }
    $('#pieChart').remove();
    $('#pie-chart-container').append('<canvas id="pieChart" height="50px" width="50px"></canvas>');
    var ctx = document.getElementById('pieChart').getContext('2d');
    let pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels:data.pie.labels,
            datasets: [{
                backgroundColor: color,
                borderColor: 'white',
                data: data.pie.productionData
            }]
        },
        options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                fontSize: 20,
                text: `Various Crop's Production In The District (${District})`
            },
        }
    });
}