package com.farmermarket.market.controller;

import com.farmermarket.market.entity.Cart;
import com.farmermarket.market.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
public class CartController {

    private final CartService service;

    public CartController(CartService service) {
        this.service = service;
    }

    @GetMapping("/cart")
    public List<Cart> getCartItems() {
        return service.getCartItems();
    }

    @PostMapping("/cart")
    public Cart addToCart(@RequestBody Cart cart) {
        return service.addToCart(cart);
    }

    @PutMapping("/cart/{id}")
    public Cart updateCartItem(@PathVariable int id, @RequestBody Cart cart) {
        return service.updateCartItem(id, cart);
    }

    @DeleteMapping("/cart/{id}")
    public void deleteCartItem(@PathVariable int id) {
        service.deleteCartItem(id);
    }
}
