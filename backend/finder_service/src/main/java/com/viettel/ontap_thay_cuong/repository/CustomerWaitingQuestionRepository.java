package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.CustomerWaitingQuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerWaitingQuestionRepository extends JpaRepository<CustomerWaitingQuestionEntity, String> {
}
