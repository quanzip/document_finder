package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, String> {
    List<DocumentEntity> findAllBySiteCode(String siteCode);
}
