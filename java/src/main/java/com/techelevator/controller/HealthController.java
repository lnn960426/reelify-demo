package com.techelevator.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    // Public health endpoint (no auth required)
    @GetMapping("/healthz")
    public String ok() {
        return "ok";
    }
}
