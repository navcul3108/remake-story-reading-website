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
	id					smallint			primary key			auto_increment,
    `name`				nvarchar(100),
    `description`		text
);
Insert Into genre(`name`, `description`) Values("Other", "The genre that the story is not belong to any specific genre else!");
Select * from genre;

Create Table If Not Exists story(
	id					varchar(36)			primary key,
    `name`				nvarchar(100),
    `description`			text,
    author				nvarchar(100),
    upload_time			datetime,
    last_modified		datetime,
    image_path			varchar(100),
    num_chapters		integer,
    genre_id			smallint not null default(1),
    num_pages			integer,
    rating				float				default 0
);

-- Create Table If Not exists story_genre(
-- 	story_id			varchar(36),
--     genre_id			smallint,
--     
--     primary key(story_id, genre_id),
--     foreign key(story_id) references story(id),
--     foreign key(genre_id) references genre(id)
-- );


create view story_and_genre_view as
Select story.*, genre.`name` as genre_name, genre.`description` as genre_description 
from story, genre
where story.genre_id = genre.id;
Select * from story_and_genre_view;

-- Drop table comment;
-- Drop table reading_history;
-- Drop table rating;
-- Drop table story_chapter;
-- drop table story;

Create Table If Not Exists story_chapter(
	story_id			varchar(36),
    title				nvarchar(100),
    `index`				integer,
    file_name			varchar(50),		-- format: /<story id>_<chapter index>.pdf
	start_page			integer,
    end_page			integer,
	
    primary key(story_id, `index`),
    foreign key(story_id) references story(id)
);

Select * from story_chapter where story_id="0e8d4630-95de-11eb-9924-5bd98a2cc98e" order by `index` ;

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
