class Interactive {
    constructor() {
        this.standardChoices = { "k": 1, "l": 100, "dist": "poi", "routing": "Return" }
        this.filters = { "k": null, "l": 100, "dist": "poi", "routing": "Return" }
        this.choiceList = ["l", "dist", "routing"]
        this.outcome = "ET_W"
        this.df = null
        d3.csv('results_1_100.0.csv', function (row) {
            Object.keys(row).forEach(function (key) {
                if (key !== 'dist' && key !== 'routing') {
                    row[key] = parseFloat(row[key]);
                }
            });
            delete row['']
            return row
        }).then(this.setupDropdowns.bind(this)).then(this.setupFilters.bind(this)).then(this.plotData.bind(this))

        // Add the event listeners
        document.getElementById('parameterDropdown').addEventListener('change', this.updateFilters.bind(this));
        document.getElementById('outcomeDropdown').addEventListener('change', this.updateOutcome.bind(this));
        document.getElementById('filter1Dropdown').addEventListener('change', function(e){
            this.filters[this.choiceList[0]] = e.target.value; this.standardChoices[this.choiceList[0]] = e.target.value; this.updatePlot()
        }.bind(this));
        document.getElementById('filter2Dropdown').addEventListener('change', function(e){
            this.filters[this.choiceList[1]] = e.target.value; this.standardChoices[this.choiceList[1]] = e.target.value; this.updatePlot()
        }.bind(this));
        document.getElementById('filter3Dropdown').addEventListener('change', function(e){
            this.filters[this.choiceList[2]] = e.target.value; this.standardChoices[this.choiceList[2]] = e.target.value; this.updatePlot()
        }.bind(this));
    }

    setupFilters(){
        var i = 1
        this.choiceList = []
        for (var k of Object.keys(this.filters)) {
            if (this.filters[k] != null) {
                this.choiceList.push(k)
                const name = "filter" + i + "Dropdown"
                const label = document.querySelector(`label[for=${name}]`);
                label.textContent = `Select value of ${k} parameter:`
                i++

                const dropdown = document.getElementById(name)

                // Assuming your dataset is available in this.dataset
                const uniqueValues = [...new Set(this.df.map(entry => entry[k]))];

                // Clear existing options
                dropdown.innerHTML = '';

                // Add options to the filter dropdown
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    dropdown.appendChild(option);
                });
            }
        }
    }

    updateFilters() {
        const selectedParameter = document.getElementById('parameterDropdown').value;
        this.standardChoices[selectedParameter] = this.filters[selectedParameter]
        this.filters = { ...this.standardChoices }
        this.filters[selectedParameter] = null
        var i = 1
        this.choiceList = []
        for (var k of Object.keys(this.filters)) {
            if (this.filters[k] != null) {
                this.choiceList.push(k)
                const name = "filter" + i + "Dropdown"
                const label = document.querySelector(`label[for=${name}]`);
                label.textContent = `Select value of ${k} parameter:`
                i++

                const dropdown = document.getElementById(name)

                // Assuming your dataset is available in this.dataset
                const uniqueValues = [...new Set(this.df.map(entry => entry[k]))];

                // Clear existing options
                dropdown.innerHTML = '';

                // Add options to the filter dropdown
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    dropdown.appendChild(option);
                });
            }
        }
        this.updatePlot()
    }


    updateOutcome() {
        this.outcome = document.getElementById('outcomeDropdown').value;
        this.updatePlot()
    }

    setupDropdowns(df) {
        const parameterDropdown = document.getElementById('parameterDropdown');
        const outcomeDropdown = document.getElementById('outcomeDropdown');

        // Extract all columns from data excluding EM
        const allColumns = Object.keys(df[0]);
        const outcomeColumns = allColumns.filter(col => (col !== 'EM') & (col !== "k") & (col !== "l") & (col !== "dist") & (col !== "routing"));

        // Populate parameter dropdown
        const parameterOptions = ['k', 'l', 'dist', 'routing'];
        parameterOptions.forEach(param => {
            const option = document.createElement('option');
            option.value = param;
            option.text = param;
            parameterDropdown.appendChild(option);
        });

        // Populate outcome dropdown
        outcomeColumns.forEach(outcome => {
            const option = document.createElement('option');
            option.value = outcome;
            option.text = outcome;
            outcomeDropdown.appendChild(option);
        });

        this.df = df
    }

    updatePlot() {
        const outcome = this.outcome
        const filters = this.filters
        const df = this.df

        let filteredData = df;

        filteredData = df.filter(entry => {
            let passFilter = true;
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && entry[key] !== filters[key]) {
                    passFilter = false;
                }
            });
            return passFilter;
        })
        const key = Object.keys(filters).filter((x) => filters[x] == null)[0]

        // Group data by 'k' and create datasets for each unique 'k' value
        const groupedData = d3.group(filteredData, d => d[key]);
        
        // Create chart using grouped data
        const labels = Array.from(groupedData.keys());
        const datasets = labels.map(k => {
            const dataForK = groupedData.get(k);
            return {
                label: `${key} = ${k}`,
                data: dataForK.map(entry => parseFloat(entry[outcome])),
                borderColor: getRandomColor(), // Function to generate random color
                fill: false,
            };
        });
        this.chart.data.datasets = datasets
        this.chart.update()
    }

    plotData() {
        const outcome = this.outcome
        const filters = this.filters
        const df = this.df

        let filteredData = df;

        filteredData = df.filter(entry => {
            let passFilter = true;
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && entry[key] !== filters[key]) {
                    passFilter = false;
                }
            });
            return passFilter;
        })

        const key = Object.keys(filters).filter((x) => filters[x] == null)[0]

        // Group data by 'k' and create datasets for each unique 'k' value
        const groupedData = d3.group(filteredData, d => d[key]);

        // Create chart using grouped data
        const labels = Array.from(groupedData.keys());
        const datasets = labels.map(k => {
            const dataForK = groupedData.get(k);
            return {
                label: `${key} = ${k}`,
                data: dataForK.map(entry => parseFloat(entry[outcome])),
                borderColor: getRandomColor(), // Function to generate random color
                fill: false,
            };
        });

        const ctx = document.getElementById('plot').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: filteredData.map(entry => entry.EM),
                datasets: datasets,
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'EM',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: outcome,
                        },
                    },
                },
            },
        });
    }
}

// Function to generate a random color for chart datasets
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Example usage
const inst = new Interactive()
