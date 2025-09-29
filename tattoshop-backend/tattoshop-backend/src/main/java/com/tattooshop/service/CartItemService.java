package com.tattooshop.service;

import com.tattooshop.entity.CartItem;
import com.tattooshop.repository.CartItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    public CartItem save(CartItem cartItem){
        return cartItemRepository.save(cartItem);
    }

    public Optional<CartItem> findById(Long id){
        return cartItemRepository.findById(id);
    }

    public List<CartItem> findAll(){
        return cartItemRepository.findAll();
    }

    public void deleteById(Long id){
        cartItemRepository.deleteById(id);
    }
}
