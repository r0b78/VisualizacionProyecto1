import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DataModelPoblacion } from '../data/dataPoblacion.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {
  @ViewChild('my_data',{static: false})
  private chartContainer: ElementRef;

  @Input()
  data: DataModelPoblacion[];
  
  margin = {top: 40, right: 40, bottom: 30, left: 80};

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(): void {
    if (!this.data) { 
      return; 
    }
    this.createChart();
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;

    const data = this.data

    const svg = d3.select("#my_data")
              .append("svg")
                .attr("width", element.offsetWidth )
                .attr("height", 350)
              .append("g")
                .attr("transform",
                    "translate(" + this.margin.left + "," + this.margin.top + ")");

    let width = element.offsetWidth - this.margin.left - this.margin.right;
    let height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const x = d3.scaleLinear()
            .domain([0, d3.max(data, dataPoint => dataPoint.Poblacion)+400])
            .range([ 0, width ]);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
            .domain([0, d3.max(data, dataPoint => dataPoint.Densidad)])
            .range([ height, 0]);
    
    svg.append("g")
    .call(d3.axisLeft(y));

    const z = d3.scaleLinear()
              .domain([0, d3.max(data, dataPoint => dataPoint.Poblacion)])
              .range([ 0, 40 ]);
    
    svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Poblacion); } )
      .attr("cy", function (d) { return y(d.Densidad); } )
      .attr("r", function (d) { return z(d.Poblacion); } )
      .style("fill", "#69b3a2")
      .style("opacity", "0.7")
      .attr("stroke", "black")
    
  }

}
