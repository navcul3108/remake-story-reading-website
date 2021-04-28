Use story_reading_website;
Insert into `account`(email, password, last_name, first_name) values ("admin@gmail.com", "admin123456", "Admin", "I am");
Insert into `account`(email, password, last_name, first_name) values ("gmail123@gmail.com", "1234567", "Luc", "Giang Van");
Insert into `account`(email, password, last_name, first_name) values ("tran123@gmail.com", "123456", "Tran", "Ta Quoc");
Insert into `account`(email, password, last_name, first_name) values ("tran3@gmail.com", "123456", "Tran", "Ta");
Insert into `account`(email, password, last_name, first_name) values ("tuan@gmail.com", "1234567", "Tuan", "Nguyen Anh");

Insert into role(email, role) values ("admin@gmail.com", "admin");
Insert into role(email, role) values ("gmail123@gmail.com", "user");
Insert into role(email, role) values ("tran123@gmail.com", "user");
Insert into role(email, role) values ("tran3@gmail.com", "user");
Insert into role(email, role) values ("tuan@gmail.com", "user");

Insert into genre(id, `name`, `description`) values ("1", "Other", "Thể loại mà không thuộc về loại truyện cụ thể nào");
Insert into genre(id, `name`, `description`) values ("4", "Ngôn tình", "Cẩu lương ký sự");
Insert into genre(id, `name`, `description`) values ("5", "Thiếu nhi", "Truyện cho thiếu nhi");
Insert into genre(id, `name`, `description`) values ("6", "Kiếm hiệp", "Truyện về võ lâm tranh đấu");

Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("07664920-a6fe-11eb-a7cd-2ddc587f8cd6", "Kính vạn hoa tập 3 - Thám tử nghiệp dư", "Quý ròm, Tiểu Long và nhỏ Hạnh được gia đinh cho đi nghỉ mát ở Vũng Tàu một tuần. Ngay buổi sáng đầu tiên, ba người bạn nhỏ của chúng ta đã hoảng vía khi phát hiện trên vách chùa Phật nằm những câu thơ kỳ bí đầy hăm doạ", "Nguyễn Nhật Ánh", "Tue Apr 27 2021 09:12:40 GMT+0700 (Indochina Time)", "Tue Apr 27 2021 09:12:40 GMT+0700 (Indochina Time)", "/images/cover/07664920-a6fe-11eb-a7cd-2ddc587f8cd6.jpg", 10, 116, 0, 5);
Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("0e8d4630-95de-11eb-9924-5bd98a2cc98e", "Kính vạn hoa tập 1: Nhà ảo thuật gia", "Truyện hay", "Nguyễn Nhật Ánh", "Mon Apr 05 2021 14:10:52 GMT+0700 (Indochina Time)", "Mon Apr 05 2021 14:10:52 GMT+0700 (Indochina Time)", "/images/cover/0e8d4630-95de-11eb-9924-5bd98a2cc98e.jpg", 10, 90, 0, 5);
Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("1adacc40-a4fd-11eb-90f8-ed9852085af5", "Anh hùng xạ điêu", "Anh hùng xạ điêu là một trong những tiểu thuyết võ hiệp của Kim Dung được đánh giá cao, xuất bản năm 1957 bởi Hương Cảng Thương Báo. Đây là tiểu thuyết đầu tiên của Xạ Điêu Tam Bộ Khúc. Kim Dung đã chỉnh sửa tất cả các tác phẩm của mình bao gồm tiểu thuyết này vào những năm 1970 và một lần nữa vào những năm 2000.", "Kim Dung", "Sat Apr 24 2021 20:00:55 GMT+0700 (Indochina Time)", "Sat Apr 24 2021 20:00:55 GMT+0700 (Indochina Time)", "/images/cover/1adacc40-a4fd-11eb-90f8-ed9852085af5.jpg", 40, 1368, 0, 6);
Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("2a292a30-a44d-11eb-8325-b7d7db057834", "Cho tôi 1 vé đi tuổi thơ", "Truyện Cho tôi xin một vé đi tuổi thơ là sáng tác mới nhất của nhà văn Nguyễn Nhật Ánh. Nhà văn mời người đọc lên chuyến tàu quay ngược trở lại thăm tuổi thơ và tình bạn dễ thương của 4 bạn nhỏ. Những trò chơi dễ thương thời bé, tính cách thật thà, thẳng thắn một cách thông minh và dại dột, những ước mơ tự do trong lòng… khiến cuốn sách có thể làm các bậc phụ huynh lo lắng rồi thở phào. Không chỉ thích hợp với người đọc trẻ, cuốn sách còn có thể hấp dẫn và thực sự có ích cho người lớn trong quan hệ với con mình.", "Nguyễn Nhật Ánh", "Fri Apr 23 2021 23:01:29 GMT+0700 (Indochina Time)", "Fri Apr 23 2021 23:01:29 GMT+0700 (Indochina Time)", "/images/cover/2a292a30-a44d-11eb-8325-b7d7db057834.png", 12, 88, 0, 5);
Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("55eab970-a44f-11eb-8325-b7d7db057834", "Kính vạn hoa - Tập 02 - Những con gấu bông", "Đang dạo chơi trong công viên Đầm Sen, Tiểu Long bồng nhìn thấy con gấu bông mà em gái mình ao ước trong góc quầy phần thưởng của gian trờ chơi ném lon. Để có được con gấu bông đó phải ném đổ năm chồng lon liên tiếp - một điều như không thể làm nổi! Vậy Tiểu Long làm sao? Rốt cuộc có đem về cho nhỏ Oanh con gấu bông đó không?", "Nguyễn Nhật Ánh", "Fri Apr 23 2021 23:17:02 GMT+0700 (Indochina Time)", "Fri Apr 23 2021 23:17:02 GMT+0700 (Indochina Time)", "/images/cover/55eab970-a44f-11eb-8325-b7d7db057834.png", 10, 90, 0, 5);
Insert into story(id, `name`, `description`, author, upload_time, last_modified, image_path, num_chapters, num_pages, rating, genre_id) values ("ec186fd0-a70d-11eb-937d-df496dee38b2", "Kính vạn hoa tập 4 - Ông thầy nóng tính", "Trong lớp Quý ròm là một học sinh \"siêu toán\", thường được nhà trường cử đi tham gia các cuộc thi học sinh giỏi toán toàn thành phố. Trong khi đó Tiều Long lại sợ học toán đến nỗi cứ thấy môn toán là 'hết muốn sống', Quý ròm không thể chấp nhận tình trạng đó.", "Nguyễn Nhật Ánh", "Tue Apr 27 2021 11:06:20 GMT+0700 (Indochina Time)", "Tue Apr 27 2021 11:06:20 GMT+0700 (Indochina Time)", "/images/cover/ec186fd0-a70d-11eb-937d-df496dee38b2.jpg", 10, 94, 0, 5);

