package com.ckm.repository;

import com.ckm.entity.Franchise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FranchiseRepository extends JpaRepository<Franchise, Long> {
    List<Franchise> findByStatus(Franchise.FranchiseStatus status);
    List<Franchise> findByNameContainingIgnoreCase(String name);
}
