d3.json("/dataScatter.json", function (error, arrData) {

    if (error) throw error;

    var view_width = $(".container").find('.nameScatterChart').width();

    var margin = {
            top: 10,
            right: 40,
            bottom: 40,
            left: 50
        },
        width = view_width - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([-1, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var r = d3.scale.linear()
        .range([7, 18]);

    var color = d3.scale.ordinal()
        .range(["#35978f", "#374649", "#fd625e"]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(height / 75);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(height / 75);

    var dollarFormatter = d3.format(",.0f");

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
    }

    for (var _i = 0; _i < arrData.length; _i++) {
        var data = arrData[_i].Data;

        var svg = d3.select(".scatterChart#scatter" + arrData[_i].ID)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("class", "wrap_chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var subset = data.filter(function (el) {
            return el.Metric === "Quantity"
        });

        var dataLegend = d3.map(data, function (d) {
            return d.Category;
        }).keys();

        subset.forEach(function (d) {
            d.ProductConcentration = +d.ProductConcentration;
            d.CustomerConcentration = +d.CustomerConcentration;
            d.TotalValue = +d.TotalValue;
        });

        x.domain([0, 1]);
        y.domain([0, 1]);
        r.domain(d3.extent(subset, function (d) {
            return d.TotalValue;
        }));

        d3.select(".nameScatterChart." + arrData[_i].ID)
            .append("text")
            .text("Purchase Price and Quantity in Your " + arrData[_i].ID.capitalizeFirstLetter())
            .on("mousemove", function () {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + this.textContent + "</div>");
            })
            .on("mouseout", function () {
                divTooltip.style("display", "none");
            });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "axisLabel")
            .attr("x", width / 2 + 30)
            .attr("y", 33)
            .style("text-anchor", "end")
            .text("Product Concentration")
            .on("mousemove", function () {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + this.textContent + "</div>");
            })
            .on("mouseout", function () {
                divTooltip.style("display", "none");
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 3)
            .attr("y", -45)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Customer Concentration")
            .on("mousemove", function () {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + this.textContent + "</div>");
            })
            .on("mouseout", function () {
                divTooltip.style("display", "none");
            });



        svg.select('.x.axis')
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.select('.x.axis').select('.label')
            .attr("x", width);

        svg.select('.y.axis')
            .call(yAxis);

        svg.append("g")
            .attr("class", "grid grid-y")
            .call(make_y_axis()
                .tickSize(-width, 0, 0)
                .tickFormat("")
            )
        svg.append("g")
            .attr("class", "grid grid-x")
            .call(make_x_axis()
                .tickSize(height, 0, 0)
                .tickFormat("")
            )

        // Hover Text y axis
        svg.selectAll(".y.axis .tick text")
            .on("mousemove", function () {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + this.textContent + "</div>");
            })
            .on("mouseout", function () {
                divTooltip.style("display", "none");
            });

        // Hover Text y axis
        svg.selectAll(".x.axis .tick text")
            .on("mousemove", function () {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + this.textContent + "</div>");
            })
            .on("mouseout", function () {
                divTooltip.style("display", "none");
            });

        var dot = svg.append("g")
            .attr("class", "dot");

        dot.selectAll(".dot")
            .data(subset)
            .enter()
            .append("circle")
            .attr("r", 7)
            .attr("cx", function (d) {
                return x(d.ProductConcentration);
            })
            .attr("cy", function (d) {
                return y(d.CustomerConcentration);
            })
            .style("fill", function (d) {
                return color(d.Category);
            })
            .on("mousemove", function (d) {
                /*divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");*/

                divTooltip.style("top", d3.event.pageY - 20 + "px");
                var posTooltip = d3.event.pageX + 10;
                divTooltip.attr("class", "toolTip");

                if ($('.scatterChart#' + $(this).parents(".scatterChart")[0].id).width() - 250 < d3.event.offsetX) {
                    posTooltip = d3.event.pageX - $('.toolTip').width() - 20;
                    divTooltip.attr("class", "toolTip left");
                }
                divTooltip.style("left", posTooltip + "px");
                divTooltip.style("display", "inline-block");

                divTooltip.html(
                    "<div class='arrow'></div>" +
                    "<div class='wrap'>" +
                    "<div class='row'>\
                    <div class='col-left'>Category:</div>\
                    <div class='col-right'>" + d.Category + "</div>\
                  </div>" +
                    "<div class='row'>\
                    <div class='col-left'>Sub-Category:</div>\
                    <div class='col-right'>" + d.SubCategory + "</div>\
                  </div>" +
                    "<div class='row'>\
                    <div class='col-left'>Total Cost:</div>\
                    <div class='col-right'>" + dollarFormatter(d.TotalValue) + "</div>\
                  </div>" +
                    "</div>"
                );
            })
            .on("mouseout", function (d) {
                divTooltip.style("display", "none");
            });

        // Update the circles
        r.range([height / 90, height / 35])

        dot.selectAll('.dot')
            .attr("r", 7)
            .attr("cx", function (d) {
                return x(d.ProductConcentration);
            })
            .attr("cy", function (d) {
                return y(d.CustomerConcentration);
            })

        var textbar = svg.append("g")
            .attr("class", "group-textbar");

        textbar.selectAll(".group-textbar")
            .data(subset)
            .enter()
            .append("rect")
            .attr("class", "labelTextBar")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("x", function (d) {
                return x(d.ProductConcentration) + 8;
            })
            .attr("y", function (d) {
                return y(d.CustomerConcentration) - 12;
            })
            .attr("width", 35)
            .attr("height", 15);

        textbar.selectAll(".group-textbar")
            .data(subset)
            .enter()
            .append("text")
            .attr("class", "textbar")
            .attr("x", function (d) {
                return x(d.ProductConcentration) + 9;
            })
            .attr("y", function (d) {
                return y(d.CustomerConcentration);
            })
            .text(function (d) {
                return d.TotalValue + " ";
            })
            .attr("font-size", "13px")


        var LegendHolder = d3.selectAll(".legendScatterChart." + arrData[_i].ID)
            .attr("class", "legendHolder");
        var legend = LegendHolder.selectAll(".legend")
            .data(dataLegend)
            .enter().append("div")
            .attr("class", "legend")
            .on("mousemove", function (d) {
                divTooltip.style("left", d3.event.pageX + 10 + "px");
                divTooltip.style("top", d3.event.pageY - 25 + "px");
                divTooltip.style("display", "inline-block");
                divTooltip.html("<div>" + d + "</div>");
            })
            .on("mouseout", function (d) {
                divTooltip.style("display", "none");
            })
            .each(function (d, i) {
                //  Legend Symbols
                var circle = d3.select(this).append("svg")
                    .style("width", "20")
                    .style("height", "20");
                circle.append("circle")
                    .attr("cx", 7)
                    .attr("cy", 10)
                    .attr("r", 7)
                    .style("fill", function (b) {
                        return color(d)
                    });
                //  Legend Text
                d3.select(this).append("div")
                    .attr("class", "textLegend")
                    .text(d);
            });

    }
});