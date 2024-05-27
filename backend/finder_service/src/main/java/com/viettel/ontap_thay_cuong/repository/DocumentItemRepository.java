package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.DocumentEntity;
import com.viettel.ontap_thay_cuong.entities.DocumentItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentItemRepository extends JpaRepository<DocumentItemEntity, String> {
    List<DocumentItemEntity> findAllByQuestionAndStatus(String question, short status);

    @Query(value = "Select d from DocumentItemEntity d where (d.feature like %:input% or d.question like %:input%) and d.status = :status order by d.selectedCount desc")
    List<DocumentItemEntity> findAllByFeatureLikeOrQuestionLikeAndStatusOrderBySelectedCountDesc(@Param(value = "input") String input, @Param(value = "status") short status);

    @Query(nativeQuery = true, value = "Select distinct feature from document_item where feature like %:input% and status = :status" +
            " order by MATCH ( feature AGAINST (:input  in boolean mode) desc")
    List<Object> findFeaturesByInputAndStatus(@Param(value = "input") String input, @Param(value = "status") short status);
}
