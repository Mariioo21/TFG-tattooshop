package com.tattooshop.controller;

import com.tattooshop.entity.Cart;
import com.tattooshop.entity.CartItem;
import com.tattooshop.entity.Product;
import com.tattooshop.entity.User;
import com.tattooshop.repository.CartItemRepository;
import com.tattooshop.repository.CartRepository;
import com.tattooshop.repository.ProductRepository;
import com.tattooshop.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository itemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<Cart> getMyCart(Authentication auth) {
        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add/{productId}")
    @Transactional
    public ResponseEntity<Cart> addItem(Authentication auth,
                                       @PathVariable Long productId,
                                       @RequestParam(defaultValue = "1") int qty) {

        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;

        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId).orElseThrow();

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity(Math.min(99, item.getQuantity() + qty));
            itemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(qty);
            itemRepository.save(item);
        }

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateQty(Authentication auth,
                                         @PathVariable Long itemId,
                                         @RequestParam int qty) {

        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;

        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        CartItem item = itemRepository.findById(itemId).orElseThrow();
        item.setQuantity(qty);
        itemRepository.save(item);

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Cart> removeItem(Authentication auth,
                                          @PathVariable Long itemId) {

        itemRepository.deleteById(itemId);
        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        cart.getItems().clear();
        cartRepository.save(cart);

        return ResponseEntity.noContent().build();
    }
}
