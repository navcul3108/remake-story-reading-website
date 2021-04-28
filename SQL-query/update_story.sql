CREATE PROCEDURE `update_story` (in story_id varchar(36),in story_name nvarchar(100),in story_author nvarchar(100))
BEGIN
	Update story Set `name` = story_name, author = story_author
    where id = story_id;
END