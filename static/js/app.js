d3.json('api/fantasy_stats').then(data => {

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