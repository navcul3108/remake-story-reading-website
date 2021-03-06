-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: story_reading_website
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(30) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `first_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `birthday` datetime DEFAULT NULL,
  `avatar_url` varchar(100) DEFAULT '/images/avatar/default.png',
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT  IGNORE INTO `account` (`email`, `password`, `last_name`, `first_name`, `birthday`, `avatar_url`) VALUES ('admin@gmail.com','admin123456','Admin','I am',NULL,'/images/avatar/admin.png'),('gmail123@gmail.com','1234567','Luc','Giang Van',NULL,'/images/avatar/default.png'),('tran123@gmail.com','123456','Tran','Ta Quoc','2000-03-27 12:00:00','/images/avatar/14cd0620-46d2-11ec-b202-df09366d1fda.jpg'),('tran3@gmail.com','123456','Tran','Ta',NULL,'/images/avatar/default.png'),('tuan@gmail.com','1234567','Tuan','Nguyen Anh',NULL,'/images/avatar/default.png');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `average_rating`
--

DROP TABLE IF EXISTS `average_rating`;
/*!50001 DROP VIEW IF EXISTS `average_rating`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `average_rating` AS SELECT 
 1 AS `story_id`,
 1 AS `avg_rating`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `favourite`
--

DROP TABLE IF EXISTS `favourite`;
/*!50001 DROP VIEW IF EXISTS `favourite`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `favourite` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `author`,
 1 AS `num_chapters`,
 1 AS `image_path`,
 1 AS `rate`,
 1 AS `email`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `genre`
--

DROP TABLE IF EXISTS `genre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genre` (
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genre`
--

LOCK TABLES `genre` WRITE;
/*!40000 ALTER TABLE `genre` DISABLE KEYS */;
INSERT  IGNORE INTO `genre` (`id`, `name`, `description`) VALUES (1,'Thể loại khác','Thể loại mà không thuộc về loại truyện cụ thể nào'),(4,'Ngôn tình',' tiểu thuyết tình cảm lãng mạn, sến súa, hài, nhẹ nhàng về tình yêu giữa nam và nữ'),(5,'Thiếu nhi','Tất cả các cuốn sách viết cho trẻ em, ngoại trừ các tác phẩm như truyện tranh, truyện cười, sách hoạt hình và các tác phẩm phi hư cấu không được đọc từ trước ra sau, như từ điển, bách khoa toàn thư và các tài liệu tham khảo khác'),(6,'Kiếm hiệp','Truyện về võ lâm tranh đấu');
/*!40000 ALTER TABLE `genre` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS `rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rating` (
  `story_id` varchar(36) NOT NULL,
  `rate` int DEFAULT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`story_id`,`email`),
  KEY `email` (`email`),
  CONSTRAINT `rating_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `story` (`id`),
  CONSTRAINT `rating_ibfk_2` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  CONSTRAINT `rating_chk_1` CHECK (((`rate` >= 1) and (`rate` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

LOCK TABLES `rating` WRITE;
/*!40000 ALTER TABLE `rating` DISABLE KEYS */;
INSERT  IGNORE INTO `rating` (`story_id`, `rate`, `email`) VALUES ('2563d480-a76f-11eb-9cad-272a2cc7219a',1,'admin@gmail.com'),('2563d480-a76f-11eb-9cad-272a2cc7219a',2,'gmail123@gmail.com'),('2563d480-a76f-11eb-9cad-272a2cc7219a',3,'tran123@gmail.com'),('2563d480-a76f-11eb-9cad-272a2cc7219a',1,'tran3@gmail.com'),('2563d480-a76f-11eb-9cad-272a2cc7219a',3,'tuan@gmail.com'),('2b465f20-a770-11eb-a8be-65f2a96f4f2d',4,'tuan@gmail.com'),('831896c0-a76e-11eb-9cad-272a2cc7219a',4,'tran123@gmail.com'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',5,'tran123@gmail.com'),('d97e2230-a770-11eb-a8be-65f2a96f4f2d',4,'tran123@gmail.com'),('fa7ee560-4206-11ec-8ceb-4332de05ca32',4,'tran123@gmail.com');
/*!40000 ALTER TABLE `rating` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `role` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`email`,`role`),
  CONSTRAINT `role_ibfk_1` FOREIGN KEY (`email`) REFERENCES `account` (`email`),
  CONSTRAINT `role_chk_1` CHECK ((`role` in (_utf8mb4'admin',_utf8mb4'user')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT  IGNORE INTO `role` (`email`, `role`) VALUES ('admin@gmail.com','admin'),('gmail123@gmail.com','user'),('tran123@gmail.com','user'),('tran3@gmail.com','user'),('tuan@gmail.com','user');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story`
--

DROP TABLE IF EXISTS `story`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story` (
  `id` varchar(36) NOT NULL,
  `name` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `description` text,
  `author` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `upload_time` datetime DEFAULT NULL,
  `last_modified` datetime DEFAULT NULL,
  `image_path` varchar(100) DEFAULT NULL,
  `num_chapters` int DEFAULT NULL,
  `num_pages` int DEFAULT NULL,
  `rating` float DEFAULT '0',
  `genre_id` smallint NOT NULL DEFAULT (1),
  PRIMARY KEY (`id`),
  KEY `genre_id` (`genre_id`),
  CONSTRAINT `story_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story`
--

LOCK TABLES `story` WRITE;
/*!40000 ALTER TABLE `story` DISABLE KEYS */;
INSERT  IGNORE INTO `story` (`id`, `name`, `description`, `author`, `upload_time`, `last_modified`, `image_path`, `num_chapters`, `num_pages`, `rating`, `genre_id`) VALUES ('2563d480-a76f-11eb-9cad-272a2cc7219a','Kính vạn hoa tập 3: Thám tử nghiệp dư','Quý ròm, Tiểu Long và nhỏ Hạnh được gia đinh cho đi nghỉ mát ở Vũng Tàu một tuần. Ngay buổi sáng đầu tiên, ba người bạn nhỏ của chúng ta đã hoảng vía khi phát hiện trên vách chùa Phật nằm những câu thơ kỳ bí đầy hăm doạ.','Nguyễn Nhật Ánh','2021-04-27 22:42:18','2021-04-27 22:42:18','/images/cover/2563d480-a76f-11eb-9cad-272a2cc7219a.jpg',12,116,0,5),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Kính vạn hoa tập 4: Ông thầy nóng tính','Trong lớp Quý ròm là một học sinh \"siêu toán\", thường được nhà trường cử đi tham gia các cuộc thi học sinh giỏi toán toàn thành phố. Trong khi đó Tiều Long lại sợ học toán đến nỗi cứ thấy môn toán là \"hết muốn sống\", Quý ròm khôngthể chấp nhận tình trạng đó.﻿﻿','Nguyễn Nhật Ánh','2021-04-27 22:49:37','2021-04-27 22:49:37','/images/cover/2b465f20-a770-11eb-a8be-65f2a96f4f2d.jpg',10,94,0,5),('831896c0-a76e-11eb-9cad-272a2cc7219a','Kính vạn hoa tập 1: Nhà ảo thuật gia','Nguyễn Nhật Ánh là một nhà văn rất thân thuộc với các độc giả trẻ. Anh là một hiện tượng trong văn học Vịệt Nam.Nguyễn Nhật Ánh chủ yếu viết truyện cho thiếu nhi.','Nguyễn Nhật Ánh','2021-04-27 22:37:48','2021-04-27 22:37:48','/images/cover/831896c0-a76e-11eb-9cad-272a2cc7219a.png',10,90,0,5),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Anh hùng xạ điêu','Truyện xảy ra vào thời Tống (960-1279) khi người Nữ Chân bắt đầu tấn công bắc Trung Quốc. Phần đầu của tiểu thuyết xoay quanh tình bạn giữa Dương Thiết Tâm và Quách Khiếu Thiên, những anh hùng đã chiến đấu chống lại sự xâm chiếm lính Kim. Mối quan hệ của họ sâu đến nỗi họ thề khi con lớn, chúng sẽ trở thành huynh đệ kết nghĩa hoặc lấy nhau. Phần hai của câu chuyện tập trung vào những gian nan đau khổ mà cả hai trải qua. Quách Tĩnh, con của Quách Khiếu Thiên lớn lên ở Mông Cổ, dưới sự bảo vệ của Thành Cát Tư Hãn. Dương Khang mặt khác lớn lên là hoàng thân của nhà Kim. Quách Tĩnh tuy được bảy quái nhân nuôi dưỡng truyền thụ võ công, nhưng khi trưởng thành lại hành hiệp trượng nghĩa. Trái lại Dương Khang tuy được Toàn Chân thất tử thu nhận làm đồ đệ, hết lòng dạy dỗ, nhưng lớn lên lại gian hiểm, độc ác, hại chết cả cha ruột của mình. Ðủ thấy con người dù sống trong hoàn cảnh nào cũng không bị ảnh hưởng đến bản tính tự nhiên của mình.','Kim Dung','2021-04-27 23:13:50','2021-04-27 23:13:50','/images/cover/8d1a22b0-a773-11eb-aaf6-ff7707760ec7.jpg',40,1368,0,6),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Kính vạn hoa tập 02: Những con gấu bông','Đang dạo chơi trong công viên Đầm Sen, Tiểu Long bồng nhìn thấy con gấu bông mà em gái mình ao ước trong góc quầy phần thưởng của gian trờ chơi ném lon.','Nguyễn Nhật Ánh','2021-04-27 22:54:29','2021-04-27 22:54:29','/images/cover/d97e2230-a770-11eb-a8be-65f2a96f4f2d.png',10,105,0,5),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Cô gái năm ấy chúng ta cùng theo đuổi','Rất nhiều cậu trai để ý Thẩm Giai Nghi.Tạ Minh Hòa hiểu biết, có thể nói với cô từ chuyện xe hơi sang chuyện máy tính, rồi lại sang chuyện phong tục tập quán.Tạ Mạnh Học học giỏi, hay làm thơ vớ vẩn tặng Giai Nghi.Liêu Anh Hoằng vui vẻ, giỏi kể chuyện cười.Trương Gia Huấn tính tình quai quái, rất hay điện thoại đến cà kê dê ngỗng với cô.Kha Cảnh Đằng sôi nổi nghịch ngợm, luôn làm Giai Nghi bất ngờ.Bắt đầu cuộc chạy đua âm thầm có, công khai có, để giành được thiện cảm của cô bạn xinh xắn học giỏi nhất trường.Dù ai thắng, ai thua, ai thành công, ai thất bại, ai bỏ cuộc, ai ù nhầm, thì cô bé Thẩm Giai Nghi cũng đã trở thành hiện thân đẹp đẽ nhất của một thời niên thiếu trẻ trung sôi nổi trong họ.Nên, \"hãy cứ để mình tiếp tục thích cậu.\"','Cửu Bá Đao','2021-11-10 16:17:11','2021-11-10 16:17:11','/images/cover/fa7ee560-4206-11ec-8ceb-4332de05ca32.jpg',26,258,0,4);
/*!40000 ALTER TABLE `story` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `story_and_genre_view`
--

DROP TABLE IF EXISTS `story_and_genre_view`;
/*!50001 DROP VIEW IF EXISTS `story_and_genre_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `story_and_genre_view` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `description`,
 1 AS `author`,
 1 AS `upload_time`,
 1 AS `last_modified`,
 1 AS `image_path`,
 1 AS `num_chapters`,
 1 AS `num_pages`,
 1 AS `rating`,
 1 AS `genre_id`,
 1 AS `genre_name`,
 1 AS `genre_description`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `story_chapter`
--

DROP TABLE IF EXISTS `story_chapter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_chapter` (
  `story_id` varchar(36) NOT NULL,
  `title` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `index` int NOT NULL,
  `file_name` varchar(50) DEFAULT NULL,
  `start_page` int DEFAULT NULL,
  `end_page` int DEFAULT NULL,
  PRIMARY KEY (`story_id`,`index`),
  CONSTRAINT `story_chapter_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `story` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_chapter`
--

LOCK TABLES `story_chapter` WRITE;
/*!40000 ALTER TABLE `story_chapter` DISABLE KEYS */;
INSERT  IGNORE INTO `story_chapter` (`story_id`, `title`, `index`, `file_name`, `start_page`, `end_page`) VALUES ('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 1',1,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_1.pdf',3,11),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 2',2,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_2.pdf',12,21),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 3',3,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_3.pdf',22,31),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 4',4,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_4.pdf',32,40),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 5',5,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_5.pdf',41,49),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 6',6,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_6.pdf',50,59),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 7',7,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_7.pdf',60,71),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 8',8,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_8.pdf',72,84),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 9',9,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_9.pdf',85,98),('2563d480-a76f-11eb-9cad-272a2cc7219a','Chương 10',10,'/pdf/5/2563d480-a76f-11eb-9cad-272a2cc7219a_10.pdf',99,116),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 1',1,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_1.pdf',3,13),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 2',2,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_2.pdf',14,20),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 3',3,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_3.pdf',21,30),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 4',4,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_4.pdf',31,40),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 5',5,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_5.pdf',41,48),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 6',6,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_6.pdf',49,56),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 7',7,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_7.pdf',57,65),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 8',8,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_8.pdf',66,72),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 9',9,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_9.pdf',73,84),('2b465f20-a770-11eb-a8be-65f2a96f4f2d','Chương 10',10,'/pdf/5/2b465f20-a770-11eb-a8be-65f2a96f4f2d_10.pdf',85,94),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 1',1,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_1.pdf',3,8),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 2',2,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_2.pdf',9,18),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 3',3,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_3.pdf',19,25),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 4',4,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_4.pdf',26,33),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 5',5,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_5.pdf',34,44),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 6',6,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_6.pdf',45,52),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 7',7,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_7.pdf',53,58),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 8',8,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_8.pdf',59,63),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 9',9,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_9.pdf',64,74),('831896c0-a76e-11eb-9cad-272a2cc7219a','Chương 10',10,'/pdf/5/831896c0-a76e-11eb-9cad-272a2cc7219a_10.pdf',75,90),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Tai Họa Bất Ngờ',1,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_1.pdf',4,43),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Giang Nam Thất Quái',2,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_2.pdf',44,80),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Gió Cát Sa Mạc',3,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_3.pdf',81,114),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Hắc Phong Song Sát',4,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_4.pdf',115,148),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Cung Loan Bắn Điêu',5,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_5.pdf',149,181),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Nghi Trận Đầu Non',6,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_6.pdf',182,222),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Tỉ Võ Chiêu Thân',7,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_7.pdf',223,267),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Chứng Tỏ Bản Lĩnh',8,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_8.pdf',268,292),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Thương Sắt Cày Hư',9,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_9.pdf',293,329),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Oan Gia Gặp Gỡ',10,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_10.pdf',330,355),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Trường Xuân Nhận Thua',11,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_11.pdf',356,399),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Kháng Long Hữu Hối',12,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_12.pdf',400,446),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Phế Nhân Ngũ Hồ',13,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_13.pdf',447,493),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Đảo Chủ Đào Hoa',14,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_14.pdf',494,528),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Thần Long Bái Vĩ',15,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_15.pdf',529,556),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Cửu Âm Chân Kinh',16,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_16.pdf',557,592),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Song Thủ Hổ Bác',17,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_17.pdf',593,619),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Ba Cái Đề Thi',18,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_18.pdf',620,656),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Sóng To Cá Mập',19,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_19.pdf',657,689),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Lén Sửa Kinh Văn',20,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_20.pdf',690,710),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Đá Nặng Ngàn Cân',21,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_21.pdf',711,754),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Cưỡi Cá Ngao Du',22,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_22.pdf',755,795),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Đại Náo Cấm Cung',23,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_23.pdf',796,830),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Mật Thất Trị Thương',24,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_24.pdf',831,862),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Quán Nhỏ Hoang Thôn',25,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_25.pdf',863,906),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Thề Mới, Hẹn Cũ',26,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_26.pdf',907,936),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Trước Đài Hiên Viên',27,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_27.pdf',937,965),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Trên Ngọn Thiết Chưởng',28,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_28.pdf',966,996),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Gái Ẩn Đầm Tối',29,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_29.pdf',997,1028),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Nhất Đăng Đại Sư',30,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_30.pdf',1029,1060),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Khăn Gấm Uyên Ương',31,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_31.pdf',1061,1098),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Sông To Thác Hiểm',32,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_32.pdf',1099,1127),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Nạn Lớn Ngày Sau',33,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_33.pdf',1128,1143),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Biến Cố Trên Đảo',34,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_34.pdf',1144,1175),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Trong Miếu Thiết Thương',35,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_35.pdf',1180,1211),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Đại Quân Tây Chinh',36,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_36.pdf',1212,1244),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Trên Trời Rơi Xuống',37,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_37.pdf',1245,1279),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Mật Lệnh Cẩm Nang',38,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_38.pdf',1280,1307),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Thị Phi Thiện Ác',39,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_39.pdf',1308,1334),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7','Hoa Sơn Luận Kiếm',40,'/pdf/6/8d1a22b0-a773-11eb-aaf6-ff7707760ec7_40.pdf',1335,1368),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 1',1,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_1.pdf',3,8),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 2',2,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_2.pdf',9,19),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 3',3,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_3.pdf',20,32),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 4',4,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_4.pdf',33,43),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 5',5,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_5.pdf',44,54),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 6',6,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_6.pdf',55,62),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 7',7,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_7.pdf',63,71),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 8',8,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_8.pdf',72,84),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 9',9,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_9.pdf',85,93),('d97e2230-a770-11eb-a8be-65f2a96f4f2d','Chương 10',10,'/pdf/5/d97e2230-a770-11eb-a8be-65f2a96f4f2d_10.pdf',94,105),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 1',1,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_1.pdf',1,6),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 2',2,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_2.pdf',7,16),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 3',3,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_3.pdf',17,27),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 4',4,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_4.pdf',28,39),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 5',5,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_5.pdf',40,48),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 6',6,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_6.pdf',49,57),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 7',7,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_7.pdf',58,65),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 8',8,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_8.pdf',66,75),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 9',9,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_9.pdf',76,85),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 10',10,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_10.pdf',86,92),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 11',11,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_11.pdf',93,102),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 12',12,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_12.pdf',103,110),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 13',13,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_13.pdf',111,115),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 14',14,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_14.pdf',116,126),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 15',15,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_15.pdf',127,138),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 16',16,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_16.pdf',139,153),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 17',17,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_17.pdf',154,163),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 18',18,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_18.pdf',164,171),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 19',19,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_19.pdf',172,180),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 20',20,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_20.pdf',181,191),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 21',21,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_21.pdf',192,206),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 22',22,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_22.pdf',207,226),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 23',23,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_23.pdf',227,234),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 24',24,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_24.pdf',235,243),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 25',25,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_25.pdf',244,251),('fa7ee560-4206-11ec-8ceb-4332de05ca32','Chương 26',26,'/pdf/4/fa7ee560-4206-11ec-8ceb-4332de05ca32_26.pdf',252,258);
/*!40000 ALTER TABLE `story_chapter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_comment`
--

DROP TABLE IF EXISTS `story_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_comment` (
  `story_id` varchar(36) NOT NULL,
  `index` smallint NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` text,
  `post_time` datetime DEFAULT NULL,
  PRIMARY KEY (`story_id`,`index`),
  KEY `story_comment_ibfk_2` (`email`),
  CONSTRAINT `story_comment_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `story` (`id`),
  CONSTRAINT `story_comment_ibfk_2` FOREIGN KEY (`email`) REFERENCES `account` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_comment`
--

LOCK TABLES `story_comment` WRITE;
/*!40000 ALTER TABLE `story_comment` DISABLE KEYS */;
INSERT  IGNORE INTO `story_comment` (`story_id`, `index`, `email`, `content`, `post_time`) VALUES ('2563d480-a76f-11eb-9cad-272a2cc7219a',0,'tran123@gmail.com','Hay','2021-10-18 16:50:02'),('2563d480-a76f-11eb-9cad-272a2cc7219a',1,'tran123@gmail.com','Tuyet','2021-10-18 16:50:10'),('2563d480-a76f-11eb-9cad-272a2cc7219a',2,'tran123@gmail.com','Truyen hay lam','2021-10-19 16:47:02'),('2563d480-a76f-11eb-9cad-272a2cc7219a',3,'tran123@gmail.com','Truyen hay lam','2021-10-19 16:48:58'),('2563d480-a76f-11eb-9cad-272a2cc7219a',4,'tran123@gmail.com','Truyen hay lam','2021-10-19 16:49:09'),('2563d480-a76f-11eb-9cad-272a2cc7219a',5,'tran123@gmail.com','Truyen hay lam','2021-10-19 16:49:23'),('2563d480-a76f-11eb-9cad-272a2cc7219a',6,'tran123@gmail.com',' Truyen hay','2021-10-21 09:59:20'),('2563d480-a76f-11eb-9cad-272a2cc7219a',7,'tran123@gmail.com',' Truyen hay','2021-10-21 10:17:49'),('2563d480-a76f-11eb-9cad-272a2cc7219a',8,'tran123@gmail.com','Toi rất thich truyện này','2021-10-21 10:18:02'),('2563d480-a76f-11eb-9cad-272a2cc7219a',9,'admin@gmail.com',' Recommend truyện này cho các bạn','2021-10-25 16:33:54'),('2563d480-a76f-11eb-9cad-272a2cc7219a',10,'admin@gmail.com','Đọc truyện vui vẻ nha các bạn','2021-10-25 16:34:09'),('2b465f20-a770-11eb-a8be-65f2a96f4f2d',0,'admin@gmail.com',' recommend truyện này','2021-10-25 16:19:39'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',0,'tran123@gmail.com',' Truyện của Kim Dung hay thật sự','2021-10-25 16:58:53'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',1,'tran123@gmail.com','Truyện siêu cấp vip pro','2021-10-25 17:02:24'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',2,'tran123@gmail.com','Đây là lần thứ 2 đọc truyện của Kim Dung','2021-10-25 17:04:53'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',3,'tran123@gmail.com',' ABC XYZ','2021-10-25 17:08:10'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',4,'tran123@gmail.com',' ABC XYZ','2021-10-25 17:08:52'),('d97e2230-a770-11eb-a8be-65f2a96f4f2d',0,'tran123@gmail.com',' Một bầu trời kỷ niệm','2021-10-25 17:10:22'),('fa7ee560-4206-11ec-8ceb-4332de05ca32',0,'tran123@gmail.com',' Truyện hay','2021-11-14 13:11:38');
/*!40000 ALTER TABLE `story_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_reply`
--

DROP TABLE IF EXISTS `story_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `story_reply` (
  `story_id` varchar(36) NOT NULL,
  `comment_index` smallint NOT NULL,
  `reply_index` smallint NOT NULL,
  `email` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` text NOT NULL,
  `post_time` datetime NOT NULL,
  PRIMARY KEY (`story_id`,`comment_index`,`reply_index`),
  KEY `story_reply_ibfk_2` (`email`),
  CONSTRAINT `story_reply_ibfk_1` FOREIGN KEY (`story_id`, `comment_index`) REFERENCES `story_comment` (`story_id`, `index`),
  CONSTRAINT `story_reply_ibfk_2` FOREIGN KEY (`email`) REFERENCES `account` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_reply`
--

LOCK TABLES `story_reply` WRITE;
/*!40000 ALTER TABLE `story_reply` DISABLE KEYS */;
INSERT  IGNORE INTO `story_reply` (`story_id`, `comment_index`, `reply_index`, `email`, `content`, `post_time`) VALUES ('2563d480-a76f-11eb-9cad-272a2cc7219a',0,0,'tran123@gmail.com','Đồng quan điểm với bạn, Nguyễn Nhật Ánh luôn là nguồn cảm hứng cho chúng ta trở về tuổi thơ','2021-10-19 09:15:50'),('2563d480-a76f-11eb-9cad-272a2cc7219a',0,1,'tran123@gmail.com',' àafjajsjfajfaoifj','2021-10-21 16:18:58'),('2563d480-a76f-11eb-9cad-272a2cc7219a',0,2,'tran123@gmail.com',' sakfjjajfsal','2021-10-21 16:20:27'),('2563d480-a76f-11eb-9cad-272a2cc7219a',0,3,'tran123@gmail.com',' ssshshshsfakjfafkajhf','2021-10-25 16:47:59'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',1,0,'tran123@gmail.com',' Hay thật sự','2021-10-25 17:02:34'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',2,0,'tran123@gmail.com','Mong muốn có thêm nhiều truyện nữa của Kim Dung','2021-10-25 17:05:33'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',3,0,'tran123@gmail.com',' ABC XYAZZJJ','2021-10-25 17:08:20'),('8d1a22b0-a773-11eb-aaf6-ff7707760ec7',4,0,'tran123@gmail.com',' XYZ FFHHFHF','2021-10-25 17:08:59'),('d97e2230-a770-11eb-a8be-65f2a96f4f2d',0,0,'tran123@gmail.com',' Lâu lắm rồi mới đọc lại truyện Nguyễn Nhật Ánh','2021-10-25 17:10:43'),('fa7ee560-4206-11ec-8ceb-4332de05ca32',0,0,'tran123@gmail.com',' Khá là hay','2021-11-14 13:11:46');
/*!40000 ALTER TABLE `story_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'story_reading_website'
--
/*!50003 DROP PROCEDURE IF EXISTS `delete_story` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_story`(in story_id_in varchar(36))
BEGIN
	Delete from story_chapter where story_id = story_id_in;
    Delete from story where id = story_id_in;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insert_new_chapter` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_new_chapter`(in story_id_in varchar(36), in title_in nvarchar(100), file_name_in varchar(50),in num_pages int)
BEGIN
	Declare new_index integer;
    Declare new_start_page integer;
    Declare new_end_page integer;
    
    Select Max(`index`)+1 into new_index from story_chapter where story_id = story_id_in;    
    Select (end_page+1) into new_start_page from story_chapter where story_id = story_id_in and `index` = (new_index-1);
	Set new_end_page = new_start_page + num_pages;
    
    Insert Into story_chapter(story_id, `index`, title, file_name, start_page, end_page) 
	Values(story_id_in, new_index, title_in, file_name_in, new_start_page, new_end_page);
    
    Update story set num_chapters = num_chapters+1 where id = story_id_in;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `post_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `post_comment`(in i_story_id varchar(36), in i_email varchar(50), in i_content text)
BEGIN
	Declare inserting_index smallint default 0;
    Declare i_post_time datetime default now();
    if exists(select * from story_comment where story_id = i_story_id) then
		Select max(`index`)+1 into inserting_index from story_comment where story_id = i_story_id; 
	end if;

    Insert into story_comment(story_id, email, post_time, `index`, content) Values(i_story_id, i_email, i_post_time, inserting_index, i_content);
	Select i_email, i_post_time, i_content;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `reply_comment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `reply_comment`(in i_story_id varchar(36), in i_email varchar(50), in i_comment_index smallint, in i_content text)
BEGIN
	Declare inserting_index smallint default 0;
    Declare i_post_time datetime default now();
    if exists(select * from story_reply where story_id = i_story_id and comment_index=i_comment_index) then
		Select max(reply_index)+1 into inserting_index from story_reply where story_id = i_story_id and comment_index=i_comment_index; 
	end if;
    Insert into story_reply(story_id, email, post_time, comment_index, reply_index, content) Values(i_story_id, i_email, i_post_time, i_comment_index, inserting_index, i_content);
    Select i_email, i_comment_index, i_post_time, i_content;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_story` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_story`(in story_id varchar(36),in story_name nvarchar(100),in story_author nvarchar(100),in story_description text)
BEGIN
	Update story Set `name` = story_name, author = story_author, `description` = story_description
    where id = story_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `average_rating`
--

/*!50001 DROP VIEW IF EXISTS `average_rating`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `average_rating` AS select `rating`.`story_id` AS `story_id`,avg(`rating`.`rate`) AS `avg_rating` from `rating` group by `rating`.`story_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `favourite`
--

/*!50001 DROP VIEW IF EXISTS `favourite`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `favourite` AS select `story`.`id` AS `id`,`story`.`name` AS `name`,`story`.`author` AS `author`,`story`.`num_chapters` AS `num_chapters`,`story`.`image_path` AS `image_path`,`rating`.`rate` AS `rate`,`rating`.`email` AS `email` from (`story` join `rating` on((`story`.`id` = `rating`.`story_id`))) where (`rating`.`rate` >= 4) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `story_and_genre_view`
--

/*!50001 DROP VIEW IF EXISTS `story_and_genre_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `story_and_genre_view` AS select `story`.`id` AS `id`,`story`.`name` AS `name`,`story`.`description` AS `description`,`story`.`author` AS `author`,`story`.`upload_time` AS `upload_time`,`story`.`last_modified` AS `last_modified`,`story`.`image_path` AS `image_path`,`story`.`num_chapters` AS `num_chapters`,`story`.`num_pages` AS `num_pages`,`story`.`rating` AS `rating`,`story`.`genre_id` AS `genre_id`,`genre`.`name` AS `genre_name`,`genre`.`description` AS `genre_description` from (`story` join `genre`) where (`story`.`genre_id` = `genre`.`id`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-16 19:10:59
