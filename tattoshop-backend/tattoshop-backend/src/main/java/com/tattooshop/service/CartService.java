package com.tattooshop.service;

import com.tattooshop.entity.Cart;
import com.tattooshop.entity.User;
import com.tattooshop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    public Cart save(Cart cart){
        return cartRepository.save(cart);
    }

    public Optional<Cart> findById(Long id){
        return cartRepository.findById(id);
    }

    public Optional<Cart> findByUser(User user){
        return cartRepository.findByUser(user);
    }

    public void deleteById(Long id){
        cartRepository.deleteById(id);
    }
}
