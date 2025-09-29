package com.tattooshop.service;

import com.tattooshop.entity.OrderItem;
import com.tattooshop.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    public OrderItem save(OrderItem orderItem){
        return orderItemRepository.save(orderItem);
    }

    public Optional<OrderItem> findById (Long id){
        return orderItemRepository.findById(id);
    }

    public List<OrderItem> findAll(){
        return orderItemRepository.findAll();
    }

    public void deleteById(Long id){
        orderItemRepository.deleteById(id);
    }
}
