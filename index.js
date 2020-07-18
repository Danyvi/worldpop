//import {select, csv} from 'd3'

const svg = d3.select('svg');

// + operator parses string to numbers
const width = +svg.attr('width');
const height = +svg.attr('height');

const render = data => {

    // block to render the code independent from dataset
    const xValue = d => d.population;
    const yValue = d => d.country;

    // margin definition
    const margin = {
        top: 50,
        right: 40,
        bottom: 77,
        left: 180
    };

    // innerWidth = overall width - left margin - right margin
    const innerWidth = width - margin.left - margin.right;

    // innerHeight  = overall Height - margin.top - margin.bottom
    const innerHeight = height - margin.top - margin.bottom;

    // scaling the "domain"/"data space" to "range"/"screen space" (typical in pixel coordinates)
    // screate an instance of d3 linear scale 
    // linear scale are useful for 'quantitative' attributes
    // .domain([min, max value for domain]) accepts an array with 2 elements
    // .range() also accepts an array with 2 elements
    // d represents one row of the data input
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);
    
    /* console.log('x Domain: ', xScale.domain()); // return the domain 
    console.log('x Range: ', xScale.range()); // return the range  */

    const xAxisTickFormat = number => 
        d3.format('.3s')(number)
            .replace('G','B');

    const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(xAxisTickFormat)
        .tickSize(-innerHeight+5);

    // bandscales are useful for 'ordinal' attributes
    // padding for separation between the bars
    const yScale = d3.scaleBand()
        .domain(data.map(d => yValue(d)))
        .range([0, innerHeight])
        .padding(0.1);
    
    /* console.log('y Domain: ', yScale.domain()); // return the domain 
    console.log('y Range: ', yScale.range()); // return the range  */

    const yAxis = d3.axisLeft(yScale);

    // create a group element that will be translated to leave the space for axis
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // append a new group element where we put the y axis
    //yAxis(g.append('g')); 
    /**
     * for this type of call of a function on a selction there is a shorthand, since it is pretty common
     * g.append('g').call(yAxis)
     */
    g
        .append('g')
        .call(yAxis)
        .selectAll('.domain, .tick line')
        .remove();

        // translate the xAxis group element so tthat is shifted to the bottom and not to the top
    const xAxisGroup = g
        .append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);
    
    xAxisGroup
        .select('.domain')
        .remove()

    xAxisGroup
        .append('text')
        .attr('class', 'axis-label')
        .attr('y', 65)
        .attr('x', innerWidth/2)
        .attr('fill', 'black')
        .text('Population') 

    g
        .selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', d => yScale.bandwidth());

    g
        .append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text('Top 10 Most populous Countries')
};

d3.csv('data.csv').then(data => {
    data.forEach(d => d.population = +d.population * 1000);
    render(data);
    console.log('Data: ', data);
});

// representing rectangles for each row in our data table
