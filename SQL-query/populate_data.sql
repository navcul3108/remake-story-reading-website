Use story_reading_website;

Insert Into `account`(email, `password`, first_name, last_name) Values("admin@gmail.com", "admin123456", "I am", "Admin");
Insert Into `role`(email, `role`) Values("admin@gmail.com", "admin");

Select * From story;
Delete From story where id!="i";
Select * from story_chapter;
Delete From story_chapter where story_id!="1";