-- Store the cards
CREATE TABLE IF NOT EXISTS `cards` (
`card_id`       int(11)         NOT NULL auto_increment         COMMENT 'id of the card',
`panel_id`       int(11)         NOT NULL                        COMMENT 'The panel this card is associated with',
`card_title`    varchar(255)    NOT NULL                        COMMENT 'title of the card',
`card_desc`     varchar(1024)   DEFAULT NULL                    COMMENT 'description of the card',
PRIMARY KEY (`card_id`),
FOREIGN KEY (panel_id) REFERENCES panels(panel_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT="panel cards";