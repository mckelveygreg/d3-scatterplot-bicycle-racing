
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
    const circleR = 20;

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
                                .domain([parseTimeYear(yearMin),parseTimeYear(yearMax)])
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
}