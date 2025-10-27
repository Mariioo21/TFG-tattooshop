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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired private CartRepository cartRepository;
    @Autowired private CartItemRepository itemRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByUsername(auth.getName()).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado")
        );
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            c.setItems(new ArrayList<>());

            return cartRepository.save(c);
        });
    }

    /** ✅ Devuelve el carrito del usuario autenticado (lo crea si no existe)
     *  Forzamos la carga de items y productos para que el JSON salga completo.
     */
    @GetMapping
    @Transactional
    public ResponseEntity<Cart> getMyCart(Authentication auth) {
        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        // Fuerza carga de relaciones perezosas (items y productos) en la transacción
        cart.getItems().forEach(i -> {
            if (i.getProduct() != null) {
                i.getProduct().getId(); // toque de lectura
            }
        });

        return ResponseEntity.ok(cart);
    }

    /** ✅ Añadir producto (1–99). Si ya existe, acumula. */
    @PostMapping("/add/{productId}")
    @Transactional
    public ResponseEntity<Cart> addItem(Authentication auth,
                                        @PathVariable Long productId,
                                        @RequestParam(defaultValue = "1") int qty) {

        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;

        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProduct() != null && i.getProduct().getId().equals(productId))
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

            // Asegura que aparezca en la respuesta inmediatamente
            cart.getItems().add(item);
        }

        // Fuerza carga de productos para el JSON de respuesta
        cart.getItems().forEach(i -> { if (i.getProduct() != null) i.getProduct().getId(); });

        return ResponseEntity.ok(cartRepository.save(cart));
    }

    /** ✅ Actualiza cantidad (1–99) asegurando que el ítem es del usuario. */
    @PutMapping("/update/{itemId}")
    @Transactional
    public ResponseEntity<Cart> updateQty(Authentication auth,
                                          @PathVariable Long itemId,
                                          @RequestParam int qty) {

        if (qty < 1) qty = 1;
        if (qty > 99) qty = 99;

        User user = getCurrentUser(auth);
        CartItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ítem no encontrado"));

        // Seguridad: el ítem debe pertenecer al carrito del usuario
        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ítem no pertenece a tu carrito");
        }

        item.setQuantity(qty);
        itemRepository.save(item);

        Cart cart = item.getCart();
        cart.getItems().forEach(i -> { if (i.getProduct() != null) i.getProduct().getId(); });
        return ResponseEntity.ok(cart);
    }

    /** ✅ Elimina un ítem del carrito asegurando la pertenencia. */
    @DeleteMapping("/remove/{itemId}")
    @Transactional
    public ResponseEntity<Cart> removeItem(Authentication auth,
                                           @PathVariable Long itemId) {

        User user = getCurrentUser(auth);
        CartItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ítem no encontrado"));

        if (!item.getCart().getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Ítem no pertenece a tu carrito");
        }

        Cart cart = item.getCart();
        itemRepository.delete(item);

        // También reflejar en memoria por si la colección está cacheada en el contexto
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cart.getItems().forEach(i -> { if (i.getProduct() != null) i.getProduct().getId(); });

        return ResponseEntity.ok(cart);
    }

    /** ✅ Vacía el carrito (borra todos los ítems del usuario actual). */
    @DeleteMapping("/clear")
    @Transactional
    public ResponseEntity<Void> clearCart(Authentication auth) {
        User user = getCurrentUser(auth);
        Cart cart = getOrCreateCart(user);

        // Elimina físicamente los ítems
        if (cart.getItems() != null) {
            for (CartItem i : new ArrayList<>(cart.getItems())) {
                itemRepository.delete(i);
            }
            cart.getItems().clear();
        }

        cartRepository.save(cart);
        return ResponseEntity.noContent().build();
    }
}
