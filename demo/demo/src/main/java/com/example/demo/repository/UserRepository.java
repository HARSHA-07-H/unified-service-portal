package com.example.demo.repository;

import com.example.demo.model.User;
import com.example.demo.model.Admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Page<User> findByAdmin(Admin admin, Pageable pageable);

    Optional<User> findByAdminAndUsername(Admin admin, String username);
}
