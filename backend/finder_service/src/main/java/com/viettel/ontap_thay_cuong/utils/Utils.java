package com.viettel.ontap_thay_cuong.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Configuration
public class Utils {
    final static Logger logger = LoggerFactory.getLogger(Utils.class);

    private static Application application;

    @Autowired
    Utils(Application application) {
        Utils.application = application;
    }

    public static void saveFileToFolder(MultipartFile file, String folderPath, String newFileName) {
        if (file != null) {
            File folder = new File(folderPath);
            if (!folder.exists()) {
                folder.mkdir();
            }

            try {
                FileOutputStream fileOutputStream = new FileOutputStream(folder + File.separator + newFileName);
                fileOutputStream.write(file.getBytes());
                logger.info("Save file " + newFileName + " successfully!");
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {
            logger.info("File does not exist, could not save file");
        }
    }

    public static String getFileNameFormatted(String fileName) {
        return UUID.randomUUID().toString() + "_" + fileName;
    }

    public static String getStorageFolder() {
        return "." + File.separator + application.getImageFolder();
    }

    public static void deleteFile(String oldImage, String storageFolder) {
        File file = new File(storageFolder, oldImage);
        if (file.exists()) {
            logger.info("File " + oldImage + " deleting... " + file.delete());
        }
    }
}
