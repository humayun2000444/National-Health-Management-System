-- MySQL dump 10.13  Distrib 5.7.43, for Win64 (x86_64)
--
-- Host: localhost    Database: nhms
-- ------------------------------------------------------
-- Server version	5.7.43-log

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'admin',
  `hospital_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_key` (`email`),
  KEY `admins_hospital_id_fkey` (`hospital_id`),
  CONSTRAINT `admins_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'John Administrator','admin@hospital.com','$2b$12$EV9NzqZEpH3Yrxx6hvKZJuOF1JgBFeSy/Nr6f/SqZt6VpbOxP422q','+1 234 567 8901',NULL,'admin','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:18.354','2025-12-16 10:02:18.354');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appointments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `hospital_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime(3) NOT NULL,
  `start_time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `end_time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'consultation',
  `symptoms` text COLLATE utf8mb4_unicode_ci,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `diagnosis` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `appointments_patient_id_fkey` (`patient_id`),
  KEY `appointments_doctor_id_fkey` (`doctor_id`),
  KEY `appointments_department_id_fkey` (`department_id`),
  KEY `appointments_hospital_id_fkey` (`hospital_id`),
  CONSTRAINT `appointments_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `appointments_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointments_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `appointments_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,1,1,1,'cmj8eypi50000qzqbu57pfzyb','2025-12-21 10:02:19.202','09:00','09:30','completed','consultation','Chest pain and shortness of breath',NULL,NULL,'2025-12-16 10:02:19.208','2025-12-16 10:57:30.577'),(2,2,2,2,'cmj8eypi50000qzqbu57pfzyb','2025-12-23 10:02:19.202','10:00','10:30','pending','consultation','Recurring headaches',NULL,NULL,'2025-12-16 10:02:19.215','2025-12-16 10:02:19.215'),(3,3,1,1,'cmj8eypi50000qzqbu57pfzyb','2025-12-19 10:02:19.202','11:00','11:30','confirmed','followup','Follow-up for heart condition',NULL,NULL,'2025-12-16 10:02:19.219','2025-12-16 10:02:19.219');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hospital_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `departments_hospital_id_fkey` (`hospital_id`),
  CONSTRAINT `departments_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Cardiology','Heart and cardiovascular system care','heart','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:17.898','2025-12-16 10:02:17.898'),(2,'Neurology','Brain and nervous system disorders','brain','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:17.906','2025-12-16 10:02:17.906'),(3,'Orthopedics','Bones, joints, and muscles treatment','bone','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:17.913','2025-12-16 10:02:17.913'),(4,'Pediatrics','Medical care for infants and children','baby','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:17.917','2025-12-16 10:02:17.917'),(5,'Dermatology','Skin conditions and treatments','eye','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:17.921','2025-12-16 10:02:17.921'),(6,'icx_zone','cataliya','eye','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:57:45.711','2025-12-16 10:57:45.711');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `doctors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specialization` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `qualification` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `license_number` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `experience` int(11) DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `consultation_fee` decimal(10,2) DEFAULT NULL,
  `available_days` text COLLATE utf8mb4_unicode_ci,
  `start_time` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_time` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slot_duration` int(11) NOT NULL DEFAULT '30',
  `hospital_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `doctors_email_key` (`email`),
  KEY `doctors_hospital_id_fkey` (`hospital_id`),
  KEY `doctors_department_id_fkey` (`department_id`),
  CONSTRAINT `doctors_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `doctors_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Dr. Sarah Wilson','doctor@hospital.com','$2b$12$.sdkDC087GcCr7y0wGZ.XenzQvXdTRj56IFa8M6binklI52YNNNK2',NULL,NULL,'Cardiology','MD, FACC',NULL,12,'Renowned cardiologist with over 12 years of experience in treating heart conditions.',150.00,'[\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\"]','09:00','17:00',30,'cmj8eypi50000qzqbu57pfzyb',1,1,'2025-12-16 10:02:18.756','2025-12-16 10:02:18.756'),(2,'Dr. Michael Chen','michael.chen@hospital.com','$2b$12$.sdkDC087GcCr7y0wGZ.XenzQvXdTRj56IFa8M6binklI52YNNNK2',NULL,NULL,'Neurology','MD, PhD',NULL,8,'Expert neurologist specializing in brain disorders and stroke treatment.',175.00,'[\"monday\",\"wednesday\",\"friday\"]','10:00','18:00',30,'cmj8eypi50000qzqbu57pfzyb',2,1,'2025-12-16 10:02:18.765','2025-12-16 10:02:18.765'),(3,'Dr. James Brown','james.brown@hospital.com','$2b$12$.sdkDC087GcCr7y0wGZ.XenzQvXdTRj56IFa8M6binklI52YNNNK2',NULL,NULL,'Orthopedics','MD, FAAOS',NULL,15,'Orthopedic surgeon with expertise in sports injuries and joint replacement.',125.00,'[\"tuesday\",\"thursday\",\"saturday\"]','08:00','16:00',30,'cmj8eypi50000qzqbu57pfzyb',3,1,'2025-12-16 10:02:18.770','2025-12-16 10:02:18.770'),(4,'Dr. Emily Parker','emily.parker@hospital.com','$2b$12$.sdkDC087GcCr7y0wGZ.XenzQvXdTRj56IFa8M6binklI52YNNNK2','',NULL,'Pediatrics','MD, FAAP',NULL,6,'Caring pediatrician dedicated to children\'s health and wellness.',1005.00,'[\"monday\",\"tuesday\",\"wednesday\",\"thursday\",\"friday\"]','09:00','17:00',30,'cmj8eypi50000qzqbu57pfzyb',4,1,'2025-12-16 10:02:18.776','2025-12-16 10:55:58.366'),(5,'Humayun Ahmed','humu775@gmail.com','$2b$10$ueULTCUxZrOHBY14tZXJd.h97T0f6KZaBHkF2Sec7w9ecTaIzklA6','+8801789896378',NULL,'vvv','MMBS',NULL,2,NULL,333.00,NULL,NULL,NULL,30,'cmj8eypi50000qzqbu57pfzyb',3,1,'2025-12-16 10:55:47.449','2025-12-16 10:55:47.449');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hospitals` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `primaryColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#0F172A',
  `secondaryColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#3B82F6',
  `accentColor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '#10B981',
  `settings` json DEFAULT NULL,
  `subscription` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'free',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `hospitals_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES ('cmj8eypi50000qzqbu57pfzyb','City General Hospital','city-general-hospital','/uploads/logos/hospital-cmj8eypi50000qzqbu57pfzyb-1765883470994.png','info@citygeneral.com','+1 234 567 8900','123 Medical Center Drive, Healthcare City, HC 12345','https://citygeneral.com','#059669','#047857','#10b981','{\"onlineBooking\": true, \"prescriptions\": true, \"medicalRecords\": true, \"smsNotifications\": false, \"emailNotifications\": true}','professional',1,'2025-12-16 10:02:17.885','2025-12-16 11:11:24.127');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medical_records`
--

DROP TABLE IF EXISTS `medical_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `medical_records` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `attachments` json DEFAULT NULL,
  `record_date` datetime(3) NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `medical_records_patient_id_fkey` (`patient_id`),
  KEY `medical_records_doctor_id_fkey` (`doctor_id`),
  CONSTRAINT `medical_records_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medical_records_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medical_records`
--

LOCK TABLES `medical_records` WRITE;
/*!40000 ALTER TABLE `medical_records` DISABLE KEYS */;
INSERT INTO `medical_records` VALUES (1,1,1,'diagnosis','Hypertension Diagnosis','Patient diagnosed with Stage 1 hypertension. Blood pressure reading: 140/90 mmHg.',NULL,'2025-12-09 10:02:19.233','2025-12-16 10:02:19.235','2025-12-16 10:02:19.235'),(2,1,1,'lab_report','Lipid Panel','Total Cholesterol: 210, LDL: 130, HDL: 45, Triglycerides: 150',NULL,'2025-12-02 10:02:19.233','2025-12-16 10:02:19.240','2025-12-16 10:02:19.240'),(3,2,2,'imaging','Brain MRI','MRI scan showing no significant abnormalities. Brain structure normal.',NULL,'2025-12-06 10:02:19.233','2025-12-16 10:02:19.245','2025-12-16 10:02:19.245');
/*!40000 ALTER TABLE `medical_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` datetime(3) DEFAULT NULL,
  `gender` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood_group` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `emergency_contact` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `allergies` text COLLATE utf8mb4_unicode_ci,
  `chronic_conditions` text COLLATE utf8mb4_unicode_ci,
  `hospital_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `patients_email_key` (`email`),
  KEY `patients_hospital_id_fkey` (`hospital_id`),
  CONSTRAINT `patients_hospital_id_fkey` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'John Smith','patient@hospital.com','$2b$12$bltJaFNIOVtgI7eOEB1rM.TmeHCxf5zmWW2CFT8jQ9hcToSO5b2Ta','+1 234 567 8910','/uploads/avatars/patient-1-1765889390024.jpg','1979-05-15 00:00:00.000','Male','A+','456 Patient Street, Healthcare City, HC 12345','Jane Smith','+1 234 567 8911','Penicillin','Hypertension','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:19.182','2025-12-16 12:49:50.034'),(2,'Emily Davis','emily.davis@email.com','$2b$12$bltJaFNIOVtgI7eOEB1rM.TmeHCxf5zmWW2CFT8jQ9hcToSO5b2Ta','+1 234 567 8912',NULL,'1992-08-22 00:00:00.000','Female','B+','789 Health Ave, Healthcare City, HC 12345','Robert Davis','+1 234 567 8913','None','Diabetes Type 2','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:19.190','2025-12-16 10:02:19.190'),(3,'Robert Johnson','robert.johnson@email.com','$2b$12$bltJaFNIOVtgI7eOEB1rM.TmeHCxf5zmWW2CFT8jQ9hcToSO5b2Ta','+1 234 567 8914',NULL,'1966-03-10 00:00:00.000','Male','O-','321 Wellness Blvd, Healthcare City, HC 12345','Mary Johnson5','+1 234 567 8915','Sulfa drugs','Heart Arrhythmia','cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:02:19.197','2025-12-16 10:56:21.611'),(4,'Humayun Ahmed','cos@gmail.com','$2b$10$bsi/4iHaK8iI5LotGxW/SOuMWaSiulbGSIvOT2Up1ql/gKC8PUDm.','+8801789896378',NULL,'2013-01-08 00:00:00.000','male','A-','house no 31/b,road no-4, block-c','humu775@gmail.com',NULL,NULL,NULL,'cmj8eypi50000qzqbu57pfzyb',1,'2025-12-16 10:57:03.184','2025-12-16 10:57:03.184');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prescriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL,
  `diagnosis` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medications` json NOT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `valid_until` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `prescriptions_patient_id_fkey` (`patient_id`),
  KEY `prescriptions_doctor_id_fkey` (`doctor_id`),
  CONSTRAINT `prescriptions_doctor_id_fkey` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prescriptions_patient_id_fkey` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,1,1,'Hypertension','\"[{\\\"name\\\":\\\"Lisinopril\\\",\\\"dosage\\\":\\\"10mg\\\",\\\"frequency\\\":\\\"Once daily\\\",\\\"duration\\\":\\\"30 days\\\"},{\\\"name\\\":\\\"Aspirin\\\",\\\"dosage\\\":\\\"81mg\\\",\\\"frequency\\\":\\\"Once daily\\\",\\\"duration\\\":\\\"30 days\\\"}]\"','Take with food. Avoid alcohol. Monitor blood pressure daily.','2026-01-15 10:02:19.223','2025-12-16 10:02:19.224','2025-12-16 10:02:19.224'),(2,2,2,'Migraine','\"[{\\\"name\\\":\\\"Sumatriptan\\\",\\\"dosage\\\":\\\"50mg\\\",\\\"frequency\\\":\\\"As needed\\\",\\\"duration\\\":\\\"PRN\\\"}]\"','Take at onset of migraine. Do not exceed 2 tablets per day.','2026-03-16 10:02:19.223','2025-12-16 10:02:19.230','2025-12-16 10:02:19.230');
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-16 19:00:20
