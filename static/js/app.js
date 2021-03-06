/**********************************/
// Initialize the visualizatio

d3.json('/api/leaderboard').then(data => {
    // grab a reference to the dropdown select element
    var selector = d3.select('#selDataset');

    allYears = data.map(d => d['season']);

    years = [...new Set(allYears)];

    years.sort((a,b) => (b-a));

    years.forEach(year => {
        selector
            .append('option')
            .property('value', year)
            .text(year);
    });

    //use the first sample from the list to build the initial plots
    var firstSample = years[0];

    buildCharts(firstSample);


});



/**********************************/
// buildCharts function

function buildCharts(season) {


    /**********************************/
    // build leaderboard table

    d3.json('/api/leaderboard').then(data => {
      //var Tablehead = document.getElementById("stats-thead");
      //  Tablehead.innerHTML = "";
      var Tablebody = document.getElementById("stats-tbody");
        Tablebody.innerHTML = "";
        
        //  apply filter for season value
        data = data.filter(d => d['season'] == season);

        // populate thead
        /* THIS IS HANDLED IN INDEX.HTML
        thead = d3.select('#stats-thead');

        Object.keys(data[0]).forEach(key => {
            var th = thead.append('th');
            th.text(key);
        });
        */

        data.forEach(stats => {
            
        // populate tbody
            tbody = d3.select('#stats-tbody')
            var tr = tbody.append("tr");
                    
            Object.values(stats).forEach(value => {
                var td = tr.append("td");
                td.text(value);
            });
        });


        /******* Activate the MDBootstrap thing */
        $('#myTable').DataTable();
        $('.dataTables_length').addClass('bs-select');
        


        
    });

    /**********************************/
    // build scatter plot for qb

    d3.json('/api/pos_rank').then(data => {
        
        //  apply filter for season value
        data = data.filter(d => d['season'] == season);
        data = data.filter(d => d['pos'] == 'QB').slice(0,10);

        var trace1 = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            y: data.map(d => d['Total FPTS']),
            mode: 'markers',
            type: 'scatter',
            name: 'Team A',
            text: data.map(d => d['name']),
            marker: { size: 8 }
          };
          
        var data2 = [trace1];
          
          var layout = {
            xaxis: {
              title: 'Player Ranking',
              range: [ 0.75, 10.75 ]
            },
            yaxis: {
              title: 'Total Points',
              range: [80, 400]
            },
            title:'FPTS for QB Rankings',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
          };
          
          Plotly.newPlot('qb_scatter', data2, layout);

    });

     /**********************************/
    // build scatter plot for rb

    d3.json('/api/pos_rank').then(data => {
        
        //  apply filter for season value
        data = data.filter(d => d['season'] == season);
        data = data.filter(d => d['pos'] == 'RB').slice(0,10);

        var trace1 = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            y: data.map(d => d['Total FPTS']),
            mode: 'markers',
            type: 'scatter',
            name: 'Team A',
            text: data.map(d => d['name']),
            marker: { size: 8 }
          };
          
        var data2 = [trace1];
          
        var layout = {
          xaxis: {
            title: 'Player Ranking',
            range: [ 0.75, 10.75 ]
          },
          yaxis: {
            title: 'Total Points',
            range: [80, 400]
          },
          title:'FPTS for RB Rankings',
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)'
        };
          
          Plotly.newPlot('rb_scatter', data2, layout);

    });

     /**********************************/
    // build scatter plot for wr

    d3.json('/api/pos_rank').then(data => {
        
        //  apply filter for season value
        data = data.filter(d => d['season'] == season);
        data = data.filter(d => d['pos'] == 'WR').slice(0,10);
        
        var trace1 = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            y: data.map(d => d['Total FPTS']),
            mode: 'markers',
            type: 'scatter',
            name: 'Team A',
            text: data.map(d => d['name']),
            marker: { size: 8 }
          };
          
        var data2 = [trace1];
          
        var layout = {
          xaxis: {
            title: 'Player Ranking',
            range: [ 0.75, 10.75 ]
          },
          yaxis: {
            title: 'Total Points',
            range: [80, 400]
          },
          title:'FPTS for WR Rankings',
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)'
        };
          
          Plotly.newPlot('wr_scatter', data2, layout);

    });

     /**********************************/
    // build scatter plot for TE

    d3.json('/api/pos_rank').then(data => {
        
        //  apply filter for season value
        data = data.filter(d => d['season'] == season);
        data = data.filter(d => d['pos'] == 'TE').slice(0,10);

        var trace1 = {
            x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            y: data.map(d => d['Total FPTS']),
            mode: 'markers',
            type: 'scatter',
            name: 'Team A',
            text: data.map(d => d['name']),
            marker: { size: 8 }
          };

        var data2 = [trace1];
          
        var layout = {
          xaxis: {
            title: 'Player Ranking',
            range: [ 0.75, 10.75 ]
          },
          yaxis: {
            title: 'Total Points',
            range: [80, 400]
          },
          title:'FPTS for TE Rankings',
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)'
        };
          
          Plotly.newPlot('te_scatter', data2, layout);

    });

    /**********************************/
    // build line plot for FPTs / g over seasons

    d3.json('/api/FPTS_over_seasons').then(data => {
        
        // //  apply filter for season value
        // data = data.filter(d => d['season'] == season);

        var trace1 = {
            x: data.filter(d => d['pos'] == 'QB').map(d => d['season']),
            y: data.filter(d => d['pos'] == 'QB').map(d => d['FPTS/G']),
            mode: 'lines',
            name: 'QB'
          };
          
          var trace2 = {
            x: data.filter(d => d['pos'] == 'RB').map(d => d['season']),
            y: data.filter(d => d['pos'] == 'RB').map(d => d['FPTS/G']),
            mode: 'lines',
            name: 'RB'
          };

          var trace3 = {
            x: data.filter(d => d['pos'] == 'WR').map(d => d['season']),
            y: data.filter(d => d['pos'] == 'WR').map(d => d['FPTS/G']),
            mode: 'lines',
            name: 'WR'
          };

          var trace4 = {
            x: data.filter(d => d['pos'] == 'TE').map(d => d['season']),
            y: data.filter(d => d['pos'] == 'TE').map(d => d['FPTS/G']),
            mode: 'lines',
            name: 'TE'
          };

          var layout = {
            xaxis: {
              title: 'YEARS'
            },
            yaxis: {
              title: 'Avg Points'
            },
            title:'Avg Fantasy Points per Game by Position',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
          };
          
          var data2 = [trace1, trace2, trace3, trace4];
        
          
        Plotly.newPlot('avg_fpts_line', data2, layout);

    });


    /**********************************/
    // build line plot for # of pos over seasons

    d3.json('/api/num_of_pos_over_over_seasons').then(data => {
        
        // //  apply filter for season value
        // data = data.filter(d => d['season'] == season);

        var trace1 = {
            x: data.map(d => d['season']),
            y: data.map(d => d['QB']),
            mode: 'lines',
            name: 'QB'
          };
          
          var trace2 = {
            x: data.map(d => d['season']),
            y: data.map(d => d['RB']),
            mode: 'lines',
            name: 'RB'
          };

          var trace3 = {
            x: data.map(d => d['season']),
            y: data.map(d => d['WR']),
            mode: 'lines',
            name: 'WR'
          };

          var trace4 = {
            x: data.map(d => d['season']),
            y: data.map(d => d['TE']),
            mode: 'lines',
            name: 'TE'
          };

          var layout = {
            xaxis: {
              title: 'YEARS'
            },
            yaxis: {
              title: '# of Players'
            },
            title:'Number of Top 300 Fantasy Players by Position',
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
          };
          
          var data2 = [trace1, trace2, trace3, trace4];
        
          
        Plotly.newPlot('pos_count_line', data2, layout);

    });

    /**********************************/
    // build table for # of pos over seasons



    d3.json('/api/num_of_pos_over_over_seasons').then(data => {
    
        //  apply filter for season value
        //data = data.filter(d => d['season'] == season);

        // populate table
        //table = d3.select('#myTable');

        // populate thead
        thead = d3.select('#count-thead');

        Object.keys(data[0]).forEach(key => {
            var th = thead.append('th');
            th.text(key);
        });

        data.forEach(stats => {
            
        // populate tbody
            tbody = d3.select('#count-tbody')
            var tr = tbody.append("tr");
                    
            Object.values(stats).forEach(value => {
                var td = tr.append("td");
                td.text(value);
            });
        });
    });

    

};


function optionChanged(newSample) {
    buildCharts(newSample);   
    
    $('#myTable').DataTable();
        $('.dataTables_length').addClass('bs-select');
};





// function myFunction() {
//   var input, filter, table, tr, td, i;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   table = document.getElementById("myTable");
//   tr = table.getElementsByTagName("tr");
//   for (i = 0; i < tr.length; i++) {.append
//     td = tr[i].getElementsByTagName("td")[2];
//     if (td) {
//       if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
//         tr[i].style.display = "";
//       } else {
//         tr[i].style.display = "none";
//       }
//     }
//   }
// }

// $(document).ready(function () {

//   // sleep for a few seconds before running the jQuery stuff
//   setTimeout(() => {  

//     $('#myTable').DataTable();
//     $('.dataTables_length').addClass('bs-select');

//     console.log('end wait');
//    }, 5000);
//    // refine this to have the app check every ~.5 seconds

// });