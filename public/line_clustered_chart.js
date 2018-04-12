function getTextWidth(text, fontSize, fontName) {
      c = document.createElement("canvas");
      ctx = c.getContext("2d");
      ctx.font = fontSize + ' ' + fontName;
      return ctx.measureText(text).width;
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
                        return thisObject[d]
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

      
// Tooltip

var divTooltip = d3.select("body")
      .append("div")
      .attr("class", "toolTip");

d3.json("/dataGroup.json", function (error, Data) {
      if (error) throw error;

      // Config View SVG
      var margin = {
                  top: 20,
                  right: 30,
                  bottom: 60,
                  left: 50
            },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

      var textWidthHolder = 0;

      // Extension method declaration
      var x0 = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);
      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
            .range([height, 0]);
      var color = d3.scale.ordinal()
            .range(["#01b8aa", "#374649", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var line = d3.svg.line()
            .x(function (d) {
                  d.posX = x0(d.Date) + x0.rangeBand() / 2;
                  return x0(d.Date) + x0.rangeBand() / 2;
            })
            .y(function (d) {
                  d.posY = y(d.Value);
                  return y(d.Value)
            })


      function make_y_axis() {
            return d3.svg.axis()
                  .scale(y)
                  .orient("left")
                  .ticks(10)
      }

      function make_x_axis() {
            return d3.svg.axis()
                  .scale(x)
                  .orient("left")
                  .ticks(10)
      }

      function getIndex(arr, currX) {
            var index = -1;
            arr.forEach(function (item) {
                  if (item.posX <= currX) {
                        index++;
                  }
            });
            return index;
      }
      var xAxis = d3.svg.axis()
            .scale(x0)
            .orient("bottom");

      var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

      /// Adding Date in LineCategory
      Data.forEach(function (d) {
            d.LineCategory.forEach(function (b) {
                  b.Date = d.Date;
            })
      });
      var Categories = new Array();

      // Bar Data categories
      Data.forEach(function (d) {
            d.Categories.forEach(function (b) {
                  b.Date = d.Date;
                  if (Categories.findIndex(function (c) {
                              return c.Name === b.Name
                        }) == -1) {
                        b.Type = "bar";
                        //console.log(JSON.stringify(b))
                        Categories.push(b)
                  }
            })
      });

      // Line Data categories
      Data.forEach(function (d) {
            d.LineCategory.forEach(function (b) {
                  if (Categories.findIndex(function (c) {
                              return c.Name === b.Name
                        }) == -1) {
                        b.Type = "line";
                        //console.log(JSON.stringify(b))
                        Categories.push(b)
                  }
            })
      });

      // Processing Line data
      lineData = DataSegregator(Data.map(function (d) {
            return d.LineCategory
      }), "Name");

      // Line Coloring
      LineColor = d3.scale.ordinal();

      LineColor.domain(Categories.filter(function (d) {
            return d.Type == "line"
      }).map(function (d) {
            return d.Name
      }));

      LineColor.range(["#fd625e", "#06bf00", "#98bdc5", "#671919", "#0b172b"])

      // Scale position X and Y in SVG

      x0.domain(Data.map(function (d) {
            return d.Date;
      }));

      x1.domain(Categories.filter(function (d) {
            return d.Type == "bar"
      }).map(function (d) {
            return d.Name
      })).rangeRoundBands([0, x0.rangeBand()]);

      y.domain([0, d3.max(Data, function (d) {
            return d3.max(d.Categories, function (d) {
                  return d.Value;
            });
      })]);

      var svg = d3.select("#barchart")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("id", "wrap_chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // Back delete duplicate
      if ($('#barchart #wrap_chart').length > 1){
            var obj = $('#barchart #wrap_chart');
            $(obj[0]).remove();
      }
      if ($('body .toolTip').length > 1){
            obj = $('body .toolTip');
            $(obj[0]).remove();
      }

      d3.selectAll("div .nameBarChart")
            .append("text")
            .text("Max, Min and Benchmark Prices across Market")
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
            .data(Data)
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            //Hover text x axis
            .on("mousemove", function (d) {
                  divTooltip.style("left", d3.event.pageX + 10 + "px");
                  divTooltip.style("top", d3.event.pageY - 25 + "px");
                  divTooltip.style("display", "inline-block");
                  divTooltip.html("<div>"+d.Date+"</div>");
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
            .attr("x", -40)
            .attr("class", "axisLabel")
            .attr("dy", ".71em")
            .attr("dx", "-7em")
            .text("Population")
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

      // Start Draw Categories
      // Get Path Type Bar

      var state = svg.append("g")
            .attr("class", "group-bar")
            .selectAll(".state")
            .data(Data)
            .enter().append("g")
            .attr("class", "state")
            .attr("transform", function (d) {
                  return "translate(" + x0(d.Date) + ",0)";
            });

      // Draw Bar Categories

      state.selectAll("rect")
            .data(function (d) {
                  return d.Categories;
            })
            .enter()
            .append("rect")
            .attr("class", "opacity bar")
            .attr("data-ctype", function (d) {
                  return d.Name;
            })
            .attr("width", x1.rangeBand())
            .attr("x", function (d) {
                  return x1(d.Name);
            })
            .attr("y", function (d) {
                  return y(d.Value);
            })
            .on("mousemove", function (d) {
                  divTooltip.style("top", d3.event.pageY - 20 + "px");
                  var posTooltip = d3.event.pageX + 10;
                  divTooltip.attr("class","toolTip");
                  if ($('#barchart').width() - 250 < d3.event.offsetX){
                        posTooltip = d3.event.pageX  - $('.toolTip').width() - 20;
                        divTooltip.attr("class","toolTip left");
                  }
                  divTooltip.style("left", posTooltip + "px");
                  divTooltip.style("display", "inline-block");
                  divTooltip.html(
                              "<div class='arrow'></div>" +
                              "<div class='wrap'>" + 
                              "<div class='row'>\
                                    <div class='col-left'>Date:</div>\
                                    <div class='col-right'>" + d.Date + "</div>\
                              </div>" +
                              "<div class='row'>\
                                    <div class='col-left'>Name:</div>\
                                    <div class='col-right'>" + d.Name + "</div>\
                              </div>" +
                              "<div class='row'>\
                                    <div class='col-left'>Value:</div>\
                                    <div class='col-right'>" + d.Value + "</div>\
                              </div>" +
                              "</div>"
                  );
            })
            .on("mouseout", function (d) {
                  divTooltip.style("display", "none");
            })
            .on('click', function(){
                  if ($(this).hasClass('show')){
                        $('#barchart').find('.opacity').css('opacity',1);
                        $(this).parent().find('.opacity').removeClass('show');
                  }
                  else{
                        $('#barchart').find('.opacity').removeClass('show').css('opacity',0.4);
                        $(this).parent().find('.opacity').addClass('show').css('opacity',1);
                  }
                  $('.legendHolder .legend').removeClass('show').css('opacity',1);
            })
            .style("fill", function (d) {
                  return color(d.Name);
            })
            .transition()
            .delay(500)
            .attrTween("height", function (d) {
                  var i = d3
                        .interpolate(0, height - y(d.Value));
                  return function (t) {
                        return i(t);
                  }
            });

      // End Draw Categories

      // Start Draw lineCategories

      var lineDraw = svg.selectAll(".line")
            .data(lineData)
            .enter().append("g")
            .attr("class", "opacity line")
            .attr("data-ctype", function (d,i) {
                  return d[i].Name;
            })

      lineDraw.each(function (d, i) {
            Name = d[i].Name
            d3.select(this).append("path")
            .attr("d", function (b) {
                  return line(b)
            })
            .style({
                  "stroke-width": "2px",
                  "fill": "none"
            })
            .style("stroke", LineColor(Name))
            .on("mouseover", function (d) {
                  
                  var mouseX = d3.mouse(this);
                  var index = getIndex(d, mouseX[0]);
                  var pos = index;
                  if ((d[index].posX + d[index + 1].posX) / 2 < mouseX[0]) {
                        pos += 1;
                  }
                  var posTooltip = d3.event.pageX + 10;
                  divTooltip.attr("class","toolTip");
                  if ($('#barchart').width() - 250 < d3.event.offsetX){
                        posTooltip = d3.event.pageX - $('.toolTip').width() - 20;
                        divTooltip.attr("class","toolTip left");
                  }
                  divTooltip.style("left", posTooltip + "px");
                  divTooltip.style("display", "inline-block");
                  divTooltip.html(
                        "<div class='arrow'></div>" +
                        "<div class='wrap'>" + 
                        "<div class='row'>\
                              <div class='col-left'>Date:</div>\
                              <div class='col-right'>" + d[pos].Date + "</div>\
                        </div>" +
                        "<div class='row'>\
                              <div class='col-left'>Name:</div>\
                              <div class='col-right'>" + d[pos].Name + "</div>\
                        </div>" +
                        "<div class='row'>\
                              <div class='col-left'>Value:</div>\
                              <div class='col-right'>" + d[pos].Value + "</div>\
                        </div>" +
                        "</div>"
                        );

                  divTooltip.style("top", d3.event.pageY - 15 + "px");
                  divTooltip.style("display", "inline-block");
            })
            .on("mouseout", function (d) {
                  divTooltip.style("display", "none");
            })
            .on('click', function(){
                  if ($(this).parent().hasClass('show')){
                        $('#barchart').find('.opacity').css('opacity',1);
                        $(this).parent().removeClass('show');
                        $('.legendHolder [data-ctype="' + $(this).parent().data('ctype') + '"]').removeClass('show');

                  }
                  else{
                        $('#barchart').find('.opacity').removeClass('show').css('opacity',0.4);
                        $(this).parent().addClass('show').css('opacity',1);
                        $('.legendHolder .legend').removeClass('show').css('opacity',0.4);
                        $('.legendHolder [data-ctype="' + $(this).parent().data('ctype') + '"]').addClass('show').css('opacity',1);
                  }
            })
            .text(function (d) {
                  return 1000;
            })
            .transition().duration(1500);
                  
      })
      .style("shape-rendering", "geometricPrecision");

      // End Draw lineCategories

      // Start Draw label and number of chart

      var textbar = svg.append("g")
            .attr("class", "group-textbar")
            .selectAll(".state")
            .data(Data)
            .enter().append("g")
            .attr("class", "state")
            .attr("transform", function (d) {
                  return "translate(" + x0(d.Date) + ",0)";
            });

      function DrawLabel(pos, _data){
            //debugger;
            var pos_max = _data.Categories[0].lb_pos_y;
            var pos_min = _data.Categories[1].lb_pos_y;
            if (pos_max < pos_min){
                  var t = pos_max;
                  pos_max = pos_min;
                  pos_min = t;
            }
            while(!((pos + 20 < pos_max && pos > pos_min + 20) ||
                  (pos > pos_max + 20) || (pos < pos_min))){
                  if (pos_max - pos_min - 20 > 30)
                        pos--;
                  else
                        pos++;
            }
            return pos;
      }

      // Draw label
      textbar.selectAll("text")
            .data(function (d) {
                  return d.Categories;
            })
            .enter()
            .append("rect")
            .attr("class", "labelTextbar")
            .style("fill", "white")
            .style("fill-opacity",0.7)
            .attr("rx",4)
            .attr("ry",4)
            .attr("x", function (d) {
                  d.lb_pos_x = x1(d.Name) + x1.rangeBand() / 2 -20;
                  return d.lb_pos_x;
            })
            .attr("y",  function (d) {
                  d.lb_pos_y = y(d.Value) -17;
                  return d.lb_pos_y;
            })
            .attr("width",43)
            .attr("height",15);

      textbar.selectAll("text")
            .data(function (d) {
                  return d.Categories;
            })
            .enter()
            .append("text")
            .attr("class", "textbar")
            .attr("text-anchor", "middle")
            .attr("x", function (d) {
                  return x1(d.Name) + x1.rangeBand() / 2;
            })
            .attr("y", function (d) {
                  return y(d.Value) - 5;
            })
            .text(function (d) {
                  return d.Value;
            });

      var textlineDraw = svg.selectAll(".textline")
            .data(lineData)
            .enter().append("g")
            .attr("class", function(d, i){
                  return "textline " + d[i].Name;
            })
            
      textlineDraw.each(function (d, i) {
            for(var i=0;i < d.length;i++) {  
                  d3.select(".textline")
                        .append("rect")
                        .attr("class","labelTextBar")
                        .attr("rx",4)
                        .attr("ry",4)
                        .attr("x", function(){
                              d[i].lb_pos_x = d[i].posX-20;
                              return d[i].lb_pos_x;
                        })
                        .attr("y", function(){
                              d[i].lb_pos_y = d[i].posY +8;
                              d[i].lb_pos_y = DrawLabel(d[i].lb_pos_y, Data[i]);
                              //d[i].space_change = posY_current - d[i].lb_pos_y;
                              return d[i].lb_pos_y;
                        })
                        .attr("width",43)
                        .attr("height",15);
                  d3.select(".textline")
                        .append("text")
                        .attr("class", "textbar")
                        .attr("text-anchor", "middle")
                        .attr("x", d[i].posX)
                        .attr("y",  d[i].lb_pos_y + 12)
                        .text(d[i].Value);
                  
            }
                  
      })
      d3.selectAll("#barchart .line path")
            .data(lineData)

      // End Draw label and number of chart

      // Start Draw Legends

      var LegendHolder = svg.append("g").attr("class", "legendHolder");
      LegendHolder.selectAll(".legend")
            .data(Categories.map(function (d) {
                  return {
                        "Name": d.Name,
                        "Type": d.Type
                  }
            }))
            .enter().append("g")
            .attr("class", "legend")
            .attr("data-ctype", function (d) {
                  return d.Name;
            })
            .attr("transform", function (d, i) {
                  return "translate(0," + (-20) + ")";
            })
            .on("mousemove", function (d) {
                  divTooltip.style("left", d3.event.pageX + 10 + "px");
                  divTooltip.style("top", d3.event.pageY - 25 + "px");
                  divTooltip.style("display", "inline-block");
                  divTooltip.html("<div>" + d.Name + "</div>");
            })
            .on("mouseout", function (d) {
                  divTooltip.style("display", "none");
            })
            .on('click', function(){
                  var current = $(this).data('ctype');
                  if ($(this).hasClass('show')){
                        $('#barchart').find('.opacity').removeClass('show').css('opacity',1);
                        $('.legendHolder .legend').removeClass('show').css('opacity',1);
                        $('[data-ctype="' + current + '"]').removeClass('show');
                  }
                  else{
                        $('.legendHolder .legend').removeClass('show').css('opacity',0.4);
                        $('#barchart').find('.opacity').removeClass('show').css('opacity',0.4);
                        $('[data-ctype="' + current + '"]').addClass('show').css('opacity',1);
                  }
            })
            .each(function (d, i) {
                  //  Legend Symbols
                  d3.select(this).append("circle")
                        .attr("width", function () {
                              return 18
                        })
                        .attr("cx", function (b) {
                              left = (i + 1) * 15 + i * 18 + i * 55 + 10;
                              if (i == 1)
                                    left -= 10;
                              if (i == 2)
                                    left -= 16;
                              return left;
                        })
                        .attr("cy", 9)
                        .attr("r", 7)
                        .style("fill", function (b) {
                              return b.Type == 'bar' ? color(d.Name) : LineColor(d.Name)
                        });
                  //  Legend Text
                  d3.select(this).append("text")
                        .attr("x", function (b) {

                              left = (i + 1) * 15 + (i + 1) * 18 + (i + 1) * 5 +
                                    textWidthHolder;

                              return left;
                        })
                        .attr("y", 9)
                        .attr("dy", ".35em")
                        .style("color","rgb(102, 102, 102)")
                        .text(d.Name);
                  textWidthHolder += getTextWidth(d.Name, "10px", "calibri");
            });

      // Legend Placing

      d3.select(".legendHolder").attr("transform", function (d) {
            thisWidth = d3.select(this).node().getBBox().width;
            return "translate(" + ((width) / 2 - thisWidth / 2) + ",0)";
      })

      // End Draw Legend
});