package com.viettel.ontap_thay_cuong.service.impl;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import com.viettel.ontap_thay_cuong.repository.DocumentItemRepository;
import com.viettel.ontap_thay_cuong.repository.DocumentRepository;
import com.viettel.ontap_thay_cuong.repository.SiteRepository;
import com.viettel.ontap_thay_cuong.service.DocumentService;
import com.viettel.ontap_thay_cuong.service.dto.DocumentDTO;
import com.viettel.ontap_thay_cuong.utils.CustomException;
import com.viettel.ontap_thay_cuong.utils.ErrorApps;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {
    private Logger logger = LoggerFactory.getLogger(DocumentServiceImpl.class);

    @Value(value = "${application.documentFolder}")
    String documentFolder;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private DocumentItemRepository documentItemRepository;


    // Get Workbook
    private static Workbook getWorkbook(InputStream inputStream, String excelFilePath) throws IOException {
        Workbook workbook = null;
        if (excelFilePath.endsWith("xlsx")) {
            workbook = new XSSFWorkbook(inputStream);
        } else if (excelFilePath.endsWith("xls")) {
            workbook = new HSSFWorkbook(inputStream);
        } else {
            throw new IllegalArgumentException("The specified file is not Excel file");
        }

        return workbook;
    }

    // Get cell value
    private static Object getCellValue(Cell cell) {
        CellType cellType = cell.getCellType();
        Object cellValue = null;
        switch (cellType) {
            case BOOLEAN:
                cellValue = cell.getBooleanCellValue();
                break;
            case FORMULA:
                Workbook workbook = cell.getSheet().getWorkbook();
                FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
                cellValue = evaluator.evaluate(cell).getNumberValue();
                break;
            case NUMERIC:
                cellValue = cell.getNumericCellValue();
                break;
            case STRING:
                cellValue = cell.getStringCellValue();
                break;
            case _NONE:
            case BLANK:
            case ERROR:
                break;
            default:
                break;
        }

        return cellValue;
    }

    private void importItems(String filePath, String siteCode, DocumentEntity documentEntity) throws IOException {
        List<DocumentItemEntity> result = new ArrayList<>();
        // Get file
        InputStream inputStream = new FileInputStream(filePath);

        // Get workbook
        Workbook workbook = getWorkbook(inputStream, filePath);

        // Get sheet
        Sheet sheet = workbook.getSheetAt(0);

        // Get all rows
        Iterator<Row> iterator = sheet.iterator();
        while (iterator.hasNext()) {
            Row nextRow = iterator.next();
            if (nextRow.getRowNum() == 0) {
                // Ignore header
                continue;
            }

            // Get all cells
            Iterator<Cell> cellIterator = nextRow.cellIterator();

            // Read cells and set value for book object
            DocumentItemEntity docItem = new DocumentItemEntity();
            docItem.setDocument(documentEntity);
            docItem.setSiteCode(siteCode);
            docItem.setSelectedCount(0);
            docItem.setStatus((short) 1);
            while (cellIterator.hasNext()) {
                //Read cell
                Cell cell = cellIterator.next();
                Object cellValue = getCellValue(cell);
                if (cellValue == null || cellValue.toString().isEmpty()) {
                    continue;
                }
                // Set value for book object
                int columnIndex = cell.getColumnIndex();
                switch (columnIndex) {
                    case 1:
                        docItem.setFeature((String) getCellValue(cell));
                        break;
                    case 2:
                        docItem.setQuestion((String) getCellValue(cell));
                        break;
                    case 3:
                        docItem.setAnswer((String) getCellValue(cell));
                        break;
                    default:
                        break;
                }

            }
            result.add(docItem);
        }
        documentItemRepository.saveAll(result);
    }

    @Override
    public Object checkAndSaveDocument(DocumentDTO documentDTO) {
        String siteCode = documentDTO.getSiteCode();
        if (siteCode == null || siteCode.isEmpty())
            throw new CustomException(ErrorApps.REQUEST_INVALID_PARAM.getMessage());
        else {
            List<SiteEntity> sites = this.siteRepository.findAllByCodeAndStatus(siteCode, (short) 1);
            if (sites.isEmpty()) {
                throw new CustomException(ErrorApps.SITE_NOT_FOUND.getMessage());
            }

            File folder = new File(documentFolder);
            if (!folder.exists() || !folder.isDirectory()) {
                folder.mkdir();
            }

            MultipartFile multipartFile = documentDTO.getMultipartFile();

            if (multipartFile != null && !multipartFile.isEmpty() && !multipartFile.getName().isEmpty()) {
                File fullFilePath = new File(folder, System.currentTimeMillis() + multipartFile.getName());
                documentDTO.setDocumentUrl(fullFilePath.getPath());

                try (FileOutputStream fileOutputStream = new FileOutputStream(fullFilePath)) {
                    fileOutputStream.write(multipartFile.getBytes());
                } catch (Exception e) {
                    e.printStackTrace();
                    logger.error(e.getMessage());
                }
            }

            DocumentEntity documentEntity = new DocumentEntity();
            BeanUtils.copyProperties(documentDTO, documentEntity);
            documentEntity.setId(UUID.randomUUID().toString());
            documentRepository.save(documentEntity);

            try {
                this.importItems(documentDTO.getDocumentUrl(), documentDTO.getSiteCode(), documentEntity);
            } catch (Exception e) {
                e.printStackTrace();
                logger.error(e.getMessage());
                logger.error("Failed to import file");
            }
        }
        return null;
    }

    @Override
    public List<DocumentEntity> getDocumentsBySiteCode(String siteCode) {
        return documentRepository.findAllBySiteCode(siteCode);
    }
}
