package com.accenture.oauth.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.accenture.oauth.entities.User;

/**
 * User repository for CRUD operations.
 */
public interface UserRepository extends JpaRepository<User,Long> {
    User findByUsername(String username);
}
