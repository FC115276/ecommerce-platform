package com.farmermarket.market.repository;

import com.farmermarket.market.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,Integer> {

User findByUsername(String username);

}
