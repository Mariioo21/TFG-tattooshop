package com.tattooshop.controller;

import com.tattooshop.dto.AdminDashboardResponse;
import com.tattooshop.entity.ERole;
import com.tattooshop.entity.Order;
import com.tattooshop.repository.CategoryRepository;
import com.tattooshop.repository.OrderRepository;
import com.tattooshop.repository.ProductRepository;
import com.tattooshop.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class AdminDashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<AdminDashboardResponse> getDashboardMetrics() {
        AdminDashboardResponse response = new AdminDashboardResponse();

        response.setTotalUsers(userRepository.count());
        response.setTotalSellers(userRepository.countByRole(ERole.SELLER));
        response.setTotalCustomers(userRepository.countByRole(ERole.USER));
        response.setTotalProducts(productRepository.count());
        response.setTotalCategories(categoryRepository.count());
        response.setTotalOrders(orderRepository.count());
        response.setPendingOrders(orderRepository.countByStatus(Order.Status.PENDING));
        response.setDeliveredOrders(orderRepository.countByStatus(Order.Status.DELIVERED));

        return ResponseEntity.ok(response);
    }
}
