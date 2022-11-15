
-- book
CREATE TABLE `book` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL, 
    `publisher` varchar(100) NOT NULL,
    `author` varchar(100) NOT NULL,
    `stock` int NOT NULL,
    `pubdate` varchar(8) NOT NULL,
    `pagenum` int ,
    `ISBN` varchar(30) NOT NULL,
    `ebook` varchar(1) NOT NULL,
    `kdc` varchar(20),
    `img` varchar(30),
    `price` int,
    `nation` varchar(50) NOT NULL,
    `description` varchar(200),
    PRIMARY KEY (`id`)
);

INSERT INTO `book` VALUES(1, 'book1', '한빝출판사', 'egoing', '10', '20200312', 132, 9886003212, 'N', '300ㅈ-28너-12', 'book1.jpg', 24000, 'Korea', '새로운 책1');
INSERT INTO `book` VALUES(2, 'book2', '생능출판', 'duru', '23', '20210916', 234, 0032441568, 'Y', '720ㄱ-13차-31', 'book2.jpg', 31500, 'Korea', '새로운 책2');
INSERT INTO `book` VALUES(3, 'book3', '문학동네', 'ruri', '18', '20210210', 175, 0142223599, 'Y', '804ㅂ-06차투-2', 'book3.jpg', 11500, 'Korea', '새로운 책3');


-- calendar
CREATE TABLE `calendar` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `calendar` VALUES (1,'01월','01.01 - 1월 일정','2018-01-01 12:10:11',1);
INSERT INTO `calendar` VALUES (2,'02월','02.02 - 2월 일정','2018-01-03 13:01:10',1);
INSERT INTO `calendar` VALUES (3,'03월','03.03 - 3월 일정','2018-01-20 11:01:10',2);
INSERT INTO `calendar` VALUES (4,'04월','04.04 - 4월 일정','2018-01-23 01:03:03',3);
INSERT INTO `calendar` VALUES (5,'05월','05.05 - 5월 일정','2018-01-30 12:31:03',1);
INSERT INTO `calendar` VALUES (6,'06월','06.06 - 6월 일정','2018-01-03 13:01:10',1);
INSERT INTO `calendar` VALUES (7,'07월','07.07 - 7월 일정','2018-01-20 11:01:10',2);
INSERT INTO `calendar` VALUES (8,'08월','08.08 - 8월 일정','2018-01-23 01:03:03',3);
INSERT INTO `calendar` VALUES (9,'09월','09.09 - 9월 일정', '2018-01-30 12:31:03',1);
INSERT INTO `calendar` VALUES (10,'10월','10.10 - 10월 일정','2018-01-20 11:01:10',2);
INSERT INTO `calendar` VALUES (11,'11월','11.11 - 11월 일정','2018-01-23 01:03:03',3);
INSERT INTO `calendar` VALUES (12,'12월','12.12 - 12월 일정','2018-01-30 12:31:03',1);


-- cart
CREATE TABLE `cart` (
    `cartid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `cartdate` varchar(8) NOT NULL,
    `qty` int, 
    PRIMARY KEY (`cartid`)
);

INSERT INTO `cart` VALUES (1, 'kimyw', 1,'20221103', 1);
INSERT INTO `cart` VALUES (2, 'kimyw', 3,'20221108', 2);
INSERT INTO `cart` VALUES (3, 'ohsb', 2,'20221108', 1);


-- namecard
CREATE TABLE `namecard` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`loginid` varchar(10) NOT NULL,
    `name` varchar(20) NOT NULL,
    `company` varchar(30),
    `company_position` varchar(30),
    `email` varchar(60) NOT NULL,
    `tel` varchar(13),
    `birth` varchar(8) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `namecard` VALUES (1, 'kimyw','김여원', 'Gachon University', 'Student', 
                                'kimyw@gachon.ac.kr', '010-1111-2222','00-04-11');


-- person
CREATE TABLE `person` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`loginid` varchar(10) NOT NULL,
    `password` varchar(20) NOT NULL,
    `name` varchar(20) NOT NULL,
    `address` varchar(50),
    `tel` varchar(13),
    `birth` varchar(8) NOT NULL,
    `classes` varchar(2) NOT NULL,
    `grade` varchar(2) NOT NULL,
     PRIMARY KEY (`id`, `loginid`)
);

INSERT INTO `person` VALUES (1, 'admin', 'admin', '관리자', '서울', '010-0000-0000', '90-10-01', 'A','A');
INSERT INTO `person` VALUES (2, 'kimyw', 'kimyw', '김여원', '경기도', '010-1111-2222', '00-04-11', 'U', 'S');
INSERT INTO `person` VALUES (3, 'ohsb', 'ohsb', '오수빈', '경기도', '010-8656-4456', '02-10-17', 'U', 'G');


-- purchase
CREATE TABLE `purchase` (
    `purchaseid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `purchasedate` varchar(8) NOT NULL,
    `price` int,
    `point` int,
    `qty` int,
    `cancel` varchar(1) NOT NULL DEFAULT 'N',
    `refund` varchar(1) NOT NULL DEFAULT 'N',
    PRIMARY KEY (`purchaseid`)
);

INSERT INTO `purchase` VALUES(1, 'kimyw', '1', '20221011', 24000, 24, 1, 'N', 'N');
INSERT INTO `purchase` VALUES(2, 'kimyw', '3', '20221101', 11500, 11, 2, 'Y', 'Y');
INSERT INTO `purchase` VALUES(3, 'ohsb', '2', '20221115', 11500, 11, 1, 'Y', 'N');



-- board
CREATE TABLE `board` (
    `boardid` int NOT NULL AUTO_INCREMENT,
    `loginid` varchar(10) NOT NULL, 
    `password` varchar(20) NOT NULL,
    `name` varchar(20) NOT NULL,
    `date` varchar(8),
    `content` text,
    `title` varchar(200) NULL,
    PRIMARY KEY (`boardid`, `loginid`)
);

INSERT INTO `board` VALUES(1, 'kimyw', 'kimyw', '김여원', '20221101', '1번글. 작성자: 김여원', '1번글');
INSERT INTO `board` VALUES(2, 'ohsb', 'ohsb', '오수빈', '20221101', '2번글. 작성자: 오수빈', '2번글');
INSERT INTO `board` VALUES(3, 'kimyw', 'kimyw', '김여원', '20221103', '3번글. 작성자: 김여원', '3번글');
INSERT INTO `board` VALUES(4, 'ohsb', 'ohsb', '오수빈', '20221108', '4번글. 작성자: 오수빈', '4번글');
INSERT INTO `board` VALUES(5, 'ohsb', 'ohsb', '오수빈', '20221109', '5번글. 작성자: 오수빈', '5번글');

