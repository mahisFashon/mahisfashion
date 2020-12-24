-- MySQL dump 10.13  Distrib 5.7.24, for Win32 (AMD64)
--
-- Host: localhost    Database: mahisfashionnewdb
-- ------------------------------------------------------
-- Server version	5.7.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `country` char(2) DEFAULT NULL,
  `address_line1` varchar(250) DEFAULT NULL,
  `address_line2` varchar(250) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dealer`
--

DROP TABLE IF EXISTS `dealer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dealer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` char(2) NOT NULL,
  `address_line1` varchar(250) NOT NULL,
  `address_line2` varchar(250) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dealer`
--

LOCK TABLES `dealer` WRITE;
/*!40000 ALTER TABLE `dealer` DISABLE KEYS */;
/*!40000 ALTER TABLE `dealer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_details` (
  `order_id` int(11) NOT NULL,
  `sku` varchar(20) NOT NULL,
  `qty` int(11) NOT NULL,
  `sell_price` float NOT NULL,
  `discount_amt` float NOT NULL,
  `regular_price` float NOT NULL,
  PRIMARY KEY (`order_id`,`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_summary`
--

DROP TABLE IF EXISTS `order_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_date_time` datetime NOT NULL,
  `total_amt` float NOT NULL,
  `tax_amt` float NOT NULL,
  `discount_amt` float NOT NULL,
  `net_amt` float NOT NULL,
  `status` varchar(20) NOT NULL,
  `shipping_id` int(11) DEFAULT NULL,
  `payment_id` int(11) NOT NULL,
  `balance_amt` float NOT NULL,
  `tax_id` int(11) DEFAULT NULL,
  `discount_id` int(11) DEFAULT NULL,
  `payment_mode` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_summary`
--

LOCK TABLES `order_summary` WRITE;
/*!40000 ALTER TABLE `order_summary` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_summary_discount_details`
--

DROP TABLE IF EXISTS `order_summary_discount_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_summary_discount_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `discount_name` varchar(50) NOT NULL,
  `discount_type` char(2) NOT NULL,
  `discount_type_val` float NOT NULL,
  `discount_amt` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_summary_discount_details`
--

LOCK TABLES `order_summary_discount_details` WRITE;
/*!40000 ALTER TABLE `order_summary_discount_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_summary_discount_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_summary_payment_details`
--

DROP TABLE IF EXISTS `order_summary_payment_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_summary_payment_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `category` char(2) NOT NULL,
  `type` char(2) NOT NULL,
  `amount` float NOT NULL,
  `payment_id` varchar(20) DEFAULT NULL,
  `txn_ref_no` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_summary_payment_details`
--

LOCK TABLES `order_summary_payment_details` WRITE;
/*!40000 ALTER TABLE `order_summary_payment_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_summary_payment_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_summary_shipping_details`
--

DROP TABLE IF EXISTS `order_summary_shipping_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_summary_shipping_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `ship_to_name` varchar(100) NOT NULL,
  `addr_line1` varchar(100) NOT NULL,
  `addr_line2` varchar(100) DEFAULT NULL,
  `city` varchar(50) NOT NULL,
  `state` varchar(50) NOT NULL,
  `country` char(2) NOT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_summary_shipping_details`
--

LOCK TABLES `order_summary_shipping_details` WRITE;
/*!40000 ALTER TABLE `order_summary_shipping_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_summary_shipping_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_summary_tax_details`
--

DROP TABLE IF EXISTS `order_summary_tax_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `order_summary_tax_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `tax_name` varchar(50) NOT NULL,
  `tax_type` char(2) NOT NULL,
  `tax_type_val` float NOT NULL,
  `tax_amt` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_summary_tax_details`
--

LOCK TABLES `order_summary_tax_details` WRITE;
/*!40000 ALTER TABLE `order_summary_tax_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_summary_tax_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product` (
  `sku` varchar(20) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(250) DEFAULT NULL,
  `size` varchar(10) DEFAULT NULL,
  `dimensions` varchar(50) DEFAULT NULL,
  `salePrice` float DEFAULT NULL,
  `regularPrice` float NOT NULL,
  `costPrice` float NOT NULL,
  `category` varchar(30) NOT NULL,
  `stockQty` int(11) NOT NULL,
  `dealerBillId` int(11) DEFAULT NULL,
  `tags` varchar(200) DEFAULT NULL,
  `imageCount` smallint(6) NOT NULL,
  `onsale` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`sku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT  IGNORE INTO `product` VALUES ('SRA010010','Saree',NULL,NULL,NULL,NULL,1500,750,'Saree',1,NULL,NULL,1,NULL),('SRA010011','Saree',NULL,NULL,NULL,NULL,1800,900,'Saree',1,1,NULL,1,NULL),('SRA010012','Saree',NULL,NULL,NULL,NULL,2100,1050,'Saree',1,NULL,NULL,1,NULL),('SRA010013','Saree',NULL,NULL,NULL,NULL,1800,900,'Saree',1,NULL,NULL,1,NULL),('SRA010014','Saree',NULL,NULL,NULL,NULL,1800,900,'Saree',1,1,NULL,1,'false');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_details`
--

DROP TABLE IF EXISTS `purchase_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_details` (
  `bill_id` int(11) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `purchase_date` date NOT NULL,
  `item_qty` int(11) NOT NULL,
  `bill_amt` float NOT NULL,
  `shipping_charges` float NOT NULL,
  `tax_amt` float NOT NULL,
  PRIMARY KEY (`bill_id`,`dealer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_details`
--

LOCK TABLES `purchase_details` WRITE;
/*!40000 ALTER TABLE `purchase_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_details` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-24 10:45:35
