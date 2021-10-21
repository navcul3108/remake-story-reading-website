CREATE DEFINER=`root`@`localhost` PROCEDURE `post_comment`(in i_story_id varchar(36), in i_email varchar(50), in i_content text)
BEGIN
	Declare inserting_index smallint;
    Select max(`index`)+1 into inserting_index from story_comment where story_id = i_story_id and email = i_email; 
    Insert into story_comment(story_id, email, `index`, content) Values(i_story_id, i_email, inserting_index, i_content);
END