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

Create Table If Not Exists genre(
	id					smallint			primary key,
    `name`				nvarchar(100),
    `description`		text
);

Create Table If Not Exists story(
	id					varchar(36)			primary key,
    `name`				nvarchar(100),
    `description`			text,
    author				nvarchar(100),
    upload_time			datetime,
    last_modified		datetime,
    image_path			varchar(50),
    num_chapters		integer,
    rating				float				default 0
);

Create Table If Not Exists story_chapter(
	story_id			varchar(36),
    title				nvarchar(100),
    `index`				integer,
    file_name			varchar(50),		-- format: <story id>_<chapter index>.pdf
	
    primary key(story_id, `index`),
    foreign key(story_id) references story(id)
);

Create Table If Not Exists reading_history(
	story_id			varchar(36),
    email				nvarchar(50),
    reading_time		datetime,
    chapter				integer,
    
    primary key(story_id, email),
    foreign key(story_id) references story(id),
    foreign key(email) references `account`(email)
);

Create table if not exists rating(
	story_id			varchar(36),
    rate				integer,
	email				nvarchar(50),
    
    primary key(story_id, email),
    foreign key(story_id) references story(id),
    foreign key(email) references `account`(email)
);

Create table if not exists `comment`(
	story_id			varchar(36),
    chapter				integer,
    `time`				datetime,
    content				text,
    email				nvarchar(50)
);
