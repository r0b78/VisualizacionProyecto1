
import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { DataModel } from 'src/app/data/data.model';

@Component({
  selector: 'app-bar-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: '/bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnChanges {
  @ViewChild('chart',{static: false})
  private chartContainer: ElementRef;

  @Input()
  data: DataModel[];

  margin = {top: 40, right: 10, bottom: 30, left: 80};

  constructor() { }

  ngOnChanges(): void {
    if (!this.data) { 
      return; }

    this.createChart();
  }

  private createChart(): void {
    d3.select('svg').remove();

    const element = this.chartContainer.nativeElement;
    const data = this.data.slice(0,10)
    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', element.offsetHeight);

    const contentWidth = element.offsetWidth - this.margin.left - this.margin.right;
    const contentHeight = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3
      .scaleBand()
      .rangeRound([0, contentWidth])
      .padding(0.1)
      .domain(data.map(d => d.Canton));

    const y = d3
      .scaleLinear()
      .range([contentHeight,0])
      .domain([0, d3.max(data, d => Number(d.Poblacion))])
      
    const g = svg.append('g')
      .attr('transform', 
      'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + contentHeight + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .call(d3.axisLeft(y))
      .append("text")
      .attr('y',-15)
      .attr('x',-10)
	    .attr("fill", "#000")
	    .attr("dy", "0.71em")
	    .text("Poblacion");

    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.Canton))
        .attr('y', d => y(Number(d.Poblacion)))
        .attr('width', x.bandwidth())
        .attr('height', d =>{
          return (contentHeight - y(d.Poblacion));
        }) 
  }
}
