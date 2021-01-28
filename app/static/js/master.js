function initializeDataTable() {
    isDatatableFilled = true;
    $('#datatable').DataTable({
        destroy: true,
        searchPanes: {
            threshold: 1,
            layout: 'columns-8',
            columns: [1, 3, 4, 5, 6, 7, 8, 9]
        },
        columnDefs: [
            {
                targets: 6,
                render: function (data, type, row) {
                    if (type === 'sp') {
                        return data.split(' , ')
                    }
                    return data;
                },
                searchPanes: {
                    orthogonal: 'sp'
                }
            }, {
                targets: 7,
                render: function (data, type, row) {
                    if (type === 'sp') {
                        return data.split(' , ')
                    }
                    return data;
                },
                searchPanes: {
                    orthogonal: 'sp'
                }
            }, {
                targets: 8,
                render: function (data, type, row) {
                    if (type === 'sp') {
                        return data.split(' , ')
                    }
                    return data;
                },
                searchPanes: {
                    orthogonal: 'sp'
                }
            }
        ],
        responsive: true,
        dom: '<"dtsp-verticalContainer"<"dtsp-verticalPanes"P>l<"dtsp-dataTable"frtip>>',
        "processing": true,
        data: tweets['data']
    });
}

function drawTotalSentimentChart(pie_object) {
    let positiveCount = pie_object['positive'];
    let negativeCount = pie_object['negative'];
    let neutralCount = pie_object['neutral'];

    var myPieConfig = {
        type: "pie",
        plot: {
            borderColor: "#2B313B",
            borderWidth: 5,
            // slice: 90,
            valueBox: {
                placement: 'out',
                text: '%t\n%npv%',
                fontFamily: "Open Sans"
            },
            tooltip: {
                fontSize: '18',
                fontFamily: "Open Sans",
                padding: "5 10",
                text: "%npv%"
            },
            animation: {
                effect: 2,
                method: 5,
                speed: 900,
                sequence: 1,
                delay: 3000
            }
        },
        plotarea: {
            margin: "20 0 0 0"
        },
        series: [
            {
                values: [negativeCount],
                text: "Negative",
                backgroundColor: '#FF7965'
            },
            {
                values: [neutralCount],
                text: "Neutral",
                backgroundColor: '#FFCB45'
            },
            {
                values: [positiveCount],
                text: "Positive",
                backgroundColor: '#6FB07F'
            }
        ]
    };

    zingchart.render({
        id: "pieChart",
        data: myPieConfig,
        height: '100%',
        width: '100%'
    });

}

function drawEntitySentimentChart(bar_object) {

    var myConfig = {
        type: "bar",
        stacked: true,
        legend: {
            toggleAction: 'remove',
            "adjust-layout": true
        },
        scaleX: {
            labels: bar_object['entity_names'] //['brand', 'tv shows', 'person']
        },
        plot: {
            valueBox: {
                text: "Total Tweet: %stack-total",
                backgroundColor: 'black',
                rules: [
                    {
                        rule: '%stack-top == 0',
                        visible: 0
                    }
                ]
            },
            "adjust-layout": true,
            animation: {
                effect: 2,
                method: 5,
                speed: 900,
                sequence: 1,
                delay: 3000
            },
            "bar-width": 30,
        },
        series: [
            {
                text: 'positive',
                values: bar_object['entity_positive_counts'],//[135, 42, 67],
                stack: 1,
                backgroundColor: '#6FB07F'
            },
            {
                text: 'negative',
                values: bar_object['entity_negative_counts'],//[10, 15, 10],
                stack: 1,
                backgroundColor: '#FF7965'
            },
            {
                text: 'neutral',
                values: bar_object['entity_neutral_counts'],//[25, 45, 25],
                stack: 1,
                backgroundColor: '#FFCB45'
            }
        ]
    };
    zingchart.render({
        id: 'entityBarChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });

}

function drawDomainSentimentChart(bar_object) {

    var myConfig = {
        type: "bar",
        stacked: true,
        legend: {
            toggleAction: 'remove',
            "adjust-layout": true
        },
        scaleX: {
            labels: bar_object['domain_names'] //['brand', 'tv shows', 'person']
        },
        plot: {
            valueBox: {
                text: "Total Tweet: %stack-total",
                backgroundColor: 'black',
                rules: [
                    {
                        rule: '%stack-top == 0',
                        visible: 0
                    }
                ]
            },
            "adjust-layout": true,
            animation: {
                effect: 2,
                method: 5,
                speed: 900,
                sequence: 1,
                delay: 3000
            },
            "bar-width": 30,
        },
        series: [
            {
                text: 'positive',
                values: bar_object['domain_positive_counts'],//[135, 42, 67],
                stack: 1,
                backgroundColor: '#6FB07F'
            },
            {
                text: 'negative',
                values: bar_object['domain_negative_counts'],//[10, 15, 10],
                stack: 1,
                backgroundColor: '#FF7965'
            },
            {
                text: 'neutral',
                values: bar_object['domain_neutral_counts'],//[25, 45, 25],
                stack: 1,
                backgroundColor: '#FFCB45'
            }
        ]
    };
    zingchart.render({
        id: 'domainBarChart',
        data: myConfig,
        height: '100%',
        width: '100%'
    });

}

function myDraw() {
    let nodes = [
        {id: 1, value: 2, label: "Algie"},
        {id: 2, value: 31, label: "Alston"},
        {id: 3, value: 12, label: "Barney"},
        {id: 4, value: 16, label: "Coley"},
        {id: 5, value: 17, label: "Grant"},
        {id: 6, value: 15, label: "Langdon"},
        {id: 7, value: 6, label: "Lee"},
        {id: 8, value: 5, label: "Merlin"},
        {id: 9, value: 30, label: "Mick"},
        {id: 10, value: 18, label: "Tod"},
    ];

    // create connections between people
    // value corresponds with the amount of contact between two people
    let edges = [
        {from: 2, to: 8, value: 3},
        {from: 2, to: 9, value: 5},
        {from: 2, to: 10, value: 1},
        {from: 4, to: 6, value: 8},
        {from: 5, to: 7, value: 2},
        {from: 4, to: 5, value: 1},
        {from: 9, to: 10, value: 2},
        {from: 2, to: 3, value: 6},
        {from: 3, to: 9, value: 4},
        {from: 5, to: 3, value: 1},
        {from: 2, to: 7, value: 4},
    ];

    // Instantiate our network object.
    var container = document.getElementById("myNetwork");
    var data = {
        nodes: nodes,
        edges: edges,
    };
    var options = {
        nodes: {
            shape: "dot",
            scaling: {
                customScalingFunction: function (min, max, total, value) {
                    return value / total;
                },
                min: 5,
                max: 150,
            },
        },
    };
    let network = new vis.Network(container, data, options);
}
