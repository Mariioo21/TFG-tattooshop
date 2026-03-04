package com.tattooshop.repository;

import com.tattooshop.entity.Order;
import com.tattooshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository; 

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByCreateOrderDesc(User user);
    long countByStatus(Order.Status status);

     @Query("""
           select distinct o
           from Order o
           left join fetch o.items i
           left join fetch i.product p
           left join fetch p.category
           left join fetch p.seller
           where o.user = :user
           order by o.createOrder desc
           """)
    List<Order> findByUserWithItems(@Param("user") User user);
}
