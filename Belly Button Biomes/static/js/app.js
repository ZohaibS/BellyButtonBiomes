function buildMetadata(sample) {
    
    d3.json(`/metadata/{sample}`).then((data) => {
        var ourPanel = d3.select("#sample-metadata");

        // Clearing existing metadata.
        ourPanel.html("");

        // Adding key value pairs to the panel.
        Object.entries(data).forEach(([key, value]) => {
            ourPanel.append("h6").text(`${key}: ${value}`);
            console.log(key, value);
        });
    });
}

function buildCharts(sample) {

    d3.json(`/samples/${sample}`).then((data) => {
        const ids = data.otu_ids;
        const labels = data.otu_labels;
        const values = data.sample_values;
        console.log(ids, labels, values);

        var layout = {
            margin: { t: 0},
            hovermode: "closest",
            xaxis: { title: "OTU Id"}
        };
    
        var chartData = [
            {
                x: ids,
                y: values,
                text: labels,
                mode: "markers",
                marker: {
                    size: values,
                    color: ids,
                    colorscale: "Jet"
                }
            }
        ];
        
        Plotly.plot("bubble", chartData, layout);

        var chartData2 = [
            {
                values: values.slice(0,10),
                labels: ids.slice(0,10),
                hovertext: labels.slice(0,10),
                hoverinfo: "hovertext",
                type: "pie"
            }
        ];

        var layout2 = {
            margin: { t:0, l:0 }
        };
        
        Plotly.plot("pie", chartData2, layout2);
    });
}

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      // Use the first sample from the list to build the initial plots
      const firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildCharts(newSample);
    buildMetadata(newSample);
  }
  
  // Initialize the dashboard
  init();
  
