CREATE PROCEDURE `delete_story` (in story_id varchar(36))
BEGIN
	Delete from story_chapters where story_id = story_id;
    Delete from story where id = story_id;
END
