/**
   This code snippet refers this: https://bl.ocks.org/alandunning/4c36eb1abdb248de34c64f5672afd857
   But we have already get rid of the needless code, and did some refactory. 
 */


var RadarChart = {
    draw: function(id, d, options, indications) {
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: 0.85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 120,
            TranslateY: 50,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: d3.scaleOrdinal().range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099"])
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }

        //cfg.maxValue = 100;

        var allAxis = (d[0].map(function(i, j) {
            return i.area;
        }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('%');
        d3.select(id).select("svg").remove();

        var g = d3.select(id)
            .append("svg")
            .attr("width", cfg.w + cfg.ExtraWidthX)
            .attr("height", cfg.h + cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," +
                cfg.TranslateY + ")");


        // Circular segments
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1",
                    function(d, i) {
                        return levelFactor *
                            (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                    })
                .attr("y1", function(d, i) {
                        return levelFactor *
                            (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                    })
                .attr("x2",
                    function(d, i) {
                        return levelFactor *
                            (1 -
                                cfg.factor * Math.sin((i + 1) * cfg.radians / total));
                    })
                .attr("y2",
                    function(d, i) {
                        return levelFactor *
                            (1 -
                                cfg.factor * Math.cos((i + 1) * cfg.radians / total));
                    })
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " +
                    (cfg.h / 2 - levelFactor) + ")");
        }

        // Text indicating at what % each level is
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) // dummy data
                .enter()
                .append("svg:text")
                .attr("x",
                    function(d) {
                        return levelFactor * (1 - cfg.factor * Math.sin(0));
                    })
                .attr("y",
                    function(d) {
                        return levelFactor * (1 - cfg.factor * Math.cos(0));
                    })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "11px")
                .attr("transform", "translate(" +
                    (cfg.w / 2 - levelFactor + cfg.ToRight) +
                    ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text((j + 1) * cfg.maxValue / cfg.levels);
        }

        series = 0;

        var axis = g.selectAll(".axis").data(allAxis).enter().append("g").attr(
            "class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2",
                function(d, i) {
                    return cfg.w / 2 *
                        (1 - cfg.factor * Math.sin(i * cfg.radians / total));
                })
            .attr("y2",
                function(d, i) {
                    return cfg.h / 2 *
                        (1 - cfg.factor * Math.cos(i * cfg.radians / total));
                })
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function(d) {
                return d;
            })
            .style("font-family", "sans-serif")
            .style("font-size", "11pt")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i) {
                return "translate(0, -10)";
            })
            .attr("x",
                function(d, i) {
                    return cfg.w / 2 * (1 -
                            cfg.factorLegend *
                            Math.sin(i * cfg.radians / total)) -
                        60 * Math.sin(i * cfg.radians / total);
                })
            .attr("y", function(d, i) {
                return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) -
                    20 * Math.cos(i * cfg.radians / total);
            });

        d.forEach(function(y, x) {
            dataValues = [];
            g.selectAll(".nodes").data(y, function(j, i) {
                dataValues.push([
                    cfg.w / 2 * (1 -
                        (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                        cfg.factor * Math.sin(i * cfg.radians / total)),
                    cfg.h / 2 * (1 -
                        (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                        cfg.factor * Math.cos(i * cfg.radians / total))
                ]);
            });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",
                    function(d) {
                        var str = "";
                        for (var pti = 0; pti < d.length; pti++) {
                            str = str + d[pti][0] + "," + d[pti][1] + " ";
                        }
                        return str;
                    })
                .style("fill", function(j, i) {
                    return cfg.color(series);
                })
                .style("fill-opacity", cfg.opacityArea);

            var indicatorW = 50;
            var indicatorH = 20;
            g.append('rect')
                .attr("class", "indicator")
                .attr("x", function(d){
                    return 10;
                })
                .attr("y", function(d){
                    return 10 + series*(indicatorH+5);
                })
                .attr("width", indicatorW)
                .attr("height", indicatorH)
                .style("fill", function(j, i){
                    return cfg.color(series);
                })
                .style("fill-opacity", cfg.opacityArea);
            g.append("text")
                .attr("x", 10)
                .attr("y", function(d){
                    return 24 + series * (indicatorH+5);
                })
                .style("font-size", "11pt")
                .text(indications[series]);
            series++;
        });

    }
};
