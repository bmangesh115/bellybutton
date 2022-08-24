function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(resultArray);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    
    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // 5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(resultArray);
    //     // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels.slice(0, 10).reverse();
    var sample_values = result.sample_values.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    // Variables for metadata
    var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);
    var metadata = metadataArray[0];
    var wfreq = metadata.wfreq
    var yticks = otu_ids.map(sampleObj => "OTU " + sampleObj).slice(0, 10).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_values,
      y: yticks,
      marker: {
        color: 'rgb(230,159,0)',
        opacity: 0.8
      },
      type: "bar",
      orientation: "h",
      text: otu_labels
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      font: {
        family: 'verdana',
        size: 18,
        color: "rgb(255, 255, 255)"
      },
      paper_bgcolor: "rgb(0, 0, 0)", plot_bgcolor: "rgb(0, 0, 0)",
      yaxis: {
        tickfont: {
          size: 12,
          color: "rgb(255, 255, 255)"
        }
      }
    };


    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: result.otu_ids,
      y: result.sample_values,
      text: result.otu_labels,
      mode: "markers",
      marker: {
        size: result.sample_values,
        color: result.otu_ids,
        colorscale: "Red"

      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      font: {
        family: 'verdana',
        size: 18,
        color: "rgb(255, 255, 255)"
      },
      xaxis: { 
        title: "OTU ID",
        tickfont: {
          size: 14,
          color: "rgb(255, 255, 255)",
        },
      },
      yaxis: {
        tickfont: {
          size: 14,
          color: "rgb(255, 255, 255)"
        },
      },
      paper_bgcolor: "rgb(0, 0, 0)", plot_bgcolor: "rgb(0, 0, 0)",

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfreq,
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs Per Week", font: { size: 24 } },
      font: {
        family: 'verdana',
        size: 18,
        color: "rgb(255, 255, 255)"
      },
      gauge: {
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "rgb(255, 255, 255)"},
        bar: { color: "rgb(204,121,167)" },
        bgcolor: "rgb(0, 0, 0)",
        borderwidth: 2,
        bordercolor: "rgb(105, 105, 105)",
        steps: [
          { range: [0, 2], color: "#E8F5E9"},
          { range: [2, 4], color: "#81C784" },
          { range: [4, 6], color: "#4CAF50" },
          { range: [6, 8], color: "#388E3C" },
          { range: [8, 10], color: "#1B5E20" }
        ]
        
        }
      }
    
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      margin: { t: 25, r: 25, l: 25, b: 25},
      paper_bgcolor: "rgb(0, 0, 0)", plot_bgcolor: "rgb(0, 0, 0)",
      font: { color: "rgb(255, 255, 255)", family: "verdana", size : 14 }

    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}