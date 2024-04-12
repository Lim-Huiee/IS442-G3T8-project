DROP DATABASE IF EXISTS TICKETMISTRESS;
CREATE DATABASE TICKETMISTRESS;
USE TICKETMISTRESS;

CREATE TABLE `USER` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `name` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('customer', 'event manager', 'ticketing officer') NOT NULL DEFAULT 'customer',
    `amount_avail` DECIMAL(10, 2) NOT NULL DEFAULT 1000
);

CREATE TABLE `ORDERS` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `order_datetime` DATETIME NOT NULL DEFAULT NOW(),
    `status` ENUM('delivered', 'refunded') NOT NULL DEFAULT 'delivered',
    CONSTRAINT order_fk1 FOREIGN KEY (user_id) REFERENCES USER(`user_id`)
);

CREATE TABLE `EVENT` (
    `event_id` INT AUTO_INCREMENT PRIMARY KEY,
    `event_type` VARCHAR(255) NOT NULL,
    `event_name` VARCHAR(255) NOT NULL,
    `venue` VARCHAR(255) NOT NULL,
    `datetime` DATETIME NOT NULL,
    `total_tickets` INT NOT NULL, 
    `num_tickets_avail` INT NOT NULL DEFAULT 0,
    `event_details` TEXT,
    `price` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    `cancellation_fee` DECIMAL(10, 2) NOT NULL DEFAULT 0
);

CREATE TABLE `TICKET` (
    `ticket_id` INT AUTO_INCREMENT PRIMARY KEY,
    `event_id` INT NOT NULL,
    `order_id` INT NOT NULL,
    `status` varchar (255),
    `attended` varchar (255) DEFAULT "no",
    CONSTRAINT ticket_fk1 FOREIGN KEY (event_id) REFERENCES EVENT(`event_id`) ON DELETE CASCADE,
    CONSTRAINT ticket_fk2 FOREIGN KEY (order_id) REFERENCES ORDERS(`order_id`) ON DELETE CASCADE
);

-- Dummy data for the USER table
INSERT INTO `USER` (`email`, `name`, `password`, `role`, `amount_avail`) VALUES
('user1@abc.com', 'User 1', 'password1', 'customer', 1000),
('user2@abc.com', 'User 2', 'password2', 'customer', 1500),
('user3@abc.com', 'User 3', 'password3', 'customer', 3000),
('em@tm.com', 'event man', 'password4', 'event manager', 0),
('to@tm.com', 'ticket man', 'password5', 'ticketing officer', 0),
('mistressticket@gmail.com', 'ticketmiss', 'Tick1!', 'customer', 1000.00);

-- Dummy data for the ORDER table
INSERT INTO `ORDERS` (`user_id`, `status`, `order_datetime`) VALUES
(1, 'delivered', '2024-03-30 19:00:00'),
(2, 'refunded', '2024-02-16 20:00:00'),
(3, 'delivered', '2024-02-16 20:00:00'),
(2, 'refunded', '2024-02-16 20:00:00'),
(3, 'delivered', '2024-02-16 20:00:00');

-- Dummy data for the EVENT table
INSERT INTO `EVENT` (`event_name`, `event_type`,`venue`, `datetime`, `total_tickets`,`num_tickets_avail`, `event_details`,`price`, `cancellation_fee`) VALUES
('Kyuhyun Asia','Concert','Singapore Expo Hall 7', '2024-04-30 19:00:00', 1000, 998, 'A Kyuhyun concert.', 50, 10),
('Ed Sheeran', 'Concert','National Stadium', '2024-04-17 20:00:00', 500, 498, 'Doing Math with JJ Lin.',100, 20),
('StayC Teenfresh', 'Concert','The Star Theatre', '2024-02-16 20:00:00', 300, 299, 'A StayC concert.',70, 30),
('Disney On Ice', 'Musical','Singapore Indoor Stadium', '2024-03-09 21:00:00', 100, 100, 'ice ice baby.',90, 40);

-- Dummy data for the TICKET table
INSERT INTO `TICKET` (`event_id`, `order_id`,`status`) VALUES
(1, 1, 'delivered'),
(2, 2, 'delivered'),
(3, 3, 'delivered'),
(1, 4, 'refunded'),
(2, 5, 'delivered');