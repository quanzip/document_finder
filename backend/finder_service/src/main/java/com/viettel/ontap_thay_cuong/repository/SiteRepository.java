package com.viettel.ontap_thay_cuong.repository;

import com.viettel.ontap_thay_cuong.entities.SiteEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<SiteEntity, String> {
    List<SiteEntity> findAllByCodeAndStatus(String code, Short status);
    List<SiteEntity> findAllByNameLike(String name);
}
