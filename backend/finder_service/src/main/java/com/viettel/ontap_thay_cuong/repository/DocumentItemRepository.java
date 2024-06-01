package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.Document;
import java.util.List;

@Repository
public interface DocumentItemRepository extends JpaRepository<DocumentItemEntity, String> {
    List<DocumentItemEntity> findAllByIdAndStatusAndSiteCode(String id, short status, String siteCode);

    @Query(value = "Select d from DocumentItemEntity d where (d.feature like %:input% or d.question like %:input%) and d.siteCode =:siteCode and d.status = :status order by d.selectedCount desc")
    List<DocumentItemEntity> findAllByFeatureLikeOrQuestionLikeAndStatusOrderBySelectedCountDesc(@Param(value = "input") String input, @Param(value = "siteCode") String siteCode, @Param(value = "status") short status);

    @Query(nativeQuery = true, value = "Select distinct feature from document_item as d where d.status = :status and d.site_code = :siteCode" +
            " and (d.feature like %:input%) order by (d.feature like %:input%) desc")
    List<Object> findFeaturesByInputAndStatus(@Param(value = "input") String input, @Param(value = "siteCode") String siteCode, @Param(value = "status") short status);

    @Query(value = "Select DISTINCT(d.feature) from DocumentItemEntity d where :question like %d.feature% or d.feature like %:question% and d.siteCode = :siteCode and d.status = 1")
    List<String> findFeatureByInput(@Param(value = "question") String question, @Param(value = "siteCode") String siteCode);

    List<DocumentItemEntity> findAllByStatusAndSiteCodeAndFeatureInOrderBySelectedCountDesc(short status, String siteCode, List<String> feature);
}
