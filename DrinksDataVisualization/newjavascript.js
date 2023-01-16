/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$("body").ready(
        function(){
            d3.csv("drinks.csv")     // read csv rectangles
                   .then(
                   function(data){
                       console.log(data.length);
                       var HEIGHT = data.length * 30;
                       var svg = addSVG(HEIGHT);
                        drawRect(svg, data);  
                   }
                   );
           
           
            
        });

function addSVG(height) {
    return d3.select("body")
            .append("svg")
            .attr("width", 1000)
            .attr("height",height + 500)
            .style("background-color","grey");
}
function drawRect(svg, data, scale) {
    
    
    var group = svg.selectAll("g")
            .data(data)
            .enter()
            .append("g");
    
    var rect1 = group.append("rect")
            .attr("x",0)
            .attr("y",function(d,i){
                height = 30;
                return i*(height+2);
            })
            .attr("width",function(d){
                return d.beer_servings;
                
            })
            .attr("height",30)
            .attr("fill","yellow");
    var rect2 = group.append("rect")
            .attr("x",function(d){
                return d.beer_servings;
    })
            .attr("y",function(d,i){
                
                height = 30;
                return i*(height+2);
    })
            .attr("width",function(d){
                return d.spirit_servings;
    })
            .attr("height",30)
            .attr("fill","paleturquoise");
    
     var rect3 = group.append("rect")
            .attr("x",function(d){
                return Number(d.beer_servings) + Number(d.spirit_servings);
    })
            .attr("y",function(d,i){
                
                height = 30;
                return i*(height + 2);
    })
            .attr("width",function(d){
                return Number(d.wine_servings);
    })
            .attr("height",30)
            .attr("fill","red");
            
     group.append("text")
                    .attr("x",function(d){
                        return Number(d.beer_servings) + Number(d.spirit_servings) + Number(d.wine_servings) +10;
            })
                    .attr("y",function(d,i){
                        height = 30;
                return  i*(height + 2) +20;
                
            })
                    .html(function (d) {
                  var maxValue = Math.max(Number(d.beer_servings), Number(d.spirit_servings), Number(d.wine_servings));
                  console.log(maxValue);
                  var st ="";
                  var percent = (maxValue/((Number(d.beer_servings)+ Number(d.spirit_servings)+ Number(d.wine_servings)))*100);
                //  console.log(percent);
//                  percent.toString();
                  if(isNaN(percent)){
                      st = "No alcohol consumption reported";
                  }else{
                     let num = percent.toFixed(2);
                      
                      console.log(d); 
                      for(let item in d){
                          if(d[item] == maxValue){
                             if(item == 'beer_servings'){
                                 st+=" BEER";
                             }else if(item == 'spirit_servings'){
                                 st+=" SPIRIT";
                             }else{
                                 st+=" WINE";
                             } 
                          }
                      }
                      st += " ("+num+"%)";
                  }
                return d.country +" "+ st ;
            })
            .attr("font-size","12pt")
            .attr("fill", "black");

    }
   