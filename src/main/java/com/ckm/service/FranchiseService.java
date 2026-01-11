package com.ckm.service;

import com.ckm.entity.Franchise;
import com.ckm.repository.FranchiseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class FranchiseService {

    @Autowired
    private FranchiseRepository franchiseRepository;

    public List<Franchise> findAllFranchises() {
        return franchiseRepository.findAll();
    }

    public Optional<Franchise> findById(Long id) {
        return franchiseRepository.findById(id);
    }

    public Franchise saveFranchise(Franchise franchise) {
        return franchiseRepository.save(franchise);
    }

    public Franchise createFranchise(String name, String contactPerson, String contactPhone, String address) {
        Franchise franchise = new Franchise(name, contactPerson, contactPhone, address);
        return saveFranchise(franchise);
    }

    public void deleteFranchise(Long id) {
        franchiseRepository.deleteById(id);
    }

    public List<Franchise> findByStatus(Franchise.FranchiseStatus status) {
        return franchiseRepository.findByStatus(status);
    }

    public List<Franchise> searchByName(String name) {
        return franchiseRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Franchise> findActiveFranchises() {
        return findByStatus(Franchise.FranchiseStatus.ACTIVE);
    }

    public long getTotalFranchises() {
        return franchiseRepository.count();
    }

    public long getActiveFranchiseCount() {
        return findByStatus(Franchise.FranchiseStatus.ACTIVE).size();
    }
}
