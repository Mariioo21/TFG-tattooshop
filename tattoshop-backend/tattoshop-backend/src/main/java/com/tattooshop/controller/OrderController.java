package com.tattooshop.controller;

import com.tattooshop.entity.Cart;
import com.tattooshop.entity.CartItem;
import com.tattooshop.entity.Order;
import com.tattooshop.entity.OrderItem;
import com.tattooshop.entity.User;
import com.tattooshop.repository.CartItemRepository;
import com.tattooshop.repository.CartRepository;
import com.tattooshop.repository.UserRepository;
import com.tattooshop.repository.OrderRepository;   // 👈 IMPORT NUEVO
import com.tattooshop.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository; // 👈 NUEVO CAMPO

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔥 GET /api/orders/my — pedidos del usuario logueado
    @PreAuthorize("hasRole('USER')")
    @GetMapping("/my")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado")
                );

        // usa el método con fetch join del repositorio para evitar tropecientas queries
        List<Order> orders = orderRepository.findByUserWithItems(user);

        LocalDate today = LocalDate.now();
        for (Order order : orders) {
            if (
                order.getStatus() == Order.Status.PENDING
                    && order.getEstimatedDelivery() != null
                    && !order.getEstimatedDelivery().isAfter(today)
            ) {
                order.setStatus(Order.Status.DELIVERED);
                orderRepository.save(order);
            }
        }

        return ResponseEntity.ok(orders);
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.save(order));
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id,
                                             @RequestBody Order order) {
        if (!orderService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        order.setId(id);
        return ResponseEntity.ok(orderService.save(order));
    }

    @PreAuthorize("hasRole('USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        if (!orderService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        orderService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/checkout")
    @Transactional
    public ResponseEntity<Order> checkout(Authentication auth) {

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado")
                );

        Optional<Cart> optionalCart = cartRepository.findByUser(user);
        if (optionalCart.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío.");
        }

        Cart cart = optionalCart.get();
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El carrito está vacío.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.Status.PENDING);
        order.setCreateOrder(LocalDateTime.now());

        int dias = new Random().nextInt(3) + 1; // simular envío de 1 a 3 días
        order.setEstimatedDelivery(LocalDate.now().plusDays(dias));

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(ci.getProduct());
            oi.setQuantity(ci.getQuantity());
            oi.setPrice(ci.getProduct().getPrice());

            orderItems.add(oi);
        }

        order.setItems(orderItems);

        Order savedOrder = orderService.save(order);

        // limpiar carrito
        for (CartItem ci : new ArrayList<>(cart.getItems())) {
            cartItemRepository.delete(ci);
        }
        cart.getItems().clear();
        cartRepository.save(cart);

        return ResponseEntity.ok(savedOrder);
    }
}
