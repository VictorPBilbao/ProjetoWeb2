package com.ufpr.byteassist_backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.HashMap;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class GreetUserControllerTest {

    private final GreetUserController controller = new GreetUserController();

    @Test
    void testGetMethodName() {
        String result = controller.getMethodName();
        assertEquals("Hello, World!", result, "The default greeting should be 'Hello, World!'");
    }

    @Test
    void testSayHelloWithName() {
        String result = controller.sayHello("Victor");
        assertEquals("Hello Victor", result, "The greeting should include the provided name.");
    }

    @Test
    void testSayHelloWithoutName() {
        String result = controller.sayHello(null);
        assertEquals("Hello null", result, "The default greeting should be 'Hello World' when no name is provided.");
    }

    @Test
    void testGetUser() {
        String result = controller.getUser("123");
        assertEquals("User with id: 123", result, "The response should include the provided user ID.");
    }

    @Test
    void testGreetUser() {
        Map<String, String> result = controller.greetUser("Victor");
        assertEquals("Hello, Victor", result.get("message"), "The greeting message should include the provided name.");
    }

    @Test
    void testEchoRequest() {
        Map<String, Object> input = new HashMap<>();
        input.put("key1", "value1");
        input.put("key2", 42);

        Map<String, Object> result = controller.echoRequest(input);
        assertEquals(input, result, "The echoed map should match the input map.");
    }
}