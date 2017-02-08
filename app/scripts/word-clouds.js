//Width and height - controls how much space we'll let the chart have
var sortDir = false;

/*var w = 500;
var h = 300;*/


var dataset = [
	{ 'name': 'My Skills', 'rank': 10 },
	{ 'name': 'JavaScript', 'rank': 6 },
	{ 'name': 'PHP', 'rank': 4 },
	{ 'name': 'WordPress', 'rank': 7 },
	{ 'name': 'CSS', 'rank': 9 },
	{ 'name': 'MailChimp', 'rank': 2 },
	{ 'name': 'jQuery', 'rank': 4 },
	{ 'name': 'MySQL', 'rank': 7 },
	{ 'name': 'D3', 'rank': 1 },
	{ 'name': 'HTML5', 'rank': 10 },
	{ 'name': 'ActionScript', 'rank': 6 },
	{ 'name': 'Git', 'rank': 2 },
	{ 'name': 'Photoshop', 'rank': 8 }
];


//creates a scale suitable for something with ordinal (ordered) value
// var xScale = d3.scale.ordinal()
// 				//creates a space for each piece of data as a bar
// 				.domain(d3.range(dataset.length))
// 				//divides the available width  by the number of bars, leaving space between for margins
// 				.rangeRoundBands([0, w], 0.1);
// var yScale = d3.scale.linear()
// 				//set the height range through the highest value in the dataset
// 				.domain([0, 10])
// 				.range([0, h]);

//Create SVG element
/*var svg = d3.select("body")
			.append("svg")
			.attr("height", h);*/


d3.select('#sky-container')
   .selectAll('div')
   .data(dataset)
   .enter()
   .append('div')
   .attr('class', function(d) {
   		
   		if(d.rank == 1 || d.rank == 2){
   			return 'x5';
   		}
   		else if(d.rank == 3 || d.rank == 4){
   			return 'x4';
   		}
   		else if(d.rank == 5 || d.rank == 6){
   			return 'x3';
   		}
   		else if(d.rank == 7 || d.rank == 8){
   			return 'x2';
   		}
   		else{
   			return 'x1';
   		}

   })
   .style('top', function(d, i) {
   		return i*50 + 'px';
   })
   .style('animation-duration', function(d, i) {

   		var duration = d3.select(this).style('animation-duration');

   		var duration_num = duration.substr(0, duration.length-1);

   		var duration_new = Number(duration_num) + (i/2);

   		return duration_new + 's';

   })
   .append('div')
   .attr('class', 'cloud')
   .append('h3')
   .style('font-size', function(d) {

   		var name = d.name
   		var length = name.length;

   		return ( d.rank/2 + 5/d.rank - length/10 ) + 'em';
   })
   .html(function(d) {
   		return d.name;
   });