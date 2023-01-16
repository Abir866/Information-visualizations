/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$("body").ready(() => {
        var dataset = [
                {name: "First", value: 5},
                {name: "Second", value: 10},
                {name: "Third", value: 20},
                {name: "Fourth", value: 35},
                {name: "Fifth", value: 6},
                {name: "Sixth", value: 5}
        ];//doesn't have to add up to 100!

    var svg = d3.select("#chart")
            .append("svg")
            .attr("id","svgTag")
            .style("width", "1000px")
            .style("height", "800px")
            .style("background-color", "grey");
//    createRadios(data);
    createRadios(dataset, svg);
    draw(dataset, svg);
// cut from here

});

function over(event, d) {
    
    console.log(this);
    d3.select(this)
            .style("opacity",0.3)
            .style("stroke-width","1px")
            .style("stroke","black");
  var  selectedtext = d3.select("#label_" + d.index)
            .style("opacity",1)
    console.log(selectedtext);
    
}


function out(event, d) {
    d3.select(this)
            .style("opacity",1)
            .style("stroke","none");
    d3.select("#label_"+ d.index)
            .style("opacity",0);
}

//line chart
function draw(dataset, svg){
    $("#svgTag").empty();
    var pie = d3.pie()
            .value((d) => {
                return d.value;
            })
            .sort((a, b) => {
                if($("#unsorted").is(":checked")){
                   return null;
                }
                if($("#sorted").is(":checked")){
                   return d3.ascending (a.value, b.value);
                }
                if($("#sortedStr").is(":checked")){
                  return d3.descending (a.value, b.value);
                }
                return null;
            });

    var arc = d3.arc()
            .innerRadius(100)
            .outerRadius(300);
    console.log(arc);

    var group = svg.selectAll("g")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("transform",
                    "translate(500,300)")
            .on("mouseover", over)
            .on("mouseout", out)
            ;
    console.log(group);

    var color = ["red", "blue", "yellow", "pink", "green", "purple"]
    group.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => {
                return color[i];
            });

    group.append("text")
            .text((d) => {
                console.log(d.data.name);
//                return d.value;
                return d.data.name + ":" + d.data.value;
            })
            .attr("transform", (d) => {
                return "translate(" + arc.centroid(d) + ")";
            })
                    .attr("id",(d,i) =>{
                        console.log("label_" + d.index);
                return "label_" + d.index;
                    })
                            .style("opacity",0);
}
     
function createRadios(dataset, svg) {
    var field = d3.select("#controls")
            .append("fieldset")
            .style("width", 300);
    field.append("legend").html("Sorting");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "sorted")
            .attr("id", "sorted");
    field.append("label")
            .attr("for", "sorted")
            .html("Ascending");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "sortedStr")
            .attr("id", "sortedStr");
    field.append("label")
            .attr("for", "sortedStr")
            .html("Descending");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "unsorted")
            .attr("id", "unsorted")
            .attr("checked",true);
    field.append("label")
            .attr("for", "unsorted")
            .html("None");

    $("input:radio[name=sorting]").change(() => {
        console.log($("#sorted").is(":checked"));
        draw(dataset, svg);
    });
} 

     
    