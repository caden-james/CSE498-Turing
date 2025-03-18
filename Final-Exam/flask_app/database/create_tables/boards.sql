CREATE TABLE IF NOT EXISTS `boards` (
`board_id`          int(11)         NOT NULL auto_increment     COMMENT 'id of this board',
`name`      varchar(255)    NOT NULL                    COMMENT 'name of the board',
`created_id`        int(11)         NOT NULL                    COMMENT 'id of who created this board',
PRIMARY KEY (`board_id`),
FOREIGN KEY (created_id) REFERENCES users(user_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="Boards on the website";