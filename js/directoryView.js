function InitialiseView()  //Requests information via AJAX to help create the phone number Directory.
{
	pars  = "action=viewData";
	$.ajax({
	type: "POST",
	url: "ajax.php",
	data: pars,
	dataType: "json",
	success: function(data, textStatus, jqXHR){
			$("#directory").accordion('destroy'); //Break down the accordion
      $("#directory").empty(); //Remove all current entries
			ProcessListings(data["listingInfo"]);
			$("#directory").accordion({active: false, autoHeight: false, collapsible: true, navigation:true});
			ScrollDetection();
		}
  });
}

function ProcessListings(data) //Prints AJAX information from PHP and constructs the phone directory listings.
{
	var element = "";
	for(var i in data) //For each listing sent down
  {
    element += "<h2 id=\"contactBox" + data[i]["id"] + "\" class=\"contactContainer\" value=\"" + data[i]["id"] + "\"><a href=\"#paragraph" + data[i]["id"] + "\" id=\"contactLink" + data[i]["id"] + "\" class=\"contactLink\" value=\"" + data[i]["id"] + "\"><span class=\"contact\" value=\"" + data[i]["id"] + "\">" + data[i]["listing"] + "</span></a></h2><div id=\"contactNumber" + data[i]["id"] + "\" class=\"contactNumber\"></div>";
  }
	$(element).appendTo("#directory");
	
  $(".contactContainer").click(function() {
    var listing = $(this).text();
    var id = $(this).attr("value");
    pars  = "action=retrieveDirEntries";
    pars += ("&listing=" + listing);
    $.ajax({
      type: "POST",
      url: "ajax.php",
      data: pars,
      dataType: "json",
      success: function(data, textStatus, jqXHR){
      $("#contactNumber" + id).empty();
				for(var i in data) //For each listing sent down
				{
					$("<div id='numberRow" + data[i]["id"] + "' class='numberRow'><span class='numberName'>" + data[i]["name"] + ": </span><span class='number'>" + data[i]["number"] + "</span></div>").appendTo("#contactNumber" + id);
				}
      }
    });
  });
}

function DirectorySearch()
{
  var searchCriteria = $(".searchbox").val();
  pars  = "action=directorySearch";
  pars += ("&criteria=" + searchCriteria);
  $.ajax({
    type: "POST",
    url: "ajax.php",
    data: pars,
    dataType: "json",
    success: function(data, textStatus, jqXHR){
      $("#directory").accordion('destroy'); //Breakdown the accordion
      $("#directory").empty(); //Remove all current entries
      for(var i in data)
      {
        $("<h2 id=\"contactBox" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactContainer\" value=\"" + data[i]["telephone_directory_listing_id"] + "\"><a href=\"#paragraph" + data[i]["telephone_directory_listing_id"] + "\" id=\"contactLink" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactLink\" value=\"" + data[i]["telephone_directory_listing_id"] + "\"><span class=\"contact\" value=\"" + data[i]["telephone_directory_listing_id"] + "\">" + data[i]["telephone_directory_listing"] + "</span></a></h2><div id=\"contactNumber" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactNumber\"></div>").appendTo("#directory");
      }
      $("#directory").accordion({active: false, autoHeight: false, collapsible: true, navigation:true}); //Rebuild accordion
      $(".contactContainer").click(function() {
        var listing = $(this).text();
        var id = $(this).attr("value");
        pars  = "action=retrieveDirEntries";
        pars += ("&listing=" + listing);
        $.ajax({
          type: "POST",
          url: "ajax.php",
          data: pars,
          dataType: "json",
          success: function(data, textStatus, jqXHR){
          $("#contactNumber" + id).empty();
            for(var i in data) //For each listing sent down
            {
              $("<div id='numberRow" + data[i]["id"] + "' class='numberRow'><span class='numberName'>" + data[i]["name"] + ": </span><span class='number'>" + data[i]["number"] + "</span></div>").appendTo("#contactNumber" + id);
            }
          }   
        });
      }); 
      $("#directory").scrollTop(0);
      ScrollDetection();
    }  
  });
}

function ScrollDetection()
{
  var pane = $("#directory");
  var didScroll = false;
  var entriesSize = ($(".contactContainer").length * 35) - 550; //Grab the total number of entries on the page, (a number greater than 14 will make the directory height larger).
  var paneHeight = $(pane).height(); //Grab the height of the directory pane.
  if(entriesSize > paneHeight) //If the entriesSize is greater than the pane height
  {
    var overallHeight = entriesSize; //The overall size should be set to the greater height of combined entries.
  }
  else
  {
    var overallHeight = paneHeight; //Else, the overall height should be set to the directory frame height
  }
  
  if(overallHeight != paneHeight)
  {
    $(pane).scroll(function() {
      didScroll = true;
    });
    
    function UpdateCheck()
    { //At an interval of specified time, check to see if a scroll has occured.
      if ( didScroll ) //If a scroll has occured.
      {
        didScroll = false; //Set the scroll variable back to false.
        if($(pane).scrollTop() >= overallHeight) //If the scrolling has reached the bottom of the list, bring down the next batch of entries!
        {
          clearInterval(intervalID);
          AppendExtraEntries();
        }
      }
    }
    var intervalID = setInterval(UpdateCheck, 450);
  }
}

function AppendExtraEntries()
{
  pars  = "action=appendExtraListings";
  $.ajax({
    type: "POST",
    url: "ajax.php",
    data: pars,
    dataType: "json",
    success: function(data, textStatus, jqXHR){
      if(data.length > 0){ //If there are results...
      $("#directory").accordion('destroy'); //Breakdown the accordion
        for(var i in data)
        {
          $("<h2 id=\"contactBox" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactContainer\" value=\"" + data[i]["telephone_directory_listing_id"] + "\"><a href=\"#paragraph" + data[i]["telephone_directory_listing_id"] + "\" id=\"contactLink" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactLink\" value=\"" + data[i]["telephone_directory_listing_id"] + "\"><span class=\"contact\" value=\"" + data[i]["telephone_directory_listing_id"] + "\">" + data[i]["telephone_directory_listing"] + "</span></a></h2><div id=\"contactNumber" + data[i]["telephone_directory_listing_id"] + "\" class=\"contactNumber\"></div>").appendTo("#directory");
        }
        $("#directory").accordion({active: false, autoHeight: false, collapsible: true, navigation:true}); //Rebuild accordion
        $(".contactContainer").click(function() {
          var listing = $(this).text();
          var id = $(this).attr("value");
          pars  = "action=retrieveDirEntries";
          pars += ("&listing=" + listing);
          $.ajax({
            type: "POST",
            url: "ajax.php",
            data: pars,
            dataType: "json",
            success: function(data, textStatus, jqXHR){
            $("#contactNumber" + id).empty();
              for(var i in data) //For each listing sent down
              {
                $("<div id='numberRow" + data[i]["id"] + "' class='numberRow'><span class='numberName'>" + data[i]["name"] + ": </span><span class='number'>" + data[i]["number"] + "</span></div>").appendTo("#contactNumber" + id);
              }
            }          
          });
        });
        ScrollDetection();
      }      
    }
  });
}