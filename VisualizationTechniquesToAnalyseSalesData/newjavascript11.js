/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var scaleX, scaleY, scaleSize, scaleShape, scaleX1, scaleY1 ;
$("body").ready(() => {
    var svg = d3.select("#chart")
            .append("svg")
            .attr("id","svgTag")
            .style("width", $(window).width())
            .style("height", $(window).height())
            .style("background-color", "grey");
    
        d3.csv("avocado-updated-2020.csv").then((dataset) => {
       // console.log(dataset)
        var xMax = d3.max(dataset,(d)=>{return d.date;});
        var  yMax = d3.max(dataset,(d)=>{return d.total_volume/1000;});
        var xMin = d3.min(dataset, (d)=>{return d.date;});
       // var yMin = d3.min(dataset, (d)=>{return d.average_price;})
        var priceMax = d3.max(dataset, (d)=>{return d.average_price;})
        var volumeData = dataset.map(function(d){ return (d.total_volume/yMax)*1000;});
        var vMax = d3.max(volumeData,(d)=>{return d.date;});
        
        console.log(yMax);
        scaleX = d3.scaleBand()
              .range([ 70, $(window).width()])
              .domain(getUniqueValues(dataset.map(function(d) { return d.geography; })))
  .padding(0.2);//new domain range
    
        scaleY = d3.scaleLinear()
            .domain([0,yMax])//original data range
            .range([$(window).height()-200, 0]);//new domain range
        var xAxis = d3.axisBottom()//create an axis
            .scale(scaleX);
        scaleX1 = d3.scaleLinear()
                .domain([xMin, xMax])
                .range([ 70, $(window).width()]);
        scaleY1 = d3.scaleLinear()
                .domain([0,priceMax])
                .range([$(window).height()-200, 0]);
        d3.select("#svgTag")
            .append("g")
            .attr("transform", "translate( 70,"+($(window).height()-200) +")")
            .call(xAxis);
        
        var yAxis = d3.axisLeft()//create an axis
            .scale(scaleY);//specify the scale you want to use
         //add the axis to the svg
        d3.select("#svgTag")
            .append("g")
            .attr("transform", "translate( 70,"+($(window).height()-200) +")")
            .call(yAxis);
        createRadios(dataset, svg);
        populateSelect(dataset, svg)
        draw(dataset, svg);
    });//doesn't have to add up to 100!

    
//    createRadios(data);
    
    
// cut from here

});

function over(event, d) {
       d3.select("#floater")
            .style("left",event.clientX + "px")
            .style("top",event.clientY + "px")
            .html("Volume: "+d.total_volume);
    
    d3.selectAll("rect")
            .attr("fill","lightcyan")
            .style("opacity",1);
//    console.log(this);
//    d3.select(this)
//            .style("opacity",0.3)
//            .style("stroke-width","1px")
//            .style("stroke","black");
//  var  selectedtext = d3.select("#label_" + d.index)
//            .style("opacity",1)
//    console.log(selectedtext);
     d3.select(event.target)
            .attr("fill","blue")
            .style("opacity",0.5);
            
    $("#svg").append(event.target);
    
}


function out(event, d) {
//    d3.select(this)
//            .style("opacity",1)
//            .style("stroke","none");
//    d3.select("#label_"+ d.index)
//            .style("opacity",0);
d3.select(event.target)
            .attr("fill","lightcyan")
            .style("opacity",1);
            
    d3.select("#floater")
            .html("");
}

//line chart
function draw(dataset, svg){
    $("#svgTag").empty();
    console.log("in draw");
    
//    if($)
//        var xAxis = d3.axisBottom()//create an axis
//            .scale(scaleX);
        
//        d3.select("#svgTag")
//            .append("g")
//            .attr("transform", "translate( 0,"+($(window).height()-200) +")")
//            .call(xAxis)
//            .selectAll("text")
//            .attr("transform", "translate(-10,0)rotate(-45)")
//            .style("text-anchor", "end");;
     
     
    
    var filtered = filterData(dataset,$("#select option:selected").val());
        filtered = filterData1(filtered,$("#select1 option:selected").val());
    console.log(filtered);
    
    if($("#select1 option:selected").val() == "organic"){
         var  yMax = d3.max(filtered,(d)=>{return d.total_volume/100;});
         scaleY = d3.scaleLinear()
            .domain([0,yMax])//original data range
            .range([$(window).height()-200, 0]);
         svg.append("g")
             .attr("transform", "translate(70)")
        .call(d3.axisLeft(scaleY));
console.log(" ste1")
     }   
     if($("#select1 option:selected").val() == "conventional"){
         var  yMax = d3.max(filtered,(d)=>{return d.total_volume/1000;});
         scaleY = d3.scaleLinear()
            .domain([0,yMax])//original data range
            .range([$(window).height()-200, 0]);
         svg.append("g")
             .attr("transform", "translate(70)")
        .call(d3.axisLeft(scaleY));
console.log(" ste2")
     }
    
    if($("#sortedNone").is(":checked")){
           console.log("In sorted None"); 
          var sorted = sortData(filtered);
          scaleX =d3.scaleBand()
              .range([ 70, $(window).width()])
              .domain(sorted.map(function(d) { return d.geography; }))
  .padding(0.2);
   console.log("step1");
   var xAxis = d3.axisBottom()//create an axis
            .scale(scaleX);
          d3.select("#svgTag")
            .append("g")
            .attr("transform", "translate( 0,"+($(window).height()-200) +")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    console.log("step2");
    
    var g = svg.selectAll("k")
            .data(sorted)
//            .data(filtered)
//            .data(sorted)
            .enter()
            .append("rect")
            .attr("x", (d, i) => {
                return scaleX(d.geography);
            })
            .attr("y", (d, i) => {
                console.log(d.total_volume/1000);
                if($("#select1 option:selected").val() == "conventional"){
                    return scaleY(d.total_volume/1000);
                }if($("#select1 option:selected").val() == "organic"){
                    return scaleY(d.total_volume/100);
                }
                
                
            })
            .attr("height", (d) => {
                
                if($("#select1 option:selected").val() == "conventional"){
                    return ($(window).height()-200)- scaleY(d.total_volume/1000);
                }if($("#select1 option:selected").val() == "organic"){
                    return ($(window).height()-200)- scaleY(d.total_volume/100);
                }
                
            })
            .attr("width", (d) => {
                return scaleX.bandwidth();
            })
            .attr("fill", "lightcyan")
            .on("mouseover", over)
            .on("mouseout", out);
    console.log("step3");
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text((d) => {
        if($("#select1 option:selected").val() == "organic"){
            return "Volumes of avocado in hundreds"
        }if($("#select1 option:selected").val() == "conventional"){
            return "Volumes of avocado in thousands"
        }
                 
            });
    console.log("step4");
    }
    if($("#sortedAscend").is(":checked")){
           console.log("In ascend"); 
          var sorted = sortData(filtered);
          console.log(sorted)
          scaleX =d3.scaleBand()
              .range([ 70, $(window).width()])
              .domain(sorted.map(function(d) { return d.geography; }))
  .padding(0.2);
   console.log("step1");
   var xAxis = d3.axisBottom()//create an axis
            .scale(scaleX);
          d3.select("#svgTag")
            .append("g")
            .attr("transform", "translate( 0,"+($(window).height()-200) +")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
    console.log("step2");
    
    var g = svg.selectAll("k")
            .data(sorted)
//            .data(filtered)
//            .data(sorted)
            .enter()
            .append("rect")
            .attr("x", (d, i) => {
                return scaleX(d.geography);
            })
            .attr("y", (d, i) => {
               if($("#select1 option:selected").val() == "conventional"){
                    return scaleY(d.total_volume/1000);
                }if($("#select1 option:selected").val() == "organic"){
                    return scaleY(d.total_volume/100);
                }
            })
            .attr("height", (d) => {
                if($("#select1 option:selected").val() == "conventional"){
                    return ($(window).height()-200)- scaleY(d.total_volume/1000);
                }if($("#select1 option:selected").val() == "organic"){
                    return ($(window).height()-200)- scaleY(d.total_volume/100);
                }
            })
            .attr("width", (d) => {
                return scaleX.bandwidth();
            })
            .attr("fill", "lightcyan")
            .on("mouseover", over)
            .on("mouseout", out);
    console.log("step3");
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text((d) => {
        if($("#select1 option:selected").val() == "organic"){
            return "Volumes of avocado in hundreds"
        }if($("#select1 option:selected").val() == "conventional"){
            return "Volumes of avocado in thousands"
        }
                 
            });
    console.log("step4");
       }
       
      console.log("Done") 
//        var xAxis = d3.axisBottom()//create an axis
//            .scale(scaleX);
//    var g = svg.selectAll("k")
//            .data(sorted)
////            .data(filtered)
////            .data(sorted)
//            .enter()
//            .append("rect")
//            .attr("x", (d, i) => {
//                return scaleX(d.geography);
//            })
//            .attr("y", (d, i) => {
//                return scaleY(d.total_volume);
//            })
//            .attr("height", (d) => {
//                return ($(window).height()-200)- scaleY(d.total_volume);
//            })
//            .attr("width", (d) => {
//                return scaleX.bandwidth();
//            })
//            .attr("fill", "lightcyan")
//            .on("mouseover", over)
//            .on("mouseout", out);
//            
//            svg.append("text")
//    .attr("class", "y label")
//    .attr("text-anchor", "end")
//    .attr("y", 6)
//    .attr("dy", ".75em")
//    .attr("transform", "rotate(-90)")
//    .text("Volumes of avocado");
//    var H = 30;
//    var P = 3;
//    g.append("rect")
//            .attr("x", (d, i) => {
//                return scaleX(d.geography);
//            })
//            .attr("y", (d, i) => {
//                return scaleY(d.total_volume);
//            })
//            .attr("height", (d) => {
//                return ($(window).height()-200)- scaleY(d.total_volume);
//            })
//            .attr("width", (d) => {
//                return scaleX.bandwidth();
//            })
//            .attr("fill", "lightcyan");

//    g.append("text")
//            .attr("x", (d) => {
//                return d['IMDB Score']*7 +10;
//            })
//            .attr("y", (d, i) => {
//                return   (H +P)* i + H / 2;
//            })
//            .attr("fill", "black")
//            .html((d) => {
//                var dt = new Date(d.Premiere);
//                return d.Title+" ("+dt.getFullYear()+") (IMDB score:"+ d['IMDB Score']+")";
//            });
           // $("#svg").css("height",(data.length)*30 +2000);
}
function draw2(dataset2, svg){
    $("#svgTag").empty();
    console.log("in draw2");
        var xAxis = d3.axisBottom()//create an axis
            .scale(scaleX1);
    d3.select("#svgTag")
            .append("g")
            .attr("transform", "translate( 0,"+($(window).height()-200) +")")
            .call(xAxis);
    
    svg.append("g")
             .attr("transform", "translate(70)")
        .call(d3.axisLeft(scaleY1));

    var  filtered = filterData1(dataset2,$("#select1 option:selected").val());
       filtered = filterData2(filtered,$("#select2 option:selected").val());
       console.log(filtered);
    var line = d3.line()
            .x((d)=>{
                return scaleX1(d.date);
            })
            .y((d)=>{
                console.log(($(window).height()-200) - scaleY1(d.average_price)); 
                return scaleY1(d.average_price);
            });
            
//            var g = svg.selectAll("g")
//            .data(filtered)
////            .data(filtered)
////            .data(sorted)
//            .enter()
//            .append("g");
            
//   g.append("rect")
//            .attr("x", (d, i) => {
//                return scaleX1(d.date);
//            })
//            .attr("y", (d, i) => {
//                return scaleY1(d.average_price);
//            })
//            .attr("height", (d) => {
//                return ($(window).height()-200)- scaleY1(d.average_price);
//            })
//            .attr("width", (d) => {
//                return 2;
//            })
//            .attr("fill", "lightcyan");

            
    svg.append("path")
            .datum(filtered)
            .attr("d",(d)=>{
               // console.log(line(d));
                return line(d);
            })
            .style("fill","none")
            .style("stroke","red")
            .style("stroke-width",2);
    
    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 6)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Average price of avocado");
    
    svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", $(window).width()- 400)
    .attr("y", $(window).height() - 100)
    .text("Date in number format");
}
     
function createRadios(dataset, svg) {
    var field = d3.select("#controls")
            .append("fieldset")
            .style("width", 300);
    field.append("legend").html("Graph control");
    
    var field2 = d3.select("#controls")
            .append("fieldset")
            .style("width", 300);
    field2.append("legend").html("Sorting_by_volume");

    //create a radio button
    field2.append("input")
            .attr("type", "radio")
            .attr("name", "Sorting_by_volume")
            .attr("value", "sortedAscend")
            .attr("id", "sortedAscend");
    field2.append("label")
            .attr("for", "sortedAscend")
            .html("Ascending");
    
    field2.append("input")
            .attr("type", "radio")
            .attr("name", "Sorting_by_volume")
            .attr("value", "sortedNone")
            .attr("id", "sortedNone")
            .attr("checked",true);
    field2.append("label")
            .attr("for", "sortedNone")
            .html("None");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "sortedStr")
            .attr("id", "sortedStr");
    field.append("label")
            .attr("for", "sortedStr")
            .html("Bar chart");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "unsorted")
            .attr("id", "unsorted");
            
    field.append("label")
            .attr("for", "unsorted")
            .html("Time series");

    $("input:radio[name=sorting]").change(() => {
        console.log($("#sorted").is(":checked"));
       if($("#sortedStr").is(":checked")){
          console.log($("#sortedStr").is(":checked")); 
          draw(dataset, svg);
       }if($("#unsorted").is(":checked")){
           console.log($("#unsorted").is(":checked")); 
          draw2(dataset, svg);
       }
        
    });
    
    $("input:radio[name=Sorting_by_volume]").change(() => {
        console.log($("#sorted").is(":checked"));
        $("#sortedStr").attr("checked",true);
       if($("#sortedAscend").is(":checked")){
          console.log($("#sortedAscend").is(":checked"));
          
          draw(dataset, svg);
       }if($("#sortedNone").is(":checked")){
           console.log($("#sortedNone").is(":checked"));
           $("#sortedStr").attr("checked",true);
          draw(dataset, svg);
       }
        
    });
}
function populateSelect(data, svg) {
    
    var drop = $("<select>")//create select obj
            .attr("id", "select")
            .change(() => {
                console.log($("#select option:selected").val());
       var          filtered = filterData(data,
                        $("#select option:selected").val());
            //    console.log(filtered);
                draw(filtered, svg);
            });
    $("#controls").append("<label for='select'>Date: </label>");
    console.log($("i").html);
    
    var col = data.map((v) => {
 //       console.log(v.geography);
        return (v.date);
    });

 //   console.log(col);

    var unique = getUniqueValues(col);

    //add ALL option
   // drop.append("<option value='ALL'>ALL</option>");

////    col.forEach((v)=>{
    unique.forEach((v) => {
        drop.append("<option value='"
                + v + "'>" + v + "</option>");
    });


    $("#controls").append(drop);
    $("#controls").append("<div style='display: in-line; width: 20'></div>");
    
    $("#controls").append("<label for='select1'>Type of avocado: </label>");
    
    $("#controls").append("<select id='select1' style='display: in-line'></select>");
      
      var drop1 =$("#select1").change(() =>{
        //       console.log($("#select1 option:selected").val());
                var filtered1 = filterData1(data,
                        $("#select1 option:selected").val());
     //           console.log(filtered1);
               if($("#sortedStr").is(":checked")){
                 draw(filtered1, svg);
               }else if($("#unsorted").is(":checked")){
                  draw2(filtered1, svg);
               }else{
                  draw(filtered1, svg);
               }
            });
      
       var col1 = data.map((v) => {
  //     console.log(v.date);
        return (v.type);
    });
    var unique1 = getUniqueValues(col1);
    
   // drop1.append("<option value='ALL'>ALL</option>");
     
    unique1.forEach((v) =>{
        drop1.append("<option value='"
                + v + "'>" + v + "</option>");
        
    });
    
    $("#controls").append("<div style='display: in-line; width: 20'></div>");
    
    $("#controls").append("<label for='select2'>Geography: </label>");
    
    $("#controls").append("<select id='select2' style='display: in-line'></select>");
      
      var drop2 =$("#select2").change(() =>{
        //       console.log($("#select1 option:selected").val());
                var filtered2 = filterData2(data,
                        $("#select2 option:selected").val());
     //           console.log(filtered1);
                draw2(filtered2, svg);
            });
      
       var col2 = data.map((v) => {
  //     console.log(v.date);
        return (v.geography);
    });
    var unique2 = getUniqueValues(col2);
    
   // drop1.append("<option value='ALL'>ALL</option>");
     
    unique2.forEach((v) =>{
        drop2.append("<option value='"
                + v + "'>" + v + "</option>");
        
    });

}
function filterData(data, key) {
    var filtered = data.filter((v) => {
        if (key == "ALL") {
    //        console.log("fd all g");
      //      console.log
            return true;
        } else {
            return v.date == key;
        }
    });

    return filtered;
}
function filterData1(data, key) {
    var filtered = data.filter((v) => {
        if (key == "ALL") {
        //    console.log("fd all l");
            
            return true;
        } else {
            return v.type == key;
        }
    });
    return filtered;
}
function filterData2(data, key) {
    var filtered = data.filter((v) => {
        if (key == "ALL") {
    //        console.log("fd all g");
      //      console.log
            return true;
        } else {
            return v.geography == key;
        }
    });

    return filtered;
}
function getUniqueValues(a) {
    var unique = a.filter((v, i) => {
        return a.indexOf(v) == i;//check if the index of the 1st occ is the current index
    });

//    console.log(unique);
    return unique.sort();
}
////    d3.select("#contorls").append("select")
function sortData(data) {
    var copy = data.filter(() => true);
    
    
    
//    if($("#unsorted").is(":checked")){
//        return copy;
//    }

      var sorted = copy.sort((a, b) => {
//        return a.ind - b.ind;
      if($("#sortedNone").is(":checked")){
        return null;
      }
      if($("#sortedAscend").is(":checked")){
          console.log("In sorted Ascend")
        return d3.ascending(a.total_volume/1000, b.total_volume/1000);
      }//end if-else

      });

    
    
    return sorted;
}