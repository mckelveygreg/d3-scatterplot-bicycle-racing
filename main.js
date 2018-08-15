
const root = document.getElementById('root');
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url)
    .then(data => buildGraph(data));


const buildGraph = (data) => {
    const dataset = data;

    // Dimensions
    const width = root.clientWidth;
    const height = root.clientHeight;
    const padding = 50;
    const yLabel = 25;
    //const titleHeight = 25;
    const circleR = 7;
    const color = d3.scaleOrdinal(d3.schemeSet1);

    const svg = d3.select(root)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

    // X-Scale, Years
    const yearMax = d3.max(dataset, d => d.Year);
    const yearMin = d3.min(dataset, d => d.Year);
    console.log('max: ' + yearMax);
    console.log('min: ' + yearMin);    
    const parseTimeYear = d3.timeParse('%Y');

    const xTimeScaleYear = d3.scaleTime()
                                .domain([parseTimeYear(yearMin - 1),parseTimeYear(yearMax + 1)])
                                .range([padding + yLabel, width - padding]);
    const xAxis = d3.axisBottom(xTimeScaleYear).tickFormat(d3.timeFormat('%Y'));

    // Y-Scale, Min/Sec
    const raceMax = d3.max(dataset, d => d.Time);
    const raceMin = d3.min(dataset, d => d.Time);

    const parseTimeMinSec = d3.timeParse('%M:%S')
    const yScaleTime = d3.scaleTime()
                            .domain([parseTimeMinSec(raceMax), parseTimeMinSec(raceMin)])
                            .range([height - padding, padding]);
    const yAxis = d3.axisLeft(yScaleTime).tickFormat(d3.timeFormat('%M:%S'));
    console.log(dataset);

    // Axes
    svg.append('g')
        .attr('transform', `translate(0,${height - padding})`)
        .property('id', 'x-axis')
        .call(xAxis);
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${width/2}, ${height - 10})`)
        .text('Competition Year');

    svg.append('g')
        .attr('transform', `translate(${padding + yLabel},0)`)
        .property('id', 'y-axis')
        .call(yAxis);
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${padding/2}, ${-25 + height/2})rotate(-90)`)
        .text('Race Time in Minutes');

    // Title
    svg.append('text')
        .attr('transform', `translate(${width/2}, 30)`)
        .attr('text-anchor', 'middle')
        .attr('font-size', '28px')
        .property('id', 'title')
        .text('Doping in Professional Bicycle Racing')
    svg.append('text')
        .attr('transform', `translate(${width/2}, 50)`)
        .attr('text-anchor', 'middle')
        .attr('id', 'sub-title')
        .text('35 Fastest times up Alpe d\'Huez');
    
    // Tooltip
    const tooltip = d3.select('body')
                    .append('div')
                    .style('position', 'absolute')
                    .style('opacity', '0')
                    .text('filler text')
                    .attr('id', 'tooltip')
                    ;

    //// Dots!
    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', d => xTimeScaleYear(parseTimeYear(d.Year)))
        .attr('cy', d => yScaleTime(parseTimeMinSec(d.Time)))
        .attr('r', circleR)
        .attr('class', 'dot')
        .attr('data-xvalue', d => d.Year)
        .attr('data-yvalue', d => new Date(parseTimeMinSec(d.Time).toISOString()))
        .attr('fill', d => color(d.Doping !== ''))
        .attr('data-legend', d => d.Doping == '' ? 'No Doping Alegations' : 'Riders with Doping Alegations')
        .on('mouseover', (d, i) => (
            tooltip.style('opacity', '0.8')
                    .attr('data-year', d.Year)
                    .style('z-index', '10')
                    .html(
                        `${d.Name} (${d.Nationality})</br>
                        ${d.Year}, Time: ${d.Time}</br>
                        ${d.Doping}`
                    )))
        .on('mousemove', () => (
            tooltip.style('top', (d3.event.pageY - 5) + 'px')
                    .style('left', (d3.event.pageX + 10) + 'px')))
        .on('mouseout', () => tooltip.style('opacity', '0').style('z-index', '-1'));
 
        // Legend -- stolen from FCC :(
        var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("id", "legend")
        .attr("transform", (d, i) =>`translate(0,${height/2 - i * 20})`);
    
      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);
    
      legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text((d) => {
            console.log(d);
          if (d) return "Riders with doping allegations";
          else {
            return "No doping allegations";
          };
        });



}