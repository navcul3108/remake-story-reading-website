Create Database If Not Exists story_reading_website;

use story_reading_website;

Drop Table `account`;
Create Table If Not Exists `account`(
    email				nvarchar(50)			primary key,
    `password`			nvarchar(30)			not null,
    last_name			nvarchar(50),
    first_name			nvarchar(50)    
);

Create Table If Not Exists `role`(
	email				nvarchar(50),
    `role`				nvarchar(50) 			check (`role` in ("admin", "user"))			default  "user",
    
    primary key(email, `role`),
    foreign key(email) references `account`(email)
);