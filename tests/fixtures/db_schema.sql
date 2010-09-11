DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL auto_increment,
  `first_name` varchar(255) default NULL,
  `last_name` varchar(255) default NULL,
  `email` varchar(255) default '',
  `user_type` int(11) NOT NULL default '0',
  `hashed_password` varchar(40) default NULL,
  `salt` varchar(40) default NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `remember_token` varchar(255) default NULL,
  `remember_token_expires_at` datetime default NULL,
  `url_access_key` varchar(40) default NULL,
  `username` varchar(255) default NULL,
  `joined_at` datetime default NULL,
  PRIMARY KEY  (`id`),
  UNIQUE KEY `index_users_on_username` (`username`),
  UNIQUE KEY `index_users_on_email` (`email`),
  KEY `index_users_on_url_access_key` (`url_access_key`),
  KEY `index_users_on_joined_at` (`joined_at`)
) DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `collections`;
CREATE TABLE `collections` (
  `id` int(11) NOT NULL auto_increment,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  `items_count` int(11) default '0',
  PRIMARY KEY  (`id`),
  KEY `FK6E8025959635E932` (`user_id`),
  CONSTRAINT `FK6E8025959635E932` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_collections_user_id_users_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(11) NOT NULL auto_increment,
  `collection_id` int(11) NOT NULL,
  `created_at` datetime default NULL,
  `updated_at` datetime default NULL,
  PRIMARY KEY  (`id`),
  KEY `FK5FDE7C08FA3B252` (`collection_id`),
  CONSTRAINT `FK5FDE7C08FA3B252` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`),
  CONSTRAINT `fk_items_collection_id_collections_id` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`id`) ON DELETE CASCADE
) DEFAULT CHARSET=utf8;
