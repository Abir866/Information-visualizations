/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$("body").ready(() => {
    d3.csv("NetflixOriginals.csv").then((data) => {
        console.log(data);
        populateSelect(data);
        createRadios(data);
        draw(data);
    });

});

function createRadios(data) {
    var field = d3.select("#controls")
            .append("fieldset")
            .style("width", 300);
    field.append("legend").html("Sort by");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "sorted")
            .attr("id", "sorted");
    field.append("label")
            .attr("for", "sorted")
            .html("IMDB Ratings");

    //create a radio button
    field.append("input")
            .attr("type", "radio")
            .attr("name", "sorting")
            .attr("value", "sortedStr")
            .attr("id", "sortedStr");
    field.append("label")
            .attr("for", "sortedStr")
            .html("Title");

    //create a radio button
//    field.append("input")
//            .attr("type", "radio")
//            .attr("name", "sorting")
//            .attr("value", "unsorted")
//            .attr("id", "unsorted");
//    field.append("label")
//            .attr("for", "unsorted")
//            .html("Unsorted");

    $("input:radio[name=sorting]").change(() => {
        console.log($("#sorted").is(":checked"));
        var sorted = sortData(data);
        console.log(sorted);
        draw(sorted);
    });
}


function populateSelect(data) {
    
    var drop = $("<select>")//create select obj
            .attr("id", "select")
            .change(() => {
                console.log($("#select option:selected").val());
       var          filtered = filterData(data,
                        $("#select option:selected").val());
                console.log(filtered);
                draw(filtered);
            });
    $("#controls").append("<label for='select'>Genere: </label>");
    console.log($("i").html);
    
    var col = data.map((v) => {
        console.log(v.Genre);
        return (v.Genre);
    });

    console.log(col);

    var unique = getUniqueValues(col);

    //add ALL option
    drop.append("<option value='ALL'>ALL</option>");

////    col.forEach((v)=>{
    unique.forEach((v) => {
        drop.append("<option value='"
                + v + "'>" + v + "</option>");
    });


    $("#controls").append(drop);
    $("#controls").append("<div style='display: in-line; width: 20'></div>");
    
    $("#controls").append("<label for='select1'>Language: </label>");
    
    $("#controls").append("<select id='select1' style='display: in-line'></select>");
      
      var drop1 =$("#select1").change(() =>{
               console.log($("#select1 option:selected").val());
                var filtered1 = filterData1(data,
                        $("#select1 option:selected").val());
                console.log(filtered1);
                draw(filtered1);
            });
      
       var col1 = data.map((v) => {
       console.log(v.Language);
        return (v.Language);
    });
    var unique1 = getUniqueValues(col1);
    
    drop1.append("<option value='ALL'>ALL</option>");
     
    unique1.forEach((v) =>{
        drop1.append("<option value='"
                + v + "'>" + v + "</option>");
        
    });
   
////    d3.select("#contorls").append("select")


}

function sortData(data) {
    var copy = data.filter(() => true);
    
    
    
//    if($("#unsorted").is(":checked")){
//        return copy;
//    }

      var sorted = copy.sort((a, b) => {
//        return a.ind - b.ind;
      if($("#sorted").is(":checked")){
        return d3.ascending (a['IMDB Score'], b['IMDB Score']);
      }
      if($("#sortedStr").is(":checked")){
        return d3.ascending (a.Title, b.Title);
      }//end if-else

      });

    
    
    return sorted;
}

function getUniqueValues(a) {
    var unique = a.filter((v, i) => {
        return a.indexOf(v) == i;//check if the index of the 1st occ is the current index
    });

//    console.log(unique);
    return unique.sort();
}//end getUniqueValues()


function filterData(data, key) {
    var filtered = data.filter((v) => {
        if (key == "ALL") {
            console.log("fd all g");
            console.log
            return true;
        } else {
            return v.Genre == key;
        }
    });

    return filtered;
}
function filterData1(data, key) {
    var filtered = data.filter((v) => {
        if (key == "ALL") {
            console.log("fd all l");
            
            return true;
        } else {
            return v.Language == key;
        }
    });
    return filtered;
}

function draw(data) {
    
    console.log("in draw");

    $("#svg").empty();//clears the current svg
    var filtered = filterData(data,$("#select option:selected").val());
        filtered = filterData1(filtered,$("#select1 option:selected").val());
    console.log(filtered);
    var sorted = sortData(filtered);
    var g = d3.select("svg").selectAll("g")
            .data(sorted)
//            .data(filtered)
//            .data(sorted)
            .enter()
            .append("g");

    var H = 30;
    var P = 3;
    g.append("rect")
            .attr("x", 0)
            .attr("y", (d, i) => {
                return (H + P) * i;
            })
            .attr("height", H)
            .attr("width", (d) => {
                return d['IMDB Score']*7;
            })
            .attr("fill", "lightcyan");

    g.append("text")
            .attr("x", (d) => {
                return d['IMDB Score']*7 +10;
            })
            .attr("y", (d, i) => {
                return   (H +P)* i + H / 2;
            })
            .attr("fill", "black")
            .html((d) => {
                var dt = new Date(d.Premiere);
                return d.Title+" ("+dt.getFullYear()+") (IMDB score:"+ d['IMDB Score']+")";
            });
            $("#svg").css("height",(data.length)*30 +2000);
}//end draw()



