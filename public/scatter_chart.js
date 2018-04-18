d3.json("/dataScatter_test.json", function (error, arrData) {

	if (error) throw error;

	var view_width = $(".container").find('.nameScatterChart').width();
	var view_height = $(".container").find('.item').height() - 65;

	var margin = {
		top: 20,
		right: 30,
		bottom: 60,
		left: 50
	},
		width = view_width - margin.left - margin.right,
		height = view_height - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var r = d3.scale.linear()
		.range([7, 18]);
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.ticks(width / 225);

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(height / 75);

	function make_y_axis() {
		return d3.svg.axis()
			.scale(y)
			.orient("left")
			.ticks(height / 75)
	}

	function make_x_axis() {
		return d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.ticks(width / 225)
	}

	for (var _i = 0; _i < arrData.length; _i++) {
		var color = d3.scale.ordinal()
		.range(["#35978f", "#374649", "#fd625e","#f2c80f","#5f6b6d","#8ad4eb","#fe9666","#a66999","#3599b8","#dfbfbf","#4ac5bb","#5f6b6d","#fb8281"]);

		var data = arrData[_i].Data;

		x.domain([0, d3.max(data, function (d) {
			return make_rounding(d.ProductConcentration);
		})]);
		y.domain([0, d3.max(data, function (d) {
			return make_rounding(d.CustomerConcentration);
		})]);

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
		// r.domain(d3.extent(subset, function (d) {
		//     return d.TotalValue;
		// }));

		d3.select(".nameScatterChart." + arrData[_i].ID)
			.append("text")
			.text(arrData[_i].ID.capitalizeFirstLetter() == "Market" ? "Purchase Price and Quantity across Market" : "Purchase Price and Quantity in Your Organization")
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
			.attr("x",  width / 2 + 60)
			.attr("y", 33)
			.style("text-anchor", "end")
			.text("Purchase Quantity")
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
			.attr("x", -(height / 2 - 50))
			.attr("y", -45)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Purchase Price")
			.on("mousemove", function () {
				divTooltip.style("left", d3.event.pageX + 10 + "px");
				divTooltip.style("top", d3.event.pageY - 25 + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html("<div>" + this.textContent + "</div>");
			})
			.on("mouseout", function () {
				divTooltip.style("display", "none");
			});

		// svg.select('.x.axis')
		//     .attr("transform", "translate(0," + height + ")")
		//     .call(xAxis);

		// svg.select('.y.axis')
		//     .call(yAxis);

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
                    <div class='col-left'>Item Description</div>\
                    <div class='col-right'>" + d.Item_Description + "</div>\
                  </div>" +
					"<div class='row'>\
										<div class='col-left'>Manufacturer</div>\
										<div class='col-right'>" + d.Manufacturer + "</div>\
									</div>" +
					"<div class='row'>\
										<div class='col-left'>Manufacturer Item ID</div>\
										<div class='col-right'>" + d.Category + "</div>\
									</div>" +
					"<div class='row'>\
										<div class='col-left'>Last Purchase Price</div>\
										<div class='col-right'>" + d.Date + "</div>\
									</div>" +
					"<div class='row'>\
                    <div class='col-left'>Purchase Price ($)</div>\
                    <div class='col-right'>" + d.CustomerConcentration.toFixed(2) + "</div>\
                  </div>" +
					"<div class='row'>\
                    <div class='col-left'>Purchase Quantity</div>\
                    <div class='col-right'>" + d.ProductConcentration + "</div>\
									</div>" +
					(d.TotalValue > 0 ?
					"<div class='row'>\
                    <div class='col-left'>Cost Savings Opportunity ($)</div>\
                    <div class='col-right'>" + d.TotalValue.toFixed(2) + "</div>\
                  </div>" : "") +
					"</div>"
				);
			})
			.on("mouseout", function (d) {
				divTooltip.style("display", "none");
			});

		// Update the circles
		//r.range([height / 90, height / 35])

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
				return d.CustomerConcentration.toFixed(2);
			})
			.attr("font-size", "13px")


		var LegendHolder = d3.selectAll(".legendScatterChart." + arrData[_i].ID)
			.attr("class", "legendHolder");
		var legend = LegendHolder.selectAll(".legend")
			.data(dataLegend)
			.enter().append("div")
			.attr("class", function (d, i) {
				return "legend scatter_" + arrData[_i].ID + "_" + i;
			})
			.on("mousemove", function (d) {
				divTooltip.style("left", d3.event.pageX + 10 + "px");
				divTooltip.style("top", d3.event.pageY - 25 + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html("<div>" + d + "</div>");
			})
			.on("mouseout", function (d) {
				divTooltip.style("display", "none");
			})
			// .each(function (d, i) {
			// 	//  Legend Symbols
			// 	var circle = d3.select(this).append("svg")
			// 		.style("width", "20")
			// 		.style("height", "20");
			// 	circle.append("circle")
			// 		.attr("cx", 7)
			// 		.attr("cy", 10)
			// 		.attr("r", 7)
			// 		.style("fill", function (b) {
			// 			return color(d)
			// 		});
			// 	//  Legend Text
			// 	d3.select(this).append("div")
			// 		.attr("class", "textLegend")
			// 		.text(d);
			// });

			for (var j=0;j<dataLegend.length;j++){
				// var _data = Categories.map(function (d) {
				// 	return {
				// 		"Name": d.Name,
				// 		"Type": d.Type,
				// 	}
				// });
				$(".legend.scatter_" + arrData[_i].ID + "_" + j).append("<svg style=\"width: 20px; height: 20px;\"><circle cx=\"7\" cy=\"10\" r=\"7\" style=\"fill: " + color(dataLegend[j]) + ";\"></circle></svg><div class=\"textLegend\">" + dataLegend[j] + "</div>")
					// .style("width", "20")
					// .style("height", "20")
					// .each(function(){

					// })
					// .append("circle")
					// .attr("cx", 7)
					// .attr("cy", 10)
					// .attr("r", 7)
					// .style("fill", function () {
					// 	var _color = Categories[j].Type == 'bar' ? color(Categories[j].Name) : LineColor(Categories[j].Name);
					// 	return _color;
					// });

			}

	}
});
// Back delete duplicate
$(window).ready(function () {
	var obj_legendHolder = $(".legendHolder");
	obj_legendHolder.each(function () {
		var item = $(this).find('.legend');
		var _w = 0;
		item.each(function () {
			_w += $(this).width() + 5;
		})
		$(this).css("width", _w + "px")
		if (_w <= $(this).parent().width()) {
			$(this).parent().parent().find(".next, .prev").css("opacity", "0");
		}
	});
});