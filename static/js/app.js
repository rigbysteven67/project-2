/*d3.json('api/fantasy_stats').then(data => {

	// populate thead
	thead = d3.select('#stats-thead');

	Object.keys(data[0]).forEach(key => {
	    var th = thead.append('th');
	    th.text(key);
	});

    data.forEach(stats => {
           
	// populate tbody
        tbody = d3.select('#stats-tbody')
        var tr = tbody.append("tr");
                
        Object.values(stats).forEach(value => {
            var td = tr.append("td");
            td.text(value);
        });
    });
});
*/

/**********************************/
// Initialize the visualizatio

d3.json('/api/combined_table').then(data => {
    // grab a reference to the dropdown select element
    var selector = d3.select('#selDataset');

    allYears = data.map(d => d['SEASON']);

    years = [...new Set(allYears)];

    years.sort((a,b) => (a-b));

    console.log(years)

    years.forEach(year => {
        selector
            .append('option')
            .property('value', year)
            .text(year);
    });

    //use the first sample from the list to build the initial plots
    //var firstSample = years[0];

    //buildCharts(firstSample);
    //buildMetadata(firstSample);

});

/***THIS IS THE LINE CHART */
d3.json('/api/fantasy_avg_season_performance').then(data => {

    season = data.map(d => d['season']);
    winner_above_avg_players = data.map(d => d['winner_above_avg_players']);
    loser_above_avg_players = data.map(d => d['loser_above_avg_players']);
    winning_team = data.map(d => d['winner']);
    losing_team = data.map(d => d['loser']);

    /*
    {
        season: 2020,
        winner: "Tampa Bay Buccaneers",
        winner_code: "TB",
        winner_above_avg_players: 7,
        loser: "Kansas City Chiefs",
        loser_code: "KC",
        loser_above_avg_players: 5
        },
    */


    var trace1 = {
        x: season,
        y: winner_above_avg_players,
        text: winning_team,
        type: 'scatter',
        name: 'Super Bowl Champion'
      };
      
      var trace2 = {
        x: season,
        y: loser_above_avg_players,
        text: losing_team,
        type: 'scatter',
        name: 'Loser :('
      };
      
      var data = [trace1, trace2];
      
      Plotly.newPlot('comparison-chart', data);


});






/*** THIS IS THE GROUPED BAR CHART */
function createCompare(season=null) {
     /***************
       * FILTERED GROUP BAR
       */

        // season: 2019,
        // loser_above_avg_players: 6
        // winner_above_avg_players: 5,

        d3.json('/api/fantasy_positions').then(data => {


            // apply filter if a season value exists, otherwise leave it alone
            if(season) {
                data = data.filter(d => d['season'] == season);
            }
            /*
                {
                    season: "2002",
                    position: "RB",
                    team: "LV",
                    fpts_per_g: 17.65,
                    fpts: 565.46,
                    winner: "Tampa Bay Buccaneers",
                    Winner_code: "TB",
                    loser: "Oakland Raiders",
                    loser_code: "LV"
                }
            */

            season = data.map(d => d['season']);
            positions = data.map(d => d['position']);
            winning_team = data.map(d => d['Winner_code']);
            losing_team = data.map(d => d['loser_code']);
            winning_fpts_per_g = data.filter(d => d['team'] == d['Winner_code']).map(d => d['fpts_per_g'])
            losing_fpts_per_g = data.filter(d => d['team'] == d['loser_code']).map(d => d['fpts_per_g'])


            console.log(season.length);
            console.log(positions.length);
            console.log(winning_team.length);
            console.log(losing_team.length);
            console.log(winning_fpts_per_g.length);
            console.log(losing_fpts_per_g.length);
       
            //console.log(winning_fpts_per_g);
            //console.log(losing_fpts_per_g);

            var xValue = positions;

            var yValue = winning_fpts_per_g;
            var yValue2 = losing_fpts_per_g;
    
            var trace1 = {
            x: xValue,
            y: yValue,
            type: 'bar',
            text: yValue.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            opacity: 0.5,
            marker: {
                color: 'rgb(158,202,225)',
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
            };
    
            var trace2 = {
            x: xValue,
            y: yValue2,
            type: 'bar',
            text: yValue2.map(String),
            textposition: 'auto',
            hoverinfo: 'none',
            marker: {
                color: 'rgba(58,200,225,.5)',
                line: {
                color: 'rgb(8,48,107)',
                width: 1.5
                }
            }
            };
    
            var data = [trace1,trace2];
    
            var layout = {
            title: 'We need to fix the query for this'
            };
    


            Plotly.newPlot('position-bar', data, layout);

            

            
    

        });





        // HORIZONTAL BAR
        d3.json('/api/avg_points_by_season_position').then(data => {


            if(season) {
                data = data.filter(d => d['season'] == season);

                //NEED TO CHANGE THE SEASON VARIABKLE
            }

            season_dart = season; //TESTING ONLY

            season = data.map(d => d['season']); // WE OVERWRITE THE SEASON PARAMETER HERE AND WE SHOULD NOT
            position = data.map(d => d['position']);
            avg_fppg = data.map(d => d['avg_fppg']);
        
            var data = [
                {
                    x: avg_fppg,
                    y: position,
                    type: 'bar',
                    orientation: 'h'
                }
            ];

            positionBarChart = document.getElementById('points_by_pos');
            //positionBarChart = d3.select('position-bar');
            console.log(positionBarChart);

            Plotly.newPlot('points_by_pos', data);

            position = ''
            positionBarChart.on('plotly_click', function(data){
                console.log('clicked');
                
                position = data.points[0]['label'];

                // look at this tomorrow THIS IS ONLY AN EXAMPLE
                // :alert: WE NEED TO RETOOL ALL OF THIS
                // THIS WAS SLAPPED TO GETHER BECASUSE WE ARE TIIIIIIIIIIIIIIIIIIED
                d3.json('/api/combined_table').then(dart => {

                    console.log(position);
                    console.log(season_dart);

                    darty = dart.filter(d => (d['POS'] == position && d['SEASON'] == season_dart));

                    

                    tbody = d3.select('#stats-tbody');

                    tbody.html('');
                    //season
                    //team
                    //name
                    //ftps

                    darty.forEach(d => {
                        tr = tbody.append('tr');

                        Object.values(d).forEach(col => {
                            console.log(col)
                            tr.append('td').text(col);
                        })
                    });
                });
                


            });


            
        
        });



}

createCompare();

function optionChanged(season) {
    createCompare(season);
}




/* TOYING WITH IDEAS */
//







// function createCompare(season=null) {
//      /***************
//        * FILTERED GROUP BAR
//        */

//         // season: 2019,
//         // loser_above_avg_players: 6
//         // winner_above_avg_players: 5,

//         d3.json('/api/super_bowl_fantasy_player_avgs').then(data => {


//             // apply filter if a season value exists, otherwise leave it alone
//             if(season) {
//                 data = data.filter(d => d['season'] == season);
//             }


//             season = data.map(d => d['season']);
//             winner_above_avg_players = data.map(d => d['winner_above_avg_players']);
//             loser_above_avg_players = data.map(d => d['loser_above_avg_players']);
//             winning_team = data.map(d => d['winner']);
//             losing_team = data.map(d => d['loser']);
        
//             var xValue = season;

//             var yValue = winner_above_avg_players;
//             var yValue2 = loser_above_avg_players;
    
//             var trace1 = {
//             x: xValue,
//             y: yValue,
//             type: 'bar',
//             text: yValue.map(String),
//             textposition: 'auto',
//             hoverinfo: 'none',
//             opacity: 0.5,
//             marker: {
//                 color: 'rgb(158,202,225)',
//                 line: {
//                 color: 'rgb(8,48,107)',
//                 width: 1.5
//                 }
//             }
//             };
    
//             var trace2 = {
//             x: xValue,
//             y: yValue2,
//             type: 'bar',
//             text: yValue2.map(String),
//             textposition: 'auto',
//             hoverinfo: 'none',
//             marker: {
//                 color: 'rgba(58,200,225,.5)',
//                 line: {
//                 color: 'rgb(8,48,107)',
//                 width: 1.5
//                 }
//             }
//             };
    
//             var data = [trace1,trace2];
    
//             var layout = {
//             title: 'I am tired'
//             };
    
//             Plotly.newPlot('position-bar', data, layout);
    

//         });

// }

// createCompare();

// function optionChanged(season) {
//     createCompare(season);
// }