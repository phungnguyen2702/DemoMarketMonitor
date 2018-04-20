function getTextWidth(text, fontSize, fontName) {
	c = document.createElement("canvas");
	ctx = c.getContext("2d");
	ctx.font = fontSize + ' ' + fontName;
	return ctx.measureText(text).width;
}

function scrollNext(_t) {
	var $_this = $(_t).prev();
	$_this.animate({
		scrollLeft: $_this.offset().left - $_this.find('.legendHolder').offset().left + 50
	}, 200, function () {
		if ($_this.find('.legendHolder').offset().left + $_this.find('.legendHolder').width() <= $_this.offset().left + $_this.width() - 14)
			$(_t).parent().find('.next').css("opacity", "0");
		else
			$(_t).parent().find('.next').css("opacity", "1");
		if ($_this.offset().left - $_this.find('.legendHolder').offset().left == 0)
			$(_t).parent().find('.prev').css("opacity", "0");
		else
			$(_t).parent().find('.prev').css("opacity", "1");
	});
}

function scrollPrev(_t) {
	var $_this = $(_t).next();
	$_this.animate({
		scrollLeft: $_this.offset().left - $_this.find('.legendHolder').offset().left - 50
	}, 200, function () {
		if ($_this.find('.legendHolder').offset().left + $_this.find('.legendHolder').width() <= $_this.offset().left + $_this.width() - 14)
			$(_t).parent().find('.next').css("opacity", "0");
		else
			$(_t).parent().find('.next').css("opacity", "1");
		if ($_this.offset().left - $_this.find('.legendHolder').offset().left == 0)
			$(_t).parent().find('.prev').css("opacity", "0");
		else
			$(_t).parent().find('.prev').css("opacity", "1");
	});
}

function DataSegregator(array, on) {
	var SegData;
	OrdinalPositionHolder = {
		valueOf: function () {
			thisObject = this;
			keys = Object.keys(thisObject);
			keys.splice(keys.indexOf("valueOf"), 1);
			keys.splice(keys.indexOf("keys"), 1);
			return keys.length == 0 ? -1 : d3.max(keys, function (d) {
				return thisObject[d];
			})
		},
		keys: function () {
			keys = Object.keys(thisObject);
			keys.splice(keys.indexOf("valueOf"), 1);
			keys.splice(keys.indexOf("keys"), 1);
			return keys;
		}
	}
	array[0].map(function (d) {
		return d[on]
	}).forEach(function (b) {
		value = OrdinalPositionHolder.valueOf();
		OrdinalPositionHolder[b] = OrdinalPositionHolder > -1 ? ++value : 0;
	})

	SegData = OrdinalPositionHolder.keys().map(function () {
		return [];
	});

	array.forEach(function (d) {
		d.forEach(function (b) {
			SegData[OrdinalPositionHolder[b[on]]].push(b);
		})
	});

	return SegData;
}

// Upercase first letter
String.prototype.capitalizeFirstLetter = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

// 
function kFormatter(num) {
	return num > 999 ? (num / 1000).toFixed(1) + 'k' : num
}


function make_rounding(number) {
	if (Math.floor(number / 100) % 2 != 0) {
		return (Math.floor(number / 100) + 1) * 100;
	}
	return (Math.floor(number / 100) + 2) * 100;
}
// Tooltip

var divTooltip = d3.select("body")
	.append("div")
	.attr("class", "toolTip");

function html_tooltip_barchart(_d) {
	return "<div class='arrow'></div>" +
		"<div class='wrap'>" +
		"<div class='row'>\
				<div class='col-left'>Item Description</div>\
				<div class='col-right'>" + _d.Item + "</div>\
		  </div>" +
		"<div class='row'>\
				<div class='col-left'>Manufacturer</div>\
				<div class='col-right'>" + _d.Manufacturer + "</div>\
		  </div>" +
		"<div class='row'>\
				<div class='col-left'>Manufacturer Item ID</div>\
				<div class='col-right'>" + _d.IDManufacturer + "</div>\
		  </div>" +
		"<div class='row'>\
			  <div class='col-left'>Min Price ($)</div>\
			  <div class='col-right'>" + _d.Min_price.toFixed(2) + "</div>\
		  </div>" +
		"<div class='row'>\
			  <div class='col-left'>Max Price ($)</div>\
			  <div class='col-right'>" + _d.Max_price.toFixed(2) + "</div>\
		  </div>" +
		"<div class='row'>\
			  <div class='col-left'>Benchmark Price ($)</div>\
			  <div class='col-right'>" + _d.Benchmark_price.toFixed(2) + "</div>\
		  </div>" +
		"</div>";
}
d3.json("/dataGroup.json").then(function (arrData) {
	var view_width = $(".container").find('.nameChart').width();
	var view_height = $(".container").find('.item').height() - 65;
	// Config View SVG
	var margin = {
		top: 20,
		right: 30,
		bottom: 60,
		left: 50
	},
		width = view_width - margin.left - margin.right,
		height = view_height - margin.top - margin.bottom;

	// Extension method declaration


	var x0 = d3.scaleBand()
		.rangeRound([0, width])
		.padding(0.1);

	var x1 = d3.scaleOrdinal();

	var x = d3.scaleLinear()
		.range([0, width]);

	var r = d3.scaleLinear()
		.range([7, 18]);

	var y = d3.scaleLinear()
		.range([height, 0]);

	var color = d3.scaleOrdinal()
		.range(["#01b8aa", "#374649", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

	var line = d3.line()
		.x(function (d) {
			d.line_posX = x0(d.IDManufacturer) + x0.bandwidth() / 2;
			return d.line_posX;
		})
		.y(function (d) {
			d.line_posY = y(d.Benchmark_price);
			return d.line_posY;
		})

	var xAxis = d3.axisBottom(x0)

	var yAxis = d3.axisLeft(y)
		.ticks(height / 75);

	var xAxis_sct = d3.axisBottom(x)
		.ticks(width / 225);

	function make_y_axis() {
		return d3.axisLeft(y)
			.ticks(height / 75);
	}

	function make_x_axis() {
		return d3.axisBottom(x)
			.ticks(width / 225)
	}

	function getIndex(arr, currX) {
		var index = -1;
		arr.forEach(function (item) {
			if (item.line_posX <= currX) {
				index++;
			}
		});
		return index;
	}

	for (var _i = 0; _i < arrData.length; _i++) {

		var Data = arrData[_i].Data;

		x0.domain(Data.map(function (d) {
			return d.IDManufacturer;
		}));

		x1 = d3.scaleBand()
			.range([0, x0.bandwidth()]);

		y.domain([0, make_rounding(d3.max(Data, function (d) {
			return d.Max_price;
		}))]);

		// Start Draw Barchar and line

		var svg = d3.select(".barchart#" + arrData[_i].ID)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("class", "wrap_chart")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.selectAll("div .nameBarChart." + arrData[_i].ID)
			.append("text")
			.text(arrData[_i].ID.capitalizeFirstLetter() == "Market" ? "Max, Min and Benchmark Prices across Market" : "Max, Min and Benchmark Prices in Your Organization")
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
			.data(Data)
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
			.attr("class", "axisLabel")
			.attr("x", width / 2 + 40)
			.attr("y", 33)
			.style("text-anchor", "end")
			.text("Mfr. Item ID")
			//Hover text
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
			.attr("class", "grid")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			)

		// Generate y axis

		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", -45)
			.attr("x", -5)
			.attr("class", "axisLabel")
			.attr("dy", ".71em")
			.attr("dx", "-" + (height / 2 - 80) + "px")
			.text("Min Price and Max Price")
			.on("mousemove", function () {
				divTooltip.style("left", d3.event.pageX + 10 + "px");
				divTooltip.style("top", d3.event.pageY - 25 + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html("<div>" + this.textContent + "</div>");
			})
			.on("mouseout", function () {
				divTooltip.style("display", "none");
			});

		// Hover Text axis
		svg.selectAll(".axis .tick text")
			.on("mousemove", function () {
				divTooltip.style("left", d3.event.pageX + 10 + "px");
				divTooltip.style("top", d3.event.pageY - 25 + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html("<div>" + this.textContent + "</div>");
			})
			.on("mouseout", function () {
				divTooltip.style("display", "none");
			});

		// Start Draw

		svg.append("g")
			.attr("class", "group-min-bar")
			.selectAll("rect.min_bar")
			.data(Data)
			.enter()
			.append("rect")
			.attr("class", "opacity bar min_bar")
			.style("fill", color("Min_price"))
			.attr("data-ctype", "Min Price")
			.attr("x", x1("Min_price"))
			.attr("width", x1.bandwidth() / 2)
			.attr("transform", function (d) {
				return "translate(" + x0(d.IDManufacturer) + ",0)";
			})
			.attr("y", function (d) {
				return y(d.Min_price);
			})
			.attr("height", function (d) {
				return height - y(d.Min_price);
			})
			.on("mousemove", function (d) {
				divTooltip.style("top", d3.event.pageY - 20 + "px");
				var posTooltip = d3.event.pageX + 10;
				divTooltip.attr("class", "toolTip");
				if ($('.barchart#' + $(this).parents(".barchart")[0].id).width() / 2 < d3.event.layerX) {
					posTooltip = d3.event.pageX - $('.toolTip').width() - 20;
					divTooltip.attr("class", "toolTip left");
				}
				divTooltip.style("left", posTooltip + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html(html_tooltip_barchart(d));
			})
			.on("mouseout", function (d) {
				divTooltip.style("display", "none");
			})

		svg.append("g")
			.attr("class", "group-max-bar")
			.selectAll("rect.max_bar")
			.data(Data)
			.enter()
			.append("rect")
			.attr("class", "opacity bar max_bar")
			.style("fill", color("Max_price"))
			.attr("data-ctype", "Max price")
			.attr("x", x1("Max_price"))
			.attr("width", x1.bandwidth() / 2)
			.attr("transform", function (d) {
				return "translate(" + (x0(d.IDManufacturer) + (x1.bandwidth() / 2)) + ",0)";
			})
			.attr("y", function (d) {
				return y(d.Max_price);
			})
			.attr("height", function (d) {
				return height - y(d.Max_price);
			})
			.on("mousemove", function (d) {
				divTooltip.style("top", d3.event.pageY - 20 + "px");
				var posTooltip = d3.event.pageX + 10;
				divTooltip.attr("class", "toolTip");
				if ($('.barchart#' + $(this).parents(".barchart")[0].id).width() / 2 < d3.event.layerX) {
					posTooltip = d3.event.pageX - $('.toolTip').width() - 20;
					divTooltip.attr("class", "toolTip left");
				}
				divTooltip.style("left", posTooltip + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html(html_tooltip_barchart(d));
			})
			.on("mouseout", function (d) {
				divTooltip.style("display", "none");
			})

		svg.append("g")
			.attr("class", "opacity line")
			.attr("data-ctype", "Benchmark Price")
			.append("path")
			.datum(Data)
			.attr("style", "stroke-width: 2px; fill: none; stroke: #fd625e")
			.attr("d", line)
			.on("mouseover", function (d) {

				var mouseX = d3.mouse(this);
				var index = getIndex(d, mouseX[0]);
				var pos = index;
				if ((d[index].line_posX + d[index + 1].line_posX) / 2 < mouseX[0]) {
					pos += 1;
				}
				var posTooltip = d3.event.pageX + 10;
				divTooltip.attr("class", "toolTip");
				if ($('.barchart#' + $(this).parents(".barchart")[0].id).width() / 2 < d3.event.layerX) {
					posTooltip = d3.event.pageX - $('.toolTip').width() - 20;
					divTooltip.attr("class", "toolTip left");
				}
				divTooltip.style("left", posTooltip + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html(html_tooltip_barchart(d[pos]));

				divTooltip.style("top", d3.event.pageY - 15 + "px");
				divTooltip.style("display", "inline-block");
			})
			.on("mouseout", function (d) {
				divTooltip.style("display", "none");
			});

		// End Draw

		function DrawLabel(pos, _data) {
			var pos_max = _data.lb_max_pos_y;
			var pos_min = _data.lb_min_pos_y;
			if (pos_max < pos_min) {
				var t = pos_max;
				pos_max = pos_min;
				pos_min = t;
			}
			while (!((pos + 16 < pos_max && pos > pos_min + 16) ||
				(pos > pos_max + 30) || (pos + 30 < pos_min))) {
				if (pos_max - pos_min - 15 > 30)
					pos--;
				else
					pos++;
			}
			return pos;
		}

		var textbar = svg.append("g")
			.attr("class", "group-textbar min_text_bar")
		textbar.selectAll("rect")
			.data(Data)
			.enter()
			.append("rect")
			.attr("class", "labelTextBar")
			.attr("style", "fill: white; fill-opacity: 0.7")
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("x", function (d) {
				d.lb_min_pos_x = x0(d.IDManufacturer) + x1.bandwidth() / 2 - 40;
				return d.lb_min_pos_x;
			})
			.attr("y", function (d) {
				d.lb_min_pos_y = y(d.Min_price) - 17;
				return d.lb_min_pos_y;
			})
			.attr("width", 43)
			.attr("height", 15)
		textbar.selectAll("text")
			.data(Data)
			.enter()
			.append("text")
			.attr("class", "textbar")
			.attr("text-anchor", "middle")
			.attr("x", function (d) {
				return x0(d.IDManufacturer) + x1.bandwidth() / 2 - 19;
			})
			.attr("y", function (d) {
				return y(d.Min_price) - 5;
			})
			.text(function (d) {
				return d.Min_price.toFixed(2);
			});

		textbar = svg.append("g")
			.attr("class", "group-textbar max_text_bar")
		textbar.selectAll("rect")
			.data(Data)
			.enter()
			.append("rect")
			.attr("class", "labelTextBar")
			.attr("style", "fill: white; fill-opacity: 0.7")
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("x", function (d) {
				d.lb_max_pos_x = x0(d.IDManufacturer) + x1.bandwidth() / 2 - 4;
				return d.lb_max_pos_x;
			})
			.attr("y", function (d) {
				d.lb_max_pos_y = y(d.Max_price) - 17;
				return d.lb_max_pos_y;
			})
			.attr("width", 43)
			.attr("height", 15)
		textbar.selectAll("text")
			.data(Data)
			.enter()
			.append("text")
			.attr("class", "textbar")
			.attr("text-anchor", "middle")
			.attr("x", function (d) {
				return x0(d.IDManufacturer) + x1.bandwidth() / 2 + 17;
			})
			.attr("y", function (d) {
				return y(d.Max_price) - 5;
			})
			.text(function (d) {
				return d.Max_price.toFixed(2);
			});

		textbar = svg.append("g")
			.attr("class", "group-textbar benchmark_text_bar")
		textbar.selectAll("rect")
			.data(Data)
			.enter()
			.append("rect")
			.attr("class", "labelTextBar")
			.attr("style", "fill: white; fill-opacity: 0.7")
			.attr("rx", 4)
			.attr("ry", 4)
			.attr("width", 43)
			.attr("height", 15)
			.attr("y", function (d) {
				d.lb_bm_pos_y = d.line_posY + 8;
				d.lb_bm_pos_y = DrawLabel(d.lb_bm_pos_y, d);
				return d.lb_bm_pos_y;
			})
			.attr("x", function (d) {
				d.lb_bm_pos_x = d.line_posX - 20;
				return d.lb_bm_pos_x;
			})
		textbar.selectAll("text")
			.data(Data)
			.enter()
			.append("text")
			.attr("class", "textbar")
			.attr("text-anchor", "middle")
			.attr("x", function (d) {
				return d.line_posX;
			})
			.attr("y", function (d) {
				return d.lb_bm_pos_y + 12;
			})
			.text(function (d) {
				return d.Benchmark_price.toFixed(2);
			});
		// End Draw Barchar and line

		// Start Draw ScatterChart
		var color_sct = d3.scaleOrdinal()
			.range(["#35978f", "#374649", "#fd625e", "#f2c80f", "#5f6b6d", "#8ad4eb", "#fe9666", "#a66999", "#3599b8", "#dfbfbf", "#4ac5bb", "#5f6b6d", "#fb8281"]);

		x.domain([0, d3.max(Data, function (d) {
			return d3.max(d.Details, function (b) {
				return make_rounding(b.Purchase_quantity);
			})
		})]);

		y.domain([0, d3.max(Data, function (d) {
			return d3.max(d.Details, function (b) {
				return make_rounding(b.Purchase_price);
			})
		})]);

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

		var svg_sct = d3.select(".scatterChart#scatter" + arrData[_i].ID)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("class", "wrap_chart")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


		svg_sct.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis_sct)
			.append("text")
			.attr("class", "axisLabel")
			.attr("x", width / 2 + 60)
			.attr("y", 33)
			.style("text-anchor", "end")
			.text("Purchase Quantity")

		svg_sct.append("g")
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


		svg_sct.append("g")
			.attr("class", "grid grid-y")
			.call(make_y_axis()
				.tickSize(-width, 0, 0)
				.tickFormat("")
			)
		svg_sct.append("g")
			.attr("class", "grid grid-x")
			.call(make_x_axis()
				.tickSize(height, 0, 0)
				.tickFormat("")
			)
		// Hover Text axis

		svg_sct.selectAll(".axis text")
			.on("mousemove", function () {
				divTooltip.style("left", d3.event.pageX + 10 + "px");
				divTooltip.style("top", d3.event.pageY - 25 + "px");
				divTooltip.style("display", "inline-block");
				divTooltip.html("<div>" + this.textContent + "</div>");
			})
			.on("mouseout", function () {
				divTooltip.style("display", "none");
			});

		// Start Draw

		var group_dot = svg_sct.append("g")
			.attr("class", "group_dot")
		for (var idx_item = 0; idx_item < Data.length; idx_item++) {
			group_dot.append("g")
				.attr("class", "group_" + Data[idx_item].IDManufacturer)
				.selectAll("circle")
				.data(Data[idx_item].Details)
				.enter()
				.append("circle")
				.attr("r", 7)
				.attr("cx", function (d, i) {
					return x(d.Purchase_quantity);
				})
				.attr("cy", function (d, i) {
					return y(d.Purchase_price);
				})
				.attr("data-item", Data[idx_item].Item)
				.attr("data-manufacturer", Data[idx_item].Manufacturer)
				.attr("data-idmanufacturer", Data[idx_item].IDManufacturer)
				.style("fill", function (d) {
					return color_sct(Data[idx_item].IDManufacturer);
				})
				.on("mousemove", function (d) {
					divTooltip.style("top", d3.event.pageY - 20 + "px");
					var posTooltip = d3.event.pageX + 10;
					divTooltip.attr("class", "toolTip");

					if ($('.scatterChart#' + $(this).parents(".scatterChart")[0].id).width() / 2 < d3.event.layerX) {
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
							<div class='col-right'>" + $(this).data('item') + "</div>\
					  	</div>" +
						"<div class='row'>\
							<div class='col-left'>Manufacturer</div>\
							<div class='col-right'>" + $(this).data('manufacturer') + "</div>\
						</div>" +
						"<div class='row'>\
							<div class='col-left'>Manufacturer Item ID</div>\
							<div class='col-right'>" + $(this).data('idmanufacturer') + "</div>\
						</div>" +
						"<div class='row'>\
							<div class='col-left'>Last Purchase Price</div>\
							<div class='col-right'>" + d.Date + "</div>\
						</div>" +
						"<div class='row'>\
							<div class='col-left'>Purchase Price ($)</div>\
							<div class='col-right'>" + d.Purchase_price.toFixed(2) + "</div>\
						</div>" +
						"<div class='row'>\
						<div class='col-left'>Purchase Quantity</div>\
						<div class='col-right'>" + d.Purchase_quantity + "</div>\
										</div>" +
						(d.Cost_savings > 0 ?
							"<div class='row'>\
						<div class='col-left'>Cost Savings Opportunity ($)</div>\
						<div class='col-right'>" + d.Cost_savings.toFixed(2) + "</div>\
					  </div>" : "") +
						"</div>"
					);
				})
				.on("mouseout", function (d) {
					divTooltip.style("display", "none");
				});

			var textbar = svg_sct.append("g")
				.attr("class", "group-textbar");

			textbar.selectAll(".group-textbar")
				.data(Data[idx_item].Details)
				.enter()
				.append("rect")
				.attr("class", "labelTextBar")
				.attr("rx", 4)
				.attr("ry", 4)
				.attr("x", function (d) {
					return x(d.Purchase_quantity) + 8;
				})
				.attr("y", function (d) {
					return y(d.Purchase_price) - 12;
				})
				.attr("width", 35)
				.attr("height", 15);

			textbar.selectAll(".group-textbar")
				.data(Data[idx_item].Details)
				.enter()
				.append("text")
				.attr("class", "textbar")
				.attr("x", function (d) {
					return x(d.Purchase_quantity) + 9;
				})
				.attr("y", function (d) {
					return y(d.Purchase_price);
				})
				.text(function (d) {
					return d.Purchase_price.toFixed(2);
				})
				.attr("font-size", "13px")
		}
		// End Draw
		var LegendHolder = d3.selectAll(".legendScatterChart." + arrData[_i].ID)
			.attr("class", "legendHolder");
		var legend = LegendHolder.selectAll(".legend")
			.data(Data)
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
			.each(function (d) {
				//  Legend Symbols
				var circle = d3.select(this).append("svg")
					.style("width", "20")
					.style("height", "20");
				circle.append("circle")
					.attr("cx", 7)
					.attr("cy", 10)
					.attr("r", 7)
					.style("fill", function () {
						return color_sct(d.IDManufacturer)
					});
				//  Legend Text
				d3.select(this).append("div")
					.attr("class", "textLegend")
					.text(d.IDManufacturer);
			});
		// End Draw ScatterChart
	}
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