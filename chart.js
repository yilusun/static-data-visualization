

// draw bar chart
// can be dropped
(function(){

var svg1 = d3.select("#svg1");
var svg1Width = 800;
var svg1height = 400;
var xScale = d3.scaleBand().rangeRound([0, svg1Width - 100]).padding(0.1);
var yScale = d3.scaleLinear().rangeRound([svg1height, 0]);

d3.json("desc.json", function(data) {
    console.log(data);
    xScale.domain(data);
    var axisBottom = d3.axisBottom(xScale);
    svg1.append('g')
        .attr("class", "x axis")
        .call(axisBottom)
        .attr("transform", "translate(80, 400)")
        .selectAll("text")
        .style("text-anchor", "end")
        .style("font-size", "10pt")
        .attr("transform", "rotate(-45)");

    d3.json("data2.json", function(data) {
        var firstRow = data[0]["sub"][0]["data"];
        yScale.domain(
            [0, d3.max(firstRow, function(d) {
                return parseFloat(d.hours);
            })]);

        function parseHours(h) {
            var hours = parseFloat(h.hours);
            return yScale(hours);
        }
        svg1.selectAll(".bar")
            .data(firstRow)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) {
                return xScale(d.desc);
            })
            .attr("y", parseHours)
            .attr("width", xScale.bandwidth())
            .attr("height",
                function(d) {
                    return svg1height - yScale(parseFloat(d.hours));
                })
            .attr("transform", "translate(80, 0)");

    });

});

})();



// draw bubble chart
(function() {
    var diameter = 960,
        color = d3.scaleOrdinal(d3.schemeCategory20c);

    var svg = d3.select("#bubble-chart-container")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("class", "bubble");

    var bubble = d3.pack().size([diameter, diameter]).padding(1.5);

    d3.json("data2.json", function(error, data) {
        if (error)
            throw error;
        var data = data[0]["sub"][0]["data"];
        console.log(data);
        var root = d3.hierarchy({
                children: data
            })
            .sum(function(d) {
                return d.hours;
            })
            .sort(function(a, b) {
                return b.hours - a.hours;
            });
        bubble(root);

        var node = svg.selectAll(".node")
            .data(root.children)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("circle").attr("r", function(d) {
            return d.r;
        }).style("fill", function(d) {
            return color(d.data.desc);
        });
        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .style("font-size",
                function(d) {
                    console.log(d);
                    console.log(d.data.desc.length);
                    return Math.min(2 * d.r,
                            (2 * d.r - 8) / d.data.desc.length * 2.2) +
                        "px";
                })
            .text(function(d) {
                return d.data.desc;
            });

    });

})();

// draw radar chart
// focusing on the difference between men and women.
// 
(function(){

    d3.json("data2.json", function(err, data){
        // if (err){
        //     throw err;
        // }

        // var men = data[0]["sub"][1]["data"];
        // var women = data[0]["sub"][2]["data"];
        // var relativePercent = [];
        // var scaledDataMen = [];
        // var scaledDataWomen = [];
        
        // for(var i=0; i < men.length; i++){
        //     var vMen = parseFloat(men[i].hours);
        //     var vWomen = parseFloat(women[i].hours);
        //     if (vMen >= vWomen){
        //         vWomen = (vWomen / vMen) * 100;
        //         vMen = 1 * 100;
        //     }
        //     else{
        //         vMen = (vMen / vWomen) * 100;
        //         vWomen = 100;
        //     }
        //     scaledDataMen.push({"area": men[i].desc, "value": vMen});
        //     scaledDataWomen.push({"area": women[i].desc, "value": vWomen});
        // }
        // console.log(scaledDataWomen);
        // console.log(scaledDataMen);

        // drawing
        var height = 700;
        var width = 700;
        var config = {
            w: width,
            h: height,
            maxValue: 10,
            levels: 5,
            ExtraWidthX: 300
        };
        surveyData = [
            [
                {"area": "Sleeping", "value": 8.8},
                {"area": "Leisure and sports", "value": 4.0},
                {"area": "Educational activities", "value": 3.5},
                {"area": "Working and related activities", "value": 2.3},
                {"area": "Other", "value": 2.2},
                {"area": "Traveling", "value": 1.4},
                {"area": "Eating and drinking", "value": 1.0},
                {"area": "Grooming", "value": 0.8}
            ],
            // [
            //     {"area": "Sleeping", "value": 7.5},
            //     {"area": "Leisure and sports", "value": 2.0},
            //     {"area": "Educational activities", "value": 5.0},
            //     {"area": "Working and related activities", "value": 3},
            //     {"area": "Other", "value": 1},
            //     {"area": "Traveling", "value": 3},
            //     {"area": "Eating and drinking", "value": 1.5},
            //     {"area": "Grooming", "value": 1}
            // ],
            [
                {"area": "Sleeping", "value": 7},
                {"area": "Leisure and sports", "value": 1.5},
                {"area": "Educational activities", "value": 8.5},
                {"area": "Working and related activities", "value": 2},
                {"area": "Other", "value": 2},
                {"area": "Traveling", "value": 2},
                {"area": "Eating and drinking", "value": 3.5},
                {"area": "Grooming", "value": 1}
            ]
        ];


        RadarChart.draw("#radar-chart-container", surveyData, config, ["Avg", "Team"]);

    });

})();

// stacked area chart

(function(){
    var width = 1200,
        height = 600;
    var svg = d3.select("#stacked-area-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
   
    var  margin = {
            top: 20,
            right: 330,
            bottom: 30,
            left: 50
        },
        width = svg.attr("width") - margin.left - margin.right,
        height = svg.attr("height") - margin.top - margin.bottom;

    var parseTime = d3.timeParse("%I %p");

    var x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]),
        color = d3.scaleOrdinal().range(['#394694', 
            '#EC889a','#e25220','#95ECD7','#FBC52a','#ef6998','#FFF44B',
            '#a3d749','#4eb7d9','#ffdaf4','#EE3769','#9F8BE5']);

    var stack = d3.stack();

    var area = d3.area()
        .x(function(d, i) {
            return x(d.data.time);
        })
        .y0(function(d) {
            return y(d[0]);
        })
        .y1(function(d) {
            return y(d[1]);
        });

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data4.tsv", type, function(error, data) {
        if (error) throw error;

        console.log(data);
        var keys = data.columns.slice(1);

        x.domain([parseTime("12 AM"), parseTime("11 PM")]);
        color.domain(keys);
        stack.keys(keys);

        var layer = g.selectAll(".layer")
            .data(stack(data))
            .enter().append("g")
            .attr("class", "layer");

        layer.append("path")
            .attr("class", "area")
            .style("fill", function(d) {
                return color(d.key);
            })
            .attr("d", area);

        g.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(24).tickFormat(d3.timeFormat("%I %p")));

        g.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(y).ticks(10, "%"));

        var rectH = 20;
        var rectW = 50;
        for (var i=0; i < keys.length; i++){
            var indicator = g.append("g");
            indicator.append("rect")
                .attr("x", width + 20)
                .attr("y", function(d){
                    return margin.top + i * (rectH + 5);
                })
                .attr("width", rectW)
                .attr("height", rectH)
                .style("fill", function(){
                    return color(keys[i]);
                });

            indicator.append("text")
                .text(keys[i])
                .attr("x", width + 20 + rectW + 3)
                .attr("y", function(d){
                    return margin.top + i * (rectH + 5) + 10;
                })
                .attr("dy", "0.35em" )
                .style("font-size", "10pt");

        }

    });

    function type(d, i, columns) {
        d.time = parseTime(d.time);
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
        return d;
    }




})();


