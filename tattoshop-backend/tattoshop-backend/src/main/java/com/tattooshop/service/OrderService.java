package com.tattooshop.service;

import com.tattooshop.entity.Order;
import com.tattooshop.entity.User;
import com.tattooshop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order save(Order order){
        return orderRepository.save(order);
    }

    public Optional<Order> findById(Long id){
        return orderRepository.findById(id);
    }

    public List<Order> findByUser (User user){
        return orderRepository.findByUser(user);
    }

    public List<Order> findAll(){
        return orderRepository.findAll();
    }

    public void deleteById(Long id){
        orderRepository.deleteById(id);
    }
}
