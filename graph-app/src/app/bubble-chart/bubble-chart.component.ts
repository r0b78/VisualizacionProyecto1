import { Component, OnInit, ViewChild, ElementRef, Input, HostListener } from '@angular/core';
import { DataModelPoblacion } from '../data/dataPoblacion.model';
import * as d3 from 'd3';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {
  margin = {top: 40, right: 150, bottom: 30, left: 80};

  @ViewChild('my_data',{static: false})
  private chartContainer: ElementRef;
  private type = 'bubbles';
  @Input()
  data: DataModelPoblacion[];
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.changeChart(this.type);
  }

  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(): void {
    if (!this.data) { 
      return; 
    }
    this.createBubbleChart(this.type);
     
  }
  public handleClickEstandar(event: Event): void {
    this.type = 'bubbles'
    this.changeChart(this.type);
    
  }
  public handleClickRectagulo(event: Event): void {
    this.type = 'rectangulo'
    this.changeChart(this.type);
  }

  public handleClickBarras(event: Event): void {
    this.type = 'barras'
    this.changeChart(this.type);
  }

  public handleClickGlifo(event: Event): void {
    this.type = 'glifo'
    this.changeChart(this.type);
  }

  private changeChart(type:string) :void {
    d3.select("svg").remove();
    this.type = type;
    if(type == 'barras') {
      this.createBarChart();
    }else {
     
      this.createBubbleChart(type);  
    }
    
  }
  private createBubbleChart(type:string): void {
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
            .domain([0, d3.max(data, dataPoint => dataPoint.Densidad)+10])
            .range([ 0, width ]);
    
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
            .domain([0, d3.max(data, dataPoint => dataPoint.Poblacion)])
            .range([ height, 0]);
    
    svg.append("g")
    .call(d3.axisLeft(y));

    const z = d3.scaleLinear()
              .domain([0, d3.max(data, dataPoint => dataPoint.Poblacion)])
              .range([ 0, 40 ]);

    var tooltip = d3.select("#my_data")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "black")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("Country: " + d.Canton)
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    
    }
    var districArray = ["San José", "Alajuela", "Cartago", "Limón", "Heredia","Puntarenas","Guanacaste"]
    
    var districImages = {
      "San José":"/assets/img/sanJose.png",
      "Alajuela": "/assets/img/alajuela.jpg",
      "Cartago": "/assets//img/papa.jpg",
      "Limón": "/assets//img/limon.jpg",
      "Heredia": "/assets//img/heredia.png",
      "Puntarenas": "/assets//img/puntarenas.jpg",
      "Guanacaste": "/assets//img/guanacaste.png"
    }

    var myColor = d3.scaleOrdinal()
    .domain(districArray)
    .range(d3.schemeSet1);
    
    if(type == 'glifo') {
      
      svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("image")
        .attr("x", function (d) { return x(d.Densidad); } )
        .attr("y", function (d) { return y(d.Poblacion); } )
        .attr("xlink:href", function (d) { 
          console.log('--')
          console.log(d)
          
          return districImages[d.Provincia] })
        .attr("height", function (d) { return z(d.Poblacion)+15; } )
        .attr("widht", function (d) { return z(d.Poblacion)+15; } )
        .style("opacity", "0.7")
        .attr("stroke", "black")
  
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )  
    }
    if(type == 'rectangulo') {
      
      svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function (d) { return x(d.Densidad); } )
        .attr("y", function (d) { return y(d.Poblacion); } )
        .attr("height", function (d) { return z(d.Poblacion); } )
        .attr("width", function (d) { return z(d.Poblacion); } )
        .style("fill", function (d) { return myColor(d.Provincia); })
      
  
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )  
    }
    if(type == 'bubbles') {
      svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.Densidad); } )
        .attr("cy", function (d) { return y(d.Poblacion); } )
        .attr("r", function (d) { return z(d.Poblacion); } )
        .style("fill", function (d) { return myColor(d.Provincia); })
        .style("opacity", "0.7")
        .attr("stroke", "black")
  
        .on("mouseover", showTooltip )
        .on("mousemove", moveTooltip )
        .on("mouseleave", hideTooltip )  
    }

    //Labels

    //HighLight

  // What to do when one group is hovered
  var highlight = function(d){
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("."+d).style("opacity", 1)
  }

  // And when it is not hovered anymore
  var noHighlight = function(d){
    d3.selectAll(".bubbles").style("opacity", 1)
  }


 
     // Add one dot in the legend for each name.
     var size = 20
    
    if(type == 'glifo') {
      svg.selectAll("myrect")
      .data(districArray)
      .enter()
      .append("image")
        .attr("x", width+10)
        .attr("y", function(d,i){ return  i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("height", 20 )
        .attr("widht", 20 )
        .attr("xlink:href", function (d) { 
          console.log(d)
          var src =  districImages[d] 
          console.log(src)
          return src;
        })
        .style("opacity", "0.7")

 // Add labels beside legend dots
       svg.selectAll("mylabels")
       .data(districArray)
       .enter()
       .append("text")
         .attr("x", width+35 + size*.8)
         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
         .style("fill", function(d){ return myColor(d)})
         .text(function(d){ return d})
         .attr("text-anchor", "left")
         .style("alignment-baseline", "middle")
         .on("mouseover", highlight)
         .on("mouseleave", noHighlight)
            

    }else {
      svg.selectAll("myrect")
      .data(districArray)
      .enter()
      .append("circle")
        .attr("cx", width+40)
        .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return myColor(d)})
     // Add labels beside legend dots
     svg.selectAll("mylabels")
       .data(districArray)
       .enter()
       .append("text")
         .attr("x", width+40 + size*.8)
         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
         .style("fill", function(d){ return myColor(d)})
         .text(function(d){ return d})
         .attr("text-anchor", "left")
         .style("alignment-baseline", "middle")
         .on("mouseover", highlight)
         .on("mouseleave", noHighlight)
    
    
    }
        
    
  }


  private createBarChart(): void {
    d3.select('svg').remove();
    const margin = {top: 40, right: 10, bottom: 30, left: 80};
    const element = this.chartContainer.nativeElement;
    const data = this.data.slice(0,10)
    const svg = d3.select(element).append('svg')
        .attr('width', element.offsetWidth)
        .attr('height', 300);

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
