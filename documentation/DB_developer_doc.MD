DB Schema Details:
----------------------------
----------------------------
Relational Database Schema named `opendata_db` 

The schema has 7 tables:

1)Org_survey table 
----------------------------------------
```CREATE TABLE `org_surveys` (
  `object_id` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `notes` varchar(45) DEFAULT NULL,
  `survey_name` varchar(45) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`object_id`)
)``` 

2)Org_profile table:
----------------------------------------
```CREATE TABLE `org_profiles` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `industry_id` varchar(45) DEFAULT NULL,
  `industry_other` varchar(45) DEFAULT NULL,
  `no_org_url` varchar(45) DEFAULT NULL,
  `org_additional` varchar(45) DEFAULT NULL,
  `org_description` varchar(200) DEFAULT NULL,
  `org_greatest_impact` varchar(45) DEFAULT NULL,
  `org_greatest_impact_detail` varchar(45) DEFAULT NULL,
  `org_name` varchar(150) DEFAULT NULL,
  `org_open_corporates_id` varchar(45) DEFAULT NULL,
  `org_profile_category` varchar(45) DEFAULT NULL,
  `org_profile_src` varchar(45) DEFAULT NULL,
  `org_profile_status` varchar(45) DEFAULT NULL,
  `org_profile_year` varchar(45) DEFAULT NULL,
  `org_size_id` varchar(45) DEFAULT NULL,
  `org_type` varchar(45) DEFAULT NULL,
  `org_type_other` varchar(45) DEFAULT NULL,
  `org_url` varchar(100) DEFAULT NULL,
  `org_year_founded` varchar(45) DEFAULT NULL,
  `profile_id` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `org_loc_id` int(11) DEFAULT NULL,
  `data_use_type` varchar(45) DEFAULT NULL,
  `data_use_type_other` varchar(45) DEFAULT NULL,
  `org_confidence` int(11) DEFAULT NULL,
  `machine_read` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `fk_org_prof_id_idx` (`profile_id`),
  KEY `fk_org_loc_id_idx` (`org_loc_id`),
  CONSTRAINT `org_profiles_ibfk_2` FOREIGN KEY (`org_loc_id`) REFERENCES `org_locations_info` (`object_id`),
  CONSTRAINT `org_profiles_ibfk_3` FOREIGN KEY (`profile_id`) REFERENCES `org_surveys` (`object_id`)
)``` 

3)Org_country_info table:
----------------------------
```CREATE TABLE `org_country_info` (
  `country_id` int(11) NOT NULL AUTO_INCREMENT,
  `org_hq_country` varchar(45) DEFAULT NULL,
  `org_hq_country_income` varchar(45) DEFAULT NULL,
  `org_hq_country_income_code` varchar(45) DEFAULT NULL,
  `org_hq_country_locode` varchar(45) DEFAULT NULL,
  `org_hq_country_region` varchar(45) DEFAULT NULL,
  `org_hq_country_region_code` varchar(45) DEFAULT NULL,
  `ISO2` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`country_id`)
)```

*** This is a Static Table.

4)Org_Locations_info table:
----------------------------------------
```CREATE TABLE `org_locations_info` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `org_hq_city` varchar(45) DEFAULT NULL,
  `org_hq_city_locode` varchar(45) DEFAULT NULL,
  `org_hq_st_prov` varchar(45) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `latitude` varchar(45) DEFAULT NULL,
  `longitude` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `country_id` (`country_id`),
  CONSTRAINT `org_locations_info_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `org_country_info` (`country_id`),
  CONSTRAINT `org_locations_info_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `org_country_info` (`country_id`)
)```

5)Org_data_sources table:
----------------------------
```CREATE TABLE `org_data_sources` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `data_country_count` varchar(45) DEFAULT NULL,
  `data_type` varchar(45) DEFAULT NULL,
  `row_type` varchar(45) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `data_src_gov_level` varchar(45) DEFAULT NULL,
  `profile_id` int(11) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `machine_read` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `country_id` (`country_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `org_data_sources_ibfk_2` FOREIGN KEY (`country_id`) REFERENCES `org_country_info` (`country_id`),
  CONSTRAINT `org_data_sources_ibfk_3` FOREIGN KEY (`profile_id`) REFERENCES `org_profiles` (`profile_id`)
)```

6)Org_contacts table:
----------------------------
```CREATE TABLE `org_contacts` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `survey_contact_email` varchar(45) DEFAULT NULL,
  `survey_contact_first` varchar(45) DEFAULT NULL,
  `survey_contact_last` varchar(45) DEFAULT NULL,
  `survey_contact_phone` varchar(45) DEFAULT NULL,
  `survey_contact_title` varchar(45) DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `profile_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `org_contacts_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `org_profiles` (`profile_id`)
)```

7)Data_app_info table:
----------------------------
```CREATE TABLE `data_app_info` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `advocacy` varchar(45) DEFAULT NULL,
  `advocacy_desc` varchar(45) DEFAULT NULL,
  `org_opt` varchar(45) DEFAULT NULL,
  `org_opt_desc` varchar(45) DEFAULT NULL,
  `other` varchar(45) DEFAULT NULL,
  `other_desc` varchar(45) DEFAULT NULL,
  `prod_srvc` varchar(45) DEFAULT NULL,
  `prod_srvc_desc` varchar(45) DEFAULT NULL,
  `research` varchar(45) DEFAULT NULL,
  `research_desc` varchar(45) DEFAULT NULL,
  `profile_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`object_id`),
  KEY `profile_id` (`profile_id`),
  CONSTRAINT `data_app_info_ibfk_1` FOREIGN KEY (`profile_id`) REFERENCES `org_profiles` (`profile_id`)
)```

Survey Interface
----------------------------
----------------------------
### (http://www.opendataenterprise.org/map/survey)


1. The layout of the interface is implemented at `/templates/survey/tp_survey.php`
2. http://www.opendataenterprise.org/index.html calls  `map/survey/start` function in index.php file using slim framework.

/start/ function
------------------------------------
	It has following two queries: 
		1. retrieve max object id from org-surveys table
		2. Insert new object id with id as maxId + 1 into org_surveys table
	
3. Pass last inserted survey id to `map/survey/:surveyId/form` where surveyId is the passed surveyId
	
3. `:surveyId/form` function calls `survey/tp_survey.php` file

4. User fills survey form and then submits it

5. After form submission, it calls `/map/survey/2du/:surveyId` function in index.php

6. All the insertion of data using mysql queries is done in `/map/survey/2du` function

/2du/:surveyId Function
------------------------------------
1. All processing of input data provided by user in the form is done in this function.
2. Retrieve `org_hq_country` name from `org_hq_country_locade` using wb_region
### Queries executed in this function:
	1. Retrieve country id from org_hq_country table based on org_hq_country name
	2. Insert into org_locations_info table all location based user data along with country id retrieve from previous query.
	3. Insert into org_profiles table along with profile id as survey id of the form and org_loc_id as last inserted object id from org_locations table in second query
	4. Insert into org_contact table all survey_contact related user data along with profile id as survey id
	5. Insert into data_app_info table with alll respective column information from user input.
	6. Creating two conditions for data_use_type based on user input
		a. one data_type:
			i. Retrieve country id from org_hq_country table based on org_hq_country name
			ii. insert into org_data_sources with data_type, profile id and country id
			
		b. More than one data_type 
			For each data_type:
				i. Retrieve country id from org_hq_country table based on org_hq_country name
				ii. insert into org_data_sources with data_type, profile id and country id
				
3. Calls `/map/survey/:surveyId/thankyou` function after successful execution of all queries 

4. All survey related information along with profile id is passed to `survey/tp_thankyou.php` from `/:surveyId/thankyou` function

Survey Edit
---------------------
---------------------
`/map/survey/edit/:surveyId` is called from `/survey/tp_thankyou.php` file

/edit/:profile_id function
---------------------------------
### Queries executed in this function:
	Retrieve org_name from org_profiles table using profile id
1. Calls `survey/tp_profile_edit_msg.php` file and passes `org_name` information.

2. `survey/tp_profile_edit_msg.php` file calls `/map/survey/edit/:profileId/form` function from index.php file

/edit/:profileId/form function
----------------------------------
### Queries executed in this function:
	1. Retrieve all information from org_profiles table based on profile id
	2. Retrieve all information from org_data_sources based on profile id
	3. Retrieve all information from org_locations_info based org_loc_id which is retrieved in the first query
	4. Retrieve all information from org_country_info based on org_loc_id which is retrieved in the third query
	5. Retrieve all information from data_app_info based on profile id
	6. insert into org_surveys with new survey id for edited form

1. Sends all retrieved information to `survey/tp_profile_edit.php` file along with new profile id

2. `survey/tp_profile_edit.php` file, it displays all information received from `/edit/:profileId/form` function 

3. After submission of edited form, it calls `/map/survey/2du/:surveyId` function and process all information as described above for `/2du/:surveyId` function.


	


