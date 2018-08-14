

const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

d3.json(url)
    .then(data => buildGraph(data));


const buildGraph = (data) => {
    const dataset = data;

    console.log(dataset);
}