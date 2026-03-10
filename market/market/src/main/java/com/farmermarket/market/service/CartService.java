package com.farmermarket.market.service;

import com.farmermarket.market.entity.Cart;
import com.farmermarket.market.repository.CartRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    private final CartRepository repo;

    public CartService(CartRepository repo) {
        this.repo = repo;
    }

    public List<Cart> getCartItems() {
        return repo.findAll();
    }

    public Cart addToCart(Cart cart) {
        return repo.save(cart);
    }

    public Cart updateCartItem(int id, Cart cart) {
        cart.setId(id);
        return repo.save(cart);
    }

    public void deleteCartItem(int id) {
        repo.deleteById(id);
    }
}
