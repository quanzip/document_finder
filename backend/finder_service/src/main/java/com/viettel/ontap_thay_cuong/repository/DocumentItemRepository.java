package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentItemRepository extends JpaRepository<DocumentItemEntity, String> {
    List<DocumentItemEntity> findAllByQuestionAndStatus(String question, short status);
}
