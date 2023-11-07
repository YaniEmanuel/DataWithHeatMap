document.addEventListener("DOMContentLoaded", function () {
    const margin = { top: 80, right: 50, bottom: 100, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;
  
    const svg = d3
      .select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    d3.json(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    ).then(function (data) {
      const dataset = data.monthlyVariance;
  
      const baseTemp = data.baseTemperature;
      const minYear = d3.min(dataset, (d) => d.year);
      const maxYear = d3.max(dataset, (d) => d.year);
      const minMonth = 1;
      const maxMonth = 12;
  
      const xScale = d3
        .scaleBand()
        .domain(d3.range(minYear, maxYear + 1))
        .range([0, width]);
  
      const yScale = d3
        .scaleBand()
        .domain(d3.range(minMonth, maxMonth + 1))
        .range([0, height]);
  
      const colors = d3.scaleSequential(d3.interpolateRdBu).domain([-7, 7]);
  
      svg
        .selectAll(".cell")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "cell")
        .attr("data-year", (d) => d.year)
        .attr("data-month", (d) => d.month - 1)
        .attr("data-temp", (d) => baseTemp + d.variance)
        .attr("x", (d) => xScale(d.year))
        .attr("y", (d) => yScale(d.month))
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("fill", (d) => colors(d.variance))
        .on("mouseover", function (event, d) {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0.9;
          tooltip.style.left = event.clientX + "px";
          tooltip.style.top = event.clientY + "px";
          tooltip.setAttribute("data-year", d.year);
          tooltip.innerHTML =
            `${d.year} - ${monthNames[d.month - 1]}` +
            `<br>Temperature: ${baseTemp + d.variance}°C` +
            `<br>Variance: ${d.variance}°C`;
        })
        .on("mouseout", function () {
          const tooltip = document.getElementById("tooltip");
          tooltip.style.opacity = 0;
        });
  
      const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter((year) => year % 10 === 0));
      const yAxis = d3.axisLeft(yScale).tickFormat((month) => monthNames[month]);
  
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
  
      svg.append("g").attr("id", "y-axis").call(yAxis);
  
      const legend = d3.select("#legend");
      const legendData = [-7, -5, -3, -1, 1, 3, 5, 7];
  
      legend
        .selectAll(".legend-box")
        .data(legendData)
        .enter()
        .append("div")
        .attr("class", "legend-box")
        .style("background-color", (d) => colors(d))
        .style("width", "40px")
        .style("height", "20px");
  
      const legendText = ["< -7", "-5", "-3", "-1", "1", "3", "5", "> 7"];
  
      legend
        .selectAll(".legend-text")
        .data(legendText)
        .enter()
        .append("div")
        .attr("class", "legend-text")
        .text((d) => d);
    });
  
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
  });  