var mysql = require('mysql');
var fs = require('fs');

//files are read directly using require since they are json files.
var obj_survey = require("./survey1.json"); //sync data read
var obj_contact = require("./org_contact.json");
var obj_arcgis = require("./arcgis_flatfile.json");

var con = mysql.createConnection({
  host: '127.0.0.1', // Important to connect to localhost after connecting via ssh in screen
  user: 'root',
  password: 'Sep@2015',
  database: 'opendata_db'
});
con.connect(function(err){
	if(err){
		console.log("err");
	}
	console.log("success");
});

//length of all json objects is stored in variables.
var surveyLen = Object.keys(obj_survey.results).length;
console.log(surveyLen);
var locationLen = Object.keys(obj_arcgis.results).length;
console.log(locationLen);
var contactsLen = Object.keys(obj_contact.results).length;
console.log(contactsLen);

//inserting from obj_arcgis and org_surveys. Duplicate values are not inserted by default.
for(var i = 0; i < locationLen; i++){
	(function(index){
		var surveyArray  = {
			survey_name: "opendata",
			object_id: obj_arcgis.results[index].profile_id,
			createdAt: obj_arcgis.results[index].createdAt,
			updatedAt: obj_arcgis.results[index].updatedAt,
		   // action: obj_survey.results[index].action
		};
		var query = con.query('INSERT INTO org_surveys SET ?', surveyArray, function(err, result) {
			if(err) console.log(err);
			//you can check the values coming in query using following console.log statement. 
		    //console.log(query.sql);
		  });
		}(i));
}

for(var i = 0; i < surveyLen; i++){
	(function(index){
		var surveyArray  = {
			survey_name: "opendata",
			object_id: obj_survey.results[index].profile_id,
			createdAt: obj_survey.results[index].createdAt,
			updatedAt: obj_survey.results[index].updatedAt,
		   // action: obj_survey.results[index].action
		};
		var query = con.query('INSERT INTO org_surveys SET ?', surveyArray, function(err, result) {
			if(err) console.log(err);
			//you can check the values coming in query using following console.log statement. 
		    //console.log(query.sql);
		  });
		}(i));
}
//for loop from location json file
// org_locations_info table
for(var i = 0; i < locationLen; i++){
    (function(index){
		if(obj_arcgis.results[index].org_hq_country == "South Korea" ){
			obj_arcgis.results[index].org_hq_country = "Korea, Rep.";
		}
		if(obj_arcgis.results[index].org_hq_country == "Venezuela" ){
			obj_arcgis.results[index].org_hq_country = "Venezuela, RB";
		}
		if(obj_arcgis.results[index].org_hq_country == "Egypt, Arab Rep." ){
			obj_arcgis.results[index].org_hq_country = "Egypt";
		}
		if(obj_arcgis.results[index].org_hq_country == "The Gambia" ){
			obj_arcgis.results[index].org_hq_country = "Gambia, The";
		}
		if(obj_arcgis.results[index].org_hq_country == "대한민국" ){
			obj_arcgis.results[index].org_hq_country = "";
		}
		
		var countryId;
		if(obj_arcgis.results[index].org_hq_country == ""){
			var loc_info = {
					org_hq_city: obj_arcgis.results[index].org_hq_city,
					org_hq_city_locode: obj_arcgis.results[index].org_hq_city_locode,
					org_hq_st_prov: obj_arcgis.results[index].org_hq_st_prov,
					latitude: obj_arcgis.results[index].latitude,
					longitude: obj_arcgis.results[index].longitude
				}
				var query1 = con.query("INSERT into org_locations_info SET ?", loc_info, function(err1, result1){
					if(err1){
						console.log(err1);
					}
				});
		} else {	
			var query = con.query("SELECT country_id from org_country_info where org_hq_country = ?" , [obj_arcgis.results[index].org_hq_country],function(err, result, fields){
				result = result[0];
				countryId = result.country_id;
				var loc_info = {
					org_hq_city: obj_arcgis.results[index].org_hq_city,
					org_hq_city_locode: obj_arcgis.results[index].org_hq_city_locode,
					org_hq_st_prov: obj_arcgis.results[index].org_hq_st_prov,
					country_id: countryId,
					latitude: obj_arcgis.results[index].latitude,
					longitude: obj_arcgis.results[index].longitude
				}
				var query1 = con.query("INSERT into org_locations_info SET ?", loc_info, function(err1, result1){
					if(err1){
						console.log(err1);
					}
				});
				//con.end();
		});
		
	}
    }(i));
}

//for loop from contacts json file
//contacts table
for(var i = 0; i < contactsLen; i++){
    (function(index){
	var profileId = "";
      //write columns names of the table which belongs to information in contacts.json
	var query = con.query("SELECT * from org_profiles where profile_id = ?" , [obj_contact.results[index].profile_id],function(err, result, fields){
				result = result[0];
				if(result === undefined){
					profileId = obj_contact.results[index].profile_id;
					console.log(profileId);
					var profileArray = {
						profile_id: profileId,
			
					}
				}
				//return countryId;
	  });
		  //write all columns names for profile and according values from json. If the value is not there in json, it takes as NULL.

    var contactsArray  = {       
        //object_id: obj_contact.results[index].objectId,
        createdAt: obj_contact.results[index].createdAt,
        updatedAt: obj_contact.results[index].updatedAt,
		profile_id: obj_contact.results[index].profile_id,
		survey_contact_email: obj_contact.results[index].survey_contact_email,
		survey_contact_first: obj_contact.results[index].survey_contact_first,
		survey_contact_last: obj_contact.results[index].survey_contact_last,
		survey_contact_phone: obj_contact.results[index].survey_contact_phone,
		survey_contact_title: obj_contact.results[index].survey_contact_title
      };
    var query = con.query('INSERT INTO org_contacts SET ?', contactsArray, function(err, result) {
		  if(err) {
			  console.log(err);
			console.log(query.sql);
		  }
      });
    }(i));
}
//data_app_info table

for(var i = 0; i < locationLen; i++){
    (function(index){
	var profileId = "";
      //write columns names of the table which belongs to information in contacts.json
    var query = con.query("SELECT * from org_profiles where profile_id = ?" , [obj_contact.results[index].profile_id],function(err, result, fields){
				result = result[0];
				if(result === undefined){
					profileId = obj_contact.results[index].profile_id;
					console.log(profileId);
					var profileArray = {
						profile_id: profileId,
			
					}
				}
				//return countryId;
	  });
		  //write all columns names for profile and according values from json. If the value is not there in json, it takes as NULL.

    var AppArray  = {       
        advocacy: obj_arcgis.results[index].advocacy,
		advocacy_desc: obj_arcgis.results[index].advocacy_desc,
		org_opt:obj_arcgis.results[index].org_opt,
		org_opt_desc: obj_arcgis.results[index].org_opt_desc,
		other: obj_arcgis.results[index].other,
		other_desc:obj_arcgis.results[index].other_desc,
		prod_srvc:  obj_arcgis.results[index].prod_srvc,
		prod_srvc_desc:obj_arcgis.results[index].prod_srvc_desc,
	    research:obj_arcgis.results[index].research,
		research_desc:obj_arcgis.results[index].research_desc,
		profile_id:obj_arcgis.results[index].profile_id
      };
     var query = con.query('INSERT INTO data_app_info SET ?', AppArray, function(err, result) {
		  if(err) {
			  console.log(err);
			console.log(query.sql);
		  }
      });
    }(i));
}

//Profile table
for(var i = 0; i < locationLen; i++) {
	(function(index) {
		if(obj_arcgis.results[index].data_use_type != null){
			console.log("not null");
			//console.log(obj_arcgis.results[index].data_use_type);
		for(var j = 0; j < obj_arcgis.results[index].data_use_type.length; j++){
			//console.log("loop");
		var arcgisArray  = {
			createdAt: obj_arcgis.results[index].createdAt,
			industry_id:obj_arcgis.results[index].industry_id,
			industry_other:obj_arcgis.results[index].industry_other,
			no_org_url:obj_arcgis.results[index].no_org_url,
			org_additional:obj_arcgis.results[index].org_additional,
			org_description:obj_arcgis.results[index].org_description,
			org_greatest_impact:obj_arcgis.results[index].org_greatest_impact,
			org_greatest_impact_detail:obj_arcgis.results[index].org_greatest_impact_detail,
			org_name:obj_arcgis.results[index].org_name,
			org_open_corporates_id:obj_arcgis.results[index].org_open_corporates_id,
			org_profile_category:obj_arcgis.results[index].org_profile_category,
			org_profile_src:obj_arcgis.results[index].org_profile_src,
			org_profile_status:obj_arcgis.results[index].org_profile_status,
			org_profile_year:obj_arcgis.results[index].org_profile_year,
			org_size_id:obj_arcgis.results[index].org_size_id,
			org_type:obj_arcgis.results[index].org_type,
			org_type_other:obj_arcgis.results[index].org_type_other,
			org_url:obj_arcgis.results[index].org_url,
			org_year_founded:obj_arcgis.results[index].org_year_founded,
			profile_id:obj_arcgis.results[index].profile_id,
			org_confidence:obj_arcgis.results[index].org_confidence,
			updatedAt:obj_arcgis.results[index].updatedAt,
			data_use_type:obj_arcgis.results[index].data_use_type[j],
			data_use_type_other:obj_arcgis.results[index].data_use_type_other
		};
		var query = con.query('INSERT INTO org_profiles SET ?', arcgisArray, function(err, result) {
        if(err){
			console.log(err);
			console.log(query.sql);
		}
		console.log(query.sql);
      });
	}
		} else {
			var arcgisArray  = {
				createdAt: obj_arcgis.results[index].createdAt,
				industry_id:obj_arcgis.results[index].industry_id,
				industry_other:obj_arcgis.results[index].industry_other,
				no_org_url:obj_arcgis.results[index].no_org_url,
				org_additional:obj_arcgis.results[index].org_additional,
				org_description:obj_arcgis.results[index].org_description,
				org_greatest_impact:obj_arcgis.results[index].org_greatest_impact,
				org_greatest_impact_detail:obj_arcgis.results[index].org_greatest_impact_detail,
				org_name:obj_arcgis.results[index].org_name,
				org_open_corporates_id:obj_arcgis.results[index].org_open_corporates_id,
				org_profile_category:obj_arcgis.results[index].org_profile_category,
				org_profile_src:obj_arcgis.results[index].org_profile_src,
				org_profile_status:obj_arcgis.results[index].org_profile_status,
				org_profile_year:obj_arcgis.results[index].org_profile_year,
				org_size_id:obj_arcgis.results[index].org_size_id,
				org_type:obj_arcgis.results[index].org_type,
				org_type_other:obj_arcgis.results[index].org_type_other,
				org_url:obj_arcgis.results[index].org_url,
				org_year_founded:obj_arcgis.results[index].org_year_founded,
				profile_id:obj_arcgis.results[index].profile_id,
				org_confidence:obj_arcgis.results[index].org_confidence,
				updatedAt:obj_arcgis.results[index].updatedAt,
				data_use_type:obj_arcgis.results[index].data_use_type,
				data_use_type_other:obj_arcgis.results[index].data_use_type_other
			};
		var query = con.query('INSERT INTO org_profiles SET ?', arcgisArray, function(err, result) {
        if(err){
			console.log(err);
			console.log(query.sql);
		}
		//console.log(query.sql);
      });
		}
		
	}(i));
}
//org data sources
for(var i = 0; i < locationLen; i++){
	(function(index){
		if(obj_arcgis.results[index].data_src_country_name == "South Korea" ){
			obj_arcgis.results[index].data_src_country_name = "Korea, Rep.";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Venezuela" ){
			obj_arcgis.results[index].data_src_country_name = "Venezuela, RB";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Egypt, Arab Rep." ){
			obj_arcgis.results[index].data_src_country_name = "Egypt";
		}
		if(obj_arcgis.results[index].data_src_country_name == "The Gambia" ){
			obj_arcgis.results[index].data_src_country_name = "Gambia, The";
		}
		if(obj_arcgis.results[index].data_src_country_name == "대한민국" ){
			obj_arcgis.results[index].data_src_country_name = "";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Macedonia, The former Yugoslav Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Macedonia, FYR";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Moldova, Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Moldova";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Korea, Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Korea, Rep.";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Tanzania, United Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Tanzania";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Iran, Islamic Rep." ){
			obj_arcgis.results[index].data_src_country_name = "Iran";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Slovakia" ){
			obj_arcgis.results[index].data_src_country_name = "Slovak Republic";
		}
		if(typeof obj_arcgis.results[index].data_src_country_name != "undefined"){
			if(obj_arcgis.results[index].data_src_country_name != null){
			console.log("not null");
			//console.log(obj_arcgis.results[index].profile_id);
		var query = con.query("SELECT country_id from org_country_info where org_hq_country = ?" , [obj_arcgis.results[index].data_src_country_name],function(err, result, fields){
				//console.log(query.sql);
				//console.log(obj_arcgis.results[index].org_hq_country);
				//console.log(obj_arcgis.results[index].profile_id);
				result = result[0];
				countryId = result.country_id;
				//console.log(countryId);
				//return countryId;
				
		  //write all columns names for profile and according values from json. If the value is not there in json, it takes as NULL.
					var dataSourcesArray  = {
					  createdAt: obj_arcgis.results[index].createdAt,
					  data_country_count: obj_arcgis.results[index].data_country_count,
					  data_type:obj_arcgis.results[index].data_type,
					  row_type:obj_arcgis.results[index].row_type,
					  profile_id:obj_arcgis.results[index].profile_id,
					  updatedAt: obj_arcgis.results[index].updatedAt,
					  country_id: countryId
					};
		var query = con.query('INSERT INTO org_data_sources SET ?', dataSourcesArray, function(err, result) {
        if(err){
			console.log(err);
			console.log(query.sql);
		}
			console.log(query.sql);
		});


			});}
			else {
				var dataSourcesArray  = {
					createdAt: obj_arcgis.results[index].createdAt,
					data_country_count: obj_arcgis.results[index].data_country_count,
					data_type:obj_arcgis.results[index].data_type,
					row_type:obj_arcgis.results[index].row_type,
					updatedAt: obj_arcgis.results[index].updatedAt,
					profile_id:obj_arcgis.results[index].profile_id,
				};
		var query = con.query('INSERT INTO org_data_sources SET ?', dataSourcesArray, function(err, result) {
        if(err){
			console.log(err);
			console.log(query.sql);
		}
		console.log(query.sql);
      });

		}
		} 
		else {

		var dataSourcesArray  = {
		  createdAt: obj_arcgis.results[index].createdAt,
		  data_country_count: obj_arcgis.results[index].data_country_count,
		  data_type:obj_arcgis.results[index].data_type,
		  row_type:obj_arcgis.results[index].row_type,
		  updatedAt: obj_arcgis.results[index].updatedAt,
		  profile_id:obj_arcgis.results[index].profile_id,
		};
		var query = con.query('INSERT INTO org_data_sources SET ?', dataSourcesArray, function(err, result) {
        if(err){
			console.log(err);
			console.log(query.sql);
		}
		console.log(query.sql);
      });

		}
	}(i));
}

//update org_loc_id
for(var i = 0; i < locationLen; i++){
	(function(index){
		
		if(obj_arcgis.results[index].data_src_country_name == "South Korea" ){
			obj_arcgis.results[index].data_src_country_name = "Korea, Rep.";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Venezuela" ){
			obj_arcgis.results[index].data_src_country_name = "Venezuela, RB";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Egypt, Arab Rep." ){
			obj_arcgis.results[index].data_src_country_name = "Egypt";
		}
		if(obj_arcgis.results[index].data_src_country_name == "The Gambia" ){
			obj_arcgis.results[index].data_src_country_name = "Gambia, The";
		}
		if(obj_arcgis.results[index].data_src_country_name == "대한민국" ){
			obj_arcgis.results[index].data_src_country_name = "";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Macedonia, The former Yugoslav Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Macedonia, FYR";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Moldova, Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Moldova";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Korea, Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Korea, Rep.";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Tanzania, United Republic of" ){
			obj_arcgis.results[index].data_src_country_name = "Tanzania";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Iran, Islamic Rep." ){
			obj_arcgis.results[index].data_src_country_name = "Iran";
		}
		if(obj_arcgis.results[index].data_src_country_name == "Slovakia" ){
			obj_arcgis.results[index].data_src_country_name = "Slovak Republic";
		}
		
		if(obj_arcgis.results[index].org_hq_country != "" ) {
			var query10 = con.query("SELECT country_id from org_country_info where org_hq_country = ?", [obj_arcgis.results[index].org_hq_country], function(err, result){
					if(err){
						console.log(query10.sql);
					}
					
					result = result[0];
					if(result !== undefined){
						countryId = result.country_id;
						console.log(countryId);
					}
			//when st is nullvand city is null
			if(obj_arcgis.results[index].org_hq_st_prov == "" && obj_arcgis.results[index].org_hq_city == "") {

				var query = con.query("SELECT object_id from org_locations_info where country_id = ? AND org_hq_city = ? AND org_hq_st_prov = ?" , [countryId,obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){
					console.log(query.sql);
				result = result[0];
				if(result !== undefined){

					objectId = result.object_id;
							//console.log(countryId);
							//return countryId;

					  //write all columns names for profile and according values from json. If the value is not there in json, it takes as NULL.
				  var data_src_array  = {
					  org_loc_id: objectId
					};

				 var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
					 if(err){
						 console.log(err);
						console.log(query.sql);
					 }

				});
				}
			});
		} else if(obj_arcgis.results[index].org_hq_city != "" && obj_arcgis.results[index].org_hq_st_prov == "" ){
			var query = con.query("SELECT object_id from org_locations_info where country_id = ? AND org_hq_city = ? AND org_hq_st_prov = ?" , [countryId,obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){

				console.log(query.sql);
				//console.log(obj_arcgis.results[index].org_hq_country);
				//console.log(obj_arcgis.results[index].profile_id);
				result = result[0];
				if(result !== undefined){

				objectId = result.object_id;
				  var data_src_array  = {
					  org_loc_id: objectId
					};
		
				 var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
					 if(err){
						 console.log(err);
						console.log(query.sql);
					 }
				  });
				}
			});
		} else if(obj_arcgis.results[index].org_hq_city == "" && obj_arcgis.results[index].org_hq_st_prov != "" ){
			var query = con.query("SELECT object_id from org_locations_info where country_id = ? AND org_hq_city = ? AND org_hq_st_prov = ?" , [countryId,obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){

				console.log(query.sql);
				//console.log(obj_arcgis.results[index].org_hq_country);
				//console.log(obj_arcgis.results[index].profile_id);
				result = result[0];
				if(result !== undefined){

				objectId = result.object_id;
				  var data_src_array  = {
					  org_loc_id: objectId
					};
					//var profile_id = 6114;

				 var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
					 //console.log(query2.sql);
					 if(err){
						 console.log(err);
						console.log(query.sql);
					 }
				  });
				}
			});
		} else {
			var query = con.query("SELECT object_id from org_locations_info where country_id = ? AND org_hq_city = ? AND org_hq_st_prov = ?" , [countryId,obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){
					console.log(query.sql);
				//console.log(obj_arcgis.results[index].org_hq_country);
				//console.log(obj_arcgis.results[index].profile_id);
				result = result[0];
				if(result !== undefined){

					objectId = result.object_id;
				  var data_src_array  = {
					  org_loc_id: objectId
					};
					//var profile_id = 6114;

				 var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
					 //console.log(query2.sql);
					 if(err){
						 console.log(err);
						console.log(query.sql);
					 }

				});
				}
			});
		}
		
			});
	} else {
		if(obj_arcgis.results[index].org_hq_city != "" && obj_arcgis.results[index].org_hq_st_prov == "" ){
			var query = con.query("SELECT object_id from org_locations_info where org_hq_city = ? AND org_hq_st_prov = ?" , [obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){

				console.log(query.sql);
				result = result[0];
				if(result !== undefined){

				objectId = result.object_id;
				var data_src_array  = {
				  org_loc_id: objectId
				};
					//var profile_id = 6114;

				var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
				 //console.log(query2.sql);
				if(err){
					 console.log(err);
					console.log(query.sql);
				 }
				});
				}
			});
		} else if(obj_arcgis.results[index].org_hq_city == "" && obj_arcgis.results[index].org_hq_st_prov != ""){
			var query = con.query("SELECT object_id from org_locations_info where org_hq_city = ? AND org_hq_st_prov = ?" , [obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){

				console.log(query.sql);
				result = result[0];
				if(result !== undefined){

				objectId = result.object_id;
				//console.log(countryId);
				//return countryId;

		  		//write all columns names for profile and according values from json. If the value is not there in json, it takes as NULL.
				var data_src_array  = {
				  org_loc_id: objectId
				};
					//var profile_id = 6114;

				var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
				 //console.log(query2.sql);
				if(err){
					 console.log(err);
					console.log(query.sql);
				 }
				});
				}
			});
		} else {
			var query = con.query("SELECT object_id from org_locations_info where org_hq_city = ? AND org_hq_st_prov = ?" , [obj_arcgis.results[index].org_hq_city,obj_arcgis.results[index].org_hq_st_prov],function(err, result, fields){
					console.log(query.sql);
				//console.log(obj_arcgis.results[index].org_hq_country);
				//console.log(obj_arcgis.results[index].profile_id);
				result = result[0];
				if(result !== undefined){

					objectId = result.object_id;
				  var data_src_array  = {
					  org_loc_id: objectId
					};
					//var profile_id = 6114;

				 var query2 = con.query('UPDATE org_profiles SET ? where profile_id = ?', [data_src_array, obj_arcgis.results[index].profile_id], function(err, result) {
					 //console.log(query2.sql);
					 if(err){
						 console.log(err);
						console.log(query.sql);
					 }

				});
				}
			});
		}
	}
	}(i));
}
//con.end();
