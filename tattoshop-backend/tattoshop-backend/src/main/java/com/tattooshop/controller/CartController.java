package com.tattooshop.controller;

import com.tattooshop.entity.Cart;
import com.tattooshop.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/carts")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping("/{id}")
    public ResponseEntity<Cart> getCartById(@PathVariable Long id) {
        return cartService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cart> createCart(@RequestBody Cart cart) {
        return ResponseEntity.ok(cartService.save(cart));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cart> updateCart(@PathVariable Long id, @RequestBody Cart cart) {
        if (!cartService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cart.setId(id);
        return ResponseEntity.ok(cartService.save(cart));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCart(@PathVariable Long id) {
        if (!cartService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cartService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}