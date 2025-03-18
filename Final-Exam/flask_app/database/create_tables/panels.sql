-- Store the lists of each board
CREATE TABLE IF NOT EXISTS `panels` (
`panel_id`       int(11)         NOT NULL auto_increment         COMMENT 'id of the panel',
`board_id`      int(11)         NOT NULL                        COMMENT 'The board that this panel is associated with',
`panel_name`     varchar(255)    NOT NULL                        COMMENT 'Name of the panel',
PRIMARY KEY (`panel_id`),
FOREIGN KEY (board_id) REFERENCES boards(board_id)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="board panels";