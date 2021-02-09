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

    // data.slice(0, 20).map(object => {
    //     var year = object.Year
    //     years.push(year)
    //     var SBwinner = object.Winner
    //     console.log(SBwinner)
    //     var SBloser = object.Loser
    //     console.log(SBloser)
    //     var MVP = object.MVP
    //     console.log(MVP)
    //     var city = object.City
    //     console.log(city)
    //     var state = object.State
    //     console.log(state)
    // });

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


d3.json('/api/super_bowl_fantasy_player_avgs').then(data => {

    season = data.map(d => d['season']);
    winner_above_avg_players = data.map(d => d['winner_above_avg_players']);
    loser_above_avg_players = data.map(d => d['loser_above_avg_players']);
    winning_team = data.map(d => d['winner']);
    losing_team = data.map(d => d['loser']);


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


function createCompare(season=null) {
     /***************
       * FILTERED GROUP BAR
       */

        // season: 2019,
        // loser_above_avg_players: 6
        // winner_above_avg_players: 5,

        d3.json('/api/super_bowl_fantasy_player_avgs').then(data => {


            // apply filter if a season value exists, otherwise leave it alone
            if(season) {
                data = data.filter(d => d['season'] == season);
            }


            season = data.map(d => d['season']);
            winner_above_avg_players = data.map(d => d['winner_above_avg_players']);
            loser_above_avg_players = data.map(d => d['loser_above_avg_players']);
            winning_team = data.map(d => d['winner']);
            losing_team = data.map(d => d['loser']);
        
            var xValue = season;

            var yValue = winner_above_avg_players;
            var yValue2 = loser_above_avg_players;
    
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
            title: 'I am tired'
            };
    
            Plotly.newPlot('position-bar', data, layout);
    

        });

}

createCompare();

function optionChanged(season) {
    createCompare(season);
}

