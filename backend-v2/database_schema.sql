-- Use this script to initialize the SQL database.
CREATE TABLE `challenge`
(
    `id`        int NOT NULL AUTO_INCREMENT,
    `max_score` int NOT NULL,
    `question`  varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `user`
(
    `id`       int NOT NULL AUTO_INCREMENT,
    `is_admin` int NOT NULL DEFAULT '0',
    `name`     varchar(255) DEFAULT NULL,
    `pin`      varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UK93hcpyi15ewkrr4x6y09pb80x` (`pin`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `answer`
(
    `id`           int NOT NULL AUTO_INCREMENT,
    `answer`       varchar(255) DEFAULT NULL,
    `score`        int          DEFAULT NULL,
    `challenge_id` int          DEFAULT NULL,
    `user_id`      int          DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FK7p8xib9qettow8gwa28qe16v2` (`challenge_id`),
    KEY `FK68tbcw6bunvfjaoscaj851xpb` (`user_id`),
    CONSTRAINT `FK68tbcw6bunvfjaoscaj851xpb` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    CONSTRAINT `FK7p8xib9qettow8gwa28qe16v2` FOREIGN KEY (`challenge_id`) REFERENCES `challenge` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;


CREATE TABLE `image`
(
    `id`           int NOT NULL AUTO_INCREMENT,
    `content_type` varchar(255) DEFAULT NULL,
    `data`         longblob,
    `challenge_id` int          DEFAULT NULL,
    `user_id`      int          DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `FKed8nmxtu9tkdsreoq9qcc2bg3` (`challenge_id`),
    KEY `FKlxnnh0ir05khn8iu9tgwh1yyk` (`user_id`),
    CONSTRAINT `FKed8nmxtu9tkdsreoq9qcc2bg3` FOREIGN KEY (`challenge_id`) REFERENCES `challenge` (`id`),
    CONSTRAINT `FKlxnnh0ir05khn8iu9tgwh1yyk` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_0900_ai_ci;