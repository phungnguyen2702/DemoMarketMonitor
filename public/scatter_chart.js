d3.json("/dataScatter.json", function (error, data) {
console.log(data);
    if (error) throw error;

    var margin = {
        top: 40,
        right: 40,
        bottom: 40,
        left: 50
    },
    width = 960 - margin.left - margin.right,
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
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var dollarFormatter = d3.format(",.0f");

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10)
    }

    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(10)
    }

    var svg = d3.select(".scatterChart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "wrap_chart")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.selectAll("div .nameScatterChart")
        .append("text")
        .text("Purchase Price and Quantity in Your Organization")
        .on("mousemove", function () {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            divTooltip.html("<div>"+ this.textContent +"</div>");
        })
        .on("mouseout", function () {
            divTooltip.style("display", "none");
        });

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
  
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", width/2 + 30)
        .attr("y", 33)
        .style("text-anchor", "end")
        .text("Product Concentration")
        .on("mousemove", function () {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            divTooltip.html("<div>"+ this.textContent +"</div>");
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
        .attr("x", -height/3)
        .attr("y", -45)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Customer Concentration")
        .on("mousemove", function () {
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
            divTooltip.style("display", "inline-block");
            divTooltip.html("<div>"+ this.textContent +"</div>");
        })
        .on("mouseout", function () {
            divTooltip.style("display", "none");
        });

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
            divTooltip.style("left", d3.event.pageX + 10 + "px");
            divTooltip.style("top", d3.event.pageY - 25 + "px");
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



    var textbar = svg.append("g")
        .attr("class", "group-textbar");

    textbar.selectAll(".group-textbar")
        .data(subset)
        .enter()
        .append("rect")
        .attr("class", "labelTextBar")
        .attr("rx",4)
        .attr("ry",4)
        .attr("x", function (d) {
            return x(d.ProductConcentration)+8;
        })
        .attr("y",  function (d) {
            return y(d.CustomerConcentration)-12;
        })
        .attr("width",35)
        .attr("height",15);

    textbar.selectAll(".group-textbar")
        .data(subset)
        .enter()
        .append("text")
        .attr("class","textbar")
        .attr("x", function (d) {
            return x(d.ProductConcentration)+9;
        })
        .attr("y", function (d) {
            return y(d.CustomerConcentration);
        })
        .text(function (d) {
            return d.TotalValue + " ";
        })
        .attr("font-size", "13px")


    var textWidthHolder = 0;
    var LegendHolder = svg.append("g").attr("class", "legendHolder");
    var legend = LegendHolder.selectAll(".legend")
        .data(dataLegend)
        .enter().append("g")
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
        .attr("transform", function (d, i) {
            return "translate(0," + (-20) + ")";
        })
        .each(function (d, i) {
            //  Legend Symbols
            d3.select(this).append("circle")
                .attr("width", function () {
                  return 18
                })
                .attr("cx", function (b) {
                    left = (i + 1) * 15 + i * 18 + i * 55 + 10;
                    if (i == 2)
                        left += 10;
                    return left;
                })
                .attr("cy", 9)
                .attr("r", 7)
                .style("fill", function (b) {
                    return color(d)
                });
            //  Legend Text
            d3.select(this).append("text")
                .attr("x", function (b) {
                    left = (i + 1) * 15 + (i + 1) * 18 + (i + 1) * 5 + textWidthHolder;
                    return left;
                })
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(d);
            textWidthHolder += getTextWidth(d, "10px", "Segoe UI");
        });

    // Legend Placing
    d3.selectAll(".legendHolder").attr("transform", function (d) {
      thisWidth = d3.select(this).node().getBBox().width;
      return "translate(" + ((width) / 2 - thisWidth / 2) + ",0)";
    })


    function resize() {
        // Update the range of the scale with new width/height
        x.range([0, width]);
        y.range([height, 0]);

        // Update the axis and text with the new scale
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
        // Update the tick marks
        xAxis.ticks(height / 75);
        yAxis.ticks(height / 75);

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
    }

    d3.select(window).on('resize', resize);
    resize();
});